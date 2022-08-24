const { Router } = require('express'); //Usamos la funcion Router de express
const { check } = require('express-validator');
const { login, loginGoogle } = require('../controllers/auth');
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post('/login',[
    check('correo','El correo es obligarorio').isEmail(),
    check('contraseña','La contraseña es obligaroria').not().isEmpty(),
    validarCampos
],login)

router.post('/google',[
    check('id_token','id_token de google neccesario').not().isEmpty(),
    validarCampos
],loginGoogle)

module.exports = router;