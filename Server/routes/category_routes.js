import express from "express";
import Category from "../model/Category.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary

const router = express.Router();

// Keep Multer for temporary local storage before uploading to Cloud
const uploadDir = path.join(process.cwd(), "uploads/categories");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST: Add Category
router.post("/addcategory", upload.single("image"), async (req, res) => {
  try {
    const { categoryname, altText } = req.body;

    if (!categoryname) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    // 1. Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories",
      resource_type: "image"
    });

    // 2. Save the Cloudinary URL
    const newCategory = new Category({
      categoryname,
      images: [{
        url: uploadResult.secure_url,
        altText: altText || categoryname
      }]
    });

    await newCategory.save();

    // Optional: Delete the local temp file to save space
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(200).json({
      success: true,
      message: "Category added successfully",
      category: newCategory,
    });

  } catch (error) {
    console.error("Add Category Error:", error);
    res.status(500).json({ success: false, message: "Failed to add category" });
  }
});

// GET: Get All Categories
router.get("/getcategories", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching categories" });
  }
});

// GET: Get Single Category
router.get("/getcategory/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// DELETE: Delete Category
router.delete("/deletecategory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Note: We are skipping local file deletion here since we are now using Cloudinary URLs.
    // In a production app, you would use cloudinary.uploader.destroy() here.

    await Category.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete category" });
  }
});

// PUT: Update Category
router.put("/updatecategory/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryname, altText } = req.body;

    let updateData = {};

    if (categoryname) {
      updateData.categoryname = categoryname;
    }

    if (req.file) {
      // Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
        resource_type: "image"
      });

      updateData.images = [{
        url: uploadResult.secure_url,
        altText: altText || categoryname
      }];

      // Clean up local temp file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Failed to update category" });
  }
});

export default router;