const mongoose = require('mongoose')

const workOrderSchema = new mongoose.Schema({
    partName: {
        type: String,
        required: true
    },
    recRepair: {
        type: String
    },
    qty: {
        type: Number,
        required: true
    },
    repairDesc: {
        type: String
    },
    progress: {
        type: String,
        default: "Pending"
    },
},
{
    timestamps: true
}
)

module.exports = mongoose.model('WorkOrder', workOrderSchema)