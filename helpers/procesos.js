const os = require('os')
const { exec } = require('child_process')

const informacionSO = async () => {

    //obtener informacion del sistema operativo, memoria y procesador
    // Obtener información del procesador
    const arquitecturaProcesador = os.arch()
    const tipoProcesador = os.cpus()[0].model
    const nucleosProcesador = os.cpus().length

    // Obtener información de la memoria
    const memoriaTotal = Math.round(os.totalmem() / 1024 / 1024) + ' MB'
    const memoriaLibre = Math.round(os.freemem() / 1024 / 1024) + ' MB'

    return {
        arquitecturaProcesador,
        tipoProcesador,
        nucleosProcesador,
        memoriaTotal,
        memoriaLibre,
    }

}


const procesosSO = async () => {
    return new Promise((resolve, reject) => {
        exec('tasklist', (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }

            resolve(stdout);
        });
    });
};


module.exports = {
    informacionSO,
    procesosSO
}