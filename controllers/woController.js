const WorkOrder = require('../models/WorkOrder')
const asyncHandler = require('express-async-handler')

// @desc Get all work orders
// @route GET /wo
// @access Private
const getAllWorkOrders = asyncHandler(async (req, res) => {
    const workOrders = await WorkOrder.find().lean()
    if (!workOrders?.length) {
        return res.status(400).json({ message: 'No Work Orders found' })
    }
    res.json(workOrders)
})

// @desc Get specific work orders
// @route GET /wo/:id
// @access Private
const getWOsbyID = asyncHandler(async (req, res) => {

    const workOrder = await WorkOrder.findById({ _id: req.params.id }).lean()

    if (!workOrder) {
        return res.status(400).json({ message: 'No Work Orders found' })
    }
    res.json(workOrder)
})

// @desc Get work order history
// @route GET /wo/history
// @access Private
const getWorkOrderHistory = asyncHandler(async (req, res) => {
    const workOrders = await WorkOrder.find({ progress: "Completed" }).lean()
    if (!workOrders?.length) {
        return res.status(400).json({ message: 'No Work Orders found' })
    }
    res.json(workOrders)
})

// @desc Get work order on progress
// @route GET /wo/history
// @access Private
const getWorkOrderOnProgress = asyncHandler(async (req, res) => {
    const workOrders = await WorkOrder.find({ progress: "Work in Progress" }).lean()
    if (!workOrders?.length) {
        return res.status(400).json({ message: 'No Work Orders found' })
    }
    res.json(workOrders)
})

// @desc Get final inspection work orders
// @route GET /wo/final
// @access Private
const getWoFinalInspection = asyncHandler(async (req, res) => {
    const workOrders = await WorkOrder.find({ progress: "Final Inspection" }).lean()
    if (!workOrders?.length) {
        return res.status(400).json({ message: 'No Work Orders found' })
    }
    res.json(workOrders)
})

// @desc Create new work orders
// @route POST /wo
// @access Private
const createWorkOrder = asyncHandler(async (req, res) => {
    const { partName, qty } = req.body

    const workOrderObject = { partName, qty }

    // Create and store new WorkOrder
    const workOrder = await WorkOrder.create(workOrderObject)

    if (workOrder) {
        res.status(201).json({ message:`New Work Order ${workOrder.id} created` })
    } else {
        res.status(400).json({ message: 'Invalid Work Order data received' })
    }
})

// @desc Update work orders
// @route PATCH /wo
// @access Private
const updateWorkOrder = asyncHandler(async (req, res) => {

    const { id, partName, qty} = req.body

    const workOrder = await WorkOrder.findById(id).exec()

    if(!workOrder) return res.status(404).json({msg: "Work Order not found!!!"})

    try {
        workOrder.set({
            partName: partName,
            qty: qty
        });
        workOrder.save()

        res.status(200).json({msg: "Work Order is updated successfully"})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
})

// @desc Create new work orders
// @route PATCH /wo/assign
// @access Private
const assignWorkOrder = asyncHandler(async (req, res) => {

    const { id, recRepair } = req.body

    const workOrder = await WorkOrder.findById(id).exec()

    if(!workOrder) return res.status(404).json({msg: "Work Order not found!!!"})

    try {
        workOrder.set({
            recRepair: recRepair,
            progress: "Work in Progress"
        });
        workOrder.save()

        res.status(200).json({msg: "Work Order is updated successfully"})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
})

// @desc Create new work orders
// @route PATCH /wo/repair
// @access Private
const repairWorkOrder = asyncHandler(async (req, res) => {

    const { id, repairDesc } = req.body

    const workOrder = await WorkOrder.findById(id).exec()

    if(!workOrder) return res.status(404).json({msg: "Work Order not found!!!"})

    try {
        workOrder.set({
            repairDesc: repairDesc,
            progress: "Final Inspection"
        });
        workOrder.save()

        res.status(200).json({msg: "Work Order is updated successfully"})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
})

// @desc Approve work orders
// @route PATCH /wo/approve
// @access Private
const approveWorkOrder = asyncHandler(async (req, res) => {

    const { id } = req.body

    const workOrder = await WorkOrder.findById(id).exec()

    if(!workOrder) return res.status(404).json({msg: "Work Order not found!!!"})

    try {
        workOrder.set({
            progress: "Completed"
        });
        workOrder.save()

        res.status(200).json({msg: "Work Order is updated successfully"})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
})

// @desc Delete work orders
// @route DELETE /wo
// @access Private
const deleteWorkOrder = asyncHandler(async (req, res) => {
    const { id } = req.body
    
    if (!id) {
        return res.status(400).json({ message: 'Work Order ID required'})
    }

    const workOrder = await WorkOrder.findById(id).exec()

    if (!workOrder) {
        return res.status(400).json({ message: 'WorkOrder not found' })
    }

    const result = await workOrder.deleteOne()

    const reply = `Work Order ${result.id} has been deleted deleted`

    res.json(reply)
})

module.exports = {
    getAllWorkOrders,
    getWOsbyID,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    assignWorkOrder,
    getWorkOrderHistory,
    repairWorkOrder,
    approveWorkOrder,
    getWoFinalInspection,
    getWorkOrderOnProgress
}