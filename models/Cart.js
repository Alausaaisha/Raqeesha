const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
  qty: { type: Number, required: true },
  ordered: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Cart', cartSchema);
