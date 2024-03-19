# SMARTI System Entity Merger Service (by TSG)

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
  "entityType": {
    "person": {
      "priorities" : {
        "tz": ["webint", "A1", "c2"],
        "name" : ["A1", "webint", "c2"],
        "age": ["c2","A1", "webint"],
        "address": {
          "city": ["A1", "c2", "webint"],
          "region": ["webint", "c2", "A1"]
        }
      }
    },
    "vehicle": {
      "priorities" : {
        "type": ["A1", "c2", "webint"],
        "class": ["webint", "A1", "c2"],
        "engine": ["c2", "webint", "A1"],
        "price": ["A1", "webint", "c2"]
      }
    }
  }
}
```
Example JSON of entities send in POST request:
```json
{
  "entityType": {
    "person": {
      "webint": {
        "tz": "123456789",
        "name": "Moshe",
        "age": 60,
      	"address": {
      	  "city": "Tel-Aviv",
          "region": "north"
      	}
	  },
	  "c2": {
	    "tz": "000000000",
      	"name": "M",
      	"age": 50,
      	"address": {
      	  "city": "Metola",
          "region": "center"
      	}
	  },
	  "A1": {
	    "tz": "111111111",
      	"name": "Moti",
      	"age": 25,
      	"address": {
      	  "city": "Herzlia",
          "region": "Sharon"
      	}
	  }
	},
	"vehicle": {
	  "webint": {
	    "type": "Car",
	    "class": "A1"
	  },
	  "c2": {
	    "type": "Ship",
	    "class": "S1"
	  },
	  "A1": {
	    "type": "Space Ship",
	    "class": "SS1"
	  }
	}
  }
}
```
Example JSON of merged entity send as respons:
```json
{
    "person": {
        "tz": "123456789",
        "name": "Moti",
        "age": 50,
        "address": {
            "city": "Herzlia",
            "region": "north"
        }
    },
    "vehicle": {
        "type": "Space Ship",
        "class": "A1"
    }
}
```
