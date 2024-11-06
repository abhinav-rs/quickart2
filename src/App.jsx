
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Landing/Home'; 
import Signup from './components/Auth/Signup';
import Login from './components/Auth/login'
import SellerLanding from './components/Seller/Sellerlanding';
import ProductAdd from './components/Seller/ProductAdd';
import Customerpage from './components/Customer/customerpage';
import Cart from './components/Customer/cart';
// Adjusted file path if needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/SellerLanding" element={<SellerLanding />} />
        <Route path="/ProductAdd" element={<ProductAdd />} />
        <Route path="/Customer" element={<Customerpage />} />
        <Route path="/cart" element={<Cart />} /> 

        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  );
};

export default App;
