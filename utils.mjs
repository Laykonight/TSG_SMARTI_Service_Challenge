import fs from "fs";

/*  This boolean function takes one parameter and check if it's object. */
export function isNestedEntity(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/*  The function retrieves the value of a specific key from an object (able to handle nested objects).
  The function takes two parameters: The object and a specific key.
  returns the value of the key if found in the object or implicitly `undefined`,
  if the object does not contain the key. */
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

/*  The function loads a JSON format file located at the specified file path.
  The function takes the path to the file as a string argument.
  returns object with the file content. */
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
