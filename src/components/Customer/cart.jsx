import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // Import supabase client
import './cart.css'; // Import the CSS file for styling
import { jsPDF } from 'jspdf';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      const userEmail = localStorage.getItem('userEmail');

      // Fetch cart items
      const { data: cartData, error: cartError } = await supabase
        .from('cart')
        .select('*')
        .eq('email', userEmail);

      if (cartError) {
        console.error('Error fetching cart items:', cartError.message);
      } else {
        setCartItems(cartData);
        // Calculate total price
        const total = cartData.reduce((sum, item) => sum + item.price, 0);
        setTotalPrice(total);
      }

      // Fetch customer details
      const { data: customerData, error: customerError } = await supabase
        .from('customer')
        .select('c_name, c_address')
        .eq('email', userEmail)
        .single();

      if (customerError) {
        console.error('Error fetching customer details:', customerError.message);
      } else {
        setCustomer(customerData);
      }
    };

    fetchCartItems();
  }, []);

  // Function to generate a PDF receipt
  const generateReceipt = () => {
    const doc = new jsPDF();

    // Generate unique order ID
    const orderId = Math.floor(10000000 + Math.random() * 90000000);
    const orderDate = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(14);
    doc.text("Tax Invoice", 105, 20, { align: "center" });

    // Seller Info
    doc.setFontSize(10);
    doc.text("Sold By: Quickkart Private Limited", 14, 30);
    doc.text("Ship-from Address: MEC Men's Hostel, karimakad Road, Thrikkakara (po), Ernakulam", 14, 35);
    doc.text("Pincode: 682021", 14, 40);
    doc.text("GSTIN - 29AACCF0683K1ZD", 14, 45);

    // Invoice Number and QR Code placeholder
   
    doc.text(`Invoice Number # ${orderId}`, 152, 35);

    // Order Info
    doc.setFontSize(10);
    doc.setFont("bold");
    doc.text("Order ID:", 14, 60);
    doc.text("Order Date:", 14, 65);
    doc.setFont("normal");
    doc.text(String(orderId), 35, 60); // Order ID
    doc.text(orderDate, 35, 65); // Order Date

    // Billing Address
    doc.setFont("bold");
    doc.text("Billing Address", 105, 60);
    doc.setFont("normal");
    doc.text(customer?.c_name || "Customer Name", 105, 65);
    doc.text(customer?.c_address || "Customer Address", 105, 70);

    // Table Headers
    doc.setFont("bold");
    doc.text("Description", 14, 90);
    doc.text("Qty", 90, 90);
    doc.text("Gross Amount ₹", 110, 90);
    doc.text("Discount", 150, 90);
    doc.text("Total ₹", 180, 90);

    // Table Data
    doc.setFont("normal");
    let yPosition = 100;
    cartItems.forEach((item) => {
      doc.text(item.p_name, 14, yPosition + 5); // Product name
      doc.text("1", 90, yPosition + 5); // Quantity
      doc.text(item.price.toFixed(2), 110, yPosition + 5); // Price
      doc.text("0.00", 150, yPosition + 5); // Discount
      doc.text(item.price.toFixed(2), 180, yPosition + 5); // Total for item
      yPosition += 15;
    });

    // Table Footer
    doc.setFont("bold");
    doc.text("Total", 14, yPosition);
    doc.text(cartItems.length.toString(), 90, yPosition); // Total quantity
    doc.text(totalPrice.toFixed(2), 110, yPosition); // Total price
    doc.text("0.00", 150, yPosition);
    doc.text(totalPrice.toFixed(2), 180, yPosition);

    // Grand Total Section
    doc.setFontSize(12);
    yPosition += 20;
    doc.text("Grand Total", 14, yPosition);
    doc.setFont("bold");
    doc.text(`₹ ${totalPrice.toFixed(2)}`, 180, yPosition);

    // Footer and Page Info
    yPosition += 20;
    doc.setFontSize(10);
    doc.setFont("italic");
    doc.text("Quickkart Private Limited", 14, yPosition);
    doc.text("Authorized Signatory", 180, yPosition, { align: "right" });

    // Footer line
    doc.setLineWidth(0.2);
    doc.line(10, yPosition + 10, 200, yPosition + 10);
    doc.text("page 1 of 1", 105, yPosition + 20, { align: "center" });

    // Save the PDF
    doc.save("reciept.pdf");
  };

  return (
    <div className="cart-container">
      <h1>CART</h1>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-strip" key={item.id}>
                <img src={item.url} alt={item.p_name} className="cart-image" />
                <span className="cart-item-name">{item.p_name}</span>
                <span className="cart-store-name">{item.s_nam}</span>
                <span className="cart-item-price">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="total-strip">
            <strong>Total:</strong> ${totalPrice.toFixed(2)}
          </div>
          <div className="order-now-container">
            <button className="order-now-button" onClick={generateReceipt}>Order Now</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
