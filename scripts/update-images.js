const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Unsplash distinct images mapped to product index / names
const distinctImages = [
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80", // 1. Orea Curle
    "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=600&q=80", // 2. Ganesh Murti
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80", // 3. Geo Prism Keychain
    "https://images.unsplash.com/photo-1490979380897-4f36a8bd7c68?auto=format&fit=crop&w=600&q=80", // 4. Eiffel 1:500
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80", // 5. Hexia Wall Panel
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80", // 6. Dash Totem
    "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=80", // 7. Petalo Vase
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80", // 8. Lune Dome Lamp
    "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80", // 9. Volta Arc Lamp
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80", // 10. Tiny Mantra Tag
    "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&w=600&q=80", // 11. Dragon Keep
    "https://images.unsplash.com/photo-1609137144814-8742d4a6f233?auto=format&fit=crop&w=600&q=80", // 12. Diya Stand
    "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=600&q=80", // 13. Vent Bloom
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80", // 14. Rova Shelf Clip
    "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=600&q=80", // 15. Om Plaque
    "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=600&q=80", // 16. City Block Set
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80", // 17. Bloom Tag
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80", // 18. Name Plaque
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80", // 19. Wheel Crest
    "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&w=600&q=80"  // 20. Portrait Bust
];

// Load env variables
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        env[key] = value;
    }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing environment variables!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateDatabaseProducts() {
    console.log("Fetching products from Supabase...");
    const { data: products, error } = await supabase.from('products').select('id, name').order('created_at', { ascending: true });
    
    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    console.log(`Found ${products.length} products. Updating images...`);

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        // Assign image based on index (loop if database has more products than our array)
        const imgUrl = distinctImages[i % distinctImages.length];
        
        console.log(`Updating "${product.name}" (${product.id}) with image: ${imgUrl}`);
        
        const { error: updateError } = await supabase
            .from('products')
            .update({ images: [imgUrl] })
            .eq('id', product.id);

        if (updateError) {
            console.error(`Failed to update ${product.name}:`, updateError);
        }
    }
    console.log("Database products update complete!");
}

async function updateSchemaFile() {
    const schemaPath = path.join(__dirname, '../supabase_schema.sql');
    let content = fs.readFileSync(schemaPath, 'utf-8');

    // Replace the specific lines inside supabase_schema.sql
    // Product 1
    content = content.replace(
        "'e0f1a2b3-c4d5-4001-9002-000000000001', 'Orēa Curlé Lamp', 'Lamps', 3000, 'Bestseller', 4.8, 142, 'Modern 3D printed table lamp with matte white finish. Precision-crafted for elegant lighting.', '22 cm', 'PLA+', '5', '{\"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg\"}'",
        `'e0f1a2b3-c4d5-4001-9002-000000000001', 'Orēa Curlé Lamp', 'Lamps', 3000, 'Bestseller', 4.8, 142, 'Modern 3D printed table lamp with matte white finish. Precision-crafted for elegant lighting.', '22 cm', 'PLA+', '5', '{"${distinctImages[0]}"}'`
    );
    // Product 2
    content = content.replace(
        "'e0f1a2b3-c4d5-4001-9002-000000000002', 'Ganesh Murti', 'Devotional', 1200, 'Top Rated', 5.0, 89, 'Intricately printed sacred idol with resin-coated finish. Crafted with 0.1mm precision.', '15 cm', 'Resin', '7', '{\"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg\"}'",
        `'e0f1a2b3-c4d5-4001-9002-000000000002', 'Ganesh Murti', 'Devotional', 1200, 'Top Rated', 5.0, 89, 'Intricately printed sacred idol with resin-coated finish. Crafted with 0.1mm precision.', '15 cm', 'Resin', '7', '{"${distinctImages[1]}"}'`
    );
    // Product 3
    content = content.replace(
        "'e0f1a2b3-c4d5-4001-9002-000000000003', 'Geo Prism Keychain', 'Keychains', 280, 'Popular', 4.9, 210, 'Lightweight resin keychain with 30+ designs and custom engraving option.', '4 cm', 'Resin', '3', '{\"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg\"}'",
        `'e0f1a2b3-c4d5-4001-9002-000000000003', 'Geo Prism Keychain', 'Keychains', 280, 'Popular', 4.9, 210, 'Lightweight resin keychain with 30+ designs and custom engraving option.', '4 cm', 'Resin', '3', '{"${distinctImages[2]}"}'`
    );
    // Product 4
    content = content.replace(
        "'e0f1a2b3-c4d5-4001-9002-000000000004', 'Eiffel 1:500', 'Miniature', 1500, 'New', 4.8, 54, 'Obsessively detailed architectural scale model. Perfect for collectors.', '18 cm', 'PLA', '5', '{\"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg\"}'",
        `'e0f1a2b3-c4d5-4001-9002-000000000004', 'Eiffel 1:500', 'Miniature', 1500, 'New', 4.8, 54, 'Obsessively detailed architectural scale model. Perfect for collectors.', '18 cm', 'PLA', '5', '{"${distinctImages[3]}"}'`
    );

    // Loop through others and replace
    for (let i = 5; i <= 20; i++) {
        const id = `0000000000${i < 10 ? '0' + i : i}`;
        const searchStr = `e0f1a2b3-c4d5-4001-9002-${id}`;
        const oldImage = `{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}`;
        const newImage = `{"${distinctImages[i - 1]}"}`;
        
        // Find line containing ID, replace the image string
        const lines = content.split('\n');
        const updatedLines = lines.map(line => {
            if (line.includes(searchStr)) {
                return line.replace(oldImage, newImage);
            }
            return line;
        });
        content = updatedLines.join('\n');
    }

    fs.writeFileSync(schemaPath, content, 'utf-8');
    console.log("Updated supabase_schema.sql with distinct images!");
}

async function updateMockDataFile() {
    const dataPath = path.join(__dirname, '../app/components/data.ts');
    let content = fs.readFileSync(dataPath, 'utf-8');

    // Replace all placeholder images with distinct ones
    const regex = /images:\s*\["https:\/\/i\.pinimg\.com\/736x\/ef\/4a\/fb\/ef4afb6c44b3ce31a3778e4409db8b2c\.jpg"\]/g;
    
    let index = 0;
    content = content.replace(regex, (match) => {
        const img = distinctImages[index % distinctImages.length];
        index++;
        return `images: ["${img}"]`;
    });

    fs.writeFileSync(dataPath, content, 'utf-8');
    console.log("Updated data.ts mock products with distinct images!");
}

async function run() {
    await updateSchemaFile();
    await updateMockDataFile();
    await updateDatabaseProducts();
    console.log("All updates complete!");
}

run();
