const { response } = require('express')

// Aca creamos las funciones
const usersGet = (req, res = response)=>{
    // Tambien se puede desestructurar
    const query = req.query;
    res.json({
        msg:'get API',
        query
    })
}
const usersPost = (req, res = response)=>{
    // En la req viene lo que el front nos manda (lo podemos desestructurar)
    const body = req.body;
    res.json({
        msg:'post API',
        body
    })
}
const usersPut = (req, res = response)=>{
const id = req.params.id; //Esto lo mandamos en la ruta(el mismo nombre)
    res.json({
        msg:'put API',
        id
    })
}
const usersPatch = (req, res = response)=>{
    res.json({
        msg:'patch API'
    })
}
const usersDelete = (req, res = response)=>{
    res.json({
        msg:'delete API'
    })
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}