//fixed error handling so it exists the program if there is an error in the readFile function or the write function
const fs = require("fs");
function readFile(path, callback) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}
function writeFile(path, data, callback) {
  fs.writeFile(path, data, "utf8", (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
}

readFile("/Users/mindruandrei/auth-app/backend/input.txt", (err, data) => {
  if (err) {
    return;
  }
  const newData = data.toUpperCase();
  writeFile("output.txt", newData, (err) => {
    if(err) {
        return
    }
  });
});
