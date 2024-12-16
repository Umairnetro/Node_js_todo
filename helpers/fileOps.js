const fs = require("fs");

const readJSON = (file) => {
  try {
    const data = fs.readFileSync(`./data/${file}`, "utf8");

    if (!data) return [];

    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file ${file}:`, err);
    return [];
  }
};

const writeJSON = (file, data) => {
  try {
    fs.writeFileSync(`./data/${file}`, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing file ${file}`, err);
  }
};

module.exports = { readJSON, writeJSON };
