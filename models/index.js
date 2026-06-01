const sequelize = require('../config/database');
const User = require('./User');
const Inventario = require('./Inventario');
const EstadoEquipo = require('./EstadoEquipo');
const Marca = require('./Marca');
const TipoEquipo = require('./TipoEquipo');

Inventario.belongsTo(EstadoEquipo, { foreignKey: 'estadoEquipoId' });
Inventario.belongsTo(Marca, { foreignKey: 'marcaId' });
Inventario.belongsTo(TipoEquipo, { foreignKey: 'tipoEquipoId' });

module.exports = {
  sequelize,
  User,
  Inventario,
  EstadoEquipo,
  Marca,
  TipoEquipo,
};
