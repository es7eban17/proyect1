const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Datos iniciales del catálogo
let productos = [
  { id: 1, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/5 ALARM.jpeg" },
  { id: 2, nombre: "Precio:$7000", stock: 1, imagen: "./WHEELS/22' FORD MAVERICK.jpeg" },
  { id: 3, nombre: "Precio:$7000", stock: 1, imagen: "./WHEELS/49' DRAG MERC.jpeg" },
  { id: 4, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/67' LOTUS.jpeg" },
  { id: 5, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/70' DODGE CHARGER.jpeg" },
  { id: 6, nombre: "Precio:$7000", stock: 2, imagen: "./WHEELS/77'PONTIAC FIREBIRD.jpeg" },
  { id: 7, nombre: "Precio:$8000", stock: 1, imagen: "./WHEELS/91' GMC SCYCLONE.jpeg" },
  { id: 8, nombre: "Precio:$7000", stock: 1, imagen: "./WHEELS/94'AUDI AVANT R2.jpeg" },
  { id: 9, nombre: "Precio:$7000", stock: 2, imagen: "./WHEELS/BATMAN.jpeg" },
  { id: 10, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/BOOM CAR.jpeg" },
  { id: 11, nombre: "Precio:$7000", stock: 2, imagen: "./WHEELS/CADILLAC PROJECT.jpeg" },
  { id: 12, nombre: "Precio:$6000", stock: 2, imagen: "./WHEELS/DEORA II.jpeg" },
  { id: 13, nombre: "Precio:$6000", stock: 2, imagen: "./WHEELS/DEORA III.jpeg" },
  { id: 14, nombre: "Precio:$8000", stock: 1, imagen: "./WHEELS/DODGE VIPER.jpeg" },
  { id: 15, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/DUNE DADDY.jpeg" },
  { id: 16, nombre: "Precio:$6000", stock: 2, imagen: "./WHEELS/FLIPPIN FAST.jpeg" },
  { id: 17, nombre: "Precio:$7000", stock: 1, imagen: "./WHEELS/FORD SUPERVAN 4}.jpeg" },
  { id: 18, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/FORD TRANSIT CONECT.jpeg" },
  { id: 19, nombre: "Precio:$7000", stock: 1, imagen: "./WHEELS/HYDROATA MERC.jpeg" },
  { id: 20, nombre: "Precio:$7000", stock: 2, imagen: "./WHEELS/JAGUAR F TYPR.jpeg" },
  { id: 21, nombre: "Precio:$7000", stock: 2, imagen: "./WHEELS/LIMITED GRYP.jpeg" },
  { id: 22, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/MAXSTEEL.jpeg" },
  { id: 23, nombre: "Precio:$7000", stock: 2, imagen: "./WHEELS/MAZDA RX7.jpeg" },
  { id: 24, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/MUSTANG FUNNY CAR.jpeg" },
  { id: 25, nombre: "Precio:$7000", stock: 2, imagen: "./WHEELS/NISSAN SKYLYNE.jpeg" },
  { id: 26, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/PIRANHA.jpeg" },
  { id: 27, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/QUICK BYTE.jpeg" },
  { id: 28, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/RAPID PULSE.jpeg" },
  { id: 29, nombre: "Precio:$7000", stock: 2, imagen: "./WHEELS/RAVENGER ST.jpeg" },
  { id: 30, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/SURFIN SCHOOL BUS.jpeg" },
  { id: 31, nombre: "Precio:$6000", stock: 2, imagen: "./WHEELS/SUSHI.jpeg" },
  { id: 32, nombre: "Precio:$6000", stock: 2, imagen: "./WHEELS/TERRA TRACKTYL.jpeg" },
  { id: 33, nombre: "Precio:$8000", stock: 1, imagen: "./WHEELS/TOYOTA GR 86.jpeg" },
  { id: 34, nombre: "Precio:$6000", stock: 2, imagen: "./WHEELS/TROUBLE DECKER.jpeg" },
  { id: 35, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/VOLKSWAGEN ID BUZZ.jpeg" },
  { id: 36, nombre: "Precio:$6000", stock: 1, imagen: "./WHEELS/WHEELS HIGH.jpeg"}
  

];

// Usuario y contraseña (en un entorno real, esto debería estar en una base de datos)
const plainPassword = '1918'; // Cambia esto por la contraseña que desees
let user = { username: 'admin', password: '' };

// Encripta la contraseña al iniciar el servidor
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error('Error al encriptar la contraseña:', err);
  } else {
    user.password = hash;
    console.log('Contraseña encriptada:', hash);
  }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && await bcrypt.compare(password, user.password)) {
    req.session.user = username;
    res.json({ mensaje: "Inicio de sesión exitoso" });
  } else {
    res.status(401).json({ mensaje: "Credenciales incorrectas" });
  }
});

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.status(401).json({ mensaje: "No autorizado" });
  }
}

// Ruta para obtener los productos (sin autenticación)
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// Ruta para actualizar el stock de un producto (protegida)
app.post('/api/productos/actualizar', isAuthenticated, (req, res) => {
  const { id, nuevoStock } = req.body;
  const producto = productos.find(p => p.id === id);

  if (producto) {
    producto.stock = nuevoStock;
    res.json({ mensaje: "Stock actualizado correctamente", producto });
  } else {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  }
});

// Ruta secreta para mostrar el formulario de inicio de sesión
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Ruta protegida para el panel de administración
app.get('/admin-dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Ruta para servir el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
