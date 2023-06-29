const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");   

require('dotenv').config();


 const hashPassword = async(password)=>{
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(password, salt);
  return hash;
}

 const hashCompare = (password, hash) =>{
  return bcrypt.compare(password,hash);
}

 const createToken = ({firstName, lastName, email, role})=>{
  let token = jwt.sign({firstName, lastName, email, role}, process.env.SecretKey, {expiresIn: "60m"});
  return token;
}

 const decodeToken = (token)=> {
  let data = jwt.decode(token);
  return data;    
}

 const isSignedIn = async (req, res, next) => {
    try {
      if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      let data = decodeToken(token);
      if((Math.floor(Date.now()/1000))<= data.exp){
        next();
      } else {
        return res.status(401).json({ message: "Login Expired" });  
      } 
     } else {
     return res.status(400).json({ message: "Access denied" });
}
    }
     catch (error) {
      return res.status(500).json({ message: "Invalid Authentication" });
    }
};

 const roleAdmin = async(req, res, next)=>{
    try {
      if (req.headers.authorization) {
      let token = req.headers.authorization.split(' ')[1];
      let data = decodeToken(token);
      if(data.role === "admin"){
        next();
      } else {
        return res.status(401).json({ message: "Admin only" });  
      } 
    }
  } catch (error) {
    return res.status(500).json({ message: "Invalid Authentication" });
  }
}

module.exports = {hashCompare, hashPassword, createToken, decodeToken, isSignedIn, roleAdmin}