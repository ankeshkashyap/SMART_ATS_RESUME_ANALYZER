import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "../pages/Signup";
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import JobDescription from "../pages/JobDescription";
import Analysis from "../pages/Analysis";
import Analyze from "../pages/Analyze";
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
                    path="/Login"
                    element={<Login />}
                />
                <Route
                path = "/Dashboard"
                element={
                <ProtectedRoute>
                    <Dashboard />/
                </ProtectedRoute>}
                />
                
                <Route path = "/job-description"
                element = {<JobDescription />} />
                
                 <Route
                path="/analysis/:analysisID"
                element={<Analysis/>}/>
                
                <Route
                path="/analyze"
                element={<Analyze/>}/>

                </Routes>
                
        </BrowserRouter>
    );
}

export default AppRoutes;