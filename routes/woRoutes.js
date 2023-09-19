const express = require('express')
const router = express.Router()
const woController = require('../controllers/woController')

router.route('/')
    .get(woController.getAllWorkOrders)
    .post(woController.createWorkOrder)
    .patch(woController.updateWorkOrder)
    .delete(woController.deleteWorkOrder)

router.route('/history')
    .get(woController.getWorkOrderHistory)

router.route('/onprogress')
    .get(woController.getWorkOrderOnProgress)

router.route('/final')
    .get(woController.getWoFinalInspection)

router.route('/:id')
    .get(woController.getWOsbyID)
    
router.route('/assign')
    .patch(woController.assignWorkOrder)

router.route('/repair')
    .patch(woController.repairWorkOrder)

router.route('/approve')
    .patch(woController.approveWorkOrder)



module.exports = router