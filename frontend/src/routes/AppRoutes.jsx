import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "../pages/Signup";
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Signup />}
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

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;