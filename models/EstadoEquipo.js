const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EstadoEquipo = sequelize.define('EstadoEquipo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = EstadoEquipo;
