const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
    checkPassword(loginPW) {
        return bcrypt.compareSync(loginPW, this.password)
    }
    //Inside the checkPassword method, there's a call to bcrypt.compareSync(). bcrypt is a library used for hashing passwords securely. The compareSync() function is used to compare a plain text password (loginPW) with a hashed password stored in the database (accessed through this.password).
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false 
        }
    },
    {
        hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            beforeUpdate: async (updatedUserData) => {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User; 

//Commonly used hooks in Sequelize (a popular ORM for Node.js) include:

// beforeCreate: Executed before a new instance of the model is created in the database.
// afterCreate: Executed after a new instance of the model is created in the database.
// beforeUpdate: Executed before an existing instance of the model is updated in the database.
// afterUpdate: Executed after an existing instance of the model is updated in the database.
// beforeDestroy: Executed before an instance of the model is deleted from the database.
// afterDestroy: Executed after an instance of the model is deleted from the database.

//Hooks provide a way to encapsulate and organize logic related to database operations within the model definition itself, improving code maintainability and readability. They allow developers to enforce business rules, handle side effects, and implement custom behaviors consistently across the application.