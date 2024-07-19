const router = require('express').Router();
const { User, FileRef } = require('../../models');

//route to create new user
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password
        });
        req.session.save(() => {
            req.session.userId = newUser.id;
            req.session.username = newUser.username;
            req.session.loggedIn = true;
            res.json(newUser)
        })
    
    } catch (error) {
        res.status(505).json(error)
    }
});

router.post('/login', async (req, res) => {
    try {
        const existingUser = await User.findOne({
            //for where explanation, see footnote #1
            where: {username: req.body.username}
        });
        if (!existingUser) {
            res.status(404).json({message: 'invalid username'})
        };
        const validPW = await existingUser.checkPassword(req.body.password)
        if (!validPW) {
            res.status(404).json({message: 'invalid password'})
        }

        req.session.save(() => {
            req.session.userId = existingUser.id
            req.session.username = existingUser.username
            req.session.loggedIn = true
            return res.json({existingUser, message: 'You are logged in!'})
        })
    } catch (error) {
        return res.status(500).json(error)
    }
});

//route to log out user.
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end()//(2)
        })
    } else {
        res.status(404).end()
    }
});

// this code sets up a route handler for the root URL of the web application. When a GET request is made to this route, it fetches all user data from the database and sends it back to the client as a JSON response.
router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll()
        res.json(userData)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router; 

//1. 'where' is a Sequelize query option that specifies the conditions for the query. It is used to filter the rows returned by the query based on specific criteria.
    //{username: req.body.username}: This is an object representing the condition or criteria for the query. It consists of a key-value pair where:
        //username: This is the name of the field in the database table (User model) that we want to match against.
        //req.body.username: This is the value we want to match against in the username field. req.body.username refers to the value of the username field submitted in the POST request body.

//2. The 'res' (response) object in Express.js has various methods that you can use to send a response to the client. Here are some commonly used res methods (for more, refer to documentation): 
    // res.send(): Sends the HTTP response with the specified data. It can handle various types of data, such as HTML, JSON, strings, or buffers: res.send(<h1>'Hello, World!'<h1>);
    // res.json(): Sends a JSON response. It automatically converts JavaScript objects into JSON format: res.json({ message: 'Hello, JSON!' });
    // res.status(): Sets the HTTP status code for the response: res.status(404).send('Not Found');
    // res.render(): Renders a view template. It's commonly used with template engines like EJS, Pug, or Handlebars: res.render('index', { title: 'My App' });
    // res.redirect(): Redirects the client to a different URL: res.redirect('/home');
    // res.end(): Ends the response process. It is often used to terminate the response when no more data needs to be sent: res.end();
    // res.sendFile(): Sends a file as an octet stream. It is often used to serve static files: res.sendFile('/path/to/file.txt');
    // res.setHeader(): Sets an HTTP header for the response: res.setHeader('Content-Type', 'text/plain');
    // res.cookie(): Sets a cookie in the client's browser: res.cookie('user', 'john_doe', { maxAge: 900000, httpOnly: true });
    // res.clearCookie(): Clears a cookie previously set in the client's browser: res.clearCookie('user');
    // in Express.js, the res (response) object methods can be chained together. Chaining allows you to call multiple methods on the res object in a single statement, which can improve code readability and reduce the number of lines of code.
        // Chaining can be used with various res methods, including status(), send(), json(), end(), etc. However, it's important to note that not all res methods can be chained together. For example, methods like render() and redirect() do not return the res object, so they cannot be chained with other res methods.
            // res.status(200).json({ message: 'Success' }).end();
