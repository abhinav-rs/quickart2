import { useState } from "react";
import { supabase } from "../../supabaseClient";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import './Signup.css';

function Signup() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const [address, setAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const userDetails = {
        Name: name,
        Number: phoneNumber,
        email,
        password: hashedPassword,
        Type: userType,
        Address: address,
      };

      if (userType === "seller") {
        userDetails.Store_name = storeName;
      }

      // Insert data into Auth table
      const { data: authData, error: insertError } = await supabase
        .from("Auth")
        .insert([userDetails]);

      if (insertError) {
        console.error("Insert error:", insertError.message);
        setError(insertError.message);
        setLoading(false);
      } else {
        console.log("User details inserted into Auth table:", authData);

        // If the user is a customer, insert data into the customer table
        if (userType === "customer") {
          const customerDetails = {
            Email: email,
            c_name: name,
            c_number: phoneNumber,
            c_address: address,
          };

          const { error: customerInsertError } = await supabase
            .from("customer")
            .insert([customerDetails]);

          if (customerInsertError) {
            console.error("Error inserting into customer table:", customerInsertError.message);
            setError("Failed to complete signup. Please try again.");
            setLoading(false);
            return;
          } else {
            console.log("Customer details inserted into customer table.");
          }
        }

        // Redirect to login page after successful signup
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-center">
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form className="signup-form" onSubmit={handleSignup}>
          {error && <p className="error-message">{error}</p>}

          <label htmlFor="name">Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter Password (at least 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>User Type</label>
          <select
            value={userType}
            onChange={(e) => {
              setUserType(e.target.value);
              if (e.target.value === "customer") {
                setStoreName("");
              }
            }}
          >
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>

          {userType === "customer" && (
            <>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </>
          )}

          {userType === "seller" && (
            <>
              <label htmlFor="storeName">Store Name</label>
              <input
                type="text"
                placeholder="Enter Store Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />

              <label htmlFor="address">Address</label>
              <input
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
 