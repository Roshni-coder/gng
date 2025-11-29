import express from "express";
import Category from "../model/Category.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Correct folder
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

// Add category
router.post("/addcategory", upload.single("image"), async (req, res) => {
  try {
    const { categoryname, altText } = req.body;
    if (!categoryname) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imagePath = `uploads/categories/${req.file.filename}`;

    const newCategory = new Category({
      categoryname,
      images: [{
        url: imagePath,
        altText: altText || categoryname
      }]
    });
    await newCategory.save();

    res.status(200).json({
      success: true,
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add category" });
  }
});

router.get("/getcategories", async (req, res) => {
  try {
    const categories = await Category.find({});
    console.log("Categories from DB:", JSON.stringify(categories, null, 2));
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching categories" });
  }
});

router.get("/getcategory/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

router.delete("/deletecategory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Delete all images in the images array
    if (category.images && category.images.length > 0) {
      category.images.forEach(img => {
        const imagePath = path.join(__dirname, `../${img.url}`);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Category.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete category" });
  }
});

router.put("/updatecategory/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryname, altText } = req.body;

    let updateData = {};

    if (categoryname) {
      updateData.categoryname = categoryname;
    }

    if (req.file) {
      const imagePath = `uploads/categories/${req.file.filename}`;
      updateData.images = [{
        url: imagePath,
        altText: altText || categoryname
      }];
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Category updated successfully",
        category: updatedCategory,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update category" });
  }
});

export default router;
