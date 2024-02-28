const User = require('./User');
const FileRef = require('./FileRef');

User.hasMany(FileRef, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

FileRef.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, FileRef };

//{ onDelete: 'CASCADE' } specifies the cascading delete behavior. It means that if a User record is deleted, all associated FileRef records with a matching foreign key (user_id) will also be deleted automatically, ensuring referential integrity.