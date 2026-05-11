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
        // 1. Extração segura (Desestruturação evita que campos maliciosos passem)
        const { name, quantity, price, image } = req.body;

        // 2. Validação: Impede o avanço se dados obrigatórios faltarem
        // Verifica se o nome é falso/vazio ou se o preço não foi enviado
        if (!name || name.trim() === "" || price == null) {
            return res.status(400).json({ message: 'Os campos nome e preço são obrigatórios e não podem estar vazios.' });
        }

        // 3. Criação segura no banco utilizando apenas os campos extraídos
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
        const { name, quantity, price, image } = req.body;

        // Validação customizada: Se tentarem atualizar o nome, ele não pode ser vazio
        if (name !== undefined && name.trim() === "") {
            return res.status(400).json({ message: 'O nome do produto não pode ser vazio.' });
        }

        // Monta um objeto limpo apenas com as propriedades que o cliente enviou.
        // Isso permite atualizações parciais (ex: atualizar só o preço sem apagar o resto).
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (quantity !== undefined) updateData.quantity = quantity;
        if (price !== undefined) updateData.price = price;
        if (image !== undefined) updateData.image = image;

        // Otimização e Segurança:
        // { new: true } -> Retorna o documento já atualizado, poupando um findById extra.
        // { runValidators: true } -> Força o Mongoose a aplicar as regras do Model também na edição.
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