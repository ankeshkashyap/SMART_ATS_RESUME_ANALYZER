import { useEffect, useState } from "react";
import api from "../services/api"


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
        <div className="min-h-screen bg-background">

            <h1 className="text-3xl font-bold p-8">
                Dashboard
                Welcome back ,  {user?.name}

            </h1>
        <p>
            {user?.email}
        </p>
        </div>
        
    );
}

export default Dashboard;