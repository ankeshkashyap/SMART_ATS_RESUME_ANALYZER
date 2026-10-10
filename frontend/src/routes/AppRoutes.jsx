import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "../pages/Signup";
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import JobDescription from "../pages/JobDescription";
import Analysis from "../pages/Analysis";
import Analyze from "../pages/Analyze";
import JDHistory from "../pages/JDHistory";
import Resume from "../pages/Resume";
function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                path = "/Dashboard"
                element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>}
                />
                
                <Route path = "/job-description"
                element = {
                    <ProtectedRoute><JobDescription /></ProtectedRoute>
                
                } />
                
                 <Route
                path="/analysis/:analysisID"
                element={<ProtectedRoute><Analysis/></ProtectedRoute>}/>
                
                <Route
                path="/analyze"
                element={<ProtectedRoute><Analyze/></ProtectedRoute>}/>

                

                <Route
                path="/jd-history"
                element={<ProtectedRoute><JDHistory/></ProtectedRoute>}/>

                <Route
                    path="/resume"
                    element={
                        <ProtectedRoute>
                            <Resume />
                        </ProtectedRoute>
                    }
                />
                </Routes>

                
                
        </BrowserRouter>
    );
}

export default AppRoutes;