const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Config = require('./models/Config');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elango-products', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Config.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@elangoproducts.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user'
    });
    await testUser.save();

    console.log('Created users');

    // Create categories
    const masalaCategory = new Category({
      name: 'Masala Items',
      description: 'Traditional spice blends and masalas'
    });
    await masalaCategory.save();

    const milkCategory = new Category({
      name: 'Milk Products',
      description: 'Fresh dairy products and milk-based items'
    });
    await milkCategory.save();

    const groceryCategory = new Category({
      name: 'Grocery Items',
      description: 'Essential grocery items and staples'
    });
    await groceryCategory.save();

    console.log('Created categories');

    // Create products
    const products = [
      // Masala Items
      {
        name: 'Sambhar Masala',
        description: 'Authentic South Indian sambhar masala powder made with traditional spices',
        price: 120,
        image: '/images/sambhar-masala.jpg',
        categoryId: masalaCategory._id,
        stock: 50
      },
      {
        name: 'Rasam Powder',
        description: 'Tangy and flavorful rasam powder for the perfect South Indian rasam',
        price: 100,
        image: '/images/rasam-powder.jpg',
        categoryId: masalaCategory._id,
        stock: 40
      },
      {
        name: 'Turmeric Powder',
        description: 'Pure and organic turmeric powder with natural color and aroma',
        price: 80,
        image: '/images/turmeric-powder.jpg',
        categoryId: masalaCategory._id,
        stock: 60
      },
      // Milk Products
      {
        name: 'Pure Ghee',
        description: 'Traditional homemade ghee from pure cow milk',
        price: 500,
        image: '/images/ghee.jpg',
        categoryId: milkCategory._id,
        stock: 25
      },
      {
        name: 'Fresh Paneer',
        description: 'Soft and fresh paneer made from pure milk',
        price: 200,
        image: '/images/paneer.jpg',
        categoryId: milkCategory._id,
        stock: 15
      },
      {
        name: 'Khoya',
        description: 'Rich and creamy khoya perfect for sweets and desserts',
        price: 300,
        image: '/images/khoya.jpg',
        categoryId: milkCategory._id,
        stock: 20
      },
      // Grocery Items
      {
        name: 'Basmati Rice',
        description: 'Premium quality basmati rice with long grains and aromatic fragrance',
        price: 150,
        image: '/images/basmati-rice.jpg',
        categoryId: groceryCategory._id,
        stock: 100
      },
      {
        name: 'Toor Dal',
        description: 'High-quality toor dal (pigeon peas) rich in protein',
        price: 120,
        image: '/images/toor-dal.jpg',
        categoryId: groceryCategory._id,
        stock: 80
      },
      {
        name: 'Urad Dal',
        description: 'Premium urad dal perfect for making dosa, idli, and vada',
        price: 130,
        image: '/images/urad-dal.jpg',
        categoryId: groceryCategory._id,
        stock: 70
      }
    ];

    await Product.insertMany(products);
    console.log('Created products');

    // Create config
    const config = new Config({
      site_name: 'Elango Home Made Products',
      description: 'Premium quality home made products',
      contact_email: 'info@elangoproducts.com',
      contact_phone: '+91-9876543210'
    });
    await config.save();

    console.log('Created config');
    console.log('Seed data created successfully!');
    
    console.log('\nLogin credentials:');
    console.log('Admin: admin@elangoproducts.com / admin123');
    console.log('User: user@test.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
