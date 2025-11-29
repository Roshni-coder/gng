import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongodb_url);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Migration function
const migrateCategories = async () => {
    try {
        await connectDB();

        const db = mongoose.connection.db;
        const categoriesCollection = db.collection('categories');

        // Find all categories with old structure (has 'image' field instead of 'images')
        const oldCategories = await categoriesCollection.find({
            image: { $exists: true },
            images: { $exists: false }
        }).toArray();

        console.log(`\n📊 Found ${oldCategories.length} categories to migrate\n`);

        if (oldCategories.length === 0) {
            console.log('✅ No categories need migration. All categories are already using the new structure!');
            process.exit(0);
        }

        let successCount = 0;
        let errorCount = 0;

        // Migrate each category
        for (const category of oldCategories) {
            try {
                const newImages = [{
                    url: category.image,
                    altText: category.categoryname || ''
                }];

                await categoriesCollection.updateOne(
                    { _id: category._id },
                    {
                        $set: { images: newImages },
                        $unset: { image: "" }
                    }
                );

                successCount++;
                console.log(`✅ Migrated: ${category.categoryname} (${category._id})`);
            } catch (error) {
                errorCount++;
                console.error(`❌ Error migrating ${category.categoryname}:`, error.message);
            }
        }

        console.log(`\n📈 Migration Summary:`);
        console.log(`   ✅ Successfully migrated: ${successCount}`);
        console.log(`   ❌ Failed: ${errorCount}`);
        console.log(`   📊 Total: ${oldCategories.length}\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

// Run migration
migrateCategories();
