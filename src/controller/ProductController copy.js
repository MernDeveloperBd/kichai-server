const ProductService = require("../service/ProductService.js");

class sellerProductController{
    async getProductsBySellerId(req, res){
        try {
            const seller = await req.seller;
            const products = await ProductService.getProductBySeller(seller._id);
            return res.status(200).json(products)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }

    // create product
    async createProduct(req, res){
        try {
           const seller = await req.seller;
           const product = await ProductService.createProduct(req.body, seller);
           return res.status(201).json(product)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
    // delete product
    async deleteProduct(req, res){
        try {
            await ProductService.deleteProduct(req.params.productId);
             return res.status(200).json({message:"Product deleted successfully"})
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
    // update product
    async updateProduct(req, res){
        try {
           const product = await ProductService.updateProduct(req.params.productId, req.body);
             return res.status(200).json(product)
        } catch (error) {
            return res.status(404).json({error: error.message})
        }
    }
    // get product by id
    async getProductById(req, res){
        try {
           const product = await ProductService.findProductById(req.params.productId);
             return res.status(200).json(product)
        } catch (error) {
            return res.status(404).json({error: error.message})
        }
    }
    // search product 
    async searchProduct(req, res){
        try {
            const query =req.query.q;
           const products = await ProductService.searchProduct(query);
             return res.status(200).json(products)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
    // get all products
    async getAllProducts(req, res){
        try {
           const products = await ProductService.getAllProducts(req.query);
             return res.status(200).json(products)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}

module.exports = new sellerProductController()