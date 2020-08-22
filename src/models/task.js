const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
}, {
    timestamps: true
})
const Task = mongoose.model('tasks', taskSchema)

module.exports = Task