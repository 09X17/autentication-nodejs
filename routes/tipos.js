const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const tipoController = require('../controllers/tipoController');

router.use(authenticate);
router.use(authorize('administrador'));

router.get('/', tipoController.getAll);
router.get('/:id', tipoController.getById);
router.post('/', tipoController.create);
router.put('/:id', tipoController.update);
router.delete('/:id', tipoController.remove);

module.exports = router;
