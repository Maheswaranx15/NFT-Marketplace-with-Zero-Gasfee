import json
import os

# Directory containing the input JSON files
input_dir = './updated'
# Directory to save the OpenSea metadata files
output_dir = './WU-New'
# Base URI for the images, assuming they are stored on IPFS
base_image_uri = 'ipfs://QmbsxrAkDexeQuu6cC1NoaJeG1oH1864gySVhbJk5nZ6ow/'

# Create the output directory if it does not exist
os.makedirs(output_dir, exist_ok=True)

# List of all possible attributes
all_attributes = [
    "Model", "Background", "Head", "Eyes", "Mouth", "Facial Expression",
    "Neck", "Ears", "Clothing", "Hand", "Accessories 1", "Accessories 2",
    "Special", "1998 Special", "Special Power", "Original Collection Girl",
    "Unique", "Influential Women", "Angel3000 Wings", "Legendary"
]

# Function to convert each file to OpenSea metadata format
def convert_to_opensea_metadata(file_path):
    # Read the input JSON file
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Extract token number to use in metadata and image URI
    token_number = data.get("Desired Token Number (File Name)", "Unknown")

    # Prepare OpenSea metadata format
    opensea_metadata = {
        "name": f"Women Unite - 10k Assemble {token_number}",
        "description": "",  # Add a description if needed
        "image": f"{base_image_uri}{token_number}.jpg",
        "attributes": []
    }

    # Add all available attributes to the metadata, even if "None"
    for attr in all_attributes:
        value = data.get(attr, "None")
        if value and value != "None":
            opensea_metadata["attributes"].append({
                "trait_type": attr,
                "value": value
            })

    # Output file path
    output_file_path = os.path.join(output_dir, f"{token_number}.json")

    # Write OpenSea metadata to the output file
    with open(output_file_path, 'w') as f:
        json.dump(opensea_metadata, f, indent=4)
    
    print(f"Saved OpenSea metadata to {output_file_path}")

# Iterate through each file in the input directory
for file_name in os.listdir(input_dir):
    if file_name.endswith('.json'):
        file_path = os.path.join(input_dir, file_name)
        convert_to_opensea_metadata(file_path)
