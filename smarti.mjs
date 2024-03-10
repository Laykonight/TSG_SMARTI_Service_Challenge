import express from "express";
import bodyParser from "body-parser";
import { isNestedEntity, getValue, loadJsonFile } from "./utils.mjs";

const app = express();
const PORT = process.env.PORT || 3000;
const filePath = "./priorities_settings/priorities.json.txt";

// Middleware to parse JSON bodies
app.use(bodyParser.json());

let prioritiesSettings = loadJsonFile(filePath);

/*  The function merge 2 identical entities into one entity.(sending non identical entities can cause undefined behavior)
  The function takes an object that contains the two entities in a JSON format.
  returns object of the merged entity. */
function mergeEntities(entitiesObject) {
  const mergedEntity = {};

  if (entitiesObject.length === 0) {
    return mergedEntity;
  }

  const entityNames = Object.keys(entitiesObject);
  const object1 = entitiesObject[entityNames[0]];
  const object2 = entitiesObject[entityNames[1]];

  return merge(object1, object2, entityNames);
}

/*  Recursive function to merge 2 identical objects (identical objects share the same object structure and keys,
  sending non identical objects can cause undefined behavior) into one according to prioritiesSettings. 
  The function takes as parameters the two objects, array contains the two entities names and object key in case 
  of nested objects. Returns object of a recursive merged entity. */
function merge(object1, object2, entityNames, objectKey) {
  const mergedEntity = {};

  if (object1.length === 0) {
    return mergedEntity;
  }

  const keysList = Object.keys(object1);
  let value1;
  let value2;

  for (const key of keysList) {
    value1 = object1[key];
    value2 = object2[key];

    if (isNestedEntity(value1)) {
      mergedEntity[key] = merge(value1, value2, entityNames, key);
    } else {
      const index = findPrioritizeEntityIndex(entityNames, key);
      objectKey = key;

      if (index === 1) {
        mergedEntity[objectKey] = object2[key];
        continue;
      }

      mergedEntity[objectKey] = object1[key];
    }
  }
  return mergedEntity;
}

/*  The function finds the `entityNames` index from priorityOrder of a specific key.
  The function takes two parameters: Array of entities names and a specific key.
  returns the index number of the first match from priorityOrder or -1 if the
  priorityOrder doesn't contain any of the `entityNames`. */
function findPrioritizeEntityIndex(entityNames, key) {
  const priorityOrder = getValue(prioritiesSettings.priorities, key);
  let index = -1;

  for (const currentEntity of priorityOrder) {
    index = entityNames.findIndex((entityName) => entityName === currentEntity);

    if (index !== -1) {
      break;
    }
  }
  return index;
}

/*   Route that handles two identical entities (identical entities share the same structure and keys) 
  sent as JSON in post request. The route will return JSON of one entity merged from the two.
  The merge will be according to priorities settings file. */
app.post("/merge_entities", (req, res) => {
  const body = req.body;
  if (!body || body.length === 0) {
    return res.status(400).json({ error: "No body provided" });
  }
  const entitiesObjectKey = Object.keys(body)[0];
  const entitiesObject = body[entitiesObjectKey];
  const mergedEntity = mergeEntities(entitiesObject);
  res.json(mergedEntity);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
