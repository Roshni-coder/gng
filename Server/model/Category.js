import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryname: {
        type: String,
        required: true,
        unique: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        altText: {
            type: String,
            default: ''
        }
    }]
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
