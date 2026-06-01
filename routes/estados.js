const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const estadoController = require('../controllers/estadoController');

router.use(authenticate);
router.use(authorize('administrador'));

router.get('/', estadoController.getAll);
router.get('/:id', estadoController.getById);
router.post('/', estadoController.create);
router.put('/:id', estadoController.update);
router.delete('/:id', estadoController.remove);

module.exports = router;
