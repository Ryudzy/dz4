import React, { useState, useEffect } from 'react';
import './App.css';

const API_ROOT = 'http://localhost:8080';

const App = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [currentPage, setCurrentPage] = useState('home');
    const [totalQuantity, setTotalQuantity] = useState(cartCount);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [registrationMode, setRegistrationMode] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [products, setProducts] = useState([]);
    const [token, SetToken] = useState('');


    useEffect(() => {
        fetchProducts();
    }, [isLoggedIn]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(API_ROOT + '/api/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Basic ' + btoa(`${login}:${password}`),
                }
            }
            );
            const data = await response.json();
            setProducts(data);
            console.log(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    const toggleImage = () => {
        setImageIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    };


    const handleMenuClick = (page) => {
        setCurrentPage(page);
    };

    const handleLogin = async () => {
        try {
            const response = await fetch(API_ROOT + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Basic ' + btoa(`${login}:${password}`),
                },
                body: JSON.stringify({ username: login, password }),
            });
            if (response.ok) {
                setIsLoggedIn(true);
                setLoginError('');
            } else {
                setIsLoggedIn(false);
                setLoginError('Неправильный логин или пароль');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setLogin('');
        setPassword('');
        setLoginError('');
    };


    const handleRegistration = async () => {
        if (password === confirmPassword) {
            try {
                const response = await fetch(API_ROOT + '/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: login, password }),
                });


                if (response.ok) {
                    setIsLoggedIn(true);
                    setRegistrationMode(false);
                    setLoginError('');
                } else {
                    setLoginError('Ошибка при регистрации');
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        } else {
            setLoginError('Пароли не совпадают');
        }
    };


    const changeProductQuantity = async (product, increment) => {
        let quantity = product.quantity;
        if (increment) {
            quantity += 1;
        }
        else {
            quantity > 0 ? quantity = product.quantity - 1 : quantity = 0;
        }
        try {
            const response = await fetch(API_ROOT + `/api/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${login}:${password}`),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'quantity': quantity }),
            });


            if (response.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Error incrementing product quantity:', error);
        }
    };


    const renderAuth = () => {
        if (isLoggedIn) {
            return (
                <div className="auth-message">
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            );
        } else {
            return (
                <div className="auth-form">
                    <h2>{registrationMode ? 'Регистрация' : 'Вход'}</h2>
                    {loginError && <div className="auth-error">{loginError}</div>}
                    <input type="text" placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
                    <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {registrationMode && (
                        <input
                            type="password"
                            placeholder="Подтвердите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    )}
                    <button onClick={registrationMode ? handleRegistration : handleLogin}>
                        {registrationMode ? 'Зарегистрироваться' : 'Войти'}
                    </button>
                    <button onClick={() => setRegistrationMode(!registrationMode)}>
                        {registrationMode ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </div>
            );
        }
    };
console.log(products);

    const renderPage = () => {
        if (!isLoggedIn) {
            return renderAuth();
        } else if (currentPage === 'home') {
            return (
                <div className="content">
                    <h1>Мама, я не хочу умирать</h1>
                    <div>
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
                    {
                        products.map((product) => (
                            <div className="product-card" key={product.id}>
                                <img src={product.image} alt={product.name} className="product-image" />
                                <h3>{product.name}</h3>
                                <p>Количество: {product.quantity}</p>
                                <button className="pink-button" onClick={() => changeProductQuantity(product, true)}>+</button>
                                <button className="pink-button" onClick={() => changeProductQuantity(product, false)}>-</button>
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
                        {isLoggedIn && <li onClick={() => handleMenuClick('products')} className="menu-item">Товары</li>}
                    </ul>
                </nav>
                <div className="logout-button">
                    {isLoggedIn && <button onClick={handleLogout}>Выйти</button>}
                </div>
            </header>
            {renderPage()}
        </div>
    );
};


export default App;