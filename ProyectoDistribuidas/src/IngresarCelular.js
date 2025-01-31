const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const verificarToken = require('../Middleware/VerificarToken'); // Importar el middleware

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.IngresarCelular = async (event) => {
    try {
        // 1. Verificar el token usando el middleware
        const decoded = verificarToken(event);

        // 2. Verificar si event.body existe
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Datos de entrada no proporcionados" }),
            };
        }

        // 3. Parsear y validar los datos de entrada
        const { marca, modelo, color, almacenamiento, ram, sistemaOperativo, pantalla, camara, bateria, precio, stock } = JSON.parse(event.body);

        if (!marca || !modelo || !precio || !stock) { // Puedes agregar más validaciones
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Campos requeridos faltantes" }),
            };
        }

        // 4. Crear objeto con los datos del celular
        const createdAt = new Date().toISOString();
        const IdCelular = v4();

        const newCellphone = {
            IdCelular,
            marca,
            modelo,
            color,
            almacenamiento,
            ram,
            sistemaOperativo,
            pantalla,
            camara,
            bateria,
            precio,
            stock,
            createdAt,
        };

        // 5. Insertar en DynamoDB
        await dynamodb.put({
            TableName: 'CelularesNuevos',
            Item: newCellphone,
        }).promise();

        return {
            statusCode: 201, // Código HTTP adecuado para creación
            body: JSON.stringify(newCellphone),
        };

    } catch (error) {
        // Manejo de errores de autenticación
        if (error.message === "Token no proporcionado" || error.message === "Token inválido o expirado") {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: error.message }),
            };
        }

        console.error("Error al ingresar el celular:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error interno del servidor", error: error.message }),
        };
    }
};
