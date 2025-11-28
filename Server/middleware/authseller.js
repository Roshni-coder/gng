import jwt from "jsonwebtoken";
import "dotenv/config";
const authseller = async (req,res,next)=>{
  try {
    const token = req.headers.stoken;   // keep same
    if (!token) return res.json({ success:false,message:"Login again" });

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.sellerId = decode.id;           // <-- store ID directly
    next();
  }
  catch(e){
    res.json({success:false,message:"Auth failed"});
  }
}

export default authseller;
