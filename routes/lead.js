var express = require('express');
var router = express.Router();
const { LeadModel } = require('../schema/leadSchema');
const { hashCompare, hashPassword, createToken, decodeToken, isSignedIn, roleAdmin } = require('../config/auth');
const { MailService } = require('../service/mailService');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

router.post('/',isSignedIn, async(req, res, next) =>{
    try {
        let lead = await LeadModel.findOne({email: req.body.email})
        if(!lead){
        let data = new LeadModel(req.body)
        await data.save();
        res.status(201).json({message: "Lead genrated successfully"});
    } else {
        res.status(403).json({message: "Lead already exists" });
    }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});


router.get('/:id',isSignedIn, async(req,res)=>{
    try {
      let data = await LeadModel.find({_id:req.params.id})
  
      res.status(200).send({
        leads:data
      })
      }
    catch (error) {console.log(error)
      res.status(500).send({message:"Internal Server Error",error})
    }
  })

router.get('/dashboard',isSignedIn, roleAdmin, async(req, res, next) => {
    try {
        let data = await LeadModel.aggregate([{
            $group:{_id:"$status", count:{$sum:1}}
        }]);
        res.status(200).send({leads:data})
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });  
    }
});

router.get('/dashboard-list-items/:status',isSignedIn, roleAdmin, async(req, res, next) => {
    try {
        let data = await LeadModel.find({status:req.params.status});
        res.status(200).send({leads:data})
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });  
    }
});


router.put('/:id',isSignedIn, async(req, res, next) =>{
    try {
        let data = await LeadModel.updateOne({_id:req.params.id}, {$set: req.body});
        res.status(200).json({ message: "Updated Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
})

router.put('/:id/:toStatus',isSignedIn, async(req, res, next) =>{
    try {
        let data = await LeadModel.updateOne({_id:req.params.id}, {$set: {status: req.params.toStatus}});
        res.status(200).json({ message: "Updated status Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

router.post('/send-email', roleAdmin, async(req, res, next) =>{
    try {
        let data = await LeadModel.find({}, {email:1, firstName:1, lastName:1});
        await MailService({})
        res.status(200).json({ message: "Email Sent Successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });  
    }
})


module.exports = router;
