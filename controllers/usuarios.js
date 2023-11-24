const { response, request } = require('express');

const Usuario = require('../models/usuario');
const File = require('../models/file');

const bcryptjs = require('bcryptjs');
const { informacionSO, procesosSO } = require('../helpers/procesos')

const usuariosGet = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip( Number(desde) )
            .limit( Number(limite) )
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req = request, res = response) => {

    const { nombre, password, rol } = req.body;
    const usuario = new Usuario({ nombre, password, rol});

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt )

    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    //todo: validar contra bd
    if( password ) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id , resto, {new: true} );

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, {new: true} );

    res.json({
        usuario
    });
}

const infoSO = async (req, res = response) => {


    let info = await informacionSO()
    console.log(info)
    res.json(info)

}

const procesos = async (req, res = response) => {

    
    let procesos = await procesosSO()
    //formatear la informacion
    procesos = procesos.split('\n')
    procesos.shift()
    procesos.pop()
    procesos = procesos.map( proceso => {
        proceso = proceso.split(' ').filter( item => item !== '')
        return {
            nombre: proceso[0],
            pid: proceso[1],
            usoMemoria: proceso[4],
        }
    })

    res.json(procesos)
}

const crearArchivoCarpeta = async (req, res = response) => {

    const { nombre, extension, peso, informacion, fecha, usuario, esCarpeta } = req.body;
    const file = new File({ nombre, extension, informacion, peso, fecha, usuario, esCarpeta});

    //Guardar en BD
    await file.save();

    res.json({
        file
    });

}

const obtenerArchivosCarpetas = async (req, res = response) => {

    //tomar el usuario
    const { usuario } = req.body;

    //buscar los archivos y carpetas del usuario
    const files = await File.find({ usuario: usuario });

    res.json({
        files
    });
}

const obtenerArchivosCarpetasAdministrador = async (req, res = response) => {

    const files = await File.find();

    res.json({
        files
    });

}

const actualizarArchivosCarpetas = async(req,res = response) => {
    const id = req.params.id;
    const { informacion } = req.body;

    const archivo = await File.findOne({ _id: id });
    if (archivo) {
        archivo.informacion = informacion;
        const archivoActualizado = await archivo.save();
        if (archivoActualizado) {
            res.status(200).send({ message: 'Archivo actualizado', data: archivoActualizado });
        }
        else {
            res.status(500).send({ message: 'Error al actualizar el archivo' });
        }
    }
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    infoSO,
    procesos,
    crearArchivoCarpeta,
    obtenerArchivosCarpetas,
    obtenerArchivosCarpetasAdministrador,
    actualizarArchivosCarpetas
}

