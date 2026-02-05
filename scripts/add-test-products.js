// Add test products with proper slugs
require('dotenv').config();
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String },
    images: [{ type: String }],
    specs: { type: mongoose.Schema.Types.Mixed },
    highlights: [{ type: String }],
    features: [{
        title: { type: String },
        description: { type: String }
    }],
    warranty: {
        duration: { type: String },
        type: { type: String },
        details: { type: String }
    },
    returnPolicy: {
        returnable: { type: Boolean, default: true },
        duration: { type: String },
        details: { type: String }
    },
    shippingInfo: {
        freeShipping: { type: Boolean, default: false },
        minOrderForFreeShipping: { type: Number },
        estimatedDelivery: { type: String },
        details: { type: String }
    },
    manufacturerDetails: {
        name: { type: String },
        country: { type: String },
        address: { type: String }
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }
});

async function addTestProducts() {
    try {
        console.log(' Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pc-bazar');
        console.log('✅ Connected!');

        const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
        const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

        const categories = await Category.find();
        console.log(`Found ${categories.length} categories`);

        if (categories.length === 0) {
            console.log('❌ No categories found! Add them from admin panel first.');
            process.exit(1);
        }

        // Show categories
        categories.forEach(cat => console.log(`  - ${cat.name} (slug: ${cat.slug})`));

        // Delete bad products
        const deleted = await Product.deleteMany({
            $or: [
                { slug: { $in: ['undefined', 'xyz', null, ''] } },
                { slug: { $exists: false } }
            ]
        });
        console.log(`\n🗑️  Deleted ${deleted.deletedCount} invalid products`);

        // Find categories
        const cpu = categories.find(c => c.slug === 'processors') || categories[0];
        const gpu = categories.find(c => c.slug === 'graphics-cards') || categories[0];
        const ram = categories.find(c => c.name.toLowerCase().includes('memory') || c.name.toLowerCase().includes('ram')) || categories[0];
        const ssd = categories.find(c => c.slug === 'storage') || categories[0];
        const mobo = categories.find(c => c.slug === 'motherboards') || categories[0];

        const testProducts = [
            {
                name: 'Intel Core i5-12400F Processor',
                slug: 'intel-i5-12400f',
                price: 12500,
                discountPrice: 11999,
                stock: 15,
                brand: 'Intel',
                category: cpu._id,
                description: 'Intel Core i5-12400F 12th Gen Desktop Processor. 6 Cores, 12 Threads, up to 4.4 GHz. Perfect for gaming and productivity.',
                specs: {
                    'Cores': '6',
                    'Threads': '12',
                    'Base Clock': '2.5 GHz',
                    'Turbo Boost': '4.4 GHz',
                    'Cache': '18MB',
                    'Socket': 'LGA1700'
                },
                images: ['https://placehold.co/600x600/4285F4/white?text=Intel+i5-12400F'],
                highlights: [
                    '6 Performance cores with 12 threads',
                    'Up to 4.4 GHz Turbo Boost',
                    '18MB Intel Smart Cache',
                    'PCIe 5.0 and DDR5 support'
                ],
                warranty: {
                    duration: '3 Years',
                    type: 'Manufacturer Warranty'
                },
                shippingInfo: {
                    freeShipping: true,
                    estimatedDelivery: '2-3 Days'
                },
                isActive: true
            },
            {
                name: 'AMD Ryzen 5 5600X Processor',
                slug: 'amd-ryzen-5-5600x',
                price: 14500,
                discountPrice: 13999,
                stock: 10,
                brand: 'AMD',
                category: cpu._id,
                description: 'AMD Ryzen 5 5600X Desktop Processor. 6 Cores, 12 Threads. Zen 3 architecture for incredible gaming performance.',
                specs: {
                    'Cores': '6',
                    'Threads': '12',
                    'Base Clock': '3.7 GHz',
                    'Boost Clock': '4.6 GHz',
                    'Cache': '35MB',
                    'Socket': 'AM4'
                },
                images: ['https://placehold.co/600x600/ED1C24/white?text=AMD+Ryzen+5'],
                highlights: [
                    'Zen 3 gaming architecture',
                    'Unlocked for overclocking',
                    'Wraith Stealth Cooler included',
                    'PCIe 4.0 support'
                ],
                warranty: {
                    duration: '3 Years',
                    type: 'AMD Warranty'
                },
                shippingInfo: {
                    freeShipping: true,
                    estimatedDelivery: '2-4 Days'
                },
                isActive: true
            },
            {
                name: 'NVIDIA RTX 3060 12GB Graphics Card',
                slug: 'nvidia-rtx-3060-12gb',
                price: 32000,
                disountPrice: 29999,
                stock: 8,
                brand: 'NVIDIA',
                category: gpu._id,
                description: 'NVIDIA GeForce RTX 3060 with 12GB GDDR6. Ray tracing and DLSS with Ampere architecture for amazing performance.',
                specs: {
                    'GPU': 'GA106',
                    'CUDA Cores': '3584',
                    'Memory': '12GB GDDR6',
                    'Boost Clock': '1777 MHz',
                    'TDP': '170W'
                },
                images: ['https://placehold.co/600x600/76B900/white?text=RTX+3060'],
                highlights: [
                    '12GB GDDR6 memory',
                    'Real-time ray tracing',
                    'NVIDIA DLSS technology',
                    'DirectX 12 Ultimate support'
                ],
                warranty: {
                    duration: '3 Years',
                    type: 'Manufacturer Warranty'
                },
                shippingInfo: {
                    freeShipping: true,
                    estimatedDelivery: '3-5 Days'
                },
                isActive: true
            },
            {
                name: 'Corsair Vengeance RGB PRO 16GB DDR4 RAM',
                slug: 'corsair-vengeance-16gb',
                price: 6500,
                discountPrice: 5999,
                stock: 20,
                brand: 'Corsair',
                category: ram._id,
                description: 'CORSAIR VENGEANCE RGB PRO 16GB (2x8GB) DDR4 3200MHz. Dynamic RGB lighting for gaming builds.',
                specs: {
                    'Capacity': '16GB (2x8GB)',
                    'Speed': 'DDR4-3200MHz',
                    'Latency': 'CL16',
                    'RGB': 'Yes'
                },
                images: ['https://placehold.co/600x600/FFC600/black?text=Corsair+RAM'],
                highlights: [
                    'Dynamic RGB lighting',
                    'High-performance DDR4',
                    'Optimized for Intel \u0026 AMD',
                    'Lifetime warranty'
                ],
                warranty: {
                    duration: 'Lifetime',
                    type: 'Corsair Warranty'
                },
                shippingInfo: {
                    freeShipping: true,
                    estimatedDelivery: '1-2 Days'
                },
                isActive: true
            },
            {
                name: 'Samsung 980 PRO 1TB NVMe SSD',
                slug: 'samsung-980-pro-1tb',
                price: 12000,
                discountPrice: 10999,
                stock: 12,
                brand: 'Samsung',
                category: ssd._id,
                description: 'Samsung 980 PRO PCIe 4.0 NVMe SSD. Up to 7,000 MB/s read speeds. Lightning-fast gaming and productivity.',
                specs: {
                    'Capacity': '1TB',
                    'Interface': 'PCIe 4.0 x4 NVMe',
                    'Read Speed': '7,000 MB/s',
                    'Write Speed': '5,000 MB/s',
                    'Form Factor': 'M.2 2280'
                },
                images: ['https://placehold.co/600x600/1428A0/white?text=Samsung+SSD'],
                highlights: [
                    'PCIe 4.0 extreme speeds',
                    'Up to 7,000 MB/s reads',
                    'Next-gen gaming ready',
                    '5-year warranty'
                ],
                warranty: {
                    duration: '5 Years',
                    type: 'Samsung Warranty'
                },
                shippingInfo: {
                    freeShipping: true,
                    estimatedDelivery: '2-3 Days'
                },
                isActive: true
            },
            {
                name: 'MSI B550 Gaming Plus Motherboard',
                slug: 'msi-b550-gaming-plus',
                price: 11000,
                discountPrice: 10499,
                stock: 7,
                brand: 'MSI',
                category: mobo._id,
                description: 'MSI B550 Gaming Plus AMD AM4 ATX Motherboard. Supports Ryzen 5000 series with PCIe 4.0 and DDR4.',
                specs: {
                    'Socket': 'AM4',
                    'Chipset': 'AMD B550',
                    'Form Factor': 'ATX',
                    'Memory': 'DDR4 up to 128GB',
                    'PCIe': '4.0'
                },
                images: ['https://placehold.co/600x600/000000/red?text=MSI+B550'],
                highlights: [
                    'AMD B550 chipset',
                    'PCIe 4.0 ready',
                    'DDR4 support up to 128GB',
                    'Mystic Light RGB'
                ],
                warranty: {
                    duration: '3 Years',
                    type: 'MSI Warranty'
                },
                shippingInfo: {
                    freeShipping: true,
                    estimatedDelivery: '2-4 Days'
                },
                isActive: true
            }
        ];

        console.log(`\n📦 Adding ${testProducts.length} products...\n`);

        for (const prod of testProducts) {
            await Product.findOneAndUpdate(
                { slug: prod.slug },
                prod,
                { upsert: true, new: true }
            );
            console.log(`  ✅ ${prod.name}`);
        }

        console.log('\n✨ Success! Products added to database\n');
        console.log('🌐 Check: http://localhost:3000/collection\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB disconnected\n');
    }
}

addTestProducts();
