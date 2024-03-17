import express from "express";
import bodyParser from "body-parser";
import { isNestedEntity, getValue, loadJsonFile } from "./utils.mjs";
import e from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const filePath = "./priorities_settings/priorities.json.txt";

// Middleware to parse JSON bodies
app.use(bodyParser.json());

let prioritiesSettings = loadJsonFile(filePath);

function mergingEntities(entityType) {
  const types = Object.keys(entityType);
  let entities;
  let entitiesNames;
  let firstEntity;
  const result = {};
  for (const type of types) {
    entities = entityType[type];
    entitiesNames = Object.keys(entities);
    firstEntity = entities[entitiesNames[0]];

    result[type] = merge2(type, firstEntity, entities);
  }

  // return merge2(types, firstEntity, entities);
  return result;
}

function merge2(type, firstEntity, entities, objectKey) {
  if (firstEntity.length === 0) {
    return {};
  }
  const mergedEntity = {};

  const keysList = Object.keys(firstEntity);
  let value;
  // let value2;

  for (const key of keysList) {
    value = firstEntity[key];
    // value2 = object2[key];

    if (isNestedEntity(value)) {
      mergedEntity[key] = merge2(type, value, entities, key);
    } else {
      const prioritizeEntity = findPrioritizeEntity(type, entities, key);
      objectKey = key;

      if (prioritizeEntity && prioritizeEntity !== firstEntity) {
        mergedEntity[objectKey] = getValue(prioritizeEntity, key);
        continue;
      }

      mergedEntity[objectKey] = firstEntity[key];
    }
  }
  return mergedEntity;
}

function findPrioritizeEntity(type, entities, key) {
  // console.log("type = " + type);
  const entityTypes = prioritiesSettings.entityType;
  const priorities = "priorities";

  const priorityOrder = getValue(entityTypes[type][priorities], key);
  let prioritizeEntity;

  for (const currentEntity of priorityOrder) {
    prioritizeEntity = entities[currentEntity];
    // index = entityNames.findIndex((entityName) => entityName === currentEntity);

    if (prioritizeEntity) {
      break;
    }
  }
  return prioritizeEntity;
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
  const mergedEntity = mergingEntities(entitiesObject);
  res.json(mergedEntity);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
