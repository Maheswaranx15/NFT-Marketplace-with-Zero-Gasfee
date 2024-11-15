import requests
import os
import time

# Base URL of the IPFS gateway
base_url = "https://gateway.pinata.cloud/ipfs/QmdMo3y9hsBbi1rLP3jJmceaSagchoQxevFuxBnQy2sb8F/"

# Create a directory to save the files
os.makedirs("metadata_files", exist_ok=True)

# Generate filenames for the first 100 JSON files
filenames = [f"{i}.json" for i in range(219, 251)]  # ['1.json', '2.json', ..., '100.json']

# List to keep track of files that hit rate limits
retry_files = []

# Loop to download the specified files
for filename in filenames:
    file_url = f"{base_url}{filename}"
    response = requests.get(file_url)

    if response.status_code == 200:
        with open(f"metadata_files/{filename}", "wb") as f:
            f.write(response.content)
        print(f"Downloaded {filename}")
    elif response.status_code == 429:
        print(f"Rate limit reached for {filename}. Adding to retry list.")
        retry_files.append(filename)
    else:
        print(f"File {filename} not found: {response.status_code}")
    
    # Delay to avoid rate limiting
    time.sleep(1)  # 1-second delay between requests

# Retry download for files that hit rate limits
print("\nRetrying files that previously hit the rate limit...\n")
for filename in retry_files:
    file_url = f"{base_url}{filename}"
    success = False

    # Retry until successful or max retries reached
    for attempt in range(3):  # Maximum of 3 attempts
        response = requests.get(file_url)

        if response.status_code == 200:
            with open(f"metadata_files/{filename}", "wb") as f:
                f.write(response.content)
            print(f"Successfully downloaded {filename} on retry {attempt + 1}")
            success = True
            break
        elif response.status_code == 429:
            print(f"Rate limit still active for {filename}. Waiting and retrying...")
            time.sleep(5)  # Longer delay for retries
        else:
            print(f"Failed to download {filename} on retry {attempt + 1}: {response.status_code}")
            break

    if not success:
        print(f"Failed to download {filename} after multiple retries.")

print("\nProcess completed.")


