const router = require('express').Router();
const { v4: uuidv4} = require('uuid');
const mimeResolve = require('../../utils/fileExt');
const {FileRef, User } = require('../../models');

//(1)
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        let id = uuidv4()
        let newFilename = id.slice(id.length-5, id.length)
        let ext = mimeResolve(file.mimetype)
        req.uuid = id
        cb(null, `${newFilename}${ext}`)
    }
});

//using multer filter function to determine if the file should be accepted
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        //accept the file
        cb(null, true);
    } else {
        //reject the file
        cb(null, false)
        cb(new Error('File type is not accepted. Only JPEG, PNG, and GIF images are allowed.'));
    }
};

//(2)
const upload = multer ({
    storage: storage,
    fileFilter: fileFilter
});
router.post('/', upload.single('upload'), async (req, res) => {
    try {
        const newFile = await FileRef.create({
            filename: req.file.filename,
            uuid: req.uuid
        })

        res.render('fileUploadedView', {
            data: newFile
        })

    } catch (error) {
        res.status(500).json(error)
    }
});

router.post('/images', upload.single('upload'), (req, res) => {
    upload(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                return res.redirect('/')
            } else if (err) {
                return res.status(500).json(err)
            }


        } catch (error) {
            res.status(500).json(error)
        }
    })
})

module.exports = router;

//1. This code configures the storage engine for Multer using multer.diskStorage(). It specifies the destination directory where uploaded files will be stored ('public/images/') and specifies how the file should be named using the filename function. Inside the filename function, it generates a unique filename using uuidv4(), slices a portion of the UUID to create a shorter filename, and determines the file extension using the mimeResolve function, which is defined in utils/fileExt.js.

//2. This code defines a route handler for handling file uploads. It specifies that the route is for HTTP POST requests to the root URL ('/'). The upload.single('upload') middleware is used to handle a single file upload with the field name 'upload'--field name 'upload' is coming from HTML <input name='upload'></input> in home.handlebars. Inside the route handler, it creates a new FileRef record with the filename and UUID obtained from the request object (req.file.filename and req.uuid). Finally, it renders a view template named 'fileUploadedView' with the data of the newly created FileRef record.

// https://www.npmjs.com/package/multer?activeTab=readme 
