const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs'); 

exports.CrearUsuarios = async (event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const { nombres, correo, contraseña } = JSON.parse(event.body);

    if (!nombres || !correo || !contraseña) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Todos los campos (nombres, correo, contraseña) son obligatorios." }),
        };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    const userId = v4();
    const createdAt = new Date().toISOString();

    const newUser = {
        userId,
        nombres,
        correo,
        contraseña: hashedPassword, 
        createdAt,
    };

    try {

        await dynamodb.put({
            TableName: 'Usuarios',
            Item: newUser,
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Usuario registrado exitosamente.",
                userId,
                nombres,
                correo,
            }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error al registrar el usuario." }),
        };
    }
};
