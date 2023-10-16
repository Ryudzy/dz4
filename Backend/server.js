const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.sendStatus(401);
        return;
    }
    const authData = authHeader.split(' ')[1];
    const [username, password] = Buffer.from(authData, 'base64').toString().split(':');
    const isValidUser = validateUser(username, password);
    if (!isValidUser) {
        res.sendStatus(401);
        return;
    }
    next();
};

const users = [
    {
        username: 'user',
        password: 'password',
    },
];
const products = [
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
    ];

app.use(cors());

app.use(express.json());

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.sendStatus(201);
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const isValidUser = validateUser(username, password);
    if (isValidUser) {
        token = Buffer.from(username + ':' + password).toString('base64')
        res.json({'token': token});
    } else {
        res.sendStatus(401);
    }
});

app.get('/api/products', authMiddleware, (req, res) => {
    res.json(products);
});

app.put('/api/products/:productId', authMiddleware, (req, res) => {
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;
    
    console.log(productId)
    const updatedProduct = products.find((product) => product.id === productId);
    if (updatedProduct) {
        updatedProduct.quantity = quantity;
        res.json(updatedProduct);
    } else {
        res.sendStatus(404);
    }
});

function validateUser(username, password) {
    const user = users.find((user) => user.username === username && user.password === password);
    return !!user;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
