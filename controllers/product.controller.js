const Product = require('../models/product.model');
const mongoose = require('mongoose'); // Importação necessária para validar o ObjectId

// Puxar todos os produtos (GET)
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        // Delega o erro para o middleware no index.js
        next(error);
    }
};

// Puxar apenas um produto por ID (GET)
const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Trava de segurança da URL
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }

        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error); 
    }
};

// Criar um novo produto (POST)
const createProduct = async (req, res, next) => {
    try {
        // Extração segura
        const { name, quantity, price, image } = req.body;

        // Validação de dados vitais
        if (!name || name.trim() === "" || price == null) {
            return res.status(400).json({ message: 'Os campos nome e preço são obrigatórios e não podem estar vazios.' });
        }

        // Criação isolada
        const product = await Product.create({ name, quantity, price, image });
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// Atualizar um produto (PUT)
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Trava de segurança da URL
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido para atualização.' });
        }

        // Extração segura dos dados enviados
        const { name, quantity, price, image } = req.body;

        // Validação lógica
        if (name !== undefined && name.trim() === "") {
            return res.status(400).json({ message: 'O nome do produto não pode ser vazio.' });
        }

        // Montagem do objeto limpo para atualização parcial
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (quantity !== undefined) updateData.quantity = quantity;
        if (price !== undefined) updateData.price = price;
        if (image !== undefined) updateData.image = image;

        // Execução com validações estritas
        const product = await Product.findByIdAndUpdate(id, updateData, { 
            new: true, 
            runValidators: true 
        });

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado para atualização.' });
        }

        res.status(200).json(product); 
    } catch (error) {
        next(error);
    }
};

// Deletar um produto (DELETE)
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Trava de segurança da URL
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido para exclusão.' });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado para exclusão.' });
        }

        res.status(200).json({ message: 'Produto deletado com sucesso!' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};