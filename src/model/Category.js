const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type: String
    },
    categoryId:{
        type: String,
        required: true,
        unique: true
    },
    parentCategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    level:{
        type: Number,
        required: true
    }
},{timestamps: true});


const Category = mongoose.model('Category', categorySchema)
module.exports = Category;