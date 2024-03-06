const {Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class FileRef extends Model {};

FileRef.init(
    {
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        uuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscore:true,
        modelName: 'FileRef'
    }
);

module.exports = FileRef;