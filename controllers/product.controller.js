const Product = require('../models/product.model');

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
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not Found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

// Criar um novo produto (POST)
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar um produto (PUT)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);

        if (!product) {
            return res.status(404).json({ message: 'Product not Found' });
        }

        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deletar um produto (DELETE)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not Found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Exportar todas as funções para usarmos nas rotas
module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};