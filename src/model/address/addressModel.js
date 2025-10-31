const { default: mongoose } = require("mongoose");

const addressSchema =new mongoose.Schema({
    address_line1:{
        type:String,
        default: ""
    },
    division:{
        type:String,
        default: ""
    },
    city:{
        type:String,
        default: ""
    },
    upazila:{
        type:String,
        default: ""
    },
   area:{
    type: String,
    default: ""
   },
   postCode:{
    type: String
   },
   country:{
    type: String
   },
   mobile:{
    type: Number,
    default: null
   },
   status:{
    type:Boolean,
    default: true
   },
   selected:{
    type:Boolean,
    default: true
   },
   userId: {
    // আগেরটা ছিল: type: mongoose.Schema.ObjectId, default: ""
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    default: null,  
    required: false
  }
},
{
    timestamps:true
})

const AddressModal = mongoose.model("Address", addressSchema)
module.exports = AddressModal;