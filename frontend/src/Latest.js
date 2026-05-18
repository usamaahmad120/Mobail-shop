import latest1 from "./assets/latest-product/latest1.webp";
import latest8 from "./assets/latest-product/latest8.webp";
import latest9 from "./assets/latest-product/latest9.webp";
import latest10 from "./assets/latest-product/latest10.webp";
import smartwatch from "./assets/smart-watch1.jpeg";
import laptop from "./assets/laptop.jpg";
import dslr from "./assets/dslr.jpg";
import mouse from "./assets/mouse.jpg";

export const latestProducts = [
  {
    id: "latest_001",
    name: "Wireless Headphones",
    price: "Rs 18999",
    category: "Smartphones",
    img: latest1,
    maxStock: 10,
  },
  {
    id: "latest_002",
    name: "Gaming Laptop Cooling Stand",
    price: "Rs 12999",
    category: "Gaming Laptops",
    img: laptop,
    maxStock: 15,
  },
  {
    id: "latest_003",
    name: "Tablet Creative Kit",
    price: "Rs 45999",
    category: "Tablets",
    img: latest8,
    maxStock: 20,
  },
  {
    id: "latest_004",
    name: "Smartwatch",
    price: "Rs 52999",
    category: "Smartphones",
    img: smartwatch,
    maxStock: 8,
  },
  {
    id: "latest_005",
    name: "Creator Camera",
    price: "Rs 145999",
    category: "Smartphones",
    img: dslr,
    maxStock: 5,
  },
  {
    id: "latest_006",
    name: "Bluetooth Audio Hub",
    price: "Rs 24999",
    category: "Tablets",
    img: latest10,
    maxStock: 12,
  },
  {
    id: "latest_007",
    name: "USB-C Laptop Dock",
    price: "Rs 34999",
    category: "Laptops",
    img: latest9,
    maxStock: 18,
  },
  {
    id: "latest_008",
    name: "Wireless Laptop Mouse",
    price: "Rs 8999",
    category: "Laptops",
    img: mouse,
    maxStock: 22,
  },
];

export default latestProducts;
