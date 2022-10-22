const Router = require('express')
const router = new Router()
const postController = require('../controllers/postController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/', checkRoleMiddleware("WORKER"), postController.create)
router.get('/latest/', postController.getLatestPosts)
router.get('/:id', postController.getOne)
router.get('/', postController.getAll)
router.put('/', checkRoleMiddleware("ADMIN"), postController.update)

module.exports = router