const { TipoEquipo } = require('../models');

async function getAll(req, res) {
  try {
    const tipos = await TipoEquipo.findAll();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipos de equipo' });
  }
}

async function getById(req, res) {
  try {
    const tipo = await TipoEquipo.findByPk(req.params.id);

    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de equipo no encontrado' });
    }

    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo de equipo' });
  }
}

async function create(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }

    const existing = await TipoEquipo.findOne({ where: { nombre } });

    if (existing) {
      return res.status(400).json({ error: 'El tipo de equipo ya existe' });
    }

    const tipo = await TipoEquipo.create({ nombre, descripcion });
    res.status(201).json(tipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tipo de equipo' });
  }
}

async function update(req, res) {
  try {
    const tipo = await TipoEquipo.findByPk(req.params.id);

    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de equipo no encontrado' });
    }

    await tipo.update(req.body);
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tipo de equipo' });
  }
}

async function remove(req, res) {
  try {
    const tipo = await TipoEquipo.findByPk(req.params.id);

    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de equipo no encontrado' });
    }

    await tipo.destroy();
    res.json({ message: 'Tipo de equipo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tipo de equipo' });
  }
}

module.exports = { getAll, getById, create, update, remove };
