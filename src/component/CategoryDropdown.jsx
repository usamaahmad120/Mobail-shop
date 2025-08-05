import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../product';
import { latestProducts } from '../Latest';

// Combine all products for filtering
const allProducts = [...products, ...latestProducts];

const CategoryDropdown = ({ category, onClose }) => {
  // Filter products by category
  const filteredProducts = allProducts.filter(product => {
    // Check if the product category includes our main category (case insensitive)
    return product.category.toLowerCase().includes(category.toLowerCase()) ||
           (category === 'Electronics' && ['Gadgets', 'Speakers', 'Earphones', 'Audio'].some(cat => 
             product.category.toLowerCase().includes(cat.toLowerCase()))) ||
           (category === 'Fashion' && ['Clothing', 'Menswear', 'Girls Fashion', 'Shoes'].some(cat => 
             product.category.toLowerCase().includes(cat.toLowerCase()))) ||
           (category === 'Accessories' && ['Bags', 'Smart Watch'].some(cat => 
             product.category.toLowerCase().includes(cat.toLowerCase()))) ||
           (category === 'Beauty & Cosmetics' && ['Skincare', 'Cosmetics', 'Beauty'].some(cat => 
             product.category.toLowerCase().includes(cat.toLowerCase()))) ||
           (category === 'Cameras & Photography' && ['Camera', 'DSLR'].some(cat => 
             product.category.toLowerCase().includes(cat.toLowerCase())));
  });

  // Get up to 4 products for display
  const displayProducts = filteredProducts.slice(0, 4);

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg p-4 z-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {displayProducts.length > 0 ? (
          displayProducts.map((product) => (
            <Link 
              to="/products" 
              key={product.id} 
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition duration-300"
              onClick={onClose}
            >
              <div className="w-full h-32 overflow-hidden rounded-lg mb-2">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
              <p className="text-xs text-gray-500">{product.category}</p>
              <p className="text-sm font-bold text-[#5C2EC0] mt-1">{product.price}</p>
            </Link>
          ))
        ) : (
          <div className="col-span-4 text-center py-4 text-gray-500">
            No products found in this category
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <Link 
          to="/products" 
          className="inline-block px-4 py-2 bg-[#5C2EC0] text-white rounded-md hover:bg-[#4a25a3] transition duration-300"
          onClick={onClose}
        >
          View All {category} Products
        </Link>
      </div>
    </div>
  );
};

export default CategoryDropdown;