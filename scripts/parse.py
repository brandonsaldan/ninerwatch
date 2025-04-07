import re
import uuid
import datetime
from supabase import create_client, Client
import pdfplumber
import os

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
PDF_DIR = "pdfs_2025"
TXT_DIR = "txt_exports"
FAILED_EXPORT = "failed_incidents.txt"

incident_type_set = set([
    "911 Hang Up",
    "Abandoned Vehicle",
    "Accident",
    "Accident/Arrest",
    "Accident/Hit & Run",
    "Accident/Hit and Run",
    "Accident/Hit and Run/Property",
    "Accident/Hit and Run/Property Damage",
    "Accident/Personal Injury",
    "Accident/Personal Injury/Property Damage",
    "Accident/Property",
    "Accident/Property Damage",
    "Animal Control",
    "Arrest",
    "Assault/Battery",
    "Assault/Battery/Arrest",
    "Arson",
    "Assist",
    "Assault",
    "Assault/Arrest",
    "Assist Fire",
    "Assist Medic",
    "Assist Other",
    "Assist CFD"
    "Assist Charlotte Fire",
    "Assist Charlotte Fire Department",
    "Assist Charlotte Fire Dept.",
    "Assist CMPD",
    "Assist Other Agency",
    "BOLO",
    "Burglary",
    "Burglary/Arrest",
    "Burglary/Property",
    "Burglary/Property Damage",
    "Burglary/Property Theft",
    "Burglary of Vehicle",
    "Burglary of Vehicle Parts",
    "Burglary/Vehicle",
    "Burglary/Vehicle Parts",
    "Burglary/Vehicle Theft",
    "Campus Safety",
    "Campus Safety/Arrest",
    "Campus Safety/Property",
    "Campus Safety/Property Damage",
    "Campus Safety/Property Theft",
    "Commercial Alarm",
    "Commercial Alarm/Arrest",
    "Communicating Threats",
    "Communicating Threats/Property",
    "Communicating Threats/Property Damage",
    "Communicating Threats/Property Theft",
    "Communicating Threats/Arrest",
    "Criminal Damage",
    "Criminal Damage to Property",
    "Criminal Damage to Vehicle",
    "Crash",
    "Criminal Trespass",
    "Criminal Trespass/Arrest",
    "Damage to Property",
    "Damage to Vehicle",
    "Disorderly Conduct",
    "Disorderly Conduct/Arrest",
    "Disabled Elevator",
    "Disabled Vehicle",
    "Domestic Disturbance",
    "Domestic Violence",
    "Domestic Violence/Arrest",
    "Domestic",
    "Domestic Dispute",
    "Disturbance",
    "Disturbance/Arrest",
    "Drug Activity",
    "Drug Activity/Arrest",
    "Drug Related",
    "Drug Related/Arrest",
    "Drug Overdose",
    "Overdose",
    "Elevator Call",
    "Elevator Emergency",
    "Elevator Emergency Call",
    "Elevator Entrapment",
    "Emergency Call",
    "Emergency Medical Call",
    "Escort",
    "Follow Up",
    "Fraud",
    "Fraud/Arrest",
    "Harassment",
    "Harassment/Arrest",
    "Health and Safety",
    "Hit & Run",
    "Hit & Run/Arrest",
    "Hit & Run/Property",
    "Hit & Run/Property Damage",
    "Hit and Run",
    "Hit and Run/Arrest",
    "Hit and Run/Property Damage",
    "Hit and Run/Property",
    "Hit and Run/Property",
    "Identity Theft",
    "Identity Theft/Arrest",
    "Indecent Exposure/Arrest",
    "Illegal Parking",
    "Illegal Parking/Arrest",
    "Indecent Exposure",
    "Injured Subject",
    "Injured Person",
    "Injured/Ill Subject",
    "Intoxicated Person",
    "Intoxicated Subject",
    "Intoxicated/Disorderly",
    "Intoxicated/Disorderly Person",
    "Intoxicated/Disorderly Subject",
    "Intoxicated/Disorderly Subject/Arrest",
    "Investigate",
    "Investigation",
    "Investigation/Arrest",
    "Investigation/Property",
    "Investigation/Property Damage",
    "Investigation/Property Theft",
    "Investigation/Vehicle",
    "Investigation/Vehicle Parts",
    "Investigation/Vehicle Theft",
    "Investigate/Arrest",
    "Investigate/Property",
    "Investigate/Property Damage",
    "Investigate/Property Theft",
    "Investigate/Vehicle",
    "Investigate/Vehicle Parts",
    "Investigate/Vehicle Theft",
    "Larceny",
    "Larceny of Laptop",
    "Larceny of Property",
    "Larceny of Vehicle",
    "Larceny of Vehicle Parts",
    "Larceny/Arrest",
    "Larceny/Property",
    "Larceny/Property Damage",
    "Larceny/Property Theft",
    "Larceny of Property",
    "Larceny of Vehicle",
    "Larceny of Vehicle Parts",
    "Larceny/Vehicle",
    "Larceny/Vehicle Parts",
    "Larceny/Vehicle Theft",
    "Loitering",
    "Loitering/Arrest",
    "Loitering/Trespassing",
    "Lost Property",
    "Trespassing",
    "Missing Child",
    "Lost or Stolen",
    "Missing Person",
    "Missing Subject",
    "Missing/Found Person",
    "Missing/Found Subject",
    "Motor Vehicle Theft",
    "Motor Vehicle Theft/Arrest",
    "Noise",
    "Noise Complaint",
    "Panic Alarm",
    "Parking Violation",
    "Parking Violation/Arrest",
    "Pedestrian Check",
    "Property Damage",
    "Property Damage/Arrest",
    "Property Found",
    "Property Theft",
    "Property Theft/Arrest",
    "Robbery",
    "Robbery/Attempted",
    "Attempted Robbery",
    "Robbery/Arrest",
    "Robbery/Property",
    "Robbery/Property Damage",
    "Robbery/Property Theft",
    "Robbery/Vehicle",
    "Robbery/Vehicle Parts",
    "Serving Papers",
    "Sexual Assault",
    "Sexual Assault/Arrest",
    "Sexual Offense",
    "Shots Fired",
    "Shots Fired/Arrest",
    "Solicitation",
    "Solicitation/Arrest",
    "Stalking",
    "Stalking/Arrest",
    "Stolen Vehicle",
    "Stolen Vehicle Parts",
    "Stolen Vehicle/Arrest",
    "Stolen Vehicle Parts/Arrest",
    "Stolen Vehicle/Property",
    "Stolen Vehicle/Property Damage",
    "Stolen Vehicle/Property Theft",
    "Stolen Vehicle Parts/Property",
    "Stolen Vehicle Parts/Property Damage",
    "Stolen Vehicle Parts/Property Theft",
    "Suspicious Activity",
    "Suspicious Activity/Arrest",
    "Suspicious Activity/Property",
    "Suspicious Activity/Property Damage",
    "Suspicious Activity/Property Theft",
    "Suspicious Person",
    "Suspicious Person/Arrest",
    "Suspicious Person/Property",
    "Suspicious Person/Property Damage",
    "Suspicious Person/Property Theft",
    "Suspicious Vehicle",
    "Suspicious Vehicle/Arrest",
    "Suicide",
    "Suicide Attempt",
    "Suicide Ideation",
    "Suspicious Person",
    "Suspicious Person/Arrest",
    "Suspicious Vehicle",
    "Suspicious Vehicle/Arrest",
    "Traffic Stop",
    "Traffic Violation",
    "Utilities Outage",
    "Vehicle Accident",
    "Vehicle Lockout",
    "Vehicle Stop",
    "Verbal Confrontation",
    "Welfare Check",
])

incident_location_set = set([
    "Admissions",
    "Admissions Building",
    "Alumni",
    "Alumni Center",
    "Alumni Way/Broadrick",
    "Alumni Way/Broadrick Blvd.",
    "Annex",
    "Atkins",
    "Atkins Library",
    "Barnard",
    "Barnhardt",
    "Barnhardt Lane",
    "Belk",
    "Belk Gym",
    "Belk Hall",
    "Belk Plaza",
    "Bioinformatics",
    "Bissell House",
    "Burson",
    "Burson Hall",
    "CAB",
    "CATO",
    "CHHS",
    "CRI",
    "CRI Deck",
    "Cafeteria Activities Building",
    "Cameron",
    "Cameron Blvd",
    "Cameron Center",
    "Cato",
    "Cato Hall",
    "Cedar",
    "Cedar Hall",
    "Chancellor's Residence",
    "Colvard",
    "Cone",
    "Cone Center",
    "Cone Deck",
    "Duke Hall",
    "EPIC",
    "East",
    "East Deck 1",
    "East Deck 2",
    "East Deck 3",
    "Elm",
    "Elm Hall",
    "Foundation",
    "Fretwell",
    "Garden",
    "Garinger",
    "Garinger Building",
    "Garinger Hall",
    "Greek",
    "Greek House 1",
    "Greek House 10",
    "Greek House 2",
    "Greek House 3",
    "Greek House 4",
    "Greek House 5",
    "Greek House 6",
    "Greek House 7",
    "Greek House 8",
    "Greek House 9",
    "Greek House 11",
    "Greek House 12",
    "Greek House 13",
    "Greek Village",
    "Greek Village 1",
    "Greek Village 10",
    "Greek Village 2",
    "Greek Village 3",
    "Greek Village 4",
    "Greek Village 5",
    "Greek Village 6",
    "Greek Village 7",
    "Greek Village 8",
    "Greek Village 9",
    "Greek Village 11",
    "Greek Village 12",
    "Greek Village 13",
    "Grigg Hall",
    "Halton-Wagner",
    "Harris",
    "Harris Alumni Center",
    "Harris Alumni Pavilion",
    "Harris Center",
    "Harris Pavilion",
    "Harwood Garden",
    "Hawthorn",
    "Hawthorn Hall",
    "Hickory",
    "Hickory Hall",
    "Holshouser",
    "Holshouser Hall",
    "Hunt",
    "Hunt Hall",
    "Institute Circle/Robert D. Snyder",
    "Investigations (PPS)",
    "Irwin",
    "Irwin Belk Track",
    "Irwin Belk Track and Field Center",
    "Jerry Richardson Stadium",
    "Kennedy",
    "Kennedy Building",
    "Kennedy Hall",
    "King",
    "King Hall",
    "Klein",
    "Klein Hall",
    "Kulwicki",
    "Landingham",
    "Landingham Glen",
    "Laurel",
    "Laurel Hall",
    "Levine",
    "Levine Hall",
    "Light Rail",
    "Lot 101",
    "Lot 102",
    "Lot 11",
    "Lot 11-A",
    "Lot 11A",
    "Lot 12",
    "Lot 13",
    "Lot 14",
    "Lot 15",
    "Lot 16",
    "Lot 16-A",
    "Lot 16A",
    "Lot 20",
    "Lot 21",
    "Lot 23",
    "Lot 23-A",
    "Lot 23A",
    "Lot 25",
    "Lot 26",
    "Lot 27",
    "Lot 28",
    "Lot 29",
    "Lot 29-A",
    "Lot 29A",
    "Lot 30",
    "Lot 4",
    "Lot 4-A",
    "Lot 4A",
    "Lot 5",
    "Lot 5-A",
    "Lot 5A",
    "Lot 6",
    "Lot 6-A",
    "Lot 6A",
    "Lot 7-A",
    "Lot 7A",
    "Lot 8",
    "Lot 8-A",
    "Lot 8A",
    "Lynch",
    "Lynch Hall",
    "Macy",
    "Macy Building",
    "Macy Hall",
    "Magnolia",
    "Magnolia Hall",
    "Maple",
    "Maple Hall",
    "Marriott",
    "Martin",
    "Martin Hall",
    "Mary Alexander",
    "Mary Alexander Rd",
    "McEniry",
    "McKnight",
    "McKnight Hall",
    "McMillan",
    "McMillan Greenhouse",
    "Memorial",
    "Memorial Hall",
    "Miltimore",
    "Miltimore Hall",
    "Motorsports",
    "North Deck",
    "Oak",
    "Oak Hall",
    "Off Campus",
    "PPS",
    "PORTAL",
    "Pavilion",
    "Pine",
    "Pine Hall",
    "Police and Public Safety",
    "Reese",
    "Robinson",
    "Robinson Hall",
    "Rowe",
    "Rowe Arts",
    "SAC",
    "Sanford",
    "Sanford Hall",
    "Scott",
    "Scott Hall",
    "Smith",
    "Smith Building",
    "South Deck",
    "South Village Deck",
    "Storrs",
    "Student Activity Center",
    "Student Health",
    "Student Union",
    "Student Union Building",
    "Susie Harwood Garden",
    "Sycamore",
    "Sycamore Hall",
    "Tennis Complex",
    "UREC",
    "Union Deck",
    "University Recreation Center",
    "Van Landingham",
    "Van Landingham Glen",
    "Wallis",
    "Wallis Hall",
    "Wells Fargo",
    "Wells Fargo Field",
    "West Deck",
    "Wilson",
    "Wilson Hall",
    "Winningham",
    "Winningham Building",
    "Winningham Hall",
    "Witherspoon",
    "Witherspoon Hall",
    "Woodward",
    "Woodward Hall"
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

def incident_exists(report_number):
    result = supabase.table("crime_incidents").select("id").eq("report_number", report_number).execute()
    return len(result.data) > 0

def insert_to_supabase(incidents):
    added_count = 0
    skipped_count = 0
    with open(FAILED_EXPORT, "a", encoding="utf-8") as fail_log:
        for item in incidents:
            if incident_exists(item["report_number"]):
                print(f"📋 Skipping existing record: {item['report_number']}")
                skipped_count += 1
                continue
                
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
                added_count += 1
                print(f"✅ Added incident: {item['report_number']}")
            except Exception as e:
                print(f"❌ Failed to insert {item['report_number']}: {e}")
                fail_log.write(f"Insert fail: {item['report_number']} | {str(e)}\n")
    
    return added_count, skipped_count

if __name__ == "__main__":
    convert_pdfs_to_text()
    total_added = 0
    total_skipped = 0
    total_parsed = 0
    
    for fname in os.listdir(TXT_DIR):
        if fname.endswith(".txt"):
            full_path = os.path.join(TXT_DIR, fname)
            parsed = parse_incidents_from_file(full_path)
            total_parsed += len(parsed)
            
            added, skipped = insert_to_supabase(parsed)
            total_added += added
            total_skipped += skipped
            
            print(f"Processed {len(parsed)} incidents from {fname}")
    
    print(f"Summary: Total parsed: {total_parsed}, Added: {total_added}, Skipped (already exist): {total_skipped}")