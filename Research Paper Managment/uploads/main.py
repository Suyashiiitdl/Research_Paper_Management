import pymongo
from bson import ObjectId
import json

userobj ={}
with open('username.json', 'r') as file:
    userobj = json.load(file)
    # print(userobj)

user_id = userobj["_id"]
print("userId = ", user_id)

with open("uploads/citations.txt", "r", encoding="mbcs") as my_file:
    data = my_file.readlines()

article_list = []
art = 0  

for line in data:
   
    if line.startswith("@article"):
        if art: 
            article_list.append(one_article)
        art = 1
        one_article = [None] * 8  

    
    elif line.startswith("}"):
        if art:  
            article_list.append(one_article)
            art = 0  
   
    elif art == 1:
    
        parts = line.strip().split("=", 1)
        if len(parts) == 2:
            key, value = parts[0].strip(), parts[1].strip("{}, \n")
            if key.startswith("title"):
                one_article[0] = value
            elif key.startswith("author"):
                one_article[1] = [author.strip() for author in value.split('and')]
                for a in range(0,len(one_article[1])):
                    one_article[1][a] = one_article[1][a].replace(",", "")
                    one_article[1][a] = one_article[1][a] + ", PG, IIITD, "
                   
                # print(one_article[1])
            elif key.startswith("journal") or key.startswith("booktitle"):
                one_article[2] = value
            elif key.startswith("volume"):
                one_article[3] = value
            elif key.startswith("pages"):
                one_article[4] = value
            elif key.startswith("year"):
                one_article[5] = value
            elif key.startswith("publisher"):
                one_article[6] = value
            elif key.startswith("number"):
                one_article[7] = value


if art:
    article_list.append(one_article)

# print(article_list)    

def convert_data_corrected(data):
    converted = []  # List to hold converted data

    # Mapping indices to field names
    fields = ["Title", "Authors", "Journal", "Volume", "Pages", "Year", "Publisher", "Number"]

    for entry in data:

        converted_entry = {}
        for field, value in zip(fields, entry):
            if field == 'Authors':
                # Ensuring the authors remain as a list of strings
                converted_entry[field] = value
            else:
                converted_entry[field] = None if value is None else str(value)
        print("converted_entry = ",converted_entry)
        print("type = ",type(converted_entry))
        converted_entry.update(userID = user_id)
        converted.append(converted_entry)

    return converted

import json
# data = ["Using immersive video to evaluate future traveller information systems", ["Guo, Amy Weihong", "Blythe, Phil", "Olivier, Patrick", "Singh, Pushpendra", "Nam, Ha", "others"], "IET Intelligent Transport Systems", None, None, "2008", "Newcastle University", None], ["A study of existing Ontologies in the IoT-domain", ["Bajaj, Garvita", "Agarwal, Rachit", "Singh, Pushpendra", "Georgantas, Nikolaos", "Issarny, Valerie"], "arXiv preprint arXiv:1707.00112", None, None, "2017", None, None]

data = []

converted_data_corrected = convert_data_corrected(article_list)
converted_data_json_format_corrected = "\n".join([str(entry) + "," for entry in converted_data_corrected])  # For display purposes
# print(converted_data_json_format_corrected)

# print(convert_data(data))

filename = 'converted_data.json'


def convert_id(data):
    if 'userID' in data and isinstance(data['userID'], str):
        try:
            data['userID'] = ObjectId(data['userID'])
        except:
            pass  # Handle or log error if conversion fails
    return data


with open(filename, 'w') as file:
    json.dump(converted_data_corrected, file, indent=4)    
with open(filename, 'r') as file:
        data = json.load(file)


# # Convert string IDs back to ObjectId
# data7 = convert_id(data)

# with open(filename, 'w') as file:
#     json.dump(data7, file, indent=4)



# MongoDB connection settings
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = mongo_client["irdBtp"]  # Replace 'your_database_name' with your actual database name
collection = db["users"]  # Replace 'your_collection_name' with your actual collection name
for document in data:
    collection.insert_one(document)

from pymongo import MongoClient
from bson import ObjectId



# Iterate through each document in the collection
updated_count = 0
error_count = 0
for doc in collection.find({"userID": {"$exists": True, "$type": "string"}}):
    # Convert the userID field from string to ObjectId if valid
    if ObjectId.is_valid(doc['userID']):
        try:
            new_id = ObjectId(doc['userID'])
            collection.update_one({'_id': doc['_id']}, {'$set': {'userID': new_id}})
            updated_count += 1
        except Exception as e:
            print(f"Error converting {doc['_id']}: {e}")
            error_count += 1

# Close the connection
mongo_client.close()
    
# Print summary of the update process
print(f"Updated {updated_count} documents.")
print(f"Encountered errors in {error_count} documents.")

# Replace 'your_database_name' and 'your_collection_name' with the actual names
# update_user_ids('irdBtp', 'users')


print("Data inserted into MongoDB successfully.")