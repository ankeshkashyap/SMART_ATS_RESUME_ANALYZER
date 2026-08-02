import { useState } from "react";
import api from "../services/api";
import {useNavigate} from "react-router-dom"
import {Link} from "react-router-dom"

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]= useState("")
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        
        
            if (!name.trim()) {
                setError("Name is required.");
                return;
            }

            if (!email.trim()) {
                setError("Email is required.");
                return;
            }

            if (!password.trim()) {
                setError("Password is required.");
                return;
            }

            if (password.length < 8) {
                setError("Password must be at least 8 characters.");
                return;
            }
            

            setLoading(true);
            setError("");
            setSuccess("");
            try{
            const response = await api.post("/auth/signup",{
                name,
                email,
                password,
            });
            setSuccess(response.data.message)
            setTimeout(() => {
            navigate("/login");
            }, 1500);

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

                <form onSubmit={handleSignup}>
                <h1 className="text-3xl font-bold text-center text-gray-900">
                    Smart Resume ATS
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Create your account
                </p>

                {/* Name */}

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">
                        Full Name
                    </label>

                    <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

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
                success && (
                    <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-700">
                        {success}
                    </div>
                )
                }

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
                   {loading?"Create Account...": "Create Account"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link 
                    to="/login" className="text-primary font-semibold cursor-pointer">
                        LogIn
                    </Link>
                </p>
                </form>
            </div>

        </div>
    );
}

export default Signup;