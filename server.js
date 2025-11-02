require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')
const port = process.env.PORT

const server = http.createServer(app)

const dbConnect = require('./utils/db')
dbConnect()

 /* app.use(cors({
    origin:process.env.mode === 'pro' ? [process.env.CLIENT_URL, process.env.CLIENT_ADMIN_URL]:['http://localhost:5173','http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); */
 app.use(cors({
    origin:['http://localhost:5173','http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json())
// cors এবং bodyParser এর আগে/পরে যেকোনো সুবিধাজনক স্থানে
app.set('trust proxy', true);


const adminRoutes = require('./src/Routers/AdminRoutes.js')
const sellerRoutes = require('./src/Routers/SellerRoutes.js')
const authRoutes = require('./src/Routers/AuthRoutes.js')
const userRoutes = require('./src/Routers/UserRoutes.js')
const productRoutes = require('./src/Routers/ProductRoutes.js')
const sellerProductsRoutes = require('./src/Routers/SellerProductsRoutes.js')
const cartRoutes = require('./src/Routers/CartRoutes.js')
const orderRoutes = require('./src/Routers/OrderRoutes.js')
const sellerOrderRoutes = require('./src/Routers/SellerOrderRoutes.js')

app.use('/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/sellers', sellerRoutes)

app.use('/products', productRoutes)
app.use('/api/sellers/products', sellerProductsRoutes)

app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/seller/orders', sellerOrderRoutes)


app.use('/admin', adminRoutes)

app.get('/', (req, res) =>
     res.send('Welcome to  Kichai.com !')
)
server.listen(port, () =>
     console.log(`Kichai.com server is on port ${port}!`)
)