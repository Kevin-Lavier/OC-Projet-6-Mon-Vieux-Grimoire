const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload.js");

const booksCtrl = require("../controllers/books");

router.get("/", booksCtrl.getAllBooks);
router.get("/:id", booksCtrl.getOneBook);
router.post("/", auth, upload, upload.resizeImage, booksCtrl.createBook);
router.put("/:id", auth, upload, upload.resizeImage, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);

module.exports = router;
