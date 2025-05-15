# def convert_data(data):
#     converted = []  # List to hold converted data

#     # Mapping indices to field names
#     fields = ["Title", "Authors", "Journal", "Volume", "Pages", "Year", "Publisher", "Number"]

#     for entry in data:
#         # Create a dictionary for each entry by mapping field names to values
#         # If the value is None, it remains None, otherwise convert to string for consistency
#         converted_entry = {field: (None if value is None else str(value)) for field, value in zip(fields, entry)}
#         converted.append(converted_entry)

#     return converted
import pymongo

def convert_data_corrected(data):
    converted = []  # List to hold converted data

    # Mapping indices to field names
    fields = ["Title", "Authors", "Journal", "Volume", "Pages", "Year", "Publisher", "Number"]

    for entry in data:
        # Create a dictionary for each entry by mapping field names to values
        # Check if the field is 'Authors' and ensure it remains a list of strings
        # Else, if the value is None, it remains None; otherwise convert to string for consistency
        converted_entry = {}
        for field, value in zip(fields, entry):
            if field == 'Authors':
                # Ensuring the authors remain as a list of strings
                converted_entry[field] = value
            else:
                converted_entry[field] = None if value is None else str(value)
        
        converted.append(converted_entry)

    return converted

import json
data = ["Using immersive video to evaluate future traveller information systems", ["Guo, Amy Weihong", "Blythe, Phil", "Olivier, Patrick", "Singh, Pushpendra", "Nam, Ha", "others"], "IET Intelligent Transport Systems", None, None, "2008", "Newcastle University", None], ["A study of existing Ontologies in the IoT-domain", ["Bajaj, Garvita", "Agarwal, Rachit", "Singh, Pushpendra", "Georgantas, Nikolaos", "Issarny, Valerie"], "arXiv preprint arXiv:1707.00112", None, None, "2017", None, None]

converted_data_corrected = convert_data_corrected(data)
converted_data_json_format_corrected = "\n".join([str(entry) + "," for entry in converted_data_corrected])  # For display purposes
# print(converted_data_json_format_corrected)

# print(convert_data(data))

filename = 'converted_data.json'

# Writing the data to a JSON file
with open(filename, 'w') as file:
    json.dump(converted_data_corrected, file, indent=4)


with open(filename, 'r') as file:
        data = json.load(file)

print(data)
# MongoDB connection settings
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = mongo_client["irdBtp"]  # Replace 'your_database_name' with your actual database name
collection = db["users"]  # Replace 'your_collection_name' with your actual collection name
collection.insert_one(data)
print("Data inserted into MongoDB successfully.")