const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.put('/image', userController.addImage)
router.get('/auth', authMiddleware, userController.check)
router.get('/email', userController.getUserByEmail)
router.get('/', userController.getAll)

module.exports = router