import fs from "fs";

const cleanUpFile = (file) => {
  if (file?.path && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
};

export default cleanUpFile;
