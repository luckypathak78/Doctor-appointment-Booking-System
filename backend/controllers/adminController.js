import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

// ADD DOCTOR CONTROLLER

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      experience,
      degree,
      about,
      fees,
      address,
    } = req.body

    // image from multer
    const image = req.file

    // ===============================
    // VALIDATIONS
    // ===============================
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !experience ||
      !degree ||
      !about ||
      !fees ||
      !address ||
      !image
    ) {
      return res.json({ success: false, message: "Missing Details" })
    }

    const cleanEmail = email.trim()

    if (!validator.isEmail(cleanEmail)) {
      return res.json({ success: false, message: "Invalid email format" })
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      })
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    // CLOUDINARY UPLOAD
    
    const imageUpload = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    })

    const imageUrl = imageUpload.secure_url

    // SAVE DOCTOR
    const doctorData = {
      name,
      email: cleanEmail,
      password: hashedPassword,
      speciality,
      experience,
      degree,
      about,
      fees,
      image: imageUrl,
      address: typeof address === "string" ? JSON.parse(address) : address,
      date: Date.now(),
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()

    res.json({ success: true, message: "Doctor Added Successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ADMIN LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      )

      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: "Invalid Credentials" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

//API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })


  }  catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}
//API to get all appointment list
const appointmentsAdmin = async (req,res) => {

  try  {

    const appointments = await appointmentModel.find({})
    .populate('docData')
    .populate('userData')
    res.json({success:true,appointments})

  } catch (error) {
    console.log(error)
   res.json({success:false,message:error.message})
  }
}


//API to cancel appointment

const appointmentCancel = async (req, res) => {
  try {
    const userId = req.userId
    const { appointmentId } = req.body

    //  Get appointment
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData) {
      return res.json({ success: false, message: 'Appointment not found' })
    }

    //  Authorization check
    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: 'Unauthorized action' })
    }

    //  Already cancelled protection
    if (appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment already cancelled' })
    }

    //  Cancel appointment
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    //  Release doctor slot
    const { docId, slotDate, slotTime } = appointmentData

    const doctorData = await doctorModel.findById(docId)

    if (!doctorData) {
      return res.json({ success: false, message: 'Doctor not found' })
    }

    let slots_booked = doctorData.slots_booked || {}

    // if date exists
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (time) => time !== slotTime
      )

      // remove date if empty
      if (slots_booked[slotDate].length === 0) {
        delete slots_booked[slotDate]
      }
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment Cancelled' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//API to get dashboard data for admin panel
const adminDashboard = async (req,res) => {

  try {

    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors:doctors.length,
      appointments:appointments.length,
      pattients: users.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }

    res.json({success:true,dashData})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}


export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel,adminDashboard }

