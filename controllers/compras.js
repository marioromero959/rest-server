const Compras = require("../models/compras");

const buscarCompras = async (req, res = response) => {
    const compras = await Compras
    console.log("cc",compras);
    res.status(400).json({
        msg:`Todo ok`
    })
}

const cargarCompras = async (req, res = response) => {
    try {
        const {ordenId} = req.body
        const data = {
            nombre:ordenId,
            estado:true,
            descripcion:'asd',
        } 
        const compra =  new Compras(data);
        //Grabamos en BD
        await compra.save();
        res.status(400).json({
            msg:`Se cargo una nueva compra correctamente`
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json('Algo salio mal');
    }
}

const actualizarStock = async (req, res = response) => {
    res.status(400).json({
        msg:`Todo ok`
    })
}



module.exports = {
    buscarCompras, 
    cargarCompras,
    actualizarStock,
}