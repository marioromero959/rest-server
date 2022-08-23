const { response } = require("express");
// SDK de Nodemailer
const nodemailer = require("nodemailer");

const enviarEmail = async(req, res = response) =>{

    const email = req.body.emailBody;
    console.log("Falta actualizar metodo email")
    // const transporter = nodemailer.createTransport({
    //     host:"",
    //     port:465,
    //     secure:true,
    //     auth:{
    //         user:email,
    //         pass:email,
    //     }
    // })

    // await transporter.verify().then(()=>{
    //     console.log("ready");
    // })
    // await transporter.sendMail({
    //     from:email.email,
    //     to:'marioromero99@gmail.com',
    //     subject:'Nuevo pedido',
    //     text:`${email.nombre} hizo un pedido`,
    //     html:'<h2>Nuevo pedido</h2>',
    // })

res.send().status(200)
}
module.exports = {
    enviarEmail
}