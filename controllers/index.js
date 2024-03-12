const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

//attaching apiRoutes middleware to the /api base path: any routes defined within the apiRoutes middleware will be accessible under the /api path
router.use('/api', apiRoutes);
router.use('/', homeRoutes);

//defining a route for handling GET requests for images witha dynamic parameter :filename. when a request is made to this route, the :filename parameter is extracted from the request URL (req.params.filename). The code then constructs a file path based on the :filename paramter and renders a template called image. It passes an object containing the 'filepath' and layout information to the template render.
router.get('/:filename', async (req, res) => {
    console.log(req.params.filename)
    let filepath = `images/${req.params.filename}`
    res.render('image', {filepath: filepath, layout: 'blank.handlebars'})
});

//This code snippet defines a middleware that catches any requests that do not match the routes defined earlier. It sends a simple HTML response with the message "Wrong route."
router.use((req, res) => {
    res.send('<h1>Wrong route.<h1>')
});

module.exports = router; 