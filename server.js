const path = require('path');
//path module provides utilities for working with file and directory paths
const express = require('express');
//imports Express.js framework, express is a popular web app framework for node.js which is used for building web apps and APIs
const session = require('express-session');
//middleware for managing sessions in web apps. sessions are used to persist user data across multiple requests
const exphbs = require('express-handlebars');
//express-handlebars is an adapter that allows express.js to work with handlebars.js. handlebars is a templating engine that allows you to build dynamic html pages
const routes = require('./controllers');
//route handlers for various endpoints in web app
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
//sequelize is a promise-based Node.js ORM library forf interacting with relational databases like MySQL, PostgreSQL, SQLite, etc. the sequelize object is used to define models and perform database operations

const app = express();
const PORT = process.env.PORT || 3001;

//set up handlebars.js engine with custom helpers
const hbs = exphbs.create({helpers});

const sess = {
    secret: 'Super secret secret',
    //secret property is a string used to sign the session ID cookie. Recommended to use a long, randomly generated string for security purposes--used to prevent session tampering
    cookie: { //object that defines options for the session cookie
        maxAge: 300000, //max age of session cookie in milliseconds;300000 ms = 5 mins
        httpOnly: true, //indicates whether the cookie should be accessible only throughh the HTTP(S) protocol. Setting it to true enhances security by preventing client-side JS from accessing the cookie.
        secure: false, //indicates whether the cookie should only be sent over HTTPS. setting it to false means the cookie can be sent over HTTP.
        sameSite: 'strict' //strict means the cookie will only be sent in a first-party context. other values include 'lax' or 'none'
    },
    resave: false, //false optimizes performance by preventing unnecessary writes to the session store.
    saveUninitialized: true, //indicates whether to save a session that is new but not modified. true allows sessions to be saved even if they are new and have not been modified, which is useful for implementing login sessions.
    store: new SequelizeStore({ //indicates where session data will be stored
        db: sequelize //sequelizeStore is a session store designed to work with sequelize, allowing session data to be stored in a relational db managed by sequelize.
    })
};

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//middleware responsible for parsing incoming request bodies with JSON payloads and populate the 'req.body' property.
app.use(express.json());
//middleware responsible for parsing incoming request bodies with URL-encoded payloads and populate the 'req.body' property. extended: true allows for parsing nested objects in the URL-encoded data.
app.use(express.urlencoded({extended: true}));
//middleware responsible for serving static files such as images, CSS, JS, etc.
app.use(express.static(path.join(__dirname, 'public')));
//express middleware for managing sessions in web apps related to the sess object
app.use(session(sess));
//mounts the routes defined in the routes module onto the express application (app); indicats that the app should use these routes for handling incoming requests
app.use(routes);

//synchronizes the sequelize models withthe db. it ensures the db schema is up-to-date with the defined sequelize models. force: false indicates that that sequelize should not force the synchronization by dropping existing talbes. 
//after synchronization the app starts loistening for incoming HTTP requests on the specified ports using app.listen.
//anonymous arrow functions are used; the first in the .then is an anonymous callback function, the second is just an anonymous arrow function.
sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});