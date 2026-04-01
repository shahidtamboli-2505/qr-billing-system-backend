require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("./src/models/MenuItem");
const Order = require("./src/models/Order");
const Invoice = require("./src/models/Invoice");

const EXACT_MENU_ITEMS = [
  // FLAVOURS (Waffle, Cake, Candy)
  { name: "Chocolate Overload", category: "Waffles", price: 99, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Rich chocolate waffle" },
  { name: "Chocolate Overload Cake", category: "Cone Cake", price: 249, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Rich chocolate cake" },
  { name: "Chocolate Overload Candy", category: "Candy", price: 49, image: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Rich chocolate candy" },
  
  { name: "Midnight Cocoa", category: "Waffles", price: 79, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Dark cocoa waffle" },
  { name: "Midnight Cocoa Cake", category: "Cone Cake", price: 249, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Dark cocoa cake" },
  { name: "Midnight Cocoa Candy", category: "Candy", price: 49, image: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Dark cocoa candy" },
  
  { name: "White Chocolate", category: "Waffles", price: 79, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Sweet white chocolate waffle" },
  { name: "White Chocolate Cake", category: "Cone Cake", price: 249, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Sweet white chocolate cake" },
  { name: "White Chocolate Candy", category: "Candy", price: 49, image: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Sweet white chocolate candy" },

  { name: "KitKat", category: "Waffles", price: 109, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "KitKat waffle" },
  { name: "KitKat Cake", category: "Cone Cake", price: 249, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "KitKat cake" },
  { name: "KitKat Candy", category: "Candy", price: 49, image: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "KitKat candy" },

  { name: "Cookies & Cream", category: "Waffles", price: 109, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Cookies & Cream waffle" },
  { name: "Cookies & Cream Cake", category: "Cone Cake", price: 249, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Cookies & Cream cake" },
  { name: "Cookies & Cream Candy", category: "Candy", price: 49, image: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Cookies & Cream candy" },

  { name: "Lotus Caramel Bliss", category: "Waffles", price: 109, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Lotus caramel waffle" },
  { name: "Lotus Caramel Bliss Cake", category: "Cone Cake", price: 249, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Lotus caramel cake" },
  { name: "Lotus Caramel Bliss Candy", category: "Candy", price: 49, image: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Lotus caramel candy" },

  { name: "Nutella", category: "Waffles", price: 109, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Nutella waffle" },
  { name: "Nutella Cake", category: "Cone Cake", price: 249, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Nutella cake" },
  { name: "Nutella Candy", category: "Candy", price: 49, image: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Nutella candy" },

  // CHOCOLATE BOWLS
  { name: "Chocolate Overload Bowl", category: "Chocolate Bowls", price: 99, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb", description: "Signature chocolate bowl" },
  { name: "Midnight Cocoa Bowl", category: "Chocolate Bowls", price: 99, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c", description: "Dark cocoa bowl" },
  { name: "Milk chocolate Bowl", category: "Chocolate Bowls", price: 99, image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3", description: "Milk chocolate bowl" },
  { name: "White chocolate Bowl", category: "Chocolate Bowls", price: 99, image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7", description: "White chocolate bowl" },
  { name: "Oreo Chocolate Bowl", category: "Chocolate Bowls", price: 119, image: "https://images.unsplash.com/photo-1586985289906-406988974504", description: "Oreo chocolate bowl" },
  { name: "KitKat chocolate Bowl", category: "Chocolate Bowls", price: 119, image: "https://images.unsplash.com/photo-1511381939415-e44015466834", description: "KitKat chocolate bowl" },
  { name: "Lotus Caramel Bliss Bowl", category: "Chocolate Bowls", price: 129, image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05", description: "Caramel bowl" },
  { name: "Nutella chocolate Bowl", category: "Chocolate Bowls", price: 129, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777", description: "Nutella bowl" },

  // DESSERTS
  { name: "Teddy Bear Mousse", category: "Desserts", price: 119, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587", description: "Teddy Bear shaped dessert" },
  { name: "Angel Baby Bowl", category: "Desserts", price: 99, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b", description: "Angel Baby shaped dessert" },

  // COFFEE
  { name: "Belgian Classic Brew", category: "Coffee", price: 49, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735", description: "Classic hot coffee" },
  { name: "Belgian Signature Brew", category: "Coffee", price: 79, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735", description: "Premium signature blend" },

  // BOBA TEA
  { name: "Chocolate Boba", category: "Boba Tea", price: 89, image: "https://images.unsplash.com/photo-1558857563-b371033873b8", description: "Chocolate boba tea" },
  { name: "Coffee Boba", category: "Boba Tea", price: 89, image: "https://images.unsplash.com/photo-1558857563-b371033873b8", description: "Coffee boba tea" },

  // COMBOS
  { name: "Waffle with Cold Coffee", category: "Combos", price: 99, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e", description: "Combo 1" },
  { name: "Buy 2 Waffles, Get 1 Coffee FREE", category: "Combos", price: 89, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e", description: "Combo 2" },
  { name: "Buy 2 Bowls, Get 1 Boba FREE", category: "Combos", price: 269, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e", description: "Combo 3" },

  // ADD ONS
  { name: "Extra Chocolate Drizzle", category: "Add Ons", price: 19, image: "https://images.unsplash.com/photo-1511381939415-e44015466834", description: "Add on" },
  { name: "Oreo/KitKat/Biscoff Topping", category: "Add Ons", price: 19, image: "https://images.unsplash.com/photo-1511381939415-e44015466834", description: "Add on" }
];

const wipeAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("Connected to DB...");

    // Wipe all existings
    await MenuItem.deleteMany({});
    console.log("Deleted all old menu items.");
    
    // We shouldn't wipe orders/invoices to keep customer history unless specifically needed, but we'll do Menu only.
    
    // Insert New
    await MenuItem.insertMany(EXACT_MENU_ITEMS);
    console.log(`✅ Seeded ${EXACT_MENU_ITEMS.length} perfect menu card items!`);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  } finally {
    process.exit(0);
  }
};

wipeAndSeed();
