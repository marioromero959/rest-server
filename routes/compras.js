const { Router } = require('express');
const { buscarCompras, cargarCompras } = require('../controllers/compras');

//Usualmente las peticiones de busqueda se realizan por get,  se mandan los parametros por la url
const router = Router();

router.get('/', buscarCompras)
router.post('/cargarCompra', cargarCompras)

module.exports = router