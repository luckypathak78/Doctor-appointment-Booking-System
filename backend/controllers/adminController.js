import validator from "validator"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'



//API for adding doctor

const addDoctor = async (req, res) => {

    try {
             
          const {name, email, password, speciality, experience, degree, about, fees, address} = req.body
            const image = req.file ? req.file.path : "";
            const cleanEmail = email?.trim()

            // checking for all data to add doctor
            if(!name || !email || !password || !speciality || !experience || !degree || !about || !fees || !address) {
                return res.json({success:false,message: "Missing Details"})
            }
         
            // validating email format
            if(!validator.isEmail(cleanEmail)){
                return res.json({success:false,message: "please enter a valid email"})
            } 

            // validating strong password
            if (password.length < 8) {
                return res.json({success:false,message: "please enter a strong password"})
            }

            //hashing doctor password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            //upload image to cloudinary
            //const imageUpload = await cloudinary.uploader.upload(image.path, {resource_type:"image"})
           // const imageUrl = imageUpload.secure_url

            const doctorData = {
                name,
                email,
                password: hashedPassword,
                speciality,
                experience,
                degree,
                about,
                fees,
                address: JSON.parse(address),
                date: Date.now()

            }

            const newDoctor = new doctorModel(doctorData)
            await newDoctor.save()
            res.json({success:true,message: "Doctor Added"})

        } catch (error) {
            console.log(error)
            res.json({success:false,message:error.message})

    }
}

//API for admin login
const loginAdmin = async (req, res) => {
    try{
    const {email, password} = req.body

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){


        const token = jwt.sign(email+password, process.env.JWT_SECRET)
        res.json({success:true,token})

    } else {
        return res.json({success:false,message: "Invalid Credentials"})
    }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}


export {addDoctor, loginAdmin}