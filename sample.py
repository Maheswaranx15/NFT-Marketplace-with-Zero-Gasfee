import requests
import os

# Base URL of the IPFS gateway
base_url = "https://gateway.pinata.cloud/ipfs/QmdMo3y9hsBbi1rLP3jJmceaSagchoQxevFuxBnQy2sb8F/"

# Create a directory to save the files
os.makedirs("metadata_files", exist_ok=True)

# List of the first 10 filenames (update this list with the correct file names)
filenames = [
    "29.json",  # replace with actual names
    "54.json",  # replace with actual names
    "64.json",  # replace with actual names
    "98.json",  # replace with actual names
    "152.json",  # replace with actual names
    "197.json",  # replace with actual names
    "490.json",  # replace with actual names
    "229.json",  # replace with actual names
    "545.json",  # replace with actual names
    "226.json"   # replace with actual names
]

# Loop to download the specified files
for filename in filenames:
    file_url = f"{base_url}{filename}"
    response = requests.get(file_url)

    if response.status_code == 200:
        with open(f"metadata_files/{filename}", "wb") as f:
            f.write(response.content)
        print(f"Downloaded {filename}")
    else:
        print(f"File {filename} not found: {response.status_code}")
