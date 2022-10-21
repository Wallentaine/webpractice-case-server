const {User} = require('./User')
const {Post} = require('./Post')
const {Type} = require('./Type')
const {RectorMessage} = require('./RectorMessage')


User.hasMany(RectorMessage)
RectorMessage.belongsTo(User)

User.hasMany(Post)
Post.belongsTo(User)

Type.hasMany(Post)
Post.belongsTo(Type)

module.exports = {
    User,
    Post,
    Type,
    RectorMessage
}