const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'O nome do produto é obrigatório.'],
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
            min: [0, 'A quantidade em stock não pode ser negativa.']
        },
        price: {
            type: Number,
            required: true,
            default: 0,
            min: [0, 'O preço do produto não pode ser negativo.']
        },
        image: {
            type: String,
            required: false,
            trim: true
        },
        // Relacionamento: cada produto pode pertencer a uma categoria
        // ObjectId aponta para um documento da coleção 'Category'
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: false,
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
