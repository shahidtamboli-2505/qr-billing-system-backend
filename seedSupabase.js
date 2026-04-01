import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MENU_ITEMS = [
    // 🍰 DESSERTS
    { name: "Teddy Bear Mousse", category: "Desserts", price: 119, image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587", description: "Rich and creamy Teddy Bear Mousse" },
    { name: "Angel Baby Bowl", category: "Desserts", price: 99, image_url: "https://images.unsplash.com/photo-1551024601-bec78aea704b", description: "Signature sweet dessert bowl" },

    // 🍫 CHOCOLATE BOWLS
    { name: "Chocolate Overload Bowl", category: "Chocolate Bowls", price: 99, image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb", description: "Signature chocolate bowl" },
    { name: "Midnight Cocoa Bowl", category: "Chocolate Bowls", price: 99, image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c", description: "Dark cocoa chocolate bowl" },
    { name: "Milk Chocolate Bowl", category: "Chocolate Bowls", price: 99, image_url: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3", description: "Creamy milk chocolate bowl" },
    { name: "White Chocolate Bowl", category: "Chocolate Bowls", price: 99, image_url: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7", description: "Sweet white chocolate bowl" },
    { name: "Oreo Chocolate Bowl", category: "Chocolate Bowls", price: 119, image_url: "https://images.unsplash.com/photo-1586985289906-406988974504", description: "Chocolate bowl with Oreo crunch" },
    { name: "KitKat Chocolate Bowl", category: "Chocolate Bowls", price: 119, image_url: "https://images.unsplash.com/photo-1511381939415-e44015466834", description: "Chocolate bowl with crispy KitKat" },
    { name: "Lotus Caramel Bliss Bowl", category: "Chocolate Bowls", price: 129, image_url: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05", description: "Lotus Biscoff and caramel bliss" },
    { name: "Nutella Chocolate Bowl", category: "Chocolate Bowls", price: 129, image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777", description: "Rich Nutella loaded bowl" },

    // 🧇 WAFFLES
    { name: "Chocolate Overload Waffle", category: "Waffles", price: 249, image_url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Chocolate Overload Waffle" },
    { name: "Midnight Cocoa Waffle", category: "Waffles", price: 249, image_url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Midnight Cocoa Waffle" },
    { name: "White Chocolate Waffle", category: "Waffles", price: 249, image_url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "White Chocolate Waffle" },
    { name: "KitKat Waffle", category: "Waffles", price: 249, image_url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "KitKat Waffle" },
    { name: "Cookies & Cream Waffle", category: "Waffles", price: 249, image_url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Cookies & Cream Waffle" },
    { name: "Lotus Caramel Bliss Waffle", category: "Waffles", price: 249, image_url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Lotus Caramel Bliss Waffle" },
    { name: "Nutella Waffle", category: "Waffles", price: 249, image_url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d", description: "Nutella Waffle" },

    // 🍰 CAKE
    { name: "Chocolate Overload Cake", category: "Cake", price: 99, image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Chocolate Overload Cake" },
    { name: "Midnight Cocoa Cake", category: "Cake", price: 79, image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Midnight Cocoa Cake" },
    { name: "White Chocolate Cake", category: "Cake", price: 79, image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "White Chocolate Cake" },
    { name: "KitKat Cake", category: "Cake", price: 109, image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "KitKat Cake" },
    { name: "Cookies & Cream Cake", category: "Cake", price: 109, image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Cookies & Cream Cake" },
    { name: "Lotus Caramel Bliss Cake", category: "Cake", price: 109, image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Lotus Caramel Bliss Cake" },
    { name: "Nutella Cake", category: "Cake", price: 109, image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Nutella Cake" },

    // 🍬 CANDY
    { name: "Chocolate Overload Candy", category: "Candy", price: 49, image_url: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Chocolate Overload Candy" },
    { name: "Midnight Cocoa Candy", category: "Candy", price: 49, image_url: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Midnight Cocoa Candy" },
    { name: "White Chocolate Candy", category: "Candy", price: 49, image_url: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "White Chocolate Candy" },
    { name: "KitKat Candy", category: "Candy", price: 49, image_url: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "KitKat Candy" },
    { name: "Cookies & Cream Candy", category: "Candy", price: 49, image_url: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Cookies & Cream Candy" },
    { name: "Lotus Caramel Bliss Candy", category: "Candy", price: 49, image_url: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Lotus Caramel Bliss Candy" },
    { name: "Nutella Candy", category: "Candy", price: 49, image_url: "https://images.unsplash.com/photo-1579888944880-d9cfbf51d0ab", description: "Nutella Candy" },

    // ➕ ADD-ONS
    { name: "Extra Chocolate Drizzle", category: "Add Ons", price: 19, image_url: "https://images.unsplash.com/photo-1511381939415-e44015466834", description: "Extra Chocolate Drizzle" },
    { name: "Oreo / KitKat / Biscoff Topping", category: "Add Ons", price: 19, image_url: "https://images.unsplash.com/photo-1511381939415-e44015466834", description: "Oreo / KitKat / Biscoff Topping" },

    // ☕ COFFEE
    { name: "Belgian Classic Brew", category: "Coffee", price: 49, image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735", description: "Belgian Classic Brew" },
    { name: "Belgian Signature Brew", category: "Coffee", price: 79, image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735", description: "Belgian Signature Brew" },

    // 🧋 BOBA TEA
    { name: "Chocolate Boba Tea", category: "Boba Tea", price: 89, image_url: "https://images.unsplash.com/photo-1558857563-b371033873b8", description: "Chocolate Boba Tea" },
    { name: "Coffee Boba Tea", category: "Boba Tea", price: 89, image_url: "https://images.unsplash.com/photo-1558857563-b371033873b8", description: "Coffee Boba Tea" },

    // 🎁 COMBOS
    { name: "Waffle with Cold Coffee", category: "Combos", price: 99, image_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e", description: "Waffle with Cold Coffee" },
    { name: "Buy 2 Waffles, Get 1 Coffee FREE", category: "Combos", price: 89, image_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e", description: "Buy 2 Waffles, Get 1 Coffee FREE" },
    { name: "Buy 2 Bowls, Get 1 Boba FREE", category: "Combos", price: 269, image_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e", description: "Buy 2 Bowls, Get 1 Boba FREE" },

    // 🍦 CONE CAKE
    { name: "Triple Chocolate Cone", category: "Cone Cake", price: 79, image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Triple Chocolate Cone" },
    { name: "White Chocolate Cone", category: "Cone Cake", price: 79, image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "White Chocolate Cone" },
    { name: "Dark Chocolate Cone", category: "Cone Cake", price: 79, image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51", description: "Dark Chocolate Cone" }
];

const seedDB = async () => {
    try {
        console.log("Seeding Supabase Database...");

        console.log("🧹 Clearing old menu items to sync exactly with the real menu...");
        const { error: wipeError } = await supabase.from('menu_items').delete().not('id', 'is', null);

        if (wipeError) {
            console.error("⚠️ Failed to clear old items. You likely have test orders preventing deletion.");
            console.error("Please go to Supabase Dashboard -> Table Editor -> 'order_items' and delete all rows, then run this script again.");
            console.error(wipeError.message);
            process.exit(1);
        }

        const { error: insertError } = await supabase.from('menu_items').insert(MENU_ITEMS);

        if (insertError) throw insertError;

        console.log(`✅ Successfully wiped old database and seeded ${MENU_ITEMS.length} EXACT real menu items!`);
    } catch (error) {
        console.error("❌ Seed Error:", error);
    } finally {
        process.exit(0);
    }
};

seedDB();