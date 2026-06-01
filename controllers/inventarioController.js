const { Inventario } = require('../models');

async function getAll(req, res) {
  try {
    const inventarios = await Inventario.findAll({
      include: ['EstadoEquipo', 'Marca', 'TipoEquipo'],
    });
    res.json(inventarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inventarios' });
  }
}

async function getById(req, res) {
  try {
    const inventario = await Inventario.findByPk(req.params.id, {
      include: ['EstadoEquipo', 'Marca', 'TipoEquipo'],
    });

    if (!inventario) {
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
}

async function create(req, res) {
  try {
    const { nombre, descripcion, serial, ubicacion, estadoEquipoId, marcaId, tipoEquipoId } = req.body;

    if (!nombre || !serial) {
      return res.status(400).json({ error: 'Nombre y serial son requeridos' });
    }

    const existing = await Inventario.findOne({ where: { serial } });

    if (existing) {
      return res.status(400).json({ error: 'El serial ya está registrado' });
    }

    const inventario = await Inventario.create({
      nombre,
      descripcion,
      serial,
      ubicacion,
      estadoEquipoId,
      marcaId,
      tipoEquipoId,
    });

    res.status(201).json(inventario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear inventario' });
  }
}

async function update(req, res) {
  try {
    const inventario = await Inventario.findByPk(req.params.id);

    if (!inventario) {
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    await inventario.update(req.body);
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar inventario' });
  }
}

async function remove(req, res) {
  try {
    const inventario = await Inventario.findByPk(req.params.id);

    if (!inventario) {
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    await inventario.destroy();
    res.json({ message: 'Inventario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar inventario' });
  }
}

module.exports = { getAll, getById, create, update, remove };
