const { EstadoEquipo } = require('../models');

async function getAll(req, res) {
  try {
    const estados = await EstadoEquipo.findAll();
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estados de equipo' });
  }
}

async function getById(req, res) {
  try {
    const estado = await EstadoEquipo.findByPk(req.params.id);

    if (!estado) {
      return res.status(404).json({ error: 'Estado de equipo no encontrado' });
    }

    res.json(estado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estado de equipo' });
  }
}

async function create(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }

    const existing = await EstadoEquipo.findOne({ where: { nombre } });

    if (existing) {
      return res.status(400).json({ error: 'El estado ya existe' });
    }

    const estado = await EstadoEquipo.create({ nombre, descripcion });
    res.status(201).json(estado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear estado de equipo' });
  }
}

async function update(req, res) {
  try {
    const estado = await EstadoEquipo.findByPk(req.params.id);

    if (!estado) {
      return res.status(404).json({ error: 'Estado de equipo no encontrado' });
    }

    await estado.update(req.body);
    res.json(estado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de equipo' });
  }
}

async function remove(req, res) {
  try {
    const estado = await EstadoEquipo.findByPk(req.params.id);

    if (!estado) {
      return res.status(404).json({ error: 'Estado de equipo no encontrado' });
    }

    await estado.destroy();
    res.json({ message: 'Estado de equipo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar estado de equipo' });
  }
}

module.exports = { getAll, getById, create, update, remove };
