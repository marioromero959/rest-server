const { response } = require('express')
const Usuario = require('../models/usuario') //Siempre con mayuscula para poder crear instancias del modelo
const bcryptjs = require('bcryptjs');
const nodemailer = require("nodemailer");

// Aca creamos las funciones

const usersGet = async(req, res = response)=>{
    const { limite = 5, desde = 0} = req.query; //Parametros que envio en la url ?param=valor&param=valor
    //Codigo de ejemplo, hacerlo con Promise.all
    // const usuarios = await Usuario.find({estado:true}) ///Obtenemos todos los usuarios, si mandamos la llave, ponemos la condicion de lo que queremos que nos devuelva
        // .skip(Number(desde))
        // .limit(Number(limite)) //Le damos el limite de cantidad de usuarios que queremos 

    // const total = await Usuario.countDocuments({estado:true}); //Nos da la cantidad de registros de la coleccion
    const [total, usuarios] = await Promise.all([ //Desestructuramos el arreglo para mandar esos datos, es posicional
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})
        .skip(Number(desde))
        .limit(Number(limite)),
    ]
    )//Devuelve un array de promesas que se ejecutan de manera simultanea
    res.json({
        total,
        usuarios
    })
}

const usersPost = async(req, res = response)=>{
    const {nombre, correo, contraseña, rol} = req.body;
    const usuario = new Usuario({nombre, correo, contraseña, rol});//Solo toma los parametros del modelo
// Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); //Es el nivel de encriptacion, defalut 10
    usuario.contraseña = bcryptjs.hashSync(contraseña,salt) //Para encriptar por una sola via
// Con esto grabamos los datos en la bd
    await usuario.save();
    res.json({
        usuario,
    })
}
const usersPut = async(req, res = response)=>{
    const email = req.body.email;
    const findUser = await Usuario.find({correo:email})
    const usuario = findUser[0]
    if(!usuario){
        res.status(400).json({
            msg:'No se encontró un usuario registrado con ese email, intente de nuevo'
        })
    }else{
        //significa que si encontro un usuario en la base con ese email
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "marioromero959@gmail.com",
                    pass: "ehzlihvdahyimesp",
                }
            })
    
            await transporter.verify().then(() => {
                console.log("ready");
            })
            await transporter.sendMail({
                from: `Ecommerce Impacto` ,
                to: `${usuario.correo}`,
                subject: 'Reestablecer tu contraseña',
                html: `
                <h2>Hola: ${usuario.nombre}</h2>
                <p><strong> Este correo fue enviado para reestablecer tu contraseña, sigue el siguiente link:</strong> </p>
                <a target="_blank" href="http://localhost:4200/reset-password/${usuario._id}">Reestablecer Contraseña</a>
                `,
                //Todo:Cambiar la redireccion del mail a prod 
                //<a target="_blank" href="https://impacto-oficial.web.app/reset-password/${usuario._id}">Reestablecer Contraseña</a>
            })
            res.send().status(200)
        } catch (error) {
            res.send().status(500)
        }
    }
//     const { _id,contraseña, google,correo, ...resto } = req.body; //resto son los demas argumentos
// //Validar conrta base de datos
//     if(contraseña){
//         const salt = bcryptjs.genSaltSync();
//         resto.contraseña = bcryptjs.hashSync(contraseña,salt) 
//     }
// const usuario = await Usuario.findByIdAndUpdate(id, resto) //Con el id, actualiza el resto de campos
//     res.json(usuario)
//     res.json(200)
};

const resetPass = async(req, res = response)=>{
    const id = req.params.id; //Esto lo mandamos en la ruta(el mismo nombre)
    let {contraseña,correo} = req.body;
    const findUser = await Usuario.find({correo:correo})
    const usuario = findUser[0]
    if(!usuario){
        res.status(400).json({
            msg:'No se encontró un usuario registrado con ese email, intente de nuevo'
        })
        return
    }
    //Validar conrta base de datos
    if(contraseña){
        const salt = bcryptjs.genSaltSync();
        contraseña = bcryptjs.hashSync(contraseña,salt) 
    }
    try {
        const usuario = await Usuario.findByIdAndUpdate(id,{contraseña:contraseña}) //Con el id, actualiza el campo que le mandamos
        res.json(usuario)
    } catch (error) {
        return res.status(500).json('Algo salio mal');        
    }
 };

//No es recomendable borrar el usario, lo mejor es cambiar su estado a false
const usersDelete = async(req, res = response)=>{
    const { id } = req.params;
    // const usuario = await Usuario.findByIdAndDelete(id) Borra completamente el susuario de la BD(No usar)

    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false}) //Cambiamos el estado 
    
    res.json(usuario)
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    resetPass,
    usersDelete
}