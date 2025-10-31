const jwtProvider = require("../../../utils/jwtProvider.js");
const UserRoles = require("../../Domain/userRole.js");
const VerificationCodeModal = require("../../model/verificationCode/verificationCodeModel.js");
const SellerService = require("../../service/SellerService.js");

class SellerController {
    // create seller 
    async createSeller(req, res) {
        try {
            const seller = await SellerService.createSeller(req.body);
           return res.status(200).json({
                message: 'Seller created successful',
                seller: seller
            })
        } catch (error) {
            return res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }
    // get seller profile
    async getSellerProfile(req, res) {
        try {
            const profile =await req.seller;
            console.log("seller profile from seller controller", profile);
            
            const jwt = req.headers.authorization.split(" ")[1];
            const seller = await SellerService.getSellerProfile(jwt);
            return res.status(200).json(seller)
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }

    // get all sellers
    async getAllSellers(req, res) {
        try {
            const status = req.query.status;
            const sellers = await SellerService.getAllSellers(status);
            return res.status(200).json(sellers)
        } catch (error) {
            return res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }
    // update seller 
    async updateSeller(req, res) {
        try {
            const existingSeller = await req.seller;
            const seller = await SellerService.updateSeller(existingSeller, req.body);
            return res.status(200).json({
                message: "Seller updated successful",
                seller: seller
            })
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }

    // delete seller 
    async deleteSeller(req, res) {
        try {
            const id = req.params.id;
            await SellerService.deleteSeller(id);
            return res.status(200).json({
                message: "Seller deleted successful"
            })
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }

    // update seller account status
    async updateSellerAccountStatus(req, res) {
        try {
            const id = req.params.id;
            const status = req.params.status;
            const updatedSeller = await SellerService.updateSellerStatus(id, status);
            return res.status(200).json({
                message: "Seller account status updated successful",
                updatedSeller: updatedSeller
            })
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }
    // verify login otp
    async verifyLoginOtp(req, res) {
        try {
            const { otp, email } = req.body;
            const seller = await SellerService.getSellerByEmail(email)
            const verificationCode = await VerificationCodeModal.findOne({ email });
            if (!verificationCode || verificationCode.otp !== otp) {
                throw new Error("Invalid OTP")
            }
            const token = jwtProvider.createJwt({ email })
            const authResponse = {
                message: "Login success",
                jwt: token,
                role: UserRoles.SELLER
            }
            return res.status(200).json(authResponse)


        } catch (error) {
            return res.status(error instanceof Error ? 404 : 500)
                .json({ message: error.message })
        }
    }

}

module.exports = new SellerController()