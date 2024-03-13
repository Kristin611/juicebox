// Import the dotenv package
require('dotenv').config();

// Log the contents of the .env file to the console
console.log('Contents of .env file:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('JAWSDB_URL:', process.env.JAWSDB_URL);

//use command node printEnv.js to print contents of .env file to the console