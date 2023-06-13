import multer from "multer";
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, new Date().getTime() + ext);
  },
});

const upload = multer({ storage });

export default upload;
