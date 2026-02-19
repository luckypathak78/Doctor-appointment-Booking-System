import jwt from "jsonwebtoken"

const authDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.json({ success: false, message: "Not Authorized. Login Again" })
    }

    const token = authHeader.split(" ")[1]  
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    
    req.docId = decoded.id   
    console.log("DoctorID:", req.docId)

    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Auth Failed" })
  }
}

export default authDoctor





