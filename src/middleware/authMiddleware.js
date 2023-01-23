const jwt=require("jsonwebtoken")
const bookModel=require("../model/bookModel")
const { isValidObjectId } = require("mongoose")



exports.authentication=async function(req,res,next){
    try{
        let token=req.headers["x-auth-token"] || req.headers["x-Auth-token"]
        if(!token) return res.status(400).send({status:false,message:"Missing authentication token"})

            jwt.verify(token,'key',(err , token)=>{
              if(err)return res.status(401).send({status: false , message: err.message})
              req.id = token.userId
              next()
            })
           
    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}


exports.authorization=async function(req,res,next){
    try{
       let loginUser=req.id
      let BookId=req.params.BookId
      let userId = req.body.userId
       
      if(BookId){
       if(!isValidObjectId(BookId))return res.status(400).send("please Enter valid Object Id")
         let findId=await bookModel.findOne({_id:BookId ,isDeleted :false})
         if(!findId) return res.status(404).send({status: false,message:"Book Data not found"})
         if(loginUser != findId.userId)return res.status(403).send({status: false ,message : "unAuthorization"})
         next()
        }

        if(userId){
           if(loginUser != userId)return res.status(403).send({status: false , message:"unAuthorization"})
           next()
        }

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}