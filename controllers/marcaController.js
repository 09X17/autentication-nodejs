const { Marca } = require('../models');

async function getAll(req, res) {
  try {
    const marcas = await Marca.findAll();
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener marcas' });
  }
}

async function getById(req, res) {
  try {
    const marca = await Marca.findByPk(req.params.id);

    if (!marca) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }

    res.json(marca);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener marca' });
  }
}

async function create(req, res) {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }

    const existing = await Marca.findOne({ where: { nombre } });

    if (existing) {
      return res.status(400).json({ error: 'La marca ya existe' });
    }

    const marca = await Marca.create({ nombre });
    res.status(201).json(marca);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear marca' });
  }
}

async function update(req, res) {
  try {
    const marca = await Marca.findByPk(req.params.id);

    if (!marca) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }

    await marca.update(req.body);
    res.json(marca);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar marca' });
  }
}

async function remove(req, res) {
  try {
    const marca = await Marca.findByPk(req.params.id);

    if (!marca) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }

    await marca.destroy();
    res.json({ message: 'Marca eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar marca' });
  }
}

module.exports = { getAll, getById, create, update, remove };
