const {Router} = require('express')
const {createPost,getPosts,getPost,deletePosts,editPosts,getCatPosts,getUserPosts} = require('../controllers/postscontroller')
const authMiddleware = require('../middleware/authmiddleware')
const router = Router();

router.post('/',authMiddleware,createPost)
router.get('/',getPosts)
router.get('/:id',getPost)
router.get('/categories/:category',getCatPosts)
router.get('/users/:id',getUserPosts)
router.patch('/:id',authMiddleware,editPosts)
router.delete('/:id',authMiddleware,deletePosts)

module.exports = router;