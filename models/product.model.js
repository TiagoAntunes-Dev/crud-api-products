const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome do produto é obrigatório.'],
        trim: true // Corta espaços acidentais no início e no fim ("  Pizza  " vira "Pizza")
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'A quantidade em stock não pode ser negativa.'] // Bloqueia números menores que zero
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'O preço do produto não pode ser negativo.'] // Bloqueia preços negativos
    },
    image: {
        type: String,
        required: false,
        trim: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);