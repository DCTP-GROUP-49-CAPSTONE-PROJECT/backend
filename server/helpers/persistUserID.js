const fs = require("fs");
const path = require("path");

const saveIdTofile = (idText) => {
  fs.writeFile("userId.txt", idText, "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const readIdFromFile = () => {
  const data = fs.readFileSync("userId.txt", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    return data;
  });
  return data;
};

const removeIdFile = () => {
  fs.unlink("userId.txt", (err) => {
    if (err) {
      console.log(console.error());
    }
  });
};

module.exports = {
  saveIdTofile,
  readIdFromFile,
  removeIdFile,
};
