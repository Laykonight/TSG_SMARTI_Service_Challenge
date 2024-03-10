# SMARTI System Entity Merger Service

The SMARTI System Entity Merger Service is a Node.js service designed to merge identical entities received from different interfaces into a single entity based on priorities defined in a settings file.

## Functionality

The service provides a single REST endpoint that receives identical entities from different interfaces as JSON payloads. It then merges these entities into a single entity according to the priorities defined in the settings file and returns the merged entity as a JSON response.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository
2. Install dependencies

### Usage

1. Ensure that the priorities settings file (`priorities.json.txt`) is located in the `priorities_settings` directory. Customize the priorities settings file according to your requirements.

2. Start the service:
   npm run dev
   
4. The service will start listening for incoming requests on port 3000 by default. You can configure the port using the `PORT` environment variable.

5. Send a POST request to `http://localhost:3000/merge_entities` with JSON payloads containing identical entities from different interfaces. The service will merge these entities according to the priorities settings and return the merged entity as a JSON response.
   you can use postman or any other similar tool.

### Priorities Settings

The priorities settings file (`priorities.json.txt`) defines the priorities for each field of the entity according to the source interface. Customize this file to specify the priority order for each field.

Example priorities settings file:

```json
{
  "entityType": "person",
  "priorities": {
    "tz": ["webint", "c2"],
    "name": ["webint", "c2"],
    "age": ["c2", "webint"],
    "address": {
      "city": ["c2", "webint"],
      "region": ["webint", "c2"]
    }
  }
}
