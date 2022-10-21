const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Post = sequelize.define('post', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    img: {type: DataTypes.STRING, defaultValue: null},
    text: {type: DataTypes.TEXT, allowNull: false}
})

module.exports = {
    Post
}