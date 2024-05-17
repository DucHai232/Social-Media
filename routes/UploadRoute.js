import express from "express";
const router = express.Router();
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("file", (req, res) => {
    try {
      return res
        .status(200)
        .json({ success: true, message: "Upload file Successfully" });
    } catch (error) {
      console.log(error);
    }
  })
);
export default router;
