import React, { useState, useEffect } from "react";

function Cart() {
  const [cart, setCart] = useState([]);
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [locationLink, setLocationLink] = useState("");

  const vendorNumber = "916303343274"; // Replace with actual vendor number with country code

  // Get user's current location automatically on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setLocationLink(mapsLink);
      },
      (error) => {
        console.error("Error getting location", error);
        alert("Unable to fetch location. Please allow location access.");
      }
    );
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const generateWhatsAppMessage = () => {
    const itemList = cart.map((item, idx) => `${idx + 1}. ${item}`).join("\n");
    return `Hello Vendor,\n\nUser: ${username}\nMobile: ${mobile}\nLocation: ${locationLink}\n\nItems:\n${itemList}`;
  };

  const sendToWhatsApp = () => {
    if (!username || !mobile || cart.length === 0 || !locationLink) {
      alert("Please fill in all fields and allow location access.");
      return;
    }
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${vendorNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="container">
      <h2>Online Shop</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Enter mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => addToCart("Pizza")}>Add Pizza</button>
        <button onClick={() => addToCart("Burger")}>Add Burger</button>
        <button onClick={() => addToCart("Soda")}>Add Soda</button>
      </div>

      <div>
        <h3>Cart Items</h3>
        <ul>
          {cart.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <button onClick={sendToWhatsApp}>Buy & Send to WhatsApp</button>
    </div>
  );
}

export default Cart;
