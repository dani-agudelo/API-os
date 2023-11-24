const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify( token , process.env.SECRETORPRIVATEKEY );

        //Leer el usuario que corresponde al uid
        const usuarioToken = await Usuario.findById( uid );
        
        if( !usuarioToken ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existen en DB'
            }); 
        }

        //Verificar si el uid tiene estado en true
        if( !usuarioToken.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            });
        }

        //Se coloca en la request
        req.usuario = usuarioToken;
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}


module.exports = {
    validarJWT
}