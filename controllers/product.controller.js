const Product  = require('../models/product.model');
const mongoose = require('mongoose');

// GET /api/products — público
const getProducts = async (req, res, next) => {
    try {
        // .populate substitui o ObjectId pelo documento completo da categoria
        // Antes:  category: "64abc..."
        // Depois: category: { _id: "64abc...", name: "Doces", description: "..." }
        const products = await Product.find().populate('category', 'name description');
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

// GET /api/products/:id — público
const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        const product = await Product.findById(id).populate('category', 'name description');
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

// POST /api/products — protegido
const createProduct = async (req, res, next) => {
    try {
        const { name, quantity, price, image, category } = req.body;

        if (!name || name.trim() === '' || price == null) {
            return res.status(400).json({ message: 'Nome e preço são obrigatórios.' });
        }

        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: 'ID de categoria inválido.' });
        }

        const product = await Product.create({
            name, quantity, price, image,
            category: category || null
        });

        // Popula antes de retornar para o cliente já ver o nome da categoria
        await product.populate('category', 'name description');
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// PUT /api/products/:id — protegido
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }

        const { name, quantity, price, image, category } = req.body;

        if (name !== undefined && name.trim() === '') {
            return res.status(400).json({ message: 'O nome não pode ser vazio.' });
        }

        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: 'ID de categoria inválido.' });
        }

        // Constrói apenas os campos enviados (atualização parcial segura)
        const updateData = {};
        if (name     !== undefined) updateData.name     = name;
        if (quantity !== undefined) updateData.quantity = quantity;
        if (price    !== undefined) updateData.price    = price;
        if (image    !== undefined) updateData.image    = image;
        if (category !== undefined) updateData.category = category || null;

        const product = await Product
            .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate('category', 'name description');

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/products/:id — protegido
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.status(200).json({ message: 'Produto deletado com sucesso!' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };