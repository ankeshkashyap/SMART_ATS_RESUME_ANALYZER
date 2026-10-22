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
import ResumeDetails from "../pages/ResumeDetails";
import AnalysisHistory from "../pages/AnalysisHistory";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
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
                    path="/resume/:resumeId"
                    element={
                        <ProtectedRoute>
                            <ResumeDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/resume"
                    element={
                        <ProtectedRoute>
                            <Resume />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analysis-history"
                    element={
                        <ProtectedRoute>
                            <AnalysisHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                </Routes>

                
                
        </BrowserRouter>
    );
}

export default AppRoutes;