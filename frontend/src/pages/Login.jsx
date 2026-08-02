import { useState } from "react";
import api from "../services/api";
import {useNavigate, Link} from "react-router-dom"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]= useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Email is required.");
            return;
          }

        if (!password.trim()) {
            setError("Password is required.");
            return;
            }

        setLoading(true);
        setError("");
        try{
            const response = await api.post("/auth/login",{
                email: email.trim(),
                password,
            });
            console.log (response.data)
            localStorage.setItem(
            "token",
            response.data.access_token
            );
            navigate ("/dashboard")
            
        } catch (error) {
        if (error.response){
            setError(error.response.data.detail);
        }
        else{
            setError("Something went wrong. Please try again later")
        }
        }       
        finally {
            setLoading(false)
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

                <form onSubmit={handleLogin}>
                <h1 className="text-3xl font-bold text-center text-gray-900">
                    Smart Resume ATS
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Welcome Back
                </p>

                {/* Email */}

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                {/* Password */}

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

               {
                error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-300 text-red-700 px-4 py-3">
                        {error}
                    </div>
                )
                }
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-hover transition text-white font-semibold py-3 rounded-lg"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-primary font-semibold"
                    >
                        Create Account
                    </Link>
                </p>
                </form>
            </div>

        </div>
    );
}

export default Login;