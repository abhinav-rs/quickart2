import { useNavigate } from 'react-router-dom';
import '../Landing/Home.css'; // Ensure this path is correct
import backgroundImage from '../../assets/bg_rect.png';

const Home = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/Login');
  };

  return (
    <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {/* Removed the transparent box and its paragraph content */}
      <div className="cart-button-container" style={{ marginBottom: '8.5%' }}>
        <button className="cart-button" onClick={handleSignInClick}>
          Sign In / Login
        </button>
      </div>
    </div>
  );
};

export default Home;
