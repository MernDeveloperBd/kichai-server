const jwtProvider = require("../../utils/jwtProvider.js");
const  AddressModal  = require("../model/address/AddressModel.js");
const SellerModal = require("../seller/sellerModel.js");

class SellerService{
    // create seller
    async createSeller(sellerData){
        const existingSeller = await SellerModal.findOne({email: sellerData.email})
        if(existingSeller){
            throw new Error ("Email already registered")
        }
        let savedAddress = sellerData.pickUpAddress;
        savedAddress= await AddressModal.create(sellerData.pickUpAddress)

        const newSeller = new SellerModal({
            sellerName:sellerData.sellerName,
            email:sellerData.email,
            password:sellerData.password,
            pickUpAddress:savedAddress._id,
            businessDetails:sellerData.businessDetails,
            bankDetails:sellerData.bankDetails,
            tin:sellerData.tin,
            bin:sellerData.bin,
        })
        return await newSeller.save()
    }
    // get seller profile
    async getSellerProfile(jwt){
        const email = jwtProvider.getEmailFromJwt(jwt)
        return this.getSellerByEmail(email)
    }
    // get seller by email
    async getSellerByEmail(email){
        const seller = await SellerModal.findOne({email})
        if(!seller){
            throw new Error("Seller not found")
        }
        return seller;
    }
    // get seller by id
    async getSellerById(id){
        const seller = await SellerModal.findById(id)
        if(!seller){
            throw new Error("Seller not found")
        }
        return seller;
    }
    // get all sellers
    async getAllSellers(status){
        return await SellerModal.find({accountStatus:status})
    }
    // update seller
    async updateSeller(existingSeller, sellerData){
        return await SellerModal.findByIdAndUpdate(existingSeller._id,
             sellerData, 
             {new: true}
            )
    }
    // update seller Status
     async updateSellerStatus(sellerId, status){
        return await SellerModal.findByIdAndUpdate(sellerId,
             {$set:{accountStatus:status}},
             { new: true}
            )
    }

    // delete a seller
    async deleteSeller(sellerId){
        return await SellerModal.findOneAndDelete(sellerId)
    }
}
module.exports = new SellerService()