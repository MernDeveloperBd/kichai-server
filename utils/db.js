const { default: mongoose } = require("mongoose")

const dbConnect = async () => {
    try {
        if (process.env.mode === 'dev') {
            await mongoose.connect(process.env.DB_URL, {
                useNewURLParser: true              
                
            })
            console.log("db 1 connected");
        } else {
            await mongoose.connect(process.env.DB_URL, {
                useNewURLParser: true
            })
             console.log("prodcction db 1 connected");
        }
    } catch (error) {
        console.log(`Mongodb error ${error}`);
        

    }
}

module.exports = dbConnect;