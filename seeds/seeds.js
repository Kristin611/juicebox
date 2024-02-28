const sequelize = require('../config/connection');
const { User, FileRef } = require('../models');

const fileRefData = require('./fileRef.json');
const userData = require('./user.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true})

    const files = await FileRef.bulkCreate(fileRefData, {
        individualHooks: true,
        returning: true
    })
    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true
    })
} 

seedDatabase();

//using sequelize's bulkCreate() method to insert multiple records into the FileRef table. The fileRefData variable likely contains an array of objects, where each object represents data for a single file reference. The options passed to bulkCreate() include individualHooks: true, which ensures that any defined hooks for the FileRef model are executed for each created record, and returning: true, which indicates that the method should return the created records.