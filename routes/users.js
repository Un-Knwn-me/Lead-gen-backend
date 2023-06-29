var express = require('express');
var router = express.Router();
const { UserModel } = require('../schema/userSchema');
const { hashCompare, hashPassword, createToken, decodeToken, isSignedIn, roleAdmin } = require('../config/auth');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post("/signup", async (req, res)=>{
  try {
    let user = await UserModel.findOne({email: req.body.email})

    if(!user){
      req.body.password = await hashPassword(req.body.password);
      let data = new UserModel(req.body);
      await data.save();
      res.status(200).json({message: "User signed up successfully"});
    } else {
      res.status(401).json({message: "User already exists"});
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error", error });
  }
})


router.post('/signin', async (req, res) => {
  try {
    let user = await UserModel.findOne({email: req.body.email})
      if(user){
          if(await hashCompare(req.body.password, user.password)){
              let token = await createToken({email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role})

              res.status(200).send({message: "User successfully logged in", token, role:user.role});
          } else {
              res.status(401).send({message: "Invalid credentials"})
          }
      } else {
          res.status(404).send({message: "User not found"})
      }           
      console.log(user) 
      } catch (error) {
        console.log(error);
      res.status(500).json({ message: "Internal Server Error", error });      
      }
})


module.exports = router;
