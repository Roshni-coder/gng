import addproductmodel from "../model/addproduct.js";
import mongoose from "mongoose";
import Review from "../model/review.js";

// 1. ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    const sellerId = req.sellerId; // Assuming middleware sets this
    if (!sellerId) return res.status(400).json({ success: false, message: "Seller auth failed" });

    // Extract fields including stock
    const {
      title, description, categoryname, subcategory,
      price, oldprice, discount,
      ingredients, brand, size, additional_details,
      stock // ⭐ Get Stock
    } = req.body;

    const imageArray = req.files?.images?.map(file => ({ url: file.path, altText: title })) || [];

    const newProduct = new addproductmodel({
      title, description, categoryname, subcategory,
      price, oldprice, discount,
      ingredients, brand, size, additional_details,
      images: imageArray,
      sellerId,
      stock: Number(stock) // ⭐ Ensure Number
    });

    await newProduct.save(); // Triggers pre-save hook to set "In Stock/Out of Stock"
    res.status(201).json({ success: true, data: newProduct });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. UPDATE PRODUCT (Handles Stock Updates)
export const updateProduct = async (req, res) => {
  try {
    // We fetch the document first to allow .save() hook to run properly
    const product = await addproductmodel.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Update fields
    Object.keys(req.body).forEach(key => {
        product[key] = req.body[key];
    });

    // ⭐ Save triggers the Schema pre-hook to recalculate "Low Stock" or "Out of Stock"
    await product.save(); 

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ... (Include your delete, get, filter functions here as before)

export const getAllProducts = async (req, res) => {
  try {
    const sellerId = req.sellerId; 
    
    const products = await addproductmodel.find({ sellerId });
    console.log("p",products)
    if(!products){
      return res.status(404).json("no product found")
    }
   return  res.status(200).json({ success: true, data: products });
  } catch (error) {
   return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await addproductmodel.findById(id)
      .populate('categoryname', 'name')
      .populate('subcategory', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// export const filterProducts = async (req, res) => {
//   try {//
//     const { categoryname, minPrice, maxPrice, sort, discount } = req.query;
//     const filter = {};

//     if (categoryname) filter.categoryname = categoryname;
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = parseFloat(minPrice);
//       if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
//     }
//     if (discount) filter.discount = { $gte: parseFloat(discount) };

//     let sortOption = {};
//     if (sort === 'asc') sortOption.price = 1;
//     if (sort === 'desc') sortOption.price = -1;

//     const products = await addproductmodel.find(filter).sort(sortOption);
//     res.status(200).json({ success: true, data: products });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };
export const filterProducts = async (req, res) => {
  try {
    const { categoryname, minPrice, maxPrice, sort, discount } = req.query;
    const filter = {};

    // Handle category filter
    if (categoryname) {
      const categoriesArray = categoryname.split(',');
      filter.categoryname = { $in: categoriesArray.map(id => new mongoose.Types.ObjectId(id)) };
    }

    // Handle price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Handle discount
    if (discount) {
      filter.discount = { $gte: parseFloat(discount) };
    }

    // Sorting
    let sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;

    // Fetch and return
    const products = await addproductmodel.find(filter).sort(sortOption);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await addproductmodel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted successfully", data: del });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// export const updateProduct = async (req, res) => {
//   try {
//     const updated = await addproductmodel.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true, runValidators: true }
//     );

//     await updated.save(); // triggers pre-save hook

//     res.status(200).json({ success: true, data: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, userName } = req.body;

    if (!productId || !rating || !userName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newReview = new Review({ productId, rating, comment, userName });
    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ error: "Failed to create review" });
  }
};

// GET: Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reviews" });
  }
};
// Get related products
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await addproductmodel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const related = await addproductmodel.find({
      _id: { $ne: product._id },
      $or: [
        { categoryname: product.categoryname },
        { subcategory: product.subcategory },
      ],
    }).limit(6);

    res.status(200).json({ success: true, data: related });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
