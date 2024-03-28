const { v4: uuidv4 } = require('uuid');

function generateVerificationCode() {
    return uuidv4(); // Generates something like '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
}

module.exports = generateVerificationCode;