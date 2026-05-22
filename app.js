const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    }
}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', (req, res) => {

    const { usuario, password } = req.body;

    if (usuario === 'admin' && password === '1234') {

        req.session.usuario = usuario;

        console.log('Usuario autenticado');

        res.redirect('/privado');

    } else {

        console.log('Acceso denegado');

        res.send('Credenciales incorrectas');

    }
});

function requireAuth(req, res, next) {

    if (req.session.usuario) {
        next();
    } else {
        res.status(401).send('No autorizado');
    }
}

app.get('/privado', requireAuth, (req, res) => {
    res.send('Bienvenido a la zona privada');
});

app.listen(3000, () => {
    console.log('Servidor funcionando en puerto 3000');
});