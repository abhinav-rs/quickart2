import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../Seller/ProductAdd.css'; // CSS file for styling

function ProductAdd() {
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [storeName, setStoreName] = useState('');
  const [productPrice, setProductPrice] = useState(''); // New state for price
  const [productDescription, setProductDescription] = useState(''); // New state for description
  const [productImage, setProductImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // State to hold the image URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('You need to be logged in to add a product.');
      return;
    }

    let uploadedImageUrl = '';
    if (productImage) {
      try {
        const sanitizedFileName = productImage.name.replace(/\s+/g, '_'); // Sanitize file name
        const filePath = `public/${sanitizedFileName}`;

        // Attempt to upload the image
        const { data: imageData, error: imageError } = await supabase
          .storage
          .from('Product_photos')
          .upload(filePath, productImage, {
            cacheControl: '3600',
            upsert: false,
          });

        // Check for errors in image upload
        if (imageError) throw new Error(imageError.message);

        // Get the public URL of the uploaded image
        const { data: publicURLData, error: urlError } = supabase
          .storage
          .from('Product_photos')
          .getPublicUrl(filePath);
        
        if (urlError) throw new Error(urlError.message);

        uploadedImageUrl = publicURLData.publicUrl; // Set the image URL for the product
        setImageUrl(uploadedImageUrl); // Set state to display the image
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload product image. Please try again.');
        return; // Exit if the image upload fails
      }
    }

    // Prepare the new product data
    const newProduct = {
      Product_name: productName,
      Quantity: productQuantity,
      Store_name: storeName,
      Price: productPrice, // Added price
      Description: productDescription, // Added description
      seller_email: userEmail,
      Img_url: uploadedImageUrl, // Set to null if no image URL is available
    };

    console.log('New Product Data:', newProduct); // Log product data

    try {
      const { error } = await supabase.from('Seller').insert([newProduct]);
      if (error) {
        console.error('Error adding product to Seller table:', error.message);
        alert(`Failed to add product: ${error.message}`);
      } else {
        // Redirect to seller landing page on success
        navigate('/Sellerlanding');
      }
    } catch (error) {
      console.error('Error during product addition:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      // Reset form fields
      setProductName('');
      setProductQuantity('');
      setStoreName('');
      setProductPrice(''); // Reset price
      setProductDescription(''); // Reset description
      setProductImage(null);
      setImageUrl(''); // Reset image URL state
    }
  };

  return (
    <div className="product-add">
      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit} className="product-add-form">
        {/* Product Name */}
        <div className="form-group">
          <label>Name of the Product</label>
          <input
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        {/* Product Quantity */}
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            required
          />
        </div>

        {/* Store Name */}
        <div className="form-group">
          <label>Store Name</label>
          <input
            type="text"
            placeholder="Enter store name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>

        {/* Product Price */}
        <div className="form-group">
          <label>Price</label>
          <input
            type="text"
            placeholder="Enter product price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </div>

        {/* Product Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
            rows="4" // Multi-line input
          />
        </div>

        {/* Product Image */}
        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setProductImage(e.target.files[0]);
              setImageUrl(''); // Reset image URL when a new file is selected
            }}
          />
        </div>

        {/* Display the uploaded image */}
        {imageUrl && (
          <div className="image-preview">
            <h3>Uploaded Image:</h3>
            <img src={imageUrl} alt="Uploaded Product" />
          </div>
        )}

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default ProductAdd;
