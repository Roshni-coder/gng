import mongoose from "mongoose";
const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
      default: [] 
    }
  });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist