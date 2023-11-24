const { Schema, model } = require('mongoose');

const FileSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    extension: {
        type: String,
        required: false
    },
    peso: {
        type: String,
        required: false
    },
    informacion: {
        type: String,
        required: false,
        default: ''
    },
    fecha: {
        type: String,
        required: [true, 'La fecha es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId, //*<-- Referencia a un usuario
        ref: 'Usuario',
        required: true
    },
    esCarpeta: {
        type: Boolean,
        required: true,
        default: false
    }
});

FileSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();
    return {
        ...usuario,
        uid: _id
    };
}

module.exports = model('File', FileSchema)