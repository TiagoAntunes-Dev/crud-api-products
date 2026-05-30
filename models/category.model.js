const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'O nome da categoria é obrigatório.'],
            trim: true,
            unique: true
        },
        description: {
            type: String,
            trim: true,
            required: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
