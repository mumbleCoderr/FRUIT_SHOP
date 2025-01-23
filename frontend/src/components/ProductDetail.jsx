import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserRole } from "../js/Auth";
import "../stylesheets/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fruit, setFruit] = useState(null);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const userRole = getUserRole();

  useEffect(() => {
    const fetchFruit = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/product/noauthority/get/${id}`
        );
        setFruit(response.data);
      } catch (err) {
        navigate("/NotFound");
      }
    };

    fetchFruit();
  }, [id, navigate]);

  const togglePhotoVisibility = () => {
    setShowPhoto(!showPhoto);
  };

  const handleReturnToShop = () => {
    navigate("/");
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    setQuantity(value);
    setError("");
  };

  const handleAddToCart = (event) => {
    event.preventDefault();

    if (!userRole) {
      navigate("/LogIn");
      return;
    }

    const quantityNumber = parseInt(quantity, 10);

    if (!quantity || isNaN(quantityNumber) || quantityNumber <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (quantityNumber > fruit.quantity) {
      setError(`You cannot add more than ${fruit.quantity} items to the cart.`);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    addToCart(fruit, quantityNumber);
    alert("Product added to cart!");
    setIsFormVisible(false);
    setQuantity("");
    setError("");
  };

  const addToCart = (product, quantity) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    const productKey = JSON.stringify(product);

    if (cart[productKey]) {
      cart[productKey] += quantity;
    } else {
      cart[productKey] = quantity;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleRemoveProduct = async () => {
    const jwtToken = localStorage.getItem("jwtToken");

    try {
      await axios.delete(`http://localhost:8080/product/admin/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      alert("Product removed successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error response:", err.response); // Dodaj to
      alert("Failed to remove the product. Please try again.");
    }
  };

  if (!fruit) {
    return null;
  }

  return (
    <div className="container">
      <div className="product-detail">
        <div className="left">
          <h1 className="fruit-name-value">{fruit.name}</h1>
          <p className="product-detail-value">Price: {fruit.price} zł</p>
          <p className="product-detail-value">Quantity: {fruit.quantity}</p>
        </div>
        <div className="right-top">
          <button className="details-btn" onClick={togglePhotoVisibility}>
            {showPhoto ? "Hide photo" : "Show photo"}
          </button>
        </div>
        <div className="right-bottom">
          <button className="details-btn" onClick={handleReturnToShop}>
            Return
          </button>
        </div>
      </div>
      <div className="container-bottom">
        <div
          className={`cart-div ${isFormVisible ? "form-visible" : ""} ${
            shake ? "shake" : ""
          }`}
          onClick={() => setIsFormVisible(true)}
        >
          {userRole === "ROLE_ADMIN" ? (
            <div className="cart-div" onClick={handleRemoveProduct}>
              <p className="cart-text">REMOVE PRODUCT</p>
            </div>
          ) : !isFormVisible ? (
            <p className="cart-text">ADD PRODUCT TO CART</p>
          ) : (
            <form onSubmit={handleAddToCart}>
              <div
                className={`cart-div-left ${error ? "input-div-error" : ""}`}
              >
                <input
                  className="quantity-input"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  placeholder="Enter quantity"
                />
                {error && <p className="error-message">{error}</p>}
              </div>
              <div className="cart-div-right">
                <button
                  type="submit"
                  className={error ? "btn-error" : "cart-div-btn"}
                >
                  <p className={error ? "cart-text-error" : "cart-text"}>ADD</p>
                </button>
              </div>
            </form>
          )}
        </div>
        <div className={`photo-div ${error ? "with-error" : ""}`}>
          {showPhoto && (
            <img src={fruit.img} alt={fruit.name} className="product-image" />
          )}
        </div>
        <div className="blank-div"></div>
      </div>
    </div>
  );
};

export default ProductDetail;
