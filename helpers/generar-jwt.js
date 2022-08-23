const jwt = require('jsonwebtoken')

// No debemos grabar informacion sensible ene el JWT
const generarJWT = ( uid = '')=>{

    return new Promise((resolve, reject)=>{ //Hacemos que la funcion sea una promesa asi podemos usar el await

        const payload = { uid }

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            // expiresIn:'4h' //Podemos mandar cuanto queremos que dure el jwt
        },
        (err,token)=>{
            if(err){
                console.log(err);
                reject('No se pudo generar el jwt')
            }else{
                resolve(token)
            }
        })
    })
}


module.exports = {
    generarJWT
}