const AWS = require('aws-sdk');
const verificarToken = require('../Middleware/VerificarToken'); // Importar el middleware

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.EliminarCelular = async (event) => {
    try {
        // 1. Verificar el token usando el middleware
        const decoded = verificarToken(event);

        // 2. Obtener el ID del celular desde los parámetros de la ruta
        const { IdCelular } = event.pathParameters;
        if (!IdCelular) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "IdCelular es requerido" }),
            };
        }

        // 3. Verificar si el celular existe antes de eliminarlo
        const result = await dynamodb.get({
            TableName: "CelularesNuevos",
            Key: { IdCelular }
        }).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Celular no encontrado" }),
            };
        }

        // 4. Eliminar el celular de la base de datos
        await dynamodb.delete({
            TableName: "CelularesNuevos",
            Key: { IdCelular }
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Celular eliminado correctamente" }),
        };

    } catch (error) {
        // Manejo de errores de autenticación
        if (error.message === "Token no proporcionado" || error.message === "Token inválido o expirado") {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: error.message }),
            };
        }

        console.error("Error al eliminar el celular:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error interno del servidor", error: error.message }),
        };
    }
};
