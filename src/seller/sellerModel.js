const { default: mongoose } = require("mongoose");
const UserRoles = require("../Domain/userRole.js");
const AccountStatus = require("../Domain/AccountStatus.js");

const sellerSchema = new mongoose.Schema({
    sellerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    businessDetails: {
        businessName: {
            type: String,
        },
        businessEmail: {
            type: String,
            required: true
        },
        businessNumber: {
            type: Number
        },
        businessFbPage: {
            type: String
        },
        businessAddress: {
            type: String,
            required: true
        },
    },
    bankDetails: {
        accountNo: {
            type: String,
        },
        accountHolderName: {
            type: String
        },
        bankName: {
            type: String
        },
        branchName: {
            type: String
        },
        routingNo: {
            type: Number
        }
    },
    pickUpAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    tin: {
        type: String
    },
    bin: {
        type: String
    },
    role: {
        type: String,
        enum: [UserRoles.SELLER],
        default: UserRoles.SELLER
    },
    accountStatus: {
        type: String,
        enum: [AccountStatus.PENDING_VERIFICATION, AccountStatus.ACTIVE, AccountStatus.SUSPENDED, AccountStatus.DEACTIVATED, AccountStatus.BANNED, AccountStatus.CLOSED],
        default: AccountStatus.PENDING_VERIFICATION
    }
}, { timestamps: true })

sellerSchema.index({
    sellerName: 'text',
    email: 'text'
}, {
    weights: {
        name: 5,
        email: 4,
    }
})

const SellerModal = mongoose.model('Seller', sellerSchema)
module.exports = SellerModal