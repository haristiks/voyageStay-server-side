const express=require('express')
const router=express.Router()
const controller=require('../Controllers/userController')
const TryCatch=require('../Middlewares/tryCatchMiddleware')

router.post('/auth/signup',TryCatch(controller.userCreation))

module.exports=router;