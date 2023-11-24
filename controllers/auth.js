const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require("../models/usuario");

const login = async (req, res = response) => {
    const { nombre, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ nombre });

        if( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //Verificar la contraseña
        const validaPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validaPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }
        
        res.json({
            usuario,
            msg: "ok"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const actualizarUsuario = async(req,res = response) => {
    const id = req.params.id;
    const { password } = req.body;

    const usuario = Usuario.findOne({ _id: id });

    console.log(usuario)
    if (usuario) {

         //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        const pass = bcryptjs.hashSync( password, salt )

        const usuario = await Usuario.findByIdAndUpdate( id, { password: pass }, { new: true } );

        res.json({
            usuario
        });

    } else {
        res.status(404).send({ message: 'Usuario no encontrado' });
    }

}

// const googleSignin = async(req, res = response) => {

//     const { id_token } = req.body;
    
//     try {
//         const { correo, nombre, img } = await googleVerify( id_token );

//         let usuario = await Usuario.findOne({ correo });
        
//         if( !usuario ) {
//             //Tengo que crearlo
//             const data = {
//                 nombre,
//                 correo,
//                 password: ':P',
//                 img,
//                 google: true
//             };

//             usuario = new Usuario( data );
//             await usuario.save();
//         }

//         //Si el usuario en DB tiene estado en false
//         if( !usuario.estado ) {
//             return res.status(401).json({
//                 msg: 'Hable con el administrador, usuario bloqueado'
//             });
//         }

//         //Generar el JWT
//         const token = await generarJWT( usuario.id );

        
//         res.json({
//             usuario,
//             token
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(400).json({
//             msg: 'Token de Google no es válido'
//         })
//     }
// }

// const renovarToken = async(req, res = response) => {

//     const { usuario } = req;

//     //Generar nuevo JWT
//     const token = await generarJWT( usuario.id )

//     res.json({
//         usuario,
//         token
//     })

// }


module.exports = {
    login,
    actualizarUsuario
    // googleSignin,
    // renovarToken
}