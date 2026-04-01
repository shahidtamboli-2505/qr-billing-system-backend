require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("./src/models/MenuItem");

const MENU_ITEMS = [
  // DESSERTS
  { name: "Teddy Bear Mousse", category: "Desserts", price: 119, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587", description: "Soft mousse dessert with rich creamy texture" },
  { name: "Angel Baby Bowl", category: "Desserts", price: 99, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b", description: "Signature sweet dessert bowl" },
  // CHOCOLATE BOWLS
  { name: "Chocolate Overload", category: "Chocolate Bowls", price: 249, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb", description: "Loaded chocolate bowl for hardcore chocolate lovers" },
  { name: "Midnight Cocoa", category: "Chocolate Bowls", price: 249, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c", description: "Dark cocoa based premium bowl" },
  { name: "Milk Chocolate", category: "Chocolate Bowls", price: 249, image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3", description: "Smooth and creamy milk chocolate bowl" },
  { name: "White Chocolate", category: "Chocolate Bowls", price: 249, image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7", description: "Sweet white chocolate signature bowl" },
  { name: "Oreo Chocolate", category: "Chocolate Bowls", price: 249, image: "https://images.unsplash.com/photo-1586985289906-406988974504", description: "Chocolate bowl topped with Oreo crunch" },
  { name: "KitKat Chocolate", category: "Chocolate Bowls", price: 249, image: "https://images.unsplash.com/photo-1511381939415-e44015466834", description: "Chocolate bowl with crispy KitKat bites" },
  { name: "Lotus Caramel Bliss", category: "Chocolate Bowls", price: 249, image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05", description: "Lotus biscoff caramel bowl special" },
  { name: "Nutella Chocolate", category: "Chocolate Bowls", price: 249, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777", description: "Nutella loaded chocolate bowl" },
  // WAFFLES
  { name: "Chocolate Overload Waffle", category: "Waffles", price: 99, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Classic waffle with chocolate overload" },
  { name: "Midnight Cocoa Waffle", category: "Waffles", price: 99, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Dark cocoa waffle special" },
  { name: "White Chocolate Waffle", category: "Waffles", price: 99, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Waffle topped with white chocolate" },
  { name: "KitKat Waffle", category: "Waffles", price: 99, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Crispy waffle with KitKat topping" },
  { name: "Cookies & Cream Waffle", category: "Waffles", price: 119, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Creamy waffle with cookie crunch" },
  { name: "Lotus Caramel Bliss Waffle", category: "Waffles", price: 119, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Lotus caramel waffle special" },
  { name: "Nutella Waffle", category: "Waffles", price: 129, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Nutella lovers’ waffle" },
  // COFFEE
  { name: "Belgian Classic Brew", category: "Coffee", price: 49, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735", description: "Simple and strong classic coffee" },
  { name: "Belgian Signature Brew", category: "Coffee", price: 79, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735", description: "Premium signature coffee" },
  // BOBA TEA
  { name: "Chocolate Boba Tea", category: "Boba Tea", price: 89, image: "https://images.unsplash.com/photo-1558857563-b371033873b8", description: "Refreshing chocolate flavored boba tea" },
  { name: "Coffee Boba Tea", category: "Boba Tea", price: 89, image: "https://images.unsplash.com/photo-1558857563-b371033873b8", description: "Coffee based cool boba tea" },
  // COMBOS
  { name: "Waffle with Cold Coffee", category: "Combos", price: 99, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e", description: "Best value combo for quick dessert break" },
  { name: "Buy 2 Waffles, Get 1 Coffee FREE", category: "Combos", price: 269, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e", description: "Perfect sharing combo deal" },
  // CONE CAKE
  { name: "Triple Chocolate Cone", category: "Cone Cake", price: 79, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Chocolate cone cake special" },
  { name: "White Chocolate Cone", category: "Cone Cake", price: 79, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "White chocolate cone cake" },
  { name: "Dark Chocolate Cone", category: "Cone Cake", price: 79, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Dark chocolate cone cake" },
  // ADD ONS
  { name: "Extra Chocolate Drizzle", category: "Add Ons", price: 19, image: "https://images.unsplash.com/photo-1511381939415-e44015466834", description: "Extra chocolate topping" },
  { name: "Oreo / KitKat / Biscoff Topping", category: "Add Ons", price: 19, image: "https://images.unsplash.com/photo-1511381939415-e44015466834", description: "Extra premium topping" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log("Connected to DB for seeding...");

    const existingCount = await MenuItem.countDocuments();
    if (existingCount === 0) {
      await MenuItem.insertMany(MENU_ITEMS);
      console.log(`✅ Seeded ${MENU_ITEMS.length} menu items successfully.`);
    } else {
      console.log(`⚠️ DB already has ${existingCount} items. Skipping seed.`);
    }
  } catch (error) {
    console.error("❌ Seed Error:", error);
  } finally {
    process.exit(0);
  }
};

seedDB();
