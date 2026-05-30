const Category = require('../models/category.model');
const Product  = require('../models/product.model');
const mongoose = require('mongoose');

// GET /api/categories — público
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

// GET /api/categories/:id — público
const getCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

// POST /api/categories — protegido
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
        }
        const category = await Category.create({ name: name.trim(), description });
        res.status(201).json(category);
    } catch (error) {
        // Erro 11000 = violação de índice único (nome duplicado)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Já existe uma categoria com esse nome.' });
        }
        next(error);
    }
};

// DELETE /api/categories/:id — protegido
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Formato de ID inválido.' });
        }

        // Regra de negócio: bloqueia exclusão se houver produtos vinculados
        const count = await Product.countDocuments({ category: id });
        if (count > 0) {
            return res.status(409).json({
                message: `Não é possível excluir: ${count} produto(s) vinculado(s) a esta categoria.`
            });
        }

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }
        res.status(200).json({ message: 'Categoria excluída com sucesso.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCategories, getCategory, createCategory, deleteCategory };