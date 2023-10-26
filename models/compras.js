const { Schema, model} = require('mongoose')

const CompraSchema = new Schema({
    referenceId:{   //Debe tener el mismo nombre que como lo creamos en la coleccion
        type:String,
        required:[true,'El id es obligatorio'],
        unique:true
    },
    vendido:{
        type:Boolean,
        default:false,
        required:true
    },
    monto:{
        type:Number,
        default:0
    },
    // categoria:{
    //     type: Schema.Types.ObjectId,
    //     ref:'Categoria',
    //     required:true,
    // },
    // descripcion:{type:String},
    // disponible:{
    //     type:Boolean,
    //     default:true
    // },
    // stock:{type:Number}
})

CompraSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data
}

module.exports = model('Compras',CompraSchema)