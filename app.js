require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const inventarioRoutes = require('./routes/inventario');
const estadosRoutes = require('./routes/estados');
const marcasRoutes = require('./routes/marcas');
const tiposRoutes = require('./routes/tipos');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/inventarios', inventarioRoutes);
app.use('/api/estados', estadosRoutes);
app.use('/api/marcas', marcasRoutes);
app.use('/api/tipos', tiposRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de Autenticación y Autorización - Node.js + JWT' });
});

async function start() {
  try {
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada');

    const { User, EstadoEquipo, Marca, TipoEquipo, Inventario } = require('./models');
    const bcrypt = require('bcryptjs');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      nombre: 'Administrador',
      email: 'admin@ejemplo.com',
      password: hashedPassword,
      rol: 'administrador',
    });
    console.log('Usuario administrador creado: admin@ejemplo.com / admin123');

    const hashedDocente = await bcrypt.hash('docente123', 10);
    await User.create({
      nombre: 'Carlos Rodríguez',
      email: 'carlos@ejemplo.com',
      password: hashedDocente,
      rol: 'docente',
    });
    console.log('Usuario docente creado: carlos@ejemplo.com / docente123');

    await User.create({
      nombre: 'María López',
      email: 'maria@ejemplo.com',
      password: hashedDocente,
      rol: 'docente',
    });
    console.log('Usuario docente creado: maria@ejemplo.com / docente123');

    const estados = await EstadoEquipo.bulkCreate([
      { nombre: 'Operativo', descripcion: 'Equipo en funcionamiento correcto' },
      { nombre: 'En mantenimiento', descripcion: 'Equipo en proceso de reparación o mantenimiento preventivo' },
      { nombre: 'Fuera de servicio', descripcion: 'Equipo no operativo, requiere reparación mayor' },
      { nombre: 'Nuevo', descripcion: 'Equipo recién adquirido, sin uso' },
      { nombre: 'En garantía', descripcion: 'Equipo cubierto por garantía del fabricante' },
    ]);
    console.log(`${estados.length} estados de equipo creados`);

    const marcas = await Marca.bulkCreate([
      { nombre: 'Dell' },
      { nombre: 'HP' },
      { nombre: 'Lenovo' },
      { nombre: 'Samsung' },
      { nombre: 'Epson' },
      { nombre: 'Cisco' },
    ]);
    console.log(`${marcas.length} marcas creadas`);

    const tipos = await TipoEquipo.bulkCreate([
      { nombre: 'Portátil', descripcion: 'Computador portátil / Laptop' },
      { nombre: 'Escritorio', descripcion: 'Computador de escritorio / Desktop' },
      { nombre: 'Monitor', descripcion: 'Pantalla o monitor' },
      { nombre: 'Impresora', descripcion: 'Dispositivo de impresión' },
      { nombre: 'Servidor', descripcion: 'Equipo servidor' },
      { nombre: 'Switch', descripcion: 'Switch de red' },
    ]);
    console.log(`${tipos.length} tipos de equipo creados`);

    await Inventario.bulkCreate([
      {
        nombre: 'Laptop Dell Latitude 5520',
        descripcion: 'Intel Core i7, 16GB RAM, 512GB SSD',
        serial: 'SN-DELL-001',
        ubicacion: 'Laboratorio 301 - Edificio A',
        estadoEquipoId: 1,
        marcaId: 1,
        tipoEquipoId: 1,
      },
      {
        nombre: 'Laptop HP ProBook 450',
        descripcion: 'Intel Core i5, 8GB RAM, 256GB SSD',
        serial: 'SN-HP-002',
        ubicacion: 'Laboratorio 302 - Edificio A',
        estadoEquipoId: 1,
        marcaId: 2,
        tipoEquipoId: 1,
      },
      {
        nombre: 'PC Escritorio Lenovo ThinkCentre',
        descripcion: 'AMD Ryzen 5, 16GB RAM, 1TB HDD + 256GB SSD',
        serial: 'SN-LNV-003',
        ubicacion: 'Oficina de Decanatura - Piso 2',
        estadoEquipoId: 1,
        marcaId: 3,
        tipoEquipoId: 2,
      },
      {
        nombre: 'Monitor Samsung 24" S24R350',
        descripcion: 'Monitor LED Full HD, HDMI/VGA',
        serial: 'SN-SAM-004',
        ubicacion: 'Laboratorio 301 - Edificio A',
        estadoEquipoId: 1,
        marcaId: 4,
        tipoEquipoId: 3,
      },
      {
        nombre: 'Impresora Epson EcoTank L3250',
        descripcion: 'Impresora multifuncional, WiFi, tinta continua',
        serial: 'SN-EPS-005',
        ubicacion: 'Sala de Profesores - Piso 1',
        estadoEquipoId: 2,
        marcaId: 5,
        tipoEquipoId: 4,
      },
      {
        nombre: 'Laptop Dell Inspiron 15',
        descripcion: 'Intel Core i3, 4GB RAM, 1TB HDD',
        serial: 'SN-DELL-006',
        ubicacion: 'Bodega de Inventarios',
        estadoEquipoId: 3,
        marcaId: 1,
        tipoEquipoId: 1,
      },
      {
        nombre: 'Servidor Dell PowerEdge T40',
        descripcion: 'Xeon E-2224G, 32GB RAM, 2TB RAID',
        serial: 'SN-DELL-007',
        ubicacion: 'Sala de Servidores - Sótano',
        estadoEquipoId: 1,
        marcaId: 1,
        tipoEquipoId: 5,
      },
      {
        nombre: 'Switch Cisco Catalyst 2960',
        descripcion: 'Switch administrable 24 puertos Gigabit',
        serial: 'SN-CSC-008',
        ubicacion: 'Rack Principal - Sala de Servidores',
        estadoEquipoId: 1,
        marcaId: 6,
        tipoEquipoId: 6,
      },
      {
        nombre: 'Monitor HP 22" M22F',
        descripcion: 'Monitor IPS Full HD, bordes delgados',
        serial: 'SN-HP-009',
        ubicacion: 'Laboratorio 302 - Edificio A',
        estadoEquipoId: 4,
        marcaId: 2,
        tipoEquipoId: 3,
      },
      {
        nombre: 'Laptop Lenovo ThinkPad T14',
        descripcion: 'AMD Ryzen 7 Pro, 16GB RAM, 512GB NVMe',
        serial: 'SN-LNV-010',
        ubicacion: 'Oficina del Director de Programa',
        estadoEquipoId: 5,
        marcaId: 3,
        tipoEquipoId: 1,
      },
    ]);
    console.log('10 registros de inventario creados');

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

start();
