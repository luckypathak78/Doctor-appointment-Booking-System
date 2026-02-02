import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken"

// ===============================
// ADD DOCTOR CONTROLLER
// ===============================
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

    // ===============================
    // HASH PASSWORD
    // ===============================
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // ===============================
    // CLOUDINARY UPLOAD
    // ===============================
    const imageUpload = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    })

    const imageUrl = imageUpload.secure_url

    // ===============================
    // SAVE DOCTOR
    // ===============================
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

// ===============================
// ADMIN LOGIN
// ===============================
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


export { addDoctor, loginAdmin, allDoctors }

