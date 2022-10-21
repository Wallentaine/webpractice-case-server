const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const postRouter = require('./postRouter')
const rectorMessageRouter = require('./rectorMessageRouter')
const typeRouter = require('./typeRouter')

router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/rectorMessage', rectorMessageRouter)
router.use('/type', typeRouter)

module.exports = router