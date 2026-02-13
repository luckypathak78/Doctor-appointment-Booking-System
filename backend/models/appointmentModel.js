import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId:{ type: String, required:true },
    docId: { type:String, required:true },
    slotDate:{ type:String,reqired:true },
    slotTime:{ type:String,reqired:true },
    userData:{ type:Object,reqired:true },
    docData:{ type:Object,reqired:true },
    amount:{ type:Number,reqired:true },
    date:{ type:Number,reqired:true },
    cancelled:{ type:Boolean,default:false },
    payment:{ type:Boolean,deafault:false },
    isCompleted:{ type:Boolean,default:false },
})


const appointmentModel = mongoose.models.appointment || mongoose.model('appointment',appointmentSchema)

export default appointmentModel