const Router = require('express')
const router = new Router()
const rectorMessageController = require('../controllers/rectorMessageController')

router.post('/', rectorMessageController.create)
router.get('/', rectorMessageController.getAll)

module.exports = router