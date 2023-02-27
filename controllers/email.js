const { response } = require("express");
// SDK de Nodemailer
const nodemailer = require("nodemailer");

const enviarEmail = async (req, res = response) => {

    const email = req.body.emailBody;

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
        if(!email.telefono){
            email.telefono = "No registrado"
        }
        await transporter.sendMail({
            from: `Ecommerce Impacto" <${email.email}>` ,
            to: 'marioromero959@gmail.com',
            subject: 'Nuevo email de Ecommerce',
            html: `
            <h2>Nombre del cliente: ${email.nombre}</h2>
            <h3>Correo electrónico: ${email.email}</h3>
            <p>Mensaje: <strong> ${email.msg} </strong> </p>
            <p>Numero de contacto:${email.telefono}</p>
            `,
        })

        res.send().status(200)
    } catch (error) {
        res.send().status(500)
    }
}
module.exports = {
    enviarEmail
}