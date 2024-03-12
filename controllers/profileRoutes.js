const router = require('express').Router();
const { User, FileRef } = require('../models');
const withAuth = require('../utils/auth');

//route to handle requests for the user profile page
router.get('/profile', withAuth, async (req, res) => {
    //trycatch block to fetch user data and render the profile page
    try {
        //retreive user data from the database; exclude pass word and include related data from the FileRef model(1--see footnotes)
        const userData = await User.findByPk(req.session.user_id, {
            attributes: {exclude: ['password']},
            include: [{model: FileRef}],
        });

        //converts the retrieved user data into a plain JavaScript object using the get() method with '{plain: true}' option(2)
        const user = userData.get({plain: true});

        //route handler renders the profile view using res.render()(3)
        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (error) {
        res.status(505).json(error);
    }
});

//Get all images and join with user data
router.get('/images', async (req, res) => {
    try {
        const imageData = await FileRef.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        //serialize data so the template can read. also the code in homeroutes is rendering images so may not need the code below
        // const serializedData = imageData.map(FileRef => {
        //     return {
        //         filename: FileRef.filename,
        //         username: FileRef.User ? FileRef.User.username : null
        //     }
        // })



        // res.render('image', {image: serializedData})
    } catch (error) {
        res.status(500).json(error)
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.render('login')
});

module.exports = router;

//1.in sequelize attributes option in the findByPk method allows you to specify which fields of the model should be included or excluded in the result set. 
    //include specific fields like id, username, and email: attributes: ['id', 'username', 'email']
    //exclude specific fields like passwords: attributes: { exclude: ['password'] }
    //to include all fields from the model, set attributes to an empty array or 'null': attributes: []

//2. In Sequelize, when you retrieve data from the database using methods like findByPk, the result is not just a plain JavaScript object. Instead, it's an instance of a Sequelize model, which includes additional functionalities and metadata provided by Sequelize. By calling the get() method with {plain: true} option on this instance, you're essentially converting it into a plain JavaScript object. Converting Sequelize model instances to plain JavaScript objects is a common practice to simplify data handling, improve compatibility with other parts of your application, and ensure smoother serialization and manipulation of data.  

//3. It passes the user data as well as a logged_in variable set to true to the view template. This allows the profile page to access the user data and indicates that the user is logged in.
    //...user = spread operator: it is used to spread the properties of an object into another object. It creates a new object and copies all enumerable own properties from one or more source objects to the new object.
    //The 'user' object likely contains user-related data retrieved from the database, such as user ID, username, email, etc. By using the spread operator (...user), all properties of the 'user' object are spread into the new object passed to res.render(). This ensures that all user-related data is available to the template engine when rendering the profile page.
    //Using the spread operator allows for a dynamic inclusion of properties from the user object. If the user object contains additional properties beyond what is explicitly specified in the res.render() call, those properties will also be included in the object passed to the template engine. This makes the code more flexible and resilient to changes in the structure of the user object.
