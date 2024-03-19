import express from "express";
import bodyParser from "body-parser";
import { isNestedEntity, getValue, loadJsonFile } from "./utils.mjs";

const app = express();
const PORT = process.env.PORT || 3000;
const filePath = "./priorities_settings/priorities.json.txt";

// Middleware to parse JSON bodies
app.use(bodyParser.json());

let prioritiesSettings = loadJsonFile(filePath);

/**
 * Merges entities according to priorities settings.
 *
 * @param {Object} entityType - Object containing entities grouped by type.
 * @returns {Object} - Merged entities based on priority settings.
 */
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

    result[type] = merge(type, firstEntity, entities);
  }

  return result;
}

/**
 * Recursively merges entity properties based on priorities settings.
 *
 * @param {string} type - Type of the entity being merged.
 * @param {Object} firstEntity - The first entity to merge.
 * @param {Object} entities - Object containing entities.
 * @param {string} [objectKey] - Key of the current object being merged.
 * @returns {Object} - Merged entity.
 */
function merge(type, firstEntity, entities, objectKey) {
  if (firstEntity.length === 0) {
    return {};
  }
  const mergedEntity = {};

  const keysList = Object.keys(firstEntity);
  let value;

  for (const key of keysList) {
    value = firstEntity[key];

    if (isNestedEntity(value)) {
      mergedEntity[key] = merge(type, value, entities, key);
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

/**
 * Finds the prioritized entity for a specific key according to settings.
 *
 * @param {string} type - Type of the entity.
 * @param {Object} entities - Object containing entities.
 * @param {string} key - Key to find prioritized entity.
 * @returns {Object} - Prioritized entity.
 */
function findPrioritizeEntity(type, entities, key) {
  const entityTypes = prioritiesSettings.entityType;
  const priorities = "priorities";

  const priorityOrder = getValue(entityTypes[type][priorities], key);
  let prioritizeEntity;

  for (const currentEntity of priorityOrder) {
    prioritizeEntity = entities[currentEntity];

    if (prioritizeEntity) {
      break;
    }
  }
  return prioritizeEntity;
}

/**
 * Route handler for merging identical entities, sent as JSON in post request, based on priority settings.
 * The route will return JSON of one merged entity.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
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
