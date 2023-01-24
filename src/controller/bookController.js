const userModel = require('../model/userModel')
const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')

const mongoose = require('mongoose')
const regex = /^[A-Za-z_? ]{3,30}$/
const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
const dateRegex =/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/


// ===============================POST API CREATE BOOK ...........................

exports.bookCreate = async (req,res)=>{
  try{

  let data = req.body
  let{title ,excerpt , userId , ISBN ,category,subcategory,releasedAt} = data
  if(Object.keys(data).length =0)return res.status(400).send({status:false ,message :"body empty"})

  if(!title)return res.status(400).send({status: false ,message:"title required"})
  if(!excerpt)return res.status(400).send({status: false ,message:"excerpt required"})
  if(!userId)return res.status(400).send({status: false ,message:"userId required"})
  if(!ISBN)return res.status(400).send({status: false ,message:"ISBN required"})
  if(!category)return res.status(400).send({status: false ,message:"category required"})
  if(!subcategory)return res.status(400).send({status: false ,message:"subCategory required"})
 
 
  if(! title.match(regex))return res.status(400).send({status: false , message:"title invalid"})
  if(! excerpt.match(regex))return res.status(400).send({status: false , message:"excerpt invalid"})
  if(! category.match(regex))return res.status(400).send({status: false , message:"category invalid"})
  if(! subcategory.match(regex))return res.status(400).send({status: false , message:" subCategory invalid"})
  if(! ISBN.match(isbnRegex))return res.status(400).send({status: false , message:" ISBN invalid"})

if(releasedAt){
  if(!releasedAt.match(dateRegex))return res.status(400).send({status: false , message:" releasedAt invalid"})
}else{
  data.releasedAt =new Date() 
}

//  unique data 
let findTitle = await bookModel.findOne({title :title})
if(findTitle)return res.status(400).send({status: false, message :"title already exist in our data base"})
let findIsbn = await bookModel.findOne({ISBN:ISBN})
if(findIsbn)return res.status(400).send({status: false, message :"ISBN number already exist in our data base"})

  // let findUser = await userModel.findById({_id:userId})
  // if(!findUser)return res.status(404).send({status: false , message :"user not exist our data base"})

  let crateBook = await bookModel.create(data)
  res.status(201).send({status: true , data : crateBook})

}catch(err){
  res.status(500).send({status: false ,message :err.message})
}
}

// ===============================GET API  BOOK FIND BY FILTER ...........................

exports.getBook = async (req ,res)=>{
  try{
  let query = req.query
  query.isDeleted = false

  if(query.userId){
    if(!mongoose.isValidObjectId(query.userId))return res.status(400).send({status: false , message :"id is not valid"}) }

  let findBook = await bookModel.find(query)
  if(findBook.length ==0)return res.status(404).send({status : true ,message: "not match query"})
    res.status(200).send({status : true , data :findBook})
  }catch(err){
    res.status(500).send({status: false ,message :err.message})
  }
}

// =============================== GET API  BOOK FIND BY ID ...........................

exports.getBookId = async (req,res)=>{
 try{
  let id  = req.params.bookId

if(!mongoose.isValidObjectId(id))return res.status(400).send({status: false , message :"id is not valid"})

let findData = await bookModel.findById({_id: id,isDeleted : false}).lean()
if(!findData)return res.status(404).send({status:false ,message : "this userId not exist in our data base"})
let reviewFind = await reviewModel.find({bookId:findData._id,isDeleted:false})
findData.reviewsData = reviewFind
res.status(200).send({status: true ,data :findData})
}catch(err){
  res.status(500).send({status: false ,message :err.message})
}
}

// =============================== PUT  API  BOOK UPDATE ...........................

exports.updateBook = async (req ,res)=>{
  try{
   let id = req.params.bookId
   let body = req.body
   let {title ,ISBN ,excerpt,releasedAt}= body

if(!mongoose.isValidObjectId(id))return res.status(400).send({status: false , message :"id is not valid"})

if(title){ if(!title.match(regex))return res.status(400).send({status: false , message:"title invalid"})}
if(excerpt){ if(!excerpt.match(regex))return res.status(400).send({status: false , message:"excerpt invalid"})}
if(ISBN){ if(!ISBN.match(isbnRegex))return res.status(400).send({status: false , message:" subCategory invalid"})}
if(releasedAt){ if(! dateRegex.match(releasedAt))return res.status(400).send({status: false , message:" releasedAt invalid"})}

// UNIQUE  TITLE AND ISBN NUMBER 
if(title){
let findTitle = await bookModel.findOne({title :title})
if(findTitle)return res.status(400).send({status: false, message :"title already exist our data base"})}
if(ISBN){
let findIsbn = await bookModel.findOne({ISBN:ISBN})
if(findIsbn)return res.status(400).send({status: false, message :"ISBN number already exist our data base"})
}
//  NEW OBJECT FOR FIND AND UPDATE QUERY

let findObj ={id:id , isDeleted: false}
let data ={ title:title,excerpt:excerpt, ISBN:ISBN}

// UPDATE OBJECT

let updateBook = await bookModel.findOneAndUpdate(findObj ,data,{new: true})
if(!updateBook)return res.status(404).send({status: false ,message :"bookID not exist in our data base"})
res.status(200).send({status: true,data :updateBook})

  }catch(err){
  res.status(500).send({status: false ,message :err.message})
}
}

// =============================== DELETED API  BOOK BY ID ...........................

exports.bookDeleted = async (req ,res)=>{
  try{
    let id= req.params.bookId
    if(!mongoose.isValidObjectId(id))return res.status(400).send({status: false , message :"id is not valid"})
    
    let deletedBook = await bookModel.findOneAndDelete({_id:id ,isDeleted :false},{new : true})
    if(!deletedBook)return res.status(404).send({status: false  , message:"bookId is not exist in our data base"})
    res.status(200).send({status: false , data :deletedBook})

  }catch(err){
    res.status(500).send({status:false , message: err.message})
  }
}

