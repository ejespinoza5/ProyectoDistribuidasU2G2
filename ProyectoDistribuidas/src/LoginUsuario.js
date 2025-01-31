const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.LoginUsuario = async (event) => {
    const { correo, contraseña } = JSON.parse(event.body);

    if (!correo || !contraseña) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Correo y contraseña son obligatorios." }),
        };
    }

    try {
        const result = await dynamodb.query({
            TableName: 'Usuarios',
            IndexName: 'CorreoIndex',
            KeyConditionExpression: 'correo = :correo',
            ExpressionAttributeValues: {
                ':correo': correo,
            },
        }).promise();

        if (result.Items.length === 0) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Credenciales incorrectas." }),
            };
        }

        const usuario = result.Items[0];

        const esCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esCorrecta) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Credenciales incorrectas." }),
            };
        }

        const token = jwt.sign(
            { userId: usuario.userId, correo: usuario.correo, nombres: usuario.nombres },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Autenticación exitosa.",
                token,
                usuario: {
                    userId: usuario.userId,
                    nombres: usuario.nombres,
                    correo: usuario.correo,
                },
            }),
        };
    } catch (error) {
        console.error("Error en LoginUsuario:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error al autenticar el usuario." }),
        };
    }
};