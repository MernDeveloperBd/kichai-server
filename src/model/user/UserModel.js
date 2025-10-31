const { default: mongoose } = require("mongoose");
const UserRoles = require("../../Domain/userRole");

const UserSchema = new mongoose.Schema({
    fullName: {
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
    },
    mobile: {
        type: Number,
    },
    addresses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    role: {
        type: String,
        enum: [UserRoles.CUSTOMER, UserRoles.ADMIN],
        default: UserRoles.CUSTOMER
    },

})

UserSchema.index({
    name: 'text',
    email: 'text'
}, {
    weights: {
        name: 5,
        email: 4,
    }
})

const UserModal = mongoose.model('User', UserSchema)
module.exports = UserModal;