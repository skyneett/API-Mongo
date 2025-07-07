
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');
const userRoutes = require('./Routers/user.routes');
const User = require('./Models/user.model');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint principal: Home
app.get('/', async (req, res) => {
  try {
    // Trae todos los usuarios registrados y los muestra en el index
    const users = await User.find();
    res.send(`
      <html>
        <head>
          <title>API Mongo Railway</title>
          <style>
            body { font-family: Arial, sans-serif; background: #181824; color: #fff; }
            h1 { color: #00ff99; }
            table { border-collapse: collapse; width: 60%; margin: 20px auto; background: #222; }
            th, td { border: 1px solid #444; padding: 8px 12px; text-align: left; }
            th { background: #00ff99; color: #181824; }
            tr:nth-child(even) { background: #282828; }
            .endpoints { margin: 30px auto; width: 60%; }
            .endpoint { background: #222; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
            a { color: #00ff99; }
            .form-section { width: 60%; margin: 30px auto; background: #222; padding: 20px; border-radius: 8px; }
            label { display: block; margin-bottom: 5px; }
            input[type="text"], input[type="email"] { width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #444; background: #181824; color: #fff; }
            button { background: #00ff99; color: #181824; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 5px; }
            button.update { background: #ffb300; color: #181824; }
            button.delete { background: #ff3b3b; color: #fff; }
          </style>
        </head>
        <body>
          <h1>API Mongo Railway</h1>
          <div class="endpoints">
            <h2>Endpoints disponibles</h2>
            <div class="endpoint"><b>GET</b> <a href="/api/users">/api/users</a> - Ver todos los usuarios (JSON)</div>
            <div class="endpoint"><b>POST</b> /api/users - Crear usuario (JSON: name, email)</div>
            <div class="endpoint"><b>PUT</b> /api/users/:id - Actualizar usuario</div>
            <div class="endpoint"><b>DELETE</b> /api/users/:id - Eliminar usuario</div>
          </div>
          <div class="form-section">
            <h2 id="form-title">Crear usuario</h2>
            <form id="userForm">
              <input type="hidden" id="userId" />
              <label for="name">Nombre:</label>
              <input type="text" id="name" name="name" required />
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required />
              <button type="submit" id="submitBtn">Crear</button>
              <button type="button" id="cancelBtn" style="display:none;">Cancelar</button>
            </form>
            <div id="formMsg"></div>
          </div>
          <h2 style="text-align:center">Usuarios registrados</h2>
          <table>
            <tr><th>Nombre</th><th>Email</th><th>Creado</th><th>Acciones</th></tr>
            ${users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${new Date(u.createdAt).toLocaleString()}</td><td><button class='update' onclick='editUser("${u._id}", "${u.name}", "${u.email}")'>Actualizar</button><button class='delete' onclick='deleteUser("${u._id}")'>Eliminar</button></td></tr>`).join('')}
          </table>
          <script>
            // Manejo del formulario para crear/actualizar usuario
            const form = document.getElementById('userForm');
            const formTitle = document.getElementById('form-title');
            const submitBtn = document.getElementById('submitBtn');
            const cancelBtn = document.getElementById('cancelBtn');
            const formMsg = document.getElementById('formMsg');
            form.onsubmit = async (e) => {
              e.preventDefault();
              const id = document.getElementById('userId').value;
              const name = document.getElementById('name').value;
              const email = document.getElementById('email').value;
              let url = '/api/users';
              let method = 'POST';
              if (id) {
                url += '/' + id;
                method = 'PUT';
              }
              const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
              });
              if (res.ok) {
                formMsg.innerText = id ? 'Usuario actualizado' : 'Usuario creado';
                setTimeout(() => window.location.reload(), 800);
              } else {
                const data = await res.json();
                formMsg.innerText = data.message || 'Error';
              }
            };
            cancelBtn.onclick = () => {
              form.reset();
              document.getElementById('userId').value = '';
              formTitle.innerText = 'Crear usuario';
              submitBtn.innerText = 'Crear';
              cancelBtn.style.display = 'none';
            };
            window.editUser = (id, name, email) => {
              document.getElementById('userId').value = id;
              document.getElementById('name').value = name;
              document.getElementById('email').value = email;
              formTitle.innerText = 'Actualizar usuario';
              submitBtn.innerText = 'Actualizar';
              cancelBtn.style.display = 'inline-block';
            };
            window.deleteUser = async (id) => {
              if (confirm('¿Seguro que deseas eliminar este usuario?')) {
                const res = await fetch('/api/users/' + id, { method: 'DELETE' });
                if (res.ok) {
                  window.location.reload();
                } else {
                  alert('Error eliminando usuario');
                }
              }
            };
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error mostrando usuarios');
  }
});

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));