const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const RectorMessage = sequelize.define('rector_message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    theme: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.TEXT, allowNull: false}
})

module.exports = {
    RectorMessage
}