const AWS = require('aws-sdk');
const verificarToken = require('../Middleware/VerificarToken');  // Asegúrate de que la ruta sea correcta

AWS.config.update({
    region: 'us-east-1' // Cambia esto por la región donde tienes tu tabla
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.VerCelulares = async (event) => {
    try {
        // 1. Verificar el token usando el middleware
        const decoded = verificarToken(event);

        const result = await dynamodb.scan({
            TableName: 'CelularesNuevos',
        }).promise();

        const celulares = result.Items;

        // Ordenar los celulares por el campo 'createdAt' (de más antiguo a más reciente)
        celulares.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        return {
            statusCode: 200,
            body: JSON.stringify({ celulares }),
        };
    } catch (error) {
        // Manejo de errores
        if (error.message === "Token no proporcionado" || error.message === "Token inválido o expirado") {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: error.message }),
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error interno del servidor", error: error.message }),
        };
    }
};
