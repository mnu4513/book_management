const reviewModel = require("../model/reviewModel")
const bookModel = require("../model/bookModel")


exports.createReview = async function(req,res){
    try {
        let data = req.params.bookId
        let newReview = req.body
        let {bookId,reviewedBy,reviewAt,rating,review,isDeleted} = newReview
         if(bookId != data)return res.status(400).send({status: false , message:"book id not match"})

        if(!bookId) return res.status(400).send({status:false, message:"Pls provide bookId"})
        if(data){
            let checkBookIdByRef = await bookModel.find({_id:bookId, isDeleted:false})
            if(!checkBookIdByRef) return res.status(400).send({status:false, message:"No book exist with this Id"})
        }

        if(!reviewedBy) return res.status(400).send({status:false, message:"Pls provide reviewBy and name"})

        if(!reviewAt) return res.status(400).send({status:false, message:"pls provide reviewAt key"})
        
        if(!rating) return res.status(400).send({status:false, message:"Pls provide rating key, it is mandory to put.."})
        if(rating){
            rating++ 
        }

        let addreview = await reviewModel.create(newReview)
        res.status(201).send({status:true, message:"successful", data:addreview})

    } catch (error) {
        res.status(500).send({status:false, message:error.message})
    }
}

