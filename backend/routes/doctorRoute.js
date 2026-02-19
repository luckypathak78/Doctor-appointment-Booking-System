

import express from 'express'
import { doctorList, changeAvailability, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const router = express.Router()

router.get('/list',authDoctor, doctorList)
router.post('/change-availability', authDoctor, changeAvailability)
router.post('/login',loginDoctor)
router.get('/appointments',authDoctor,appointmentsDoctor)
router.post('/complete-appointment',authDoctor,appointmentComplete)
router.post('/cancel-appointment',authDoctor,appointmentCancel)
router.get('/dashboard', authDoctor, doctorDashboard)
router.get('/profile',authDoctor,doctorProfile)
router.post('/update-profile', authDoctor, updateDoctorProfile)


export default router
