var express = require('express');
var router = express.Router();
const multer = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({
  storage: storage,
  fileFilter(req, file, callback) {
    // 解决中文名乱码的问题
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    callback(null, true);
  },
});

router.post('/unload_img',upload.single('img'), function(req, res, next) {
  res.send({ok: 1});
});

router.post('/photos/upload', upload.array('imgs', 20), function (req, res, next) {
  if (req.files.length === 0) {
    res.send({ ok: 0 });
  } else {
    res.send({ ok: 1 });
  }
})

module.exports = router;
