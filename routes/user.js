const { Router } = require('express'); //Usamos la funcion Router de express
const { usersGet, usersPost, usersPut, usersDelete, usersPatch } = require('../controllers/user');

const router = Router();

router.get('/',usersGet)
router.put('/:id', usersPut) //El id es uno de los parametros que enviamos en la url
router.post('/', usersPost)
router.patch('/', usersPatch)
router.delete('/', usersDelete)


module.exports = router;