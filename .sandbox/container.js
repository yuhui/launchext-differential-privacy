module.exports = {
  "extensions": {
    "differential-privacy": {
      "displayName": "Differential Privacy",
      "settings": {}
    }
  },
  "dataElements": {
    "Differential item by position": {
      "settings": {
        "selectedItem": "bar",
        "probabilityOfUsingSelectedItem": "0.75",
        "listOfPossibleItems": "foo, bar, stamp",
        "returnType": "position"
      },
      "cleanText": false,
      "forceLowerCase": false,
      "modulePath": "differential-privacy/src/lib/dataElements/differentialItem.js",
      "storageDuration": ""
    },
    "Differential item by value": {
      "settings": {
        "selectedItem": "bar",
        "probabilityOfUsingSelectedItem": "0.75",
        "listOfPossibleItems": "foo, bar, stamp",
        "returnType": "value"
      },
      "cleanText": false,
      "forceLowerCase": false,
      "modulePath": "differential-privacy/src/lib/dataElements/differentialItem.js",
      "storageDuration": ""
    }
  },
  "rules": [],
  "property": {
    "name": "Sandbox property",
    "settings": {
      "id": "PR12345",
      "domains": ["adobe.com", "example.com"],
      "undefinedVarsReturnEmpty": false
    }
  },
  "company": {
    "orgId": "ABCDEFGHIJKLMNOPQRSTUVWX@AdobeOrg"
  },
  "environment": {
    "id": "EN00000000000000000000000000000000",
    "stage": "development"
  },
  "buildInfo": {
    "turbineVersion": "27.2.1",
    "turbineBuildDate": "2022-10-27T15:06:49.459Z",
    "buildDate": "2022-10-27T15:06:49.459Z",
    "environment": "development"
  }
}