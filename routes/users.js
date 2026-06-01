const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.use(authenticate);

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', authorize('administrador'), userController.create);
router.put('/:id', authorize('administrador'), userController.update);
router.delete('/:id', authorize('administrador'), userController.remove);

module.exports = router;
