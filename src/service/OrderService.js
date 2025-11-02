const { default: mongoose } = require("mongoose")
const AddressModal = require("../model/address/AddressModel.js")
const Order = require("../model/Order.js")
const OrderItem = require("../model/OrderItem.js")
const UserModal = require("../model/user/UserModel.js")
const OrderStatus = require("../Domain/OrderStatus.js")

class OrderService{
    async createOrder(user, shippingAddress, cart){
        if(shippingAddress._id && !user.address.includes(shippingAddress._id)){
            user.address.push(shippingAddress._id)
            await UserModal.findByIdAndUpdate(user._id, user)
        }

        if(!shippingAddress._id){
            shippingAddress = await AddressModal.create(shippingAddress)
        }

       
        const itemsBySeller = cart.cartItems.reduce((acc, item) =>{
            const sellerId = item.product.seller._id.toString();
            acc[sellerId] = acc[sellerId] || [];
            acc[sellerId].push(item)
            return acc;
        }, {});

        const orders = new Set();
        for(const[sellerId, cartItems] of Object.entries(itemsBySeller)){
            const totalOrderPrice = cartItems.reduce((sum, item)=>sum + item.sellingPrice, 0)
            const totalItem = cartItems.length;

            const newOrder = new Order({
                user: user._id,
                seller: sellerId,
                shippingAddress: shippingAddress._id,
                orderItems: [],
                totalMrpPrice: totalOrderPrice,
                totalSellingPrice: totalOrderPrice,
                totalItems: totalItem,
            })
            const orderItems = await Promise.all(
                cartItems.map(async (cartItem) =>{
                    const orderItem = new OrderItem({
                        product: cartItem.product._id,
                        quantity: cartItem.quantity,
                        sellingPrice: cartItem.sellingPrice,
                        mrpPrice: cartItem.mrpPrice,
                        size: cartItem.size,
                        userId: cartItem.userId
                    })
                    const savedOrderItem = await orderItem.save();
                    newOrder.orderItems.push(savedOrderItem._id);
                    return savedOrderItem;
                })
            )
            const savedOrder = await newOrder.save();
            orders.add(savedOrder)
        }
        return Array.from(orders)
    }

    // find order by id
    async findOrderById(orderId){
        if(!mongoose.Types.ObjectId.isValid(orderId)){
            throw new Error("Invalid order ID")
        }
        const order = await Order.findById(orderId).populate([
            {path: "seller"},
            {path: "orderItems", populate:{path: "product"}},
            {path: "shippingAddress"},
        ])
        if(!order){
              throw new Error("Order not found")
        }
        return order;
    }
    // user orders history
    async usersOrderHistory(userId){
        return await Order.find({user: userId}).populate([
            {path: "seller"},
            {path: "orderItems", populate:{path: "product"}},
            {path: "shippingAddress"},
        ])
    }
    // Get sellers order
    async getSellersOrder(sellerId){
        return await Order.find({user: sellerId})
        .sort({orderDate: -1})
        .populate([
            {path: "seller"},
            {path: "orderItems", populate:{path: "product"}},
            {path: "shippingAddress"},
        ])
    }
    // update order status
    async updateOrderStatus(orderId, status){        
         const order = await this.findOrderById(orderId);
         order.status = status;
        return await Order.findByIdAndUpdate(orderId, order, {new: true}).populate([
            {path: "seller"},
            {path: "orderItems", populate:{path: "product"}},
            {path: "shippingAddress"},
        ])
    }

    // cancel order
     async cancelOrder(orderId, user){        
         const order = await this.findOrderById(orderId);
         if(user._id.toString() !== order.user.toString()){
            throw new Error("You cannot cancel this order")
         }
         order.status = OrderStatus.CANCELLED;
        return await Order.findByIdAndUpdate(orderId, order, {new: true}).populate([
            {path: "seller"},
            {path: "orderItems", populate:{path: "product"}},
            {path: "shippingAddress"},
        ])
    }

    // findOrderItemById
    async findOrderItemById(orderItemId){
         if(!mongoose.Types.ObjectId.isValid(orderItemId)){
            throw new Error("Invalid order item ID")
        }
        const orderItem = await OrderItem.findById(orderItemId).populate("product");
        if(!orderItem){
              throw new Error("Order item not found")
        }
        return orderItem;
    }

}

module.exports = new OrderService()