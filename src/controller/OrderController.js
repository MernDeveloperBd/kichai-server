const CartService = require("../service/CartService.js");
const OrderService = require("../service/OrderService.js");

class OrderController{
    async createOrder(req, res, next){
        const {shippingAddress} = req.body;
        const {paymentMethod} = req.body;
        const jwt = req.headers.authorization;
        try {
            const user = await req.user;
            const cart = await CartService.findUserCart(user);
            const orders = await OrderService.createOrder(user, shippingAddress, cart)

            return res.status(200).json(orders)

        } catch (error) {
             return res.status(500).json({message: `error creating order ${error}`})
        }
    }

    // Get order by id
    async getOrderById(req, res, next){
        try {
            const {orderId} = req.params;
            const order = await OrderService.findOrderById(orderId)
            return res.status(200).json(order)
            
        } catch (error) {
              return res.status(401).json({error: error.message})
        }
    }
    // Get order item by id
    async getOrderItemById(req, res, next){
        try {
            const {orderItemId} = req.params;
            const orderItem = await OrderService.findOrderItemById(orderItemId)
            return res.status(200).json(orderItem)
            
        } catch (error) {
              return res.status(401).json({error: error.message})
        }
    }

    // get user order history
    async getUserOrderHistory(req, res){
        try {
            const userId = await req.user._id;
            const orderHistory = await OrderService.usersOrderHistory(userId);
             return res.status(200).json(orderHistory)
        } catch (error) {
             return res.status(401).json({error: error.message})
        }
    }
    // get seller order 
    async getSellerOrders(req, res){
        try {
            const sellerId = await req.seller._id;
            const orders = await OrderService.getSellersOrder(sellerId);
             return res.status(200).json(orders)
        } catch (error) {
             return res.status(401).json({error: error.message})
        }
    }

    //update order status
    async updateOrderStatus (req, res){
        try {
            const {orderId, orderStatus} = req.params;
            const updateOrder = await OrderService.updateOrderStatus(orderId, orderStatus);
            return res.status(200).json(updateOrder)
        } catch (error) {
            return res.status(401).json({error: error.message})
        }
    }
    //cancel order 
    async cancelOrder(req, res){
        try {
            const {orderId} = req.params;
            const userId =  req.user._id;
            const cancelOrder = await OrderService.cancelOrder(orderId, userId);
            return res.status(200).json({
                message: "Order cancel successfully",
                order: cancelOrder
            })
        } catch (error) {
            return res.status(401).json({error: error.message})
        }
    }
    //delete order  no need
  /*   async deleteOrder(req, res){
        try {
            const {orderId} = req.params;
             await OrderService.deleteOrder(orderId);
            return res.status(200).json({
                message: "Order deleted successfully"
            })
        } catch (error) {
            return res.status(401).json({error: error.message})
        }
    } */
}

module.exports = new OrderController()