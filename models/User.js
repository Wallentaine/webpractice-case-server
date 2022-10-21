const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id : {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, allowNull: false},
    firstName: {type: DataTypes.STRING, allowNull: false},
    middleName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    birthDate: {type: DataTypes.DATE, allowNull: false},
    profession: {type: DataTypes.STRING, defaultValue: ""},
    organization: {type: DataTypes.STRING, defaultValue: ""}
})

module.exports = {
    User
}
