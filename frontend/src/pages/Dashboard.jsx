import { useEffect, useState } from "react";
import api from "../services/api"
import DashboardLayout from "../components/common/DashboardLayout";
import DashboadHeader from "../components/common/dashboard/DashboardHeader";
import StatCard from "../components/ui/StatCard";
import { FileText, BarChart3,Briefcase, Star } from "lucide-react";
import RecentAnalyses from "../components/common/dashboard/RecentAnalyses";
import UploadResume from "./UploadResume";

function Dashboard() {

const [user,setUser]=useState(null);
const[loading, setLoading]= useState(true);
const [error,setError] = useState("");
const [uploadOpen, setUploadOpen]= useState(false);

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
                <DashboadHeader user={user}
                onUploadClick={() => setUploadOpen(true)}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
            <div className="mt-8">
                <RecentAnalyses />
            </div>

            {uploadOpen&& (
                <UploadResume 
                onClose={()=>setUploadOpen(false)}
                />
            )}

            </DashboardLayout>
            
            </div>
    );
}

export default Dashboard;