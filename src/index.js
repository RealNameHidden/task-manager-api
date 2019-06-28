const express = require('express')
require('./db/mongoose')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)
//Maintenance route
// app.use((req,res,next)=>{
//     res.status(500).send("Site down! Come back soon!")

// })

app.listen(port, () => {
    console.log("The server is up...")
})

