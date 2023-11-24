const { Categoria , Usuario, Role, Producto } = require('../models');

//USUARIOS VALIDATORS
const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ){
        throw new Error(`El id no existe ${ id }`);
    }
}


//CATEGORIAS VALIDATORS
const existeCategoriaPorId = async( id ) => {
    const existeCat = await Categoria.findById( id );
    if( !existeCat ){
        throw new Error(`No existe la categoria por id: ${ id }`);
    }
}

//PRODUCTOS VALIDATORS
const existeProductoPorId = async( id ) => {
    const existeProducto = await Producto.findById( id );
    if( !existeProducto ){
        throw new Error(`No existe la categoria por id: ${ id }`);
    }
}

//VALIDAR COLECCIONES PERMITIDAS
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );
    if( !incluida ) {
        throw new Error(`La colección: ${ coleccion } no es permitida, ${ colecciones }`);
    }

    //Si todo sale bien
    return true;

}

module.exports = {
    esRoleValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}