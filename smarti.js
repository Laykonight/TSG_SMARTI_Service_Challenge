import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

let priorities;

// Read and parse the JSON file to extract priority information
fs.readFileSync(
  "./priorities_settings/priorities.json.txt",
  "utf-8",
  (err, data) => {
    if (err) {
      console.error("Error reading priorities file:", err);
      return;
    }
  }
);
