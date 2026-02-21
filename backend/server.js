import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

const app = express()
const port = process.env.PORT || 4000

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/uploads', express.static('uploads'))

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
  res.send('API WORKING')
})

// ✅ START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await connectDB()
    await connectCloudinary()

    app.listen(port, () => {
      console.log("Database Connected")
      console.log("Server Started", port)
    })

  } catch (error) {
    console.log("Failed to start server:", error)
  }
}

startServer()

