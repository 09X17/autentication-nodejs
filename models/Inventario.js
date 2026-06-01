const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventario = sequelize.define('Inventario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  serial: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Inventario;
