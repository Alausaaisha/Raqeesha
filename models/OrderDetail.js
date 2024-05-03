const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
  qty: { type: Number, required: true }
});

module.exports = mongoose.model('OrderDetail', orderDetailSchema);
