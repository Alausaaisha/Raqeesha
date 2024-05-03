const Cart = require('../models/Cart');
const mongoose = require('mongoose');

exports.addToCart = async (req, res) => {
  const { userId, itemId, qty } = req.body;

  try {
    // Create a new cart item
    const cartItem = new Cart({
      userId,
      itemId,
      qty
      // ordered is false by default as defined in the model
    });

    // Save the cart item to the database
    const result = await cartItem.save();

    // Respond with the cart item ID and success message
    res.status(201).json({ cartId: result._id, message: 'Item added to cart' });
  } catch (error) {
    console.log(error)
    // Handle errors, like missing fields or invalid IDs
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// Backend route handler to increase cart item quantity
exports.increaseItemQuantity = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    // Find the item in the cart and increase its quantity by 1
    const result = await Cart.findOneAndUpdate(
      { userId, itemId },
      { $inc: { qty: 1 } }, // Increase quantity by 1
      { new: true } // Return the updated document
    );

    if (!result) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.status(200).json({ message: 'Item quantity increased successfully', cartItem: result });
  } catch (error) {
    res.status(500).json({ message: 'Error increasing item quantity', error: error.message });
  }
};

exports.reduceItemQuantity = async (req, res) => {
  const { userId, itemId } = req.body;

  // Validate request parameters
  if (!userId || !itemId) {
    return res.status(400).json({ message: 'userId and itemId are required' });
  }

  try {
    // Find the item in the cart
    const cartItem = await Cart.findOne({ userId, itemId });

    // Check if the item is in the cart
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Reduce the item quantity by 1
    if (cartItem.qty > 1) {
      cartItem.qty -= 1;
      await cartItem.save();
    } else {
      // If the quantity is 1, remove the item from the cart
      await Cart.findOneAndDelete({ userId, itemId });
    }

    res.status(200).json({ message: 'Item quantity reduced successfully', cartItemId: cartItem._id });
  } catch (error) {
    console.error('Error reducing item quantity', error);
    res.status(500).json({ message: 'Error reducing item quantity', error: error.message });
  }
};


// Remove item from cart

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    // Find the item in the cart and remove it
    const result = await Cart.findOneAndDelete({ userId, itemId });

    if (!result) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check if the cart is empty after removing the item
    const remainingItems = await Cart.find({ userId });
    if (remainingItems.length === 0) {
      return res.status(200).json({ message: 'Last item removed from cart', cartItems: [] });
    }

    res.status(200).json({ message: 'Item removed from cart', cartId: result._id });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
};



exports.showCart = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId); // Correctly instantiate ObjectId

  try {
      const cartItems = await Cart.aggregate([
          { $match: { userId: userId, ordered: false } }, // Match user's cart items that haven't been ordered
          { $lookup: {
              from: 'items', // The collection to join
              localField: 'itemId', // Field from the Cart collection
              foreignField: '_id', // Field from the Items collection
              as: 'itemDetails' // Array of matching items
          }},
          { $unwind: '$itemDetails' }, // Deconstructs the array field from the joined documents
          { $project: {
              userId: 1,
              itemId: 1,
              name: '$itemDetails.name',
              qty: 1,
              price: '$itemDetails.price',
              photo: '$itemDetails.photo'
          }}
      ]);

      if (!cartItems.length) {
          return res.status(404).json({ message: 'No items in your cart' });
      }

      res.status(200).json(cartItems);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving cart items', error: error.message });
  }
};