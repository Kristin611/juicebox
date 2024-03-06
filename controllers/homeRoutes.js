const router = require('express').Router();
const {User, FileRef} = require('../models');
const withAuth = require('../utils/auth');

//route to homepage that render's all of the user's images
//withAuth middleware checks if the user is authenticated or has the necessary permissions to accewss the route
router.get('/', withAuth, async (req, res) => {
    try {
        //fetching image data from FileRef table in database using sequelize's findAll method. It also includes the associatd User model to retrieve the username attribute of the user associated with each image
        const imageData = await FileRef.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
            ],
        });
        
        //after fetching image data it is mapped to a new array called images. 
        //get plain: true method is used to convert each sequelize model instance to a plain JS object
        const images = imageData.map((image) => image.get({
            plain: true
        }))
        console.log(images)
        //home template (home.handlebars) is rendered: the images array containing the image data is passed to the template as a local variable: check home.handlebars to see how it is being displayed/rendered
        res.render('home', {images: images});

    } catch (error) {
        console.error(error)
        res.status(500).json(error);
    }
});