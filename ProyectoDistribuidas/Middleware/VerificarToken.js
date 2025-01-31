const jwt = require('jsonwebtoken');

function verificarToken(event) {
    try {
        // 1️⃣ Extraer el token del encabezado en mayúsculas o minúsculas
        const authHeader = event.headers['Authorization'] || event.headers['authorization'];
        console.log('Authorization Header:', authHeader);  // Para depuración

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error("Token no proporcionado o formato incorrecto");
        }

        // 2️⃣ Extraer solo el token (sin 'Bearer ')
        const token = authHeader.split(' ')[1];
        console.log('Token extraído:', token);

        if (!token) {
            throw new Error("Token no válido");
        }

        // 3️⃣ Verificar el token con la clave secreta
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            throw new Error("Clave JWT no configurada en las variables de entorno");
        }

        const decoded = jwt.verify(token, secretKey);
        console.log('Token decodificado:', decoded);

        // 4️⃣ Retornar los datos decodificados (puedes personalizarlo si solo necesitas ciertos campos)
        return decoded;
    } catch (error) {
        console.error("Error al verificar el token:", error.message);

        if (error.name === 'JsonWebTokenError') {
            throw new Error("Token inválido");
        } else if (error.name === 'TokenExpiredError') {
            throw new Error("Token expirado");
        } else {
            throw error; // Otros errores
        }
    }
}

module.exports = verificarToken;
