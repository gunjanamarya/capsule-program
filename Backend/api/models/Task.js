const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = mongoose.Schema({
    parentTaskId: {
        type: Schema.Types.ObjectId,
        ref: 'Parent_Task',
        // required: true
    },
    task: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { collection: 'Task' });

module.exports = mongoose.model('Task', TaskSchema);