const { Router } = require('express'); 
const { enviarEmail } = require('../controllers/email');
const router = Router();

router.post('/',enviarEmail)

module.exports = router;
