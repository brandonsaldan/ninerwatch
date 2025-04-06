import os
import requests
from bs4 import BeautifulSoup

LOGS_URL = "https://police.charlotte.edu/police-log/police-log-2025/"
PROCESSED_FILES_RECORD = ".github/processed_files.txt"

print("Updating record of processed files...")

if not os.path.exists(PROCESSED_FILES_RECORD):
    os.makedirs(os.path.dirname(PROCESSED_FILES_RECORD), exist_ok=True)
    with open(PROCESSED_FILES_RECORD, 'w') as f:
        f.write("")

with open(PROCESSED_FILES_RECORD, 'r') as f:
    processed_files = set(line.strip() for line in f.readlines())

response = requests.get(LOGS_URL)
soup = BeautifulSoup(response.text, 'html.parser')

current_pdfs = set()
for a_tag in soup.find_all('a', href=True):
    href = a_tag['href']
    if href.endswith('.pdf') and '2025' in href:
        filename = os.path.basename(href)
        current_pdfs.add(filename)

pdf_dir_files = os.listdir("pdfs_2025") if os.path.exists("pdfs_2025") else []
for filename in pdf_dir_files:
    if filename.endswith('.pdf'):
        processed_files.add(filename)

with open(PROCESSED_FILES_RECORD, 'w') as f:
    for filename in sorted(processed_files):
        f.write(f"{filename}\n")

print(f"Updated processed files record. Total: {len(processed_files)}")