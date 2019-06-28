const mongoose = require('mongoose')
const validator = require('validator')
const string = require('string')
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken')
const Task= require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:true,
        trim:true,
        unique:true
    },
    age: {
        type: Number,
        default:0,
        validate(value){
            if (value<0){
                throw new Error("Age can't be negitive")            
            }
        }
        
    },
    email: {
        type:String,
        required: true,
        unique:true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Its not a valid email")
            }
        }
    },
    password: {
        type:String,
        default:'admin123',
        validate(value) {
            if(!validator.isLength(value, { min:6 })) {
                throw new Error("Password length must be greater than 6")
            }
            else if (string(value).contains('password')) {
                throw new Error("The word 'password' is not allowed to be in input for password")
            }
        }   
    },

    tokens: [{
        
            token:{
            type:String,
            required:true
            }

        
    }]
},{
    timestamps:true
})
userSchema.virtual('tasks', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.methods.toJSON = function() {
    const user = this
    userObj =user.toObject()

    delete userObj.password
    delete userObj.tokens
    
    return userObj
}
//Function to handle login
userSchema.statics.findMyCredentials = async (email,password) =>{
    const user = await User.findOne(email)
    if(!user){
        throw new Error("Unable to login")
    }
    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("Unable to login!")
    }
    return user
}
//Generate authentication token
userSchema.methods.getAuthToken = async function() {
    const user=this
    const token= jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    return token
}

//code to hash password
userSchema.pre('save', async function (next){
    const user = this
   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password,8)
   }

   next()
})
//middleware when a user is deleted
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner:user.id})
    next()
})
const User = mongoose.model('user', userSchema)


module.exports = User