const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize-config');

const EmailVerification = sequelize.define('EmailVerification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        readOnly: true,
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    verification_code: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        readOnly: true,
    },
    verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    expiration_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'sent',
    },
}, {
    hooks: {
        beforeUpdate: async (emailVerification) => {
            if (emailVerification.status === 'verified') {
                emailVerification.verified_at = new Date();
            }
        },
    },
    tableName: 'email_verifications',
    timestamps: false, // Customize this based on whether you want Sequelize to automatically manage createdAt and updatedAt
});

// Synchronize the model with the database, reflecting any changes needed.
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('EmailVerification table created or updated successfully!');
    } catch (error) {
        console.error('Error in creating or updating the EmailVerification table:', error);
    }
})();

module.exports = EmailVerification;

