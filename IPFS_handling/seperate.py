import json
import os

# File path to the input JSON file
input_file_path = './Finalcombined.json'
# Directory to save the output JSON files
output_dir = './updated'

# Create the output directory if it does not exist
os.makedirs(output_dir, exist_ok=True)

# Read the data from the input JSON file
with open(input_file_path, 'r') as f:
    data = json.load(f)

# Iterate over each entry and save it as a separate file
for entry in data:
    # Get the file name from the "Desired Token Number (File Name)" field
    token_number = entry.get("Desired Token Number (File Name)")
    if token_number is not None:
        file_name = f"{token_number}.json"
        file_path = os.path.join(output_dir, file_name)
        
        # Write the entry to the specified file
        with open(file_path, 'w') as f:
            json.dump(entry, f, indent=4)
        
        print(f"Saved {file_path}")
    else:
        print("Skipped an entry without a 'Desired Token Number (File Name)' field.")
