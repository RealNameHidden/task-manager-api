const express = require('express')
const User = require('../models/user')
const Auth= require('../middleware/auth')
const sendWelcome= require('../emails/account')
const router = express.Router()


router.post('/users', async (req, res) => {

    const user = new User(req.body)
    try {
        const token= await user.getAuthToken()
        user.tokens= user.tokens.concat({token})
        sendWelcome(user.email,user.name)
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findMyCredentials({email:req.body.email},req.body.password)
        const token = await user.getAuthToken()
        user.tokens= user.tokens.concat({token})
        await user.save()
        res.send({user,token}) 
    } catch(e) {
        res.status(400).send(e.message)
    }
})

//Logout
router.post('/users/logout',Auth,async (req,res)=>{
    try{
    req.user.tokens = req.user.tokens.filter((token)=>{
       return token.token!==req.token
    })
   await  req.user.save()
   res.send()
} catch(e){
    res.status(500).send()
}
})
//Logout all
router.post('/users/logoutall',Auth,async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})
router.get('/users/me', Auth, async (req, res) => {
    res.send(req.user)
    })

router.get('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id // Access the id provided
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

//Update user
router.patch('/users/me', Auth ,async (req, res) => {
    // Route handler code here
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age'] 
    //Check if only alowed field s are updated
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update))
    if (!isValidOperation) { 
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        // const user = await User.findById(req.params.id)
        // if (!user) {
        //     return res.status(404).send()
        // }

        updates.forEach( function(updateField){
            req.user[updateField]= req.body[updateField]
            
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/users/me', Auth, async (req, res) => {
    // Route handler
    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports=router