const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./storage/imgs')
    },
    filename: function (req,file,cb) {
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    },

})

const upload = multer ({storage:storage,limits:{fileSize:2000000}});

module.exports = upload;

