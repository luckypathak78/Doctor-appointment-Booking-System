

import express from 'express'
import { doctorList, changeAvailability } from '../controllers/doctorController.js'
import authUser from '../middlewares/authUser.js'

const router = express.Router()

router.get('/list',authUser, doctorList)
router.post('/change-availability', authUser, changeAvailability)

export default router
