import { useEffect, useState } from "react";
import api from "../services/api"
import DashboardLayout from "../components/common/DashboardLayout";
import DashboadHeader from "../components/common/dashboard/DashboardHeader";
import StatCard from "../components/ui/StatCard";
import { FileText, BarChart3,Briefcase, Star } from "lucide-react";
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


    return (<div>
            <DashboardLayout user={user}>
                <DashboadHeader user={user}/>
            <div className="grid grid-cols-4 gap-6 mt-8">
                <StatCard
                    title="Resumes Analyzed"
                    value="12"
                    icon={FileText}/>

                <StatCard
                    title="Top Skills"
                    value="12"
                    icon={Star}/>

                <StatCard
                    title="Average ATS Score"
                    value="12"
                    icon={BarChart3}/>

                <StatCard
                    title="Jobs Matched"
                    value="12"
                    icon={Briefcase}/>
            </div>
            </DashboardLayout>
            
            </div>
    );
}

export default Dashboard;