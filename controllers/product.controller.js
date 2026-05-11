const Product = require('../models/product.model');
const mongoose = require('mongoose'); // Importação necessária para validar o ObjectId

// Puxar todos os produtos (GET)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Puxar apenas um produto por ID (GET)
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Trava de segurança da URL: Impede o CastError do Mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }

        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

// Criar um novo produto (POST)
const createProduct = async (req, res) => {
    try {
        // 1. Extração segura (Ignora campos que não existem no Model)
        const { name, quantity, price, image } = req.body;

        // 2. Validação de dados vitais
        if (!name || name.trim() === "" || price == null) {
            return res.status(400).json({ message: 'Os campos nome e preço são obrigatórios e não podem estar vazios.' });
        }

        // 3. Criação isolada
        const product = await Product.create({ name, quantity, price, image });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar um produto (PUT)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Trava de segurança da URL
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido para atualização.' });
        }

        // 2. Extração segura dos dados enviados
        const { name, quantity, price, image } = req.body;

        // 3. Validação lógica
        if (name !== undefined && name.trim() === "") {
            return res.status(400).json({ message: 'O nome do produto não pode ser vazio.' });
        }

        // 4. Montagem do objeto limpo para atualização parcial
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (quantity !== undefined) updateData.quantity = quantity;
        if (price !== undefined) updateData.price = price;
        if (image !== undefined) updateData.image = image;

        // 5. Execução com validações estritas do Model ativadas
        const product = await Product.findByIdAndUpdate(id, updateData, { 
            new: true, 
            runValidators: true 
        });

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado para atualização.' });
        }

        res.status(200).json(product); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deletar um produto (DELETE)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Trava de segurança da URL
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido para exclusão.' });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado para exclusão.' });
        }

        res.status(200).json({ message: 'Produto deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};