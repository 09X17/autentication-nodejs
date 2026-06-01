const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const marcaController = require('../controllers/marcaController');

router.use(authenticate);
router.use(authorize('administrador'));

router.get('/', marcaController.getAll);
router.get('/:id', marcaController.getById);
router.post('/', marcaController.create);
router.put('/:id', marcaController.update);
router.delete('/:id', marcaController.remove);

module.exports = router;
