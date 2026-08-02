import { useEffect, useState } from "react";
import api from "../services/api"
import DashboardLayout from "../components/common/DashboardLayout";

function Dashboard() {

const [user,setUser]=useState(null);
const[loading, setLoading]= useState(true);
const [error,setError] = useState("");

useEffect(()=>{
    async function fetchProfile (){
         try {
           const response= await api.get ("/auth/profile")
           console.log(response.data);
           setUser(response.data);
         }
         catch(error){
            if (error.response) {
                 setError(error.response.data.detail);
                }
                else {
                    setError("Something went wrong.");
                }
                }
         finally{
            setLoading(false);
         }

       }
       fetchProfile();
},[]);


    return (
            <DashboardLayout user={user}/>
    );
}

export default Dashboard;