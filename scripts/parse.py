import re
import uuid
import datetime
from supabase import create_client, Client
import pdfplumber
import os

SUPABASE_URL = ""
SUPABASE_KEY = ""
PDF_DIR = "pdfs_2025"
TXT_DIR = "txt_exports"
FAILED_EXPORT = "failed_incidents.txt"

incident_type_set = set([
    "Investigate", "Suspicious Person", "Accident/Property", "Larceny", "Welfare Check",
    "Injured/Ill Subject", "Serving Papers", "Suspicious Vehicle", "Follow Up", "Assist Other Agency",
    "Hit and Run", "Elevator Call", "Commercial Alarm", "Harassment", "Disabled Vehicle", "Escort",
    "Damage to Property", "Lost or Stolen", "Hit and Run/Property", "Loitering/Trespassing",
    "Vehicle Accident", "Drug Related", "Loitering", "Verbal Confrontation", "Noise", "Panic Alarm",
    "Parking Violation", "Injured Subject", "911 Hang Up", "Intoxicated Person", "Missing Person", "BOLO",
    "Disabled Elevator", "Animal Control", "Utilities Outage", "Vehicle Lockout", "Elevator Entrapment",
    "Traffic Stop", "Suicide", "Suicide Ideation", "Fraud", "Illegal Parking", "Indecent Exposure",
    "Crash", "Assault", "Assist CMPD"
])

incident_location_set = set([
    "PPS", "Student Union", "Union Deck", "Light Rail", "Miltimore Hall", "Off Campus", "UREC",
    "South Village Deck", "North Deck", "Wilson Hall", "Atkins", "Laurel Hall", "Marriott", "CRI Deck",
    "Belk Hall", "CHHS", "Oak Hall", "Lynch Hall", "Lot 25", "Lot 6", "Hunt Hall", "Fretwell",
    "Levine Hall", "East Deck 2", "Martin Hall", "Witherspoon Hall", "West Deck", "Woodward Hall",
    "Wallis Hall", "Robinson Hall", "EPIC", "McEniry", "CATO", "Lot 15", "Cameron", "Student Health",
    "South Deck", "Lot 21", "Lot 5", "Holshouser Hall", "Mary Alexander", "Mary Alexander Rd",
    "Lot 23", "Wells Fargo Field", "Klein Hall", "Cone Center", "Atkins Library", "Lot 16",
    "Bioinformatics", "Alumni", "Maple Hall", "Scott Hall", "Student Union Building", "Lot 8",
    "Annex", "Lot 16A", "Reese", "Pine Hall", "Lot 5A", "Memorial Hall", "Smith", "Cameron Blvd",
    "SAC", "Barnhardt", "Student Activity Center", "Lot 20", "Lot 4", "Colvard", "Storrs", "Woodward",
    "Greek Village", "Barnard", "Police and Public Safety", "University Recreation Center",
    "Sycamore Hall", "Sycamore", "Witherspoon", "Martin", "Wilson", "Scott", "Oak", "Maple", "Pine",
    "Laurel", "Lynch"
])

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def convert_pdfs_to_text():
    os.makedirs(TXT_DIR, exist_ok=True)
    for fname in os.listdir(PDF_DIR):
        if fname.lower().endswith(".pdf"):
            path = os.path.join(PDF_DIR, fname)
            with pdfplumber.open(path) as pdf:
                all_text = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
            with open(os.path.join(TXT_DIR, fname.replace(".pdf", ".txt")), "w", encoding="utf-8") as out:
                out.write(all_text)

def convert_time(date_str, time_str):
    try:
        dt = datetime.datetime.strptime(date_str + time_str, "%m/%d/%Y%H%M")
        return dt.isoformat() + "Z"
    except:
        return None

def parse_incidents_from_file(path):
    with open(path, "r", encoding="utf-8") as file:
        text = file.read()

    if "CRIME AND ACCIDENT\nLOG" not in text:
        return []
    crime_log = text.split("CRIME AND ACCIDENT\nLOG", 1)[-1].split("RESIDENT HALL FIRE\nLOG")[0]
    lines = crime_log.strip().splitlines()
    i = 0
    parsed = []

    while i < len(lines):
        if lines[i].startswith("CAD/"):
            current = {
                "report_number": lines[i].strip(),
                "incident_type": "",
                "incident_location": "",
                "date_reported": "",
                "time_reported": "",
                "time_secured": "N/A",
                "time_of_occurrence": "N/A",
                "disposition": "",
                "incident_description": ""
            }
            i += 1
            if i >= len(lines):
                continue
            parts = lines[i].split()
            if len(parts) < 4:
                print(f"⚠️ Skipping malformed date line in {path} after {current['report_number']}: {lines[i]}")
                i += 1
                continue
            current["date_reported"] = parts[0]
            current["time_secured"] = parts[1]
            current["time_of_occurrence"] = parts[2]
            current["disposition"] = " ".join(parts[3:])

            i += 1
            meta_parts = lines[i].split()
            if meta_parts and meta_parts[0] in {"N", "S"}:
                current["report_number"] += meta_parts[0]
                for split_at in range(1, len(meta_parts) - 1):
                    incident_type = " ".join(meta_parts[1:split_at + 1])
                    incident_location = " ".join(meta_parts[split_at + 1:])
                    if incident_type in incident_type_set and incident_location in incident_location_set:
                        current["incident_type"] = incident_type
                        current["incident_location"] = incident_location
                        break

            i += 1
            match = re.search(r"(\d{4})hrs", lines[i])
            if match:
                current["time_reported"] = match.group(1)

            i += 1
            desc_lines = []
            while i < len(lines):
                l = lines[i].strip()
                if l.startswith("CAD/") or "RESIDENT HALL FIRE" in l:
                    break
                if l.upper() in {"INCIDENT", "DESCRIPTION"}:
                    i += 1
                    continue
                desc_lines.append(l)
                i += 1

            if desc_lines and len(desc_lines[0].split()) <= 2 and not re.search(r"[.]", desc_lines[0]):
                desc_lines.pop(0)

            description = " ".join(desc_lines).strip()
            description = re.sub(r"^[NS]\s+", "", description)
            description = re.sub(r"\(Link CAD[^)]+\)", "", description)
            description = re.sub(r"\s{2,}", " ", description).strip()
            current["incident_description"] = description

            if current["incident_type"] and current["incident_location"]:
                parsed.append(current)
        else:
            i += 1

    return parsed

def insert_to_supabase(incidents):
    with open(FAILED_EXPORT, "a", encoding="utf-8") as fail_log:
        for item in incidents:
            try:
                date_str = datetime.datetime.strptime(item["date_reported"], "%m/%d/%Y").strftime("%Y-%m-%d")
            except ValueError:
                print(f"❌ Skipping bad date: {item['date_reported']} in report {item['report_number']}")
                fail_log.write(f"Bad date format: {item['report_number']} | {item['date_reported']}\n")
                continue

            data = {
                "id": str(uuid.uuid4()),
                "report_number": item["report_number"],
                "incident_type": item["incident_type"],
                "incident_location": item["incident_location"],
                "date_reported": date_str,
                "time_reported": convert_time(item["date_reported"], item["time_reported"]),
                "time_secured": item["time_secured"],
                "time_of_occurrence": item["time_of_occurrence"],
                "disposition": item["disposition"],
                "incident_description": item["incident_description"]
            }

            try:
                supabase.table("crime_incidents").insert(data).execute()
            except Exception as e:
                print(f"❌ Failed to insert {item['report_number']}: {e}")
                fail_log.write(f"Insert fail: {item['report_number']} | {str(e)}\n")

if __name__ == "__main__":
    convert_pdfs_to_text()
    for fname in os.listdir(TXT_DIR):
        if fname.endswith(".txt"):
            full_path = os.path.join(TXT_DIR, fname)
            parsed = parse_incidents_from_file(full_path)
            insert_to_supabase(parsed)
            print(f"Inserted {len(parsed)} incidents from {fname}")