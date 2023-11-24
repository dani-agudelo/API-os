const { Router } = require('express');
const { check } = require('express-validator');

const { 
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
 } = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { 
    usuariosGet, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPut, 
    usuariosPatch, 
    recursosGet,
    infoSO,
    procesos,
    crearArchivoCarpeta,
    obtenerArchivosCarpetas,
    obtenerArchivosCarpetasAdministrador,
    actualizarArchivosCarpetas
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);   

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de tener más de 6 letras').isLength({ min: 6 }),
    check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
] , usuariosPost);   

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
],usuariosPut);   

router.patch('/', usuariosPatch); 

router.delete('/:id',[
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,usuariosDelete);   

router.get('/procesos', procesos)

router.get('/info', infoSO)

router.get('/files', obtenerArchivosCarpetas)

router.get('/files/admin', obtenerArchivosCarpetasAdministrador)

router.post('/files', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('peso', 'El peso es obligatorio').not().isEmpty(),
    check('fecha', 'La fecha es obligatoria').not().isEmpty(),
    check('usuario', 'El usuario es obligatorio').isMongoId(),
    check('usuario').custom( existeUsuarioPorId )
] ,crearArchivoCarpeta)

router.put('/files/:id',[
    check('id', 'No es un ID válido').isMongoId(),
] ,actualizarArchivosCarpetas)

module.exports = router;