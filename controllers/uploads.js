const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL) //Nos autenticamos con nuestro usuario

const { response } = require("express");
const { subirArchivo } = require('../helpers/subir-archivo')
const { Usuario, Producto } = require('../models')


const cargarArchivo = async(req, res = response) =>{

    //Pregunta si hay o no archivos en el body de la peticion
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {//Archivo es el nombre que mandamos por postman
      res.status(400).json({
          msg:'No hay archivos'
      });
      return;
    }

    try {
      //Archivos
      const nombre = await subirArchivo(req.files,'imgs')//Mandamos la carpeta imgs, opcional
      res.json({nombre})
    } catch (error) {
      res.status(400).json({
        error
      })
    }
}

//Solo para fines ilustrativos, usamos cloudinary
const actualizarImagen = async(req, res = response) =>{

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {//Archivo es el nombre que mandamos por postman
    res.status(400).json({
        msg:'No hay archivos'
    });
    return;
  }
  
  const {id, coleccion} = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id)
        if(!modelo){
          return res.status(400).json({
            msg:`No existe un usuario con el id ${id}`
          })
        }
    break;
    case 'productos':
      modelo = await Producto.findById(id)
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        })
      }
    break;
  
    default:
      return res.status(500).json({
        msg:'Se me olvido validar eso'
      })
  }

  //Borrar imagenes anteriores
  if(modelo.img){
    const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img)
    if(fs.existsSync(pathImagen)){
      fs.unlinkSync(pathImagen) //Borra el archivo
    }
  }

  const nombre = await subirArchivo(req.files, coleccion)//Mandamos la carpeta coleccion
  modelo.img = nombre

await modelo.save();

  res.json({
    modelo
  })
}


const actualizarImagenCloudinary = async(req, res = response ) => {

  const { id, coleccion } = req.params;
  const { archivo } = req.body;
  //Archivos de cloudinary que se borraron en el front 
  let modelo;

  switch ( coleccion ) {
      case 'usuarios':
          modelo = await Usuario.findById(id);
          if ( !modelo ) {
              return res.status(400).json({
                  msg: `No existe un usuario con el id ${ id }`
              });
          }
      
      break;

      case 'productos':
          modelo = await Producto.findById(id);
          if ( !modelo ) {
              return res.status(400).json({
                  msg: `No existe un producto con el id ${ id }`
              });
          }
      
      break;
  
      default:
          return res.status(500).json({ msg: 'Se me olvidó validar esto'});
  }

  
  // Borrar imagenes
  if ( modelo.img.length > 0 && archivo){
    await borrarIMGcloud(archivo,modelo)
  }

  if(req.files){
    await cargarIMGCloud(req,modelo)
  }

  await modelo.save();
  res.json( {modelo} );

}

const borrarIMGcloud = async(archivo,modelo) => {
  if(typeof(archivo) == 'object'){
    await Promise.all(archivo.map(async(borrado)=>{
      const nombreArr = borrado.split('/');
      const nombre = nombreArr[ nombreArr.length - 1 ];
      const [ public_id ] = nombre.split('.');
      await cloudinary.uploader.destroy( public_id,{invalidate:true});
      let index = modelo.img.indexOf(borrado)
      await modelo.img.splice(index, 1);
    }))
  }else{
    //Si entro al else, es porque borrado es un solo archivo en formato string
  const nombreArr = archivo.split('/');
  const nombre = nombreArr[ nombreArr.length - 1 ];
  const [ public_id ] = nombre.split('.');
  await cloudinary.uploader.destroy( public_id, {invalidate:true});
  let index = modelo.img.indexOf(archivo);
  await modelo.img.splice(index, 1)
}
}

const cargarIMGCloud = async(req,modelo) => {
  if(Object.keys(req.files.archivo).length !==9 ){
    await Promise.all(req.files.archivo.map(async (file)=>{
      const { tempFilePath } = file
      const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
      modelo.img.push(secure_url);
    }))
  }else{
    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img.push(secure_url);
  }
}




const mostrarImagen = async(req, res = response ) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
      case 'usuarios':
          modelo = await Usuario.findById(id);
          if ( !modelo ) {
              return res.status(400).json({
                  msg: `No existe un usuario con el id ${ id }`
              });
          }
      break;
      case 'productos':
          modelo = await Producto.findById(id);
          if ( !modelo ) {
              return res.status(400).json({
                  msg: `No existe un producto con el id ${ id }`
              });
          }
      break;
      default:
          return res.status(500).json({ msg: 'Se me olvidó validar esto'});
  }

  try {
    if ( modelo.img ) {
      const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
      return res.json( modelo.img )
      // if ( fs.existsSync( pathImagen ) ) {
      // }
    }
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );

  } catch (error) {
    res.json({error})
  }

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}