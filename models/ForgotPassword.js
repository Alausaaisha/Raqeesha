const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    postCode: { type: String, required: true },
    phonenumber: { type: String, required: true},
    email: { type: String, required: true},
    address: { type: String, required: true }
});

module.exports = mongoose.model('Checkout', checkoutSchema);