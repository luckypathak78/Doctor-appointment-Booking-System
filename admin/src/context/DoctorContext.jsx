import React, { useState } from 'react'
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const [dToken, setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    const getAppointments = async () => {
  try {

    const response = await axios.get(
      `${backendUrl}/api/doctor/appointments`,
      {
        headers: { Authorization: `Bearer ${dToken}` }
      }
    )

    if (response && response.data && response.data.success) {
      setAppointments(response.data.appointments)
    } else {
      console.log("API failed:", response?.data?.message)
    }

  } catch (error) {
    console.log("Axios Error:", error.response?.data || error.message)
  }
}     

const completeAppointment = async (appointmentId) => {

  try {

    const {data} = await axios.post(backendUrl+'/api/doctor/complete-appointment',{appointmentId},{
        headers: { Authorization: `Bearer ${dToken}` }
      })
      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }
  } catch (error){
     console.log(error);
     toast.error(error.message)
  }
}


  const cancelAppointment = async (appointmentId) => {

  try {

    const {data} = await axios.post(backendUrl+'/api/doctor/cancel-appointment',{appointmentId},{
        headers: { Authorization: `Bearer ${dToken}` }
      })
      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }
  } catch (error){
     console.log(error);
     toast.error(error.message)
  }
}

   const getDashData = async () => {
    try {
      const {data} = await axios.get(backendUrl+ '/api/doctor/dashboard', {headers: { Authorization: `Bearer ${dToken}` }})
      if (data.success) {
         setDashData(data.dashData)
         console.log(data.dashData)
      } else {
        toast.error(data.message)
      }

   } catch (error) {
    console.log(error);
   }
  }

     const getProfileData = async () => {

      try {

        const {data} = await axios.get(backendUrl+'/api/doctor/profile',{headers: {authorization: `Bearer ${dToken}`}})
        if (data.success) {
          setProfileData(data.profileData)
          console.log(data.profileData)
        }
        } catch (error) {
          console.log(error);
        }
      }
    

     const value = {
         dToken,setDToken,
         backendUrl,
         appointments,setAppointments,
         getAppointments,
         completeAppointment,cancelAppointment,
         dashData,setDashData,getDashData,
         profileData,setProfileData,
         getProfileData,
    }


return (
    <DoctorContext.Provider value={value}>
        {props.children}
    </DoctorContext.Provider>
    )

} 

export default DoctorContextProvider