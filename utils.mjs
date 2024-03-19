import fs from "fs";

/**
 * Checks if a value is a nested object.
 *
 * @param {*} value - Value to be checked.
 * @returns {boolean} - True if the value is a nested object, otherwise false.
 */
export function isNestedEntity(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Retrieves the value of a specific key from an object (handles nested objects).
 *
 * @param {Object} obj - The object from which to retrieve the value.
 * @param {string} key - The key whose value is to be retrieved.
 * @returns {*} - The value of the specified key, or undefined if the key is not found.
 */
export function getValue(obj, key) {
  for (const prop in obj) {
    if (
      typeof obj[prop] === "object" &&
      typeof obj[prop] !== null &&
      !Array.isArray(obj[prop])
    ) {
      const result = getValue(obj[prop], key);
      if (result !== undefined) {
        return result;
      }
    } else if (prop === key) {
      return obj[prop];
    }
  }
}

/**
 * Loads a JSON format file located at the specified file path.
 *
 * @param {string} filePath - The path to the JSON file.
 * @returns {Object} - The content of the JSON file.
 */
export function loadJsonFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const prioritiesSettings = JSON.parse(fileContent);
    console.log("Loaded priorities settings Successfully");
    return prioritiesSettings;
  } catch (err) {
    console.error("Error reading priorities file:", err);
    process.exit(1);
  }
}
