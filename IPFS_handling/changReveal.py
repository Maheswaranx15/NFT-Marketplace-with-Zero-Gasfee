import json
import os

# Directory containing the JSON files
directory = './WU-Combined-Nov05'

# Range of files to process
start = 8001
end = 10000

# New metadata to replace in each file
new_metadata = {
    "name": "Women Unite - 10k Assemble",
    "description": "This is the placeholder image of Women Unite - 10k Assemble",
    "image": "ipfs://QmNMcUMm6j5zeBMM11Co5DrXhnieK6q6XEvUyYTNVfCrhr/coming-soon.gif",
    "external_link": "https://womenunitenft.com"
}

for i in range(start, end + 1):
    file_path = os.path.join(directory, f"{i}.json")
    
    try:
        # Write the new metadata to the file
        with open(file_path, 'w') as file:
            json.dump(new_metadata, file, indent=4)
        
        print(f"Replaced content in {file_path}")
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
