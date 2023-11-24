const { Router } = require('express');
const { check } = require('express-validator');


const { login, actualizarUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares');

const router = Router();

router.put('/actualizar/:id', actualizarUsuario)

router.post('/login',[
    check('nombre', 'El usuario es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
] , login);   

module.exports = router;