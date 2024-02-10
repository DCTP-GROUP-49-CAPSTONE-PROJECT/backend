const fs = require("fs");
const path = require("path");

const idFilePath = path.join(__dirname, "userId.txt");

const saveIdTofile = (idText) => {
  fs.writeFile(idFilePath, idText, "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const readIdFromFile = () => {
  const data = fs.readFileSync(idFilePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    return data;
  });
  return data;
};

const removeIdFile = () => {
  fs.unlink(idFilePath, (err) => {
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
