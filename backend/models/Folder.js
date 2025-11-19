import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js'; // Import User for association

const Folder = sequelize.define('Folder', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    isDeleted: { // Maps to is_deleted in PG
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_deleted', 
    },
    
    // Foreign Key for Ownership
    ownerId: { // Maps to owner_id in PG
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: false,
        field: 'owner_id', 
    },

    // Foreign Key for Hierarchy (Self-referencing)
    parentFolderId: { // Maps to parent_folder_id in PG
        type: DataTypes.INTEGER,
        references: { model: 'folders', key: 'id' },
        allowNull: true,
        field: 'parent_folder_id', 
    },
}, {
    tableName: 'folders',
    timestamps: true,
});

// --- ASSOCIATIONS ---

// 1. Ownership: A Folder belongs to a User (Owner)
Folder.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'Owner'
});
User.hasMany(Folder, {
    foreignKey: 'ownerId',
    as: 'Folders'
});

// 2. Hierarchy: A Folder can have a Parent Folder (Self-referencing)
Folder.belongsTo(Folder, {
    foreignKey: 'parentFolderId',
    as: 'Parent',
    allowNull: true // Root folder has no parent
});
Folder.hasMany(Folder, {
    foreignKey: 'parentFolderId',
    as: 'Children'
});

export default Folder;