// model/product/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  mrpPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    // যদি না দেন, mrpPrice কে default ধরা হবে
    default: function () {
      return this.mrpPrice;
    }
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String
  },
  size: {
    type: String
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'At least one image is required'
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  }
}, { timestamps: true });

productSchema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 5, description: 4 } }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;