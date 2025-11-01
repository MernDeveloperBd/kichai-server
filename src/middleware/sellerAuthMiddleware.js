const jwtProvider = require("../../utils/jwtProvider.js");
const SellerService = require("../service/SellerService.js");

const sellerMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token. authorizaion failed" })
        }
        const token = authHeader.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "Invalid token. authorizaion failed" })
        }
        let email = jwtProvider.getEmailFromJwt(token)
        const seller =await SellerService.getSellerByEmail(email)
        req.seller = seller;
        next()

    } catch (error) {
        return res.status(500)
            .json({ message: error.message })
    }
}

module.exports = sellerMiddleware;

/* 
const jwtProvider = require("../../utils/jwtProvider.js");
const SellerService = require("../service/SellerService.js");

const sellerMiddleware = async (req, res, next) => {
  try {
    // Authorization header থেকে Bearer টোকেন নিন
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid token. Authorization failed" });
    }

    const token = authHeader.split(" ")[1]?.trim();
    if (!token) {
      return res.status(401).json({ error: "Invalid token. Authorization failed" });
    }

    // টোকেন থেকে ইমেইল বের করুন (jwtProvider যেন verify করে)
    let email;
    try {
      email = jwtProvider.getEmailFromJwt(token);
    } catch (err) {
      const msg = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
      return res.status(401).json({ error: msg });
    }

    if (!email) {
      return res.status(401).json({ error: "Invalid token: email not found in token" });
    }

    // সেলার ফেচ করুন (await প্রয়োজন)
    const seller = await SellerService.getSellerByEmail(email);
    if (!seller) {
      return res.status(401).json({ error: "Seller not found for this token" });
    }

    // রিকোয়েস্টে সেলার অ্যাটাচ করে দিন
    req.seller = seller;
    next();
  } catch (error) {
    console.error("sellerMiddleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = sellerMiddleware; */