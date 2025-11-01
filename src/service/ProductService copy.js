const Category =require("../model/Category.js")
const Product = require("../model/product/product.js");

export const calculateDiscountPercent = (mrpPrice, sellingPrice) => {
    if (mrpPrice <= 0) {
        return 0;
        // throw new Error("MRP Price should be greater than zero (0)")
    }
    const discount = mrpPrice - sellingPrice;
    return Math.round((discount / mrpPrice) * 100)
}

class ProductService {
    async createProduct(req, seller) {
        try {
            const discountPercent = calculateDiscountPercent(req.mrpPrice, req.sellingPrice);
            const category1 = await this.createOrGetCategory(req.category, 1);
            const category2 = await this.createOrGetCategory(req.category2, 2, category1._id);
            const category3 = await this.createOrGetCategory(req.category3, 3, category2._id);

            const product = new Product({
                title: req.title,
                description: req.description,
                mrpPrice: req.mrpPrice,
                sellingPrice: req.sellingPrice,
                discountPercent,
                quantity: req.quantity,
                color: req.color,
                size: req.size,
                images: req.images,
                seller: seller._id,
                category: category3._id
            })
            return await product.save()
        } catch (error) {
            throw error;
        }
    }

    // create or get category
    async createOrGetCategory(categoryId, lavel, parentId = null) {
        let category = await Category.findOne({ categoryId });
        if (!category) {
            category = new Category({
                categoryId,
                level: lavel,
                parentCategory: parentId
            })
            category = await category.save()
        }
        return category;
    }
    // delete product
    async deleteProduct(productId) {
        try {
            await Product.findByIdAndDelete(productId)
            return "Product deleted successfully";
        } catch (error) {
            throw new Error(error.message)
        }
    }
    // update product
    async updateProduct(productId, updatedProductData) {
        try {
            const product = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true })
            return product;
        } catch (error) {
            throw new Error(error.message)
        }
    }
    // find product by id
    async findProductById(productId) {
        try {
            const product = await Product.findById(productId)
            if (!product) {
                throw new Error("Product not found")
            }
            return product
        } catch (error) {
            throw new Error(error.message)
        }
    }
    // search product
    async searchProduct(query) {
        try {
            const products = await Product.find({ title: new RegExp(query, "i") })
            return products
        } catch (error) {
            throw new Error(error.message)
        }
    }
    // get product by seller id
    async getProductBySeller(sellerId) {
        return await Product.find({ seller: sellerId })
    }
    // get all products
    async getAllProducts(req) {
        const filterQuery = {}
        if (req.category) {
            const category = await Category.findOne({ categoryId: req.category })
            if (!category) {
                return {
                    content: [],
                    totalPages: 0,
                    totalElement: 0
                }
            }
            filterQuery.category = category._id.toString();
        }
        if (req.color) {
            filterQuery.color = req.color;
        }
        if (req.minPrice && req.maxPrice) {
            filterQuery.sellingPrice = { $gte: req.minPrice, $lte: req.maxPrice };
        }
        if (req.minDiscount) {
            filterQuery.discountPercent = { $gte: req.minDiscount };
        }
        if (req.size) {
            filterQuery.size = req.size;
        }
        let sortQuery = {};
        if (req.sort === 'price_low') {
            sortQuery.sellingPrice = 1
        } else if (req.sort = 'price_high') {
            sortQuery.sellingPrice = -1
        }
        const products = await Product.find(filterQuery)
            .sort(sortQuery)
            .skip(req.pageNumber * 24)
            .limit(24);

        const totalElement = await Product.countDocuments(filterQuery)
        const totalPages = Math.ceil(totalElement / 24);
        const resProducts = {
            content: products,
            totalPages: totalPages,
            totalElement: totalElement
        }
        return resProducts;
    }
}
module.exports = new ProductService()