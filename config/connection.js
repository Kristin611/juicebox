const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

//the code above sets up the initial environment for using the Sequelize library by importing the sequelize module and configuring environment variables using dotenv. It also declares a variable sequelize which will likely be used to establish a database connection later in the code.

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306
        }
    );
}

//the code above dynamically configures a Sequelize instance based on the environment in which the application is running. If a JAWSDB_URL environment variable is defined (indicating a remote database), it uses that URL for the connection. Otherwise, it falls back to using local database credentials specified by DB_NAME, DB_USER, and DB_PASSWORD environment variables.

module.exports = sequelize;