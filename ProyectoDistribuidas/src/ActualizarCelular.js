const AWS = require('aws-sdk');
const verificarToken = require('../Middleware/VerificarToken'); // Importar el middleware

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.ActualizarCelular = async (event) => {
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

        // 3. Verificar si event.body existe y parsearlo
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Datos de actualización no proporcionados" }),
            };
        }
        const { marca, modelo, color, almacenamiento, ram, sistemaOperativo, pantalla, camara, bateria, precio, stock } = JSON.parse(event.body);

        // 4. Construir la expresión de actualización dinámicamente
        const updateExpression = [];
        const expressionAttributeValues = {};

        if (marca) { updateExpression.push("marca = :marca"); expressionAttributeValues[":marca"] = marca; }
        if (modelo) { updateExpression.push("modelo = :modelo"); expressionAttributeValues[":modelo"] = modelo; }
        if (color) { updateExpression.push("color = :color"); expressionAttributeValues[":color"] = color; }
        if (almacenamiento) { updateExpression.push("almacenamiento = :almacenamiento"); expressionAttributeValues[":almacenamiento"] = almacenamiento; }
        if (ram) { updateExpression.push("ram = :ram"); expressionAttributeValues[":ram"] = ram; }
        if (sistemaOperativo) { updateExpression.push("sistemaOperativo = :sistemaOperativo"); expressionAttributeValues[":sistemaOperativo"] = sistemaOperativo; }
        if (pantalla) { updateExpression.push("pantalla = :pantalla"); expressionAttributeValues[":pantalla"] = pantalla; }
        if (camara) { updateExpression.push("camara = :camara"); expressionAttributeValues[":camara"] = camara; }
        if (bateria) { updateExpression.push("bateria = :bateria"); expressionAttributeValues[":bateria"] = bateria; }
        if (precio) { updateExpression.push("precio = :precio"); expressionAttributeValues[":precio"] = precio; }
        if (stock) { updateExpression.push("stock = :stock"); expressionAttributeValues[":stock"] = stock; }

        if (updateExpression.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No se proporcionaron campos para actualizar" }),
            };
        }

        // 5. Ejecutar la actualización en DynamoDB
        const result = await dynamodb.update({
            TableName: 'CelularesNuevos',
            Key: { IdCelular },
            UpdateExpression: `SET ${updateExpression.join(", ")}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW",
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Datos actualizados correctamente", updatedData: result.Attributes }),
        };

    } catch (error) {
        // Manejo de errores de autenticación
        if (error.message === "Token no proporcionado" || error.message === "Token inválido o expirado") {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: error.message }),
            };
        }

        console.error("Error al actualizar el celular:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error interno del servidor", error: error.message }),
        };
    }
};
