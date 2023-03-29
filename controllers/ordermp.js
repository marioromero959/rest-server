const { response } = require("express");
// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});


const comprarProductos = async(req, res = response) =>{
  const dataCompra = req.body;
    let preference = {
        items: [],
        back_urls:{
            "success":"https://velka-accesorios.web.app/home",
            "failure":"https://velka-accesorios.web.app/home",
        },
        payer:{
          name:dataCompra.dataClient.name,
          email:dataCompra.dataClient.email,
        },
        auto_return:"approved",
        binary_mode:true
      };

      dataCompra.productos.forEach(producto => {
        preference.items.push({
          title: producto.nombre,
          description: 'product_description',
          unit_price: producto.precio,
          quantity: producto.cantidad,
        })
      });

      try {
          const response = await  mercadopago.preferences.create(preference)
          const preferenceID = response.body.id
          // console.log("response body",response.body)
          res.send({preferenceID})
      } catch (error) {
        // console.log(error)
        return res.status(500).json('Algo salio mal');       
      }
}

module.exports = {
    comprarProductos,
}