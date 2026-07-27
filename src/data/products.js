import productData from './products.json'

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — replace image filenames with your actual files in public/images/
// ─────────────────────────────────────────────────────────────────────────────

export const navCategories = [
  'All category', 'Hot offers', 'Gift boxes', 'Projects', 'Menu item', 'Help',
]

export const heroCategories = [
  'Automobiles',
  'Clothes and wear',
  'Home interiors',
  'Computer and tech',
  'Tools, equipments',
  'Sports and outdoor',
  'Animal and pets',
  'Machinery tools',
  'More category',
]

export const sidebarCategories = [
  { name: 'Mobile accessory', count: 12911 },
  { name: 'Electronics', count: 8453 },
  { name: 'Smartphones', count: 4219 },
  { name: 'Modern tech', count: 3100 },
]

export const brands = ['Samsung', 'Apple', 'Huawei', 'Pocco', 'Lenovo']
export const features = ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory']
export const conditions = ['Any', 'Refurbished', 'Brand new', 'Old items']
export const ratingFilters = [5, 4, 3, 2]

export const products = productData.map((product, index) => ({
  ...product,
  originalPrice: product.originalPrice ?? product.price * 1.2,
  orders: product.orders ?? 120 + index,
  freeShipping: true,
  seller: product.seller ?? 'ShopHub',
  rating: product.rating ?? 4.5,
  specs: product.specs ?? {
    Category: product.category,
    Material: 'Premium material',
  },
  features: product.features ?? ['Premium quality', 'Great value', 'Fast delivery'],
}))

// ─── Home Page Data ──────────────────────────────────────────────────────────

export const dealProducts = [
  { id: 1, name: 'Smart watches', image: 'smartwatch.jpg', discount: 25, category: 'Men blazers' },
  { id: 2, name: 'Laptops',       image: 'laptop.jpg',     discount: 15, category: 'Laptops' },
  { id: 3, name: 'GoPro cameras', image: 'camera.jpg',     discount: 40, category: 'Cameras' },
  { id: 4, name: 'Headphones',    image: 'headphones.jpg', discount: 25, category: 'Headphones' },
  { id: 5, name: 'Canon cameras', image: 'phone1.jpg',     discount: 25, category: 'Canon cameras' },
]

export const homeOutdoorCategories = [
  { name: 'Soft chairs',    price: 19, image: 'chair1.jpg' },
  { name: 'Sofa & chair',   price: 19, image: 'sofa.jpg' },
  { name: 'Kitchen dishes', price: 19, image: 'dishes.jpg' },
  { name: 'Smart watches',  price: 19, image: 'smartwatch.jpg' },
  { name: 'Kitchen mixer',  price: 100, image: 'mixer.jpg' },
  { name: 'Blenders',       price: 39, image: 'blender.jpg' },
  { name: 'Home appliance', price: 19, image: 'appliance.jpg' },
  { name: 'Coffee maker',   price: 10, image: 'coffee.jpg' },
]

export const electronicsCategories = [
  { name: 'Smart watches', price: 19,  image: 'smartwatch.jpg' },
  { name: 'Cameras',       price: 89,  image: 'camera.jpg' },
  { name: 'Headphones',    price: 70,  image: 'headphones.jpg' },
  { name: 'Smart watches', price: 90,  image: 'smartwatch.jpg' },
  { name: 'Gaming set',    price: 35,  image: 'headphones.jpg' },
  { name: 'Laptops & PC',  price: 340, image: 'laptop.jpg' },
  { name: 'Smartphones',   price: 19,  image: 'phone2.jpg' },
  { name: 'Electric kettle', price: 240, image: 'kettle.jpg' },
]

export const suppliersRegion = [
  { country: "United Arab Emirates", domain: "shopname.ae", code: "AE" },
  { country: "Australia", domain: "shopname.au", code: "AU" },
  { country: "United States", domain: "shopname.us", code: "US" },
  { country: "Russia", domain: "shopname.ru", code: "RU" },
  { country: "Italy", domain: "shopname.it", code: "IT" },
  { country: "Denmark", domain: "shopname.dk", code: "DK" },
  { country: "France", domain: "shopname.fr", code: "FR" },
  { country: "China", domain: "shopname.cn", code: "CN" },
  { country: "Great Britain", domain: "shopname.co.uk", code: "GB" },
];

export const recommendedProducts = [
  { id: 1,  name: 'T-shirts with multiple colors, for men', price: 10.30, image: 'tshirt.jpg' },
  { id: 2,  name: 'Jeans shorts for men blue color',        price: 10.30, image: 'backpack.jpg' },
  { id: 3,  name: 'Brown winter coat medium size',          price: 12.50, image: 'jacket.jpg' },
  { id: 4,  name: 'Jeans bag for travel for men',           price: 34.00, image: 'backpack.jpg' },
  { id: 5,  name: 'Leather wallet',                         price: 99.00, image: 'wallet.jpg' },
  { id: 6,  name: 'Canon camera black 100x zoom',           price: 9.99,  image: 'camera.jpg' },
  { id: 7,  name: 'Headset for gaming with mic',            price: 8.99,  image: 'headphones.jpg' },
  { id: 8,  name: 'Smartwatch silver color modern',         price: 10.30, image: 'smartwatch.jpg' },
  { id: 9,  name: 'Blue wallet for men leather material',   price: 10.30, image: 'wallet.jpg' },
  { id: 10, name: 'Jeans bag for travel for men',           price: 80.95, image: 'kettle.jpg' },
]
