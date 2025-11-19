import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: { // Used as username
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password:{
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash'
    },
    role: {
        type: DataTypes.ENUM('admin', 'auditor'),
        allowNull: false,
    },
    // Security Fields
    forcePasswordChange: { // Maps to force_password_change in PG
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'force_password_change', 
    },
    isActive: { // Maps to is_active in PG
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active', 
    },
    createdBy: { // Maps to created_by in PG
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: true,
        field: 'created_by',
    },
}, {
    tableName: 'users',
    timestamps: true, // Sequelize handles createdAt/updatedAt
});

export default User;