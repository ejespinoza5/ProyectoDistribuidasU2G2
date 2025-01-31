const AWS = require('aws-sdk');
const verificarToken = require('../Middleware/VerificarToken'); // Importar el middleware

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.VerCelulares = async (event) => {
    try {
        // 1. Verificar el token usando el middleware
        const decoded = verificarToken(event);

        const result = await dynamodb.scan({
            TableName: 'CelularesNuevos',
        }).promise();

        const celulares = result.Items;

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