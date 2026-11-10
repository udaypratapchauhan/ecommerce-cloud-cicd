require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: connectionString && connectionString.includes('render.com')
    ? { rejectUnauthorized: false }
    : false,
});

const initDb = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'General',
        price NUMERIC(10, 2) NOT NULL,
        original_price NUMERIC(10, 2),
        description TEXT,
        image_url TEXT,
        rating NUMERIC(3, 1) DEFAULT 4.5,
        rating_count INT DEFAULT 120,
        stock INT DEFAULT 20,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);

    // Auto-migrate columns if table already existed
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100) NOT NULL DEFAULT 'General';
      ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 1) DEFAULT 4.5;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 120;
    `);

    const { rows } = await pool.query('SELECT COUNT(*) FROM products');
    const count = parseInt(rows[0].count, 10);

    if (count < 40) {
      await pool.query('TRUNCATE TABLE products RESTART IDENTITY');

      const seedQuery = `
        INSERT INTO products (title, category, price, original_price, description, image_url, rating, rating_count, stock) VALUES
        -- ELECTRONICS (1 to 10)
        (
          'Sony WH-1000XM4 Wireless Noise Cancelling Headphones',
          'Electronics',
          19990.00,
          29990.00,
          'Industry-leading active noise cancellation with Dual Noise Sensor technology and 30-hour battery life.',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          4.8,
          3450,
          25
        ),
        (
          'Keychron K2 RGB Wireless Mechanical Keyboard',
          'Electronics',
          7499.00,
          9999.00,
          'Compact 75% layout Bluetooth mechanical keyboard with Gateron Brown switches and Mac/Windows layout.',
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
          4.7,
          1420,
          18
        ),
        (
          'Logitech MX Master 3S Wireless Performance Mouse',
          'Electronics',
          8995.00,
          10995.00,
          'Quiet clicks and 8K DPI track-on-glass sensor with MagSpeed electromagnetic scrolling.',
          'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
          4.9,
          2890,
          30
        ),
        (
          'Philips Series 7000 All-in-One Waterproof Trimmer',
          'Electronics',
          2999.00,
          4495.00,
          '14-in-1 premium grooming kit with DualCut self-sharpening blades and 120-minute lithium runtime.',
          'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80',
          4.5,
          980,
          45
        ),
        (
          'Apple Watch Series 9 GPS 45mm Starlight Aluminium',
          'Electronics',
          41900.00,
          44900.00,
          'Advanced health sensors with Blood Oxygen, ECG apps, and Always-On Retina OLED display.',
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          4.9,
          4120,
          12
        ),
        (
          'Marshall Stanmore II Wireless Bluetooth Speaker',
          'Electronics',
          27999.00,
          34999.00,
          'Legendary vintage aesthetic producing clean, precise audio even at the highest levels.',
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
          4.8,
          1890,
          10
        ),
        (
          'Fujifilm Instax Mini 12 Instant Film Camera',
          'Electronics',
          6499.00,
          7999.00,
          'Point-and-shoot analog instant camera with automatic exposure control and built-in selfie mirror.',
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
          4.6,
          2340,
          40
        ),
        (
          'Dell UltraSharp 27-inch 4K UHD USB-C Hub Monitor',
          'Electronics',
          48990.00,
          62000.00,
          'IPS Black panel with exceptional 2000:1 contrast ratio, 98% DCI-P3, and 90W power delivery.',
          'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
          4.8,
          760,
          15
        ),
        (
          'Bose SoundLink Flex Portable Bluetooth Speaker',
          'Electronics',
          12900.00,
          15900.00,
          'Rugged IP67 waterproof outdoor speaker with PositionIQ technology for optimal acoustics.',
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
          4.7,
          3110,
          28
        ),
        (
          'Sony Alpha 7 IV Full-Frame Mirrorless Camera',
          'Electronics',
          199990.00,
          242990.00,
          '33MP full-frame Exmor R CMOS sensor with 4K 60p 10-bit recording and real-time Eye AF.',
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
          4.9,
          540,
          8
        ),

        -- FOOTWEAR (11 to 20)
        (
          'Nike Air Jordan 1 Retro High OG Chicago',
          'Footwear',
          16995.00,
          19995.00,
          'Legendary basketball silhouette crafted with premium full-grain leather and encapsulated Air-Sole.',
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
          4.9,
          5670,
          14
        ),
        (
          'Adidas Ultraboost Light Road Running Shoes',
          'Footwear',
          11999.00,
          18999.00,
          'Lightest ever BOOST cushioning paired with adaptive Primeknit+ textile for marathon comfort.',
          'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
          4.7,
          2890,
          22
        ),
        (
          'Clarks Handcrafted Genuine Leather Chelsea Boots',
          'Footwear',
          6499.00,
          10999.00,
          'Classic British silhouette featuring rich oily leather upper and cushioned Ortholite footbed.',
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
          4.6,
          1140,
          18
        ),
        (
          'Vans Old Skool Classic Skate Shoes',
          'Footwear',
          4499.00,
          5999.00,
          'The timeless low-top skate shoe featuring durable canvas and suede uppers with signature waffle outsole.',
          'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
          4.8,
          6420,
          50
        ),
        (
          'Puma Velocity Nitro 2 Lightweight Running Shoes',
          'Footwear',
          5999.00,
          9999.00,
          'Responsive NITRO FOAM cushioning with durable PUMAGRIP rubber for versatile all-distance running.',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
          4.5,
          1780,
          32
        ),
        (
          'New Balance 574 Core Heritage Lifestyle Sneakers',
          'Footwear',
          7999.00,
          9999.00,
          'Iconic hybrid road/trail design featuring ENCAP midsole cushioning with suede and mesh upper.',
          'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
          4.7,
          3200,
          24
        ),
        (
          'Converse Chuck Taylor All Star High-Top Canvas',
          'Footwear',
          3799.00,
          4999.00,
          'Timeless canvas high-top featuring the authentic ankle patch and vulcanized rubber sole.',
          'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
          4.7,
          8100,
          40
        ),
        (
          'Woodland Rugged Khaki Leather Outdoor Boots',
          'Footwear',
          4295.00,
          6995.00,
          'Heavy-duty nubuck leather boots with deep lugged rubber tread for superior outdoor grip.',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
          4.4,
          2450,
          26
        ),
        (
          'Asics Gel-Kayano 30 Stability Road Running Shoes',
          'Footwear',
          13999.00,
          17999.00,
          '4D GUIDANCE SYSTEM technology delivering adaptive stability and FF BLAST PLUS ECO cushioning.',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
          4.8,
          1950,
          16
        ),
        (
          'Nike Air Force 1 07 Triple White Low',
          'Footwear',
          8195.00,
          9695.00,
          'Crisp stitched overlays with pure white leather and legendary Nike Air cushioning.',
          'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=800&q=80',
          4.9,
          9400,
          35
        ),

        -- FASHION (21 to 30)
        (
          'Levi''s Relaxed Fit Heavyweight Denim Trucker Jacket',
          'Fashion',
          3599.00,
          5999.00,
          'Iconic trucker silhouette crafted in rugged 100% cotton selvedge indigo denim.',
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
          4.5,
          1250,
          30
        ),
        (
          'Zara Textured Knit Cuban Collar Resort Shirt',
          'Fashion',
          2290.00,
          3490.00,
          'Breathable cotton-blend open knit resort shirt with retro camp collar and mother-of-pearl buttons.',
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
          4.4,
          890,
          45
        ),
        (
          'Urban Monkey Premium Drop-Cut Heavyweight Hoodie',
          'Fashion',
          1999.00,
          3499.00,
          '380 GSM fleece hoodie with ribbed hem and high-density street-style puff print.',
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
          4.6,
          1640,
          35
        ),
        (
          'Tommy Hilfiger Classic Solid Oxford Cotton Shirt',
          'Fashion',
          3999.00,
          6999.00,
          'Pure organic cotton woven shirt finished with button-down collar and signature flag embroidery.',
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
          4.6,
          2180,
          25
        ),
        (
          'Ray-Ban Wayfarer Classic Polarized Sunglasses',
          'Fashion',
          9890.00,
          12590.00,
          'Legendary G-15 green polarized lenses housed in high-gloss black acetate frames with 100% UV shield.',
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          4.9,
          4230,
          20
        ),
        (
          'H&M Tailored Slim-Fit Stretch Chino Trousers',
          'Fashion',
          1499.00,
          2299.00,
          'Soft cotton twill trousers with elastane for active flexibility and tailored formal silhouette.',
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
          4.4,
          1340,
          50
        ),
        (
          'Fossil Minimalist Chronograph Brown Leather Watch',
          'Fashion',
          8495.00,
          12995.00,
          'Sleek 42mm stainless steel case with amber sunray dial and supple genuine saddle leather strap.',
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
          4.7,
          3100,
          22
        ),
        (
          'Jack & Jones Casual Regular Fit Flannel Check Shirt',
          'Fashion',
          1799.00,
          2999.00,
          'Brushed cotton yarn-dyed plaid pattern shirt with dual chest flap pockets and curved hem.',
          'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80',
          4.5,
          1120,
          38
        ),
        (
          'Snitch Streetwear Relaxed Multi-Pocket Cargo Joggers',
          'Fashion',
          1599.00,
          2499.00,
          'Durable cotton ripstop cargo pants featuring elastic drawcord waistband and tactical flap pockets.',
          'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
          4.5,
          2420,
          40
        ),
        (
          'Superdry Vintage Athletic Embroidered Heavy T-Shirt',
          'Fashion',
          1899.00,
          2999.00,
          '220 GSM heavyweight combed cotton featuring heritage chest applique and relaxed cut.',
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
          4.6,
          1890,
          45
        ),

        -- FITNESS (31 to 40)
        (
          'Optimum Nutrition Gold Standard 100% Whey 2kg Double Rich Chocolate',
          'Fitness',
          6499.00,
          8999.00,
          'World''s #1 selling whey protein with 24g pure whey isolate and 5.5g naturally occurring BCAAs.',
          'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80',
          4.8,
          8920,
          60
        ),
        (
          'MuscleBlaze Raw Whey Isolate 90% 1kg Unflavoured',
          'Fitness',
          2499.00,
          3899.00,
          'Zero carb, zero added sugar ultra-pure whey protein isolate delivering 27g protein per scoop.',
          'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=800&q=80',
          4.6,
          4150,
          50
        ),
        (
          'Cultsport Hexagon Rubber Coated Dumbbell Pair 10kg',
          'Fitness',
          3499.00,
          5499.00,
          'Solid cast-iron core encased in high-grade odorless rubber with knurled ergonomic chrome handles.',
          'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
          4.7,
          1980,
          30
        ),
        (
          'Boldfit Non-Slip Extra Thick 6mm EVA Yoga & Gym Mat',
          'Fitness',
          999.00,
          1799.00,
          'High-density anti-tear cushioned exercise mat with dual textured non-slip surface and carry strap.',
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
          4.5,
          5340,
          65
        ),
        (
          'The Whole Truth 100% Whey Protein Concentrate 1kg Cold Brew Coffee',
          'Fitness',
          2799.00,
          3499.00,
          'Clean ingredients protein made with real arabica coffee and grass-fed milk with zero sucralose.',
          'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
          4.7,
          2390,
          35
        ),
        (
          'Gymshark Genuine Leather Heavy Lifting Powerlifting Belt',
          'Fitness',
          2299.00,
          3499.00,
          '10mm thick reinforced buffalo leather with double-prong stainless steel buckle for core support.',
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
          4.6,
          1290,
          25
        ),
        (
          'Nivia High Speed Bearing Steel Wire Jump Rope',
          'Fitness',
          449.00,
          899.00,
          '360-degree dual ball bearing mechanism with 3-meter adjustable tangle-free braided steel wire.',
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
          4.5,
          3780,
          80
        ),
        (
          'Cellucor C4 Original Pre-Workout 30 Servings Fruit Punch',
          'Fitness',
          2199.00,
          3199.00,
          'Explosive energy formula powered by 150mg caffeine, CarnoSyn Beta-Alanine, and Nitramax.',
          'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=800&q=80',
          4.7,
          4890,
          40
        ),
        (
          'BlenderBottle Classic V2 Shaker Cup 820ml with Whisk Ball',
          'Fitness',
          699.00,
          1199.00,
          'BPA-free leak-proof protein shaker equipped with 316 surgical-grade stainless steel BlenderBall.',
          'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
          4.8,
          7420,
          55
        ),
        (
          'Domyos Resistance Tube Band Set with Door Anchor & Handles',
          'Fitness',
          1299.00,
          1999.00,
          '5 color-coded stackable natural latex resistance bands ranging from 10lbs to 50lbs with ankle straps.',
          'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=800&q=80',
          4.6,
          3150,
          45
        );
      `;
      await pool.query(seedQuery);
      console.log('Database initialized: Successfully seeded 40 verified e-commerce products (10 per category).');
    } else {
      console.log(`Database initialized: Products catalog ready with ${count} items.`);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initDb();

module.exports = { pool, initDb };
