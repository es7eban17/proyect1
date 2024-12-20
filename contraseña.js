const bcrypt = require('bcrypt');

async function generarContraseña() {
  const saltRounds = 10;
  const plainPassword = 'tuNuevaContraseña'; // Cambia esto por la contraseña que desees
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log(hashedPassword);
}

generarContraseña();
