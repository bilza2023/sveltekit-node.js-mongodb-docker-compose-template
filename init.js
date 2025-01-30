
const fs = require("fs");

db = connect("mongodb://admin:password@localhost:27017/admin");

// Switch to localDb
db = db.getSiblingDB("localDb");

const filePath = "/init.js"; // Ensure correct path
const file = fs.readFileSync(filePath, "utf8"); // Read file
const jsonData = JSON.parse(file); // Parse JSON

db.createCollection("tcodes");
db.tcodes.insertMany(jsonData);

print("✅ Database 'localDb' initialized with 'tcodes' collection!");
