-- Supabase Migration and Seed SQL Script
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS custom_orders;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS reels;
DROP TABLE IF EXISTS products;

-- 1. Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price NUMERIC NOT NULL,
    tag VARCHAR(100),
    rating NUMERIC DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    description TEXT,
    size VARCHAR(100),
    material VARCHAR(100),
    delivery_days VARCHAR(100),
    images TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT true,
    show_in_carousel BOOLEAN DEFAULT false,
    carousel_subtitle VARCHAR(255),
    carousel_desc TEXT,
    carousel_cta VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create reels table
CREATE TABLE reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user" VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    video_url TEXT,
    thumbnail_url TEXT,
    likes VARCHAR(100),
    views VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create offers table
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    cta VARCHAR(100),
    accent VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create custom_orders table
CREATE TABLE custom_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    dimensions VARCHAR(255),
    material VARCHAR(255),
    color VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    file_url TEXT,
    status VARCHAR(100) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Allow anyone to view products, reels, and offers
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on reels" ON reels FOR SELECT USING (true);
CREATE POLICY "Allow public read access on offers" ON offers FOR SELECT USING (true);

-- Allow anyone to submit custom orders
CREATE POLICY "Allow public insert access on custom_orders" ON custom_orders FOR INSERT WITH CHECK (true);

-- Allow full access to admins using the service role key
CREATE POLICY "Allow full access to service role on products" ON products TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to service role on reels" ON reels TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to service role on offers" ON offers TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to service role on custom_orders" ON custom_orders TO service_role USING (true) WITH CHECK (true);


-- =========================================================================
-- SEED DATA
-- =========================================================================

-- Seed announcements / offers
INSERT INTO offers (id, label, text, cta, accent) VALUES
('b0c1e8df-b4a1-432d-94c6-2eb8008a0d01', 'FREE SHIPPING', 'Free shipping on all orders above ₹2,500', 'Shop Now', '#1a1a1a'),
('b0c1e8df-b4a1-432d-94c6-2eb8008a0d02', 'NEW ARRIVAL', 'Ganesh Murti collection now live — limited stock', 'Explore', '#1a1a1a'),
('b0c1e8df-b4a1-432d-94c6-2eb8008a0d03', 'FESTIVE SALE', 'Up to 20% off on all table lamps this week', 'Claim Deal', '#1a1a1a'),
('b0c1e8df-b4a1-432d-94c6-2eb8008a0d04', 'CUSTOM ORDER', 'Design your own print — delivered in 5 days', 'Customize', '#1a1a1a');

-- Seed reels
INSERT INTO reels (id, "user", label, likes, views) VALUES
('a0b1c2d3-e4f5-4001-8002-000000000001', '@priya_home', 'Living room glow-up', '4.2k', '28k'),
('a0b1c2d3-e4f5-4001-8002-000000000002', '@rahul.decor', 'Ganesh Murti unboxing', '6.1k', '51k'),
('a0b1c2d3-e4f5-4001-8002-000000000003', '@sneha.crafts', 'My 3D keychain collection', '2.8k', '19k'),
('a0b1c2d3-e4f5-4001-8002-000000000004', '@ankit3d', 'Eiffel on my study desk', '3.5k', '33k'),
('a0b1c2d3-e4f5-4001-8002-000000000005', '@home.by.nisha', 'Night lamp vibes 🌙', '7.4k', '62k');

-- Seed products
INSERT INTO products (id, name, category, price, tag, rating, reviews, description, size, material, delivery_days, images, in_stock, show_in_carousel, carousel_subtitle, carousel_desc, carousel_cta) VALUES
-- Top Selling / Main Products
('e0f1a2b3-c4d5-4001-9002-000000000001', 'Orēa Curlé Lamp', 'Lamps', 3000, 'Bestseller', 4.8, 142, 'Modern 3D printed table lamp with matte white finish. Precision-crafted for elegant lighting.', '22 cm', 'PLA+', '5', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, true, 'Modern 3D Printed Table Lamp', 'Precision-printed in matte white. Ships in 5 days.', 'Shop Lamps'),

('e0f1a2b3-c4d5-4001-9002-000000000002', 'Ganesh Murti', 'Devotional', 1200, 'Top Rated', 5.0, 89, 'Intricately printed sacred idol with resin-coated finish. Crafted with 0.1mm precision.', '15 cm', 'Resin', '7', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, true, 'Intricately Printed Sacred Idol', 'Resin-coated finish. Crafted with 0.1mm precision.', 'Shop Devotional'),

('e0f1a2b3-c4d5-4001-9002-000000000003', 'Geo Prism Keychain', 'Keychains', 280, 'Popular', 4.9, 210, 'Lightweight resin keychain with 30+ designs and custom engraving option.', '4 cm', 'Resin', '3', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, true, 'Miniature Geometric Keychain', 'Lightweight resin. 30+ designs. Custom engraving.', 'Shop Keychains'),

('e0f1a2b3-c4d5-4001-9002-000000000004', 'Eiffel 1:500', 'Miniature', 1500, 'New', 4.8, 54, 'Obsessively detailed architectural scale model. Perfect for collectors.', '18 cm', 'PLA', '5', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, true, 'Architectural Scale Model', 'Obsessively detailed. Perfect for collectors.', 'Shop Miniatures'),

('e0f1a2b3-c4d5-4001-9002-000000000005', 'Hexia Wall Panel', 'Home Decor', 1800, 'Trending', 4.7, 67, 'Geometric wall panel with intricate patterns. Adds depth to any interior.', '30 cm', 'PLA+', '6', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000006', 'Dash Totem', 'Car Decor', 550, 'Popular', 4.7, 98, 'Clip-fit dashboard ornament with UV-resistant filament.', '8 cm', 'PETG', '3', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, true, 'Bespoke Dashboard Ornament', 'Clip-fit base. UV-resistant filament.', 'Shop Car Decor'),

('e0f1a2b3-c4d5-4001-9002-000000000007', 'Petalo Vase', 'Home Decor', 2200, 'Limited', 4.9, 33, 'Elegant petal-shaped vase for fresh or dried flowers.', '25 cm', 'PLA+', '7', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', false, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000008', 'Lunē Dome Lamp', 'Lamps', 4200, 'Limited', 4.8, 21, 'Dome-shaped ambiance lamp with warm LED compatibility.', '20 cm', 'PLA+', '5', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

-- Trending / Additional Products
('e0f1a2b3-c4d5-4001-9002-000000000009', 'Volta Arc Lamp', 'Lamps', 3800, 'New', 4.9, 18, 'Arc-shaped table lamp with contemporary design. Perfect for modern interiors.', '25 cm', 'PLA+', '5', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000010', 'Tiny Mantra Tag', 'Keychains', 350, 'Trending', 4.8, 76, 'Compact mantra-engraved keychain. Lightweight and durable.', '3 cm', 'Resin', '3', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000011', 'Dragon Keep', 'Miniature', 2800, 'New', 5.0, 12, 'Detailed dragon miniature collectible. Hand-painted finish available.', '12 cm', 'Resin', '7', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000012', 'Diya Stand', 'Devotional', 680, 'Seasonal', 4.9, 44, 'Traditional diya stand with modern geometric patterns.', '10 cm', 'PLA+', '4', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000013', 'Vent Bloom', 'Car Decor', 320, 'Popular', 4.6, 130, 'Car vent-mounted flower design. Adds freshness to your ride.', '6 cm', 'PETG', '3', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000014', 'Rova Shelf Clip', 'Home Decor', 650, 'Trending', 4.7, 55, 'Minimalist shelf clip for books and display items.', '8 cm', 'PLA', '3', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000015', 'Om Plaque', 'Devotional', 950, 'New', 4.8, 29, 'Sacred Om symbol plaque with intricate carving.', '15 cm', 'PLA+', '5', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000016', 'City Block Set', 'Miniature', 3400, 'Limited', 5.0, 9, 'Set of iconic city buildings in miniature. Collector''s edition.', '20 cm', 'Resin', '10', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', false, false, NULL, NULL, NULL),

-- You May Like / Additional Products
('e0f1a2b3-c4d5-4001-9002-000000000017', 'Bloom Tag', 'Keychains', 420, 'Limited', 4.8, 38, 'Flower-shaped keychain tag with vibrant colors.', '4 cm', 'Resin', '3', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000018', 'Name Plaque', 'Custom', 800, 'Popular', 4.9, 62, 'Custom engraved name plaque. Upload your design.', '15 cm', 'PLA+', '5', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, true, 'Your Idea, Printed', 'Upload a design. We print and deliver in 5–7 days.', 'Start Custom'),

('e0f1a2b3-c4d5-4001-9002-000000000019', 'Wheel Crest', 'Car Decor', 780, 'New', 4.7, 19, 'Automotive wheel-inspired decorative crest.', '10 cm', 'PETG', '4', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL),

('e0f1a2b3-c4d5-4001-9002-000000000020', 'Portrait Bust', 'Custom', 3500, 'New', 5.0, 7, 'Custom 3D printed portrait bust from your photo.', '25 cm', 'Resin', '10', '{"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"}', true, false, NULL, NULL, NULL);
