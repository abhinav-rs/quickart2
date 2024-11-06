import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './customerpage.css'; // Import the CSS file for styling

function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('Seller').select('*');
      if (error) {
        console.error('Error fetching products:', error.message);
      } else {
        // Filter out products with quantity zero
        const availableProducts = data.filter(product => product.Quantity > 0);
        setProducts(availableProducts);
      }
    };

    const fetchCartItems = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return; // Exit if no user is logged in

      const { data, error } = await supabase
        .from('cart')
        .select('p_name')
        .eq('email', userEmail);

      if (error) {
        console.error('Error fetching cart items:', error.message);
      } else {
        const cartState = data.reduce((acc, item) => {
          acc[item.p_name] = true;
          return acc;
        }, {});
        setCartItems(cartState);
      }
    };

    fetchProducts();
    fetchCartItems();
  }, []);

  // Check if cart was cleared and reset buttons if needed
  useEffect(() => {
    if (localStorage.getItem('cartCleared') === 'true') {
      setCartItems({});
      localStorage.removeItem('cartCleared'); // Reset the flag
    }
  }, []);

  const handleCartToggle = async (product) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('You need to be logged in to add items to the cart.');
      navigate('/login');
      return;
    }

    if (cartItems[product.Product_name]) {
      // Remove from cart
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('email', userEmail)
        .eq('p_name', product.Product_name);

      if (error) {
        console.error('Error removing item from cart:', error.message);
      } else {
        setCartItems((prev) => ({ ...prev, [product.Product_name]: false }));
      }
    } else {
      // Add to cart
      const { error } = await supabase.from('cart').insert([
        {
          email: userEmail, // Store customer's email here
          p_name: product.Product_name,
          s_name: product.Store_name,
          price: product.Price,
          url: product.Img_url, // Copy product image URL to cart
        },
      ]);

      if (error) {
        console.error('Error adding item to cart:', error.message);
      } else {
        setCartItems((prev) => ({ ...prev, [product.Product_name]: true }));
      }
    }
  };

  return (
    <div className="customer-page">
      <div className="cart-button-container">
        <button className="cart-button" onClick={() => navigate('/cart')}> CART
        </button>
      </div>
      <h2>Available Products</h2>
      <div className="product-cards">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.Product_name}</h3>
              <p>Store Name: {product.Store_name}</p>
              <p>Price: ${product.Price.toFixed(2)}</p>
              <p className="description">{product.Description}</p>
              {product.Img_url && (
                <img className="product-image" src={product.Img_url} alt={product.Product_name} />
              )}
              <button
                className={`cart-button ${cartItems[product.Product_name] ? 'added' : ''}`}
                onClick={() => handleCartToggle(product)}
              >
                {cartItems[product.Product_name] ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerPage;
