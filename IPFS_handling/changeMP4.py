import json
import os

# Directory containing the JSON files
directory = './WU-Combined-Nov05'

# Range of files to process
start = 8001
end = 10000

for i in range(start, end + 1):
    file_path = os.path.join(directory, f"{i}.json")
    
    try:
        # Load the JSON data
        with open(file_path, 'r') as file:
            data = json.load(file)
        
        # Modify the "image" field to replace .jpg with .mp4
        if "image" in data:
            data["image"] = data["image"].replace(".jpg", ".mp4")
        
        # Save the modified data back to the file
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=4)
        
        print(f"Updated {file_path}")
    
    except FileNotFoundError:
        print(f"File {file_path} not found.")
    except json.JSONDecodeError:
        print(f"File {file_path} is not valid JSON.")
