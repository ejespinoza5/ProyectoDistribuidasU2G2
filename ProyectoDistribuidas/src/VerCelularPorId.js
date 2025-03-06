const AWS = require('aws-sdk');
const verificarToken = require('../Middleware/VerificarToken');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.VerCelularPorId = async (event) => {
    try {
        // 1. Verificar el token
        const decoded = verificarToken(event);

        // 2. Obtener el ID correcto según la ruta
        const { IdCelular } = event.pathParameters; // Debe coincidir con la configuración en serverless.yml

        if (!IdCelular) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "ID del celular es requerido en la URL" }),
            };
        }

        // 3. Ajustar el tipo de ID (según el esquema en DynamoDB)
        const parsedId = isNaN(IdCelular) ? String(IdCelular) : Number(IdCelular);

        // 4. Buscar el celular por ID en DynamoDB
        const result = await dynamodb.get({
            TableName: 'CelularesNuevos',
            Key: { IdCelular: parsedId } // Asegúrate de que 'id' sea la clave primaria real
        }).promise();

        // 5. Validar si existe el celular
        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Celular no encontrado" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ celular: result.Item }),
        };

    } catch (error) {
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
