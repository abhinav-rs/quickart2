import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './SellerLanding.css'; // Import the CSS file for styling

function SellerLanding() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('You need to be logged in to view your products.');
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }

      const { data, error } = await supabase
        .from('Seller')
        .select('*')
        .eq('seller_email', userEmail);

      if (error) {
        console.error('Error fetching products:', error.message);
        alert('Failed to fetch products. Please try again.');
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleDelete = async (productId) => {
    const { error } = await supabase
      .from('Seller')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error.message);
      alert('Failed to delete product. Please try again.');
    } else {
      setProducts(products.filter(product => product.id !== productId));
      alert('Product deleted successfully.');
    }
  };

  return (
    <div className="seller-landing">
      <h2>Your Products</h2>
      <div className="product-cards">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.Product_name}</h3>
              <p>Quantity: {product.Quantity}</p>
              <p>Store Name: {product.Store_name}</p>
              <p>Price: ${product.Price.toFixed(2)}</p>
              <p className="description">{product.Description}</p>
              {product.Img_url && (
                <img className="product-image" src={product.Img_url} alt={product.Product_name} />
              )}
              <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No products found. Add some products!</p>
        )}
      </div>
      <button className="add-product-button" onClick={() => navigate('/ProductAdd')}>
        Add New Product
      </button>
    </div>
  );
}

export default SellerLanding;
