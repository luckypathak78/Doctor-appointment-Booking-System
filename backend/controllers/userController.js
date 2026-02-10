import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import user from '../models/userModel.js'
import {v2 as cloudinary} from 'cloudinary'

//API to register user
const registerUser = async (req,res) => {

    try{

        const { name,email,password} = req.body

        if( !name || !password || !email ) {
            return res.json({success:false,message:'Missing Details'})
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"enter a valid email"})
        }

        // validating strong password
        if (password.length <8) {
            return res.json({success:false,message:"enter a strong password"})

        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password : hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)


        res.json({success:true,token})


    } catch (error) {
         console.log(error)
         res.json({success:false,message:error.message})
    }
}

const loginUser = async (req, res) => {
    console.log("Login Controller Hit")
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    
    const token = jwt.sign(
      { id: user._id },         
      process.env.JWT_SECRET
    );

    res.json({ success: true, token });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}



//API to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;   // comes from authUser middleware

    const userData = await user.findById(userId).select("-password");

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//API to update user profile
const updateProfile = async (req,res) => {
    try {
        const userId = req.userId
        const { name, phone, address,dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({success:false,message:"Data Missing"})
        }

    await userModel.findByIdAndUpdate(userId,{
  name,
  phone,
  address: typeof address === "string" ? JSON.parse(address) : address,
  dob,
  gender
})

        
        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        
        }

             res.json({success:true, message:"profileUpdated"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {registerUser,loginUser, getProfile, updateProfile}