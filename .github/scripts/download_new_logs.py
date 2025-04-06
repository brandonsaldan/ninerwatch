import os
import requests
from bs4 import BeautifulSoup

LOGS_URL = "https://police.charlotte.edu/police-log/police-log-2025/"
PDF_DIR = "pdfs_2025"
PROCESSED_FILES_RECORD = ".github/processed_files.txt"

print("Checking for new police logs...")

if not os.path.exists(PROCESSED_FILES_RECORD):
    os.makedirs(os.path.dirname(PROCESSED_FILES_RECORD), exist_ok=True)
    with open(PROCESSED_FILES_RECORD, 'w') as f:
        f.write("")

with open(PROCESSED_FILES_RECORD, 'r') as f:
    processed_files = set(line.strip() for line in f.readlines())

response = requests.get(LOGS_URL)
soup = BeautifulSoup(response.text, 'html.parser')

new_logs_found = False
for a_tag in soup.find_all('a', href=True):
    href = a_tag['href']
    if href.endswith('.pdf') and '2025' in href:
        filename = os.path.basename(href)
        
        if filename in processed_files:
            print(f"Already processed: {filename}")
            continue
        
        new_logs_found = True
        print(f"Found new log: {filename}")
        
        pdf_response = requests.get(href)
        pdf_path = os.path.join(PDF_DIR, filename)
        
        with open(pdf_path, 'wb') as f:
            f.write(pdf_response.content)
        
        print(f"Downloaded to: {pdf_path}")

if not new_logs_found:
    print("No new logs found.")