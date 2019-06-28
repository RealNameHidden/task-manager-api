const mongoose = require('mongoose')
const validator = require('validator')
const string = require('string')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex:true
})


// const me = new User({
//     name: 'Lanister',
//     age: 22,
//     email: 'JAMIE@dh.com',
//     password: 'killCerci'
//     })
// me.save().then((me)=>{
//     console.log(me);
    
// }).catch((err)=>{
//     console.log(err);
    
// })


// const Task = mongoose.model('tasks',{
//     description: {
//         type: String
//     },
//     completed: {
//         type: Boolean
//     }
// })

// const task1 = new Task({
//     description: 'Eat healty',
//     completed: true
//     })
// task1.save().then((task1)=>{
//     console.log(task1);
    
// }).catch((err)=>{
//     console.log(err);
    
// })