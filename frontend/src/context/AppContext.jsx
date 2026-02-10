import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {

  const currencySymbol = '$'
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(
    localStorage.getItem('token') || ''
  )
  const [userData,setUserData] = useState(false)


   const getDoctorsData = async () => {

  try {

    const { data } = await axios.get(
      backendUrl + "/api/doctor/list",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (data.success) {
      setDoctors(data.doctors)
    }

  } catch (error) {
    console.log("ERROR ", error.response?.data || error.message)
  }
}

   const loadUserProfileData = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${backendUrl}/api/user/get-profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setUserData(res.data.userData);
    }
  } catch (error) {
    console.log(error);
  }
};

  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,setUserData,
    loadUserProfileData
  }

  
  useEffect(() => {
    if (token) {
      getDoctorsData()
    }
  }, [token])

  useEffect(()=>{
    if (token) {
      loadUserProfileData()
    //} else {
     // setUserData(false)
    }
  },[token])

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider

