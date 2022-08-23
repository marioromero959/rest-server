const { Router } = require('express'); 
const { comprarProductos } = require('../controllers/ordermp') 
const router = Router();

router.post('/',comprarProductos)

module.exports = router;
