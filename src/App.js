import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [currentPage, setCurrentPage] = useState('home');
  const [totalQuantity, setTotalQuantity] = useState(cartCount);

  const toggleImage = () => {
    setImageIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
  };

  const incrementCartCount = () => {
    setCartCount((prevCount) => prevCount + 1);
    setTotalQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementCartCount = () => {
    if (cartCount > 0) {
      setCartCount((prevCount) => prevCount - 1);
      setTotalQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleMenuClick = (page) => {
    setCurrentPage(page);
  };
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Хинкалич',
      quantity: 0,
      image: '/images/hinkal.jpg',
    },
    {
      id: 2,
      name: 'Печенич',
      quantity: 0,
      image: '/images/pechen.jpg',
    },
    {
      id: 3,
      name: 'Огузок',
      quantity: 0,
      image: '/images/oguzok.png',
    },
  ]);
  
  const incrementProductQuantity = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
    setTotalQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementProductQuantity = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && product.quantity > 0
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
    setTotalQuantity((prevQuantity) => prevQuantity - 1);
  };

  const renderPage = () => {
    if (currentPage === 'home') {
      return (
        <div className="content">
          <h1>Мама, я не хочу умирать</h1>
          <div className="image-container" onClick={toggleImage}>
            <img
              src={imageIndex === 0 ? process.env.PUBLIC_URL + '/images/image1.jpg' : process.env.PUBLIC_URL + '/images/image2.jpg'}
              alt="Main Image"
            />
          </div>
          <h2>Мама, я не хочу умирать</h2>
        </div>
      );
    } else if (currentPage === 'products') {
      return (
        <div className="products">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} className="product-image"/>
              <h3>{product.name}</h3>
              <p>Количество: {product.quantity}</p>
              <button className="pink-button" onClick={() => incrementProductQuantity(product.id)}>+</button>
              <button className="pink-button" onClick={() => decrementProductQuantity(product.id)}>-</button>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="App">
      <header>
        <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="Logo" className="logo-image" />
        <nav>
          <ul>
            <li onClick={() => handleMenuClick('home')} className="menu-item">Главная</li>
            <li onClick={() => handleMenuClick('products')}className="menu-item">Товары</li>
          </ul>
        </nav>
        <div className="cart">
          <img src={process.env.PUBLIC_URL + '/images/cart icon.png'} alt="Cart Icon" />
          <span className="cart-count">{totalQuantity}</span> { }
        </div>
      </header>
      {renderPage()}
    </div>
  );
};

export default App;
