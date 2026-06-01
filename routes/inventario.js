const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const inventarioController = require('../controllers/inventarioController');

router.use(authenticate);

router.get('/', inventarioController.getAll);
router.get('/:id', inventarioController.getById);
router.post('/', authorize('administrador'), inventarioController.create);
router.put('/:id', authorize('administrador'), inventarioController.update);
router.delete('/:id', authorize('administrador'), inventarioController.remove);

module.exports = router;
