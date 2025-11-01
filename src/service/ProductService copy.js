// service/ProductService.js
const Category = require('../model/Category.js');
const Product = require('../model/product/product');

const calculateDiscountPercent = (mrpPrice, sellingPrice) => {
  if (!Number.isFinite(mrpPrice) || mrpPrice <= 0) {
    throw new Error('MRP Price should be greater than zero (0)');
  }
  if (!Number.isFinite(sellingPrice) || sellingPrice <= 0) {
    sellingPrice = mrpPrice; // sellingPrice না দিলে 0% ডিসকাউন্ট
  }
  if (sellingPrice >= mrpPrice) return 0;
  const discount = mrpPrice - sellingPrice;
  return Math.max(0, Math.round((discount / mrpPrice) * 100));
};

class ProductService {
  async createProduct(req, seller) {
    try {
      const {
        title,
        description,
        mrpPrice,
        sellingPrice,
        quantity,
        color,
        size,
        images,
        category,
        category2,
        category3
      } = req;

      // Basic validations
      if (!title || !description) {
        throw new Error('title এবং description প্রয়োজন');
      }
      if (!Number.isFinite(mrpPrice) || mrpPrice <= 0) {
        throw new Error('mrpPrice সঠিকভাবে দিন (> 0)');
      }
      if (!Number.isFinite(quantity) || quantity < 0) {
        throw new Error('quantity সঠিকভাবে দিন (>= 0)');
      }
      if (!Array.isArray(images) || images.length === 0) {
        throw new Error('images array প্রয়োজন (কমপক্ষে ১টি)');
      }
      if (!seller || !seller._id) {
        throw new Error('Seller তথ্য পাওয়া যায়নি (sellerMiddleware চেক করুন)');
      }

      const discountPercent = calculateDiscountPercent(mrpPrice, sellingPrice);

      // Categories (optional chaining + deepest selected)
      const cat1 = category ? await this.createOrGetCategory(category, 1) : null;
      const cat2 = category2 ? await this.createOrGetCategory(category2, 2, cat1?._id || null) : null;
      const cat3 = category3 ? await this.createOrGetCategory(category3, 3, (cat2?._id || cat1?._id || null)) : null;

      const finalCategory = cat3 || cat2 || cat1;
      if (!finalCategory) {
        throw new Error('কমপক্ষে একটি category/category2/category3 প্রদান করুন');
      }

      const product = new Product({
        title,
        description,
        mrpPrice,
        sellingPrice: Number.isFinite(sellingPrice) ? sellingPrice : mrpPrice,
        discountPercent,
        quantity,
        color,
        size,
        images,
        seller: seller._id,
        category: finalCategory._id
      });

      return await product.save();
    } catch (error) {
      console.error('CreateProduct Error:', error);
      throw error; // আগের টাইপো ছিল: error.messge
    }
  }

  // create or get category
  async createOrGetCategory(categoryId, level, parentId = null) {
    if (!categoryId) throw new Error(`categoryId missing for level ${level}`);
    let category = await Category.findOne({ categoryId });
    if (!category) {
      category = new Category({
        categoryId,
        level,
        parentCategory: parentId
      });
      category = await category.save();
    }
    return category;
  }

  // delete product
  async deleteProduct(productId) {
    try {
      await Product.findByIdAndDelete(productId);
      return 'Product deleted successfully';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // update product
  async updateProduct(productId, updatedProductData) {
    try {
      // যদি price আপডেট হয়, discountPercent রিক্যালকুলেট
      if (updatedProductData) {
        const mrp = updatedProductData.mrpPrice;
        const sell = updatedProductData.sellingPrice;
        if (Number.isFinite(mrp) || Number.isFinite(sell)) {
          const existing = await Product.findById(productId);
          if (!existing) throw new Error('Product not found');
          const newMrp = Number.isFinite(mrp) ? mrp : existing.mrpPrice;
          const newSell = Number.isFinite(sell) ? sell : (existing.sellingPrice ?? existing.mrpPrice);
          updatedProductData.discountPercent = calculateDiscountPercent(newMrp, newSell);
        }
      }
      const product = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // find product by id
  async findProductById(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // search product
  async searchProduct(query) {
    try {
      if (!query || typeof query !== 'string' || !query.trim()) {
        return [];
      }
      const q = query.trim();
      // Text index ব্যবহার (title+description)
      const products = await Product.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // get product by seller id
  async getProductBySellerId(sellerId) {
    try {
      return await Product.find({ seller: sellerId });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // get all products
  async getAllProducts(req) {
    try {
      const filterQuery = {};

      // category filter (by categoryId)
      if (req.category) {
        const category = await Category.findOne({ categoryId: req.category });
        if (!category) {
          return {
            content: [],
            totalPages: 0,
            totalElement: 0
          };
        }
        filterQuery.category = category._id;
      }

      if (req.color) {
        filterQuery.color = req.color;
      }

      const minPrice = req.minPrice !== undefined ? Number(req.minPrice) : undefined;
      const maxPrice = req.maxPrice !== undefined ? Number(req.maxPrice) : undefined;
      if (Number.isFinite(minPrice) && Number.isFinite(maxPrice)) {
        filterQuery.sellingPrice = { $gte: minPrice, $lte: maxPrice };
      } else if (Number.isFinite(minPrice)) {
        filterQuery.sellingPrice = { $gte: minPrice };
      } else if (Number.isFinite(maxPrice)) {
        filterQuery.sellingPrice = { $lte: maxPrice };
      }

      const minDiscount = req.minDiscount !== undefined ? Number(req.minDiscount) : undefined;
      if (Number.isFinite(minDiscount)) {
        filterQuery.discountPercent = { $gte: minDiscount };
      }

      if (req.size) {
        filterQuery.size = req.size;
      }

      let sortQuery = {};
      if (req.sort === 'price_low') {
        sortQuery.sellingPrice = 1;
      } else if (req.sort === 'price_high') {
        sortQuery.sellingPrice = -1;
      }

      const limit = 24;
      const page = Number(req.pageNumber) || 0;

      const products = await Product.find(filterQuery)
        .sort(sortQuery)
        .skip(page * limit)
        .limit(limit);

      const totalElement = await Product.countDocuments(filterQuery);
      const totalPages = Math.ceil(totalElement / limit);

      return {
        content: products,
        totalPages,
        totalElement
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ProductService();