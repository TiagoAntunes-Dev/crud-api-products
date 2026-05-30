const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'O nome é obrigatório.'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'O e-mail é obrigatório.'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'A senha é obrigatória.'],
            minlength: [6, 'A senha deve ter no mínimo 6 caracteres.']
        }
    },
    { timestamps: true }
);

// Roda ANTES de salvar — só faz hash se a senha foi modificada
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Método de instância: compara texto com o hash salvo
UserSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
