const multer = require('multer');
const path = require('path');

// set storage
const storage = multer.diskStorage({ // defines how and where the uploaded files will be stored on disk.
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // callback, no error occurs-null 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // round- 2.49 will be rounded down (2), and 2.5 will be rounded up (3).
    //random no bet 0-9 * 1billion
    cb(null, uniqueSuffix + path.extname(file.originalname)); // sets new file naem
  }
});


const upload = multer({ storage: storage });

// Export or use directly in your route
module.exports = upload;
