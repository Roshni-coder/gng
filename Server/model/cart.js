import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
     
    },
       sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    quantity: {
        type: Number,
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart
