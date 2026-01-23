const mongoose = require('mongoose');

async function checkCategories() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not set");
        }
        await mongoose.connect(process.env.MONGODB_URI);

        // Schema definition
        const catSchema = new mongoose.Schema({ name: String, slug: String });
        const Category = mongoose.models.Category || mongoose.model('Category', catSchema);

        const categories = await Category.find({});
        console.log(`Found ${categories.length} categories:`);
        categories.forEach(c => console.log(` - ${c.name} (${c.slug})`));

        // Add defaults if looking sparse
        if (categories.length < 3) {
            console.log("Seeding more categories...");
            const newCats = [
                { name: "Laptops", slug: "laptops" },
                { name: "Desktops", slug: "desktops" },
                { name: "Processors", slug: "processors" },
                { name: "Graphics Cards", slug: "graphics-cards" },
                { name: "Motherboards", slug: "motherboards" },
                { name: "Storage", slug: "storage" },
                { name: "Monitors", slug: "monitors" },
                { name: "Keyboards", slug: "keyboards" },
                { name: "Mice", slug: "mice" }
                { name: "Processors", slug: "mice" }
                

            ].filter(n => !categories.find(c => c.slug === n.slug));

            if (newCats.length > 0) {
                await Category.create(newCats);
                console.log(`Seeded ${newCats.length} new categories.`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkCategories();
