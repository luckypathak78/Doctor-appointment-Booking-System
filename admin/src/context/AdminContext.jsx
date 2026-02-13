import { createContext, useState, useEffect } from "react";
import axios from "axios"
import { toast } from "react-toastify"

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(
        localStorage.getItem('aToken') || ''
    );
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (aToken) {
            localStorage.setItem('aToken', aToken);
        } else {
            localStorage.removeItem('aToken');
        }
    }, [aToken]);

    const getAllDoctors = async () => {

      try {

        const { data } = await axios.post(
  backendUrl + '/api/admin/all-doctors',
  {},
  {
    headers: {
      Authorization: `Bearer ${aToken}`
    }
  }
)




        if (data.success) {
            setDoctors(data.doctors)
            console.log(data.doctors)
            
        } else {
            toast.error(data.message)
        }

      } catch (error) {
            toast.error(error.message)
      }

    }


    const changeAvailability = async (docId) => {

        try {         const { data } = await axios.post(
  backendUrl + '/api/admin/change-availability',
  {docId},
  {
    headers: {
      Authorization: `Bearer ${aToken}`
    }
  }
)

     if (data.success) {
        toast.success(data.message)
        getAllDoctors()
     } else {
        toast.error(error.message)
     }



        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
          const {data} = await axios.get(backendUrl+'/api/admin/appointments',{
    headers: {
      Authorization: `Bearer ${aToken}`,
    },
  })
       
  if (data.success) {
    setAppointments(data.appointments)
    console.log(data.appointments)
  } else {
    toast.error(data.message)
  }

        } catch (error) {
            toast.error(error.message)
        }
    }

     const cancelAppointment = async (appointmentId) => {
  try {
    const { data } = await axios.post(
      backendUrl + '/api/admin/cancel-appointment',
      { appointmentId },
      {
        headers: {
          Authorization: `Bearer ${aToken}`,},})

    if (data.success) {
      toast.success(data.message)
      getAllAppointments
    } else {
      toast.error(data.message)
    }

  } catch (error) {
    console.log(error)
  }
}


    const value = {
        aToken,
        setAToken,
        backendUrl,doctors,
        getAllDoctors, changeAvailability,
        appointments,setAppointments,
        getAllAppointments,
        cancelAppointment
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
