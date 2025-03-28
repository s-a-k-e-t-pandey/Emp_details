import { useState, FormEvent } from "react"
import { Input } from "./Input"
import * as motion from "motion/react-client";
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useNavigate } from 'react-router-dom';

interface LoginInput {
    email: string;
    password: string;
}

export const AuthScreen = () => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<LoginInput>({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            if (!postInputs.email || !postInputs.password) {
                throw new Error("Please fill in all fields")
            }
            const response = await axios.post(
                "https://reqres.in/api/login", 
                postInputs, 
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
            )
            if(response){
                const token = response.data.token
                localStorage.setItem("token", token)
            }

            setSuccess(true)
            setTimeout(() => {
                navigate('/users');
            }, 1500);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.form onSubmit={handleSubmit} className="max-w-md mx-auto rounded-xl"
            whileHover={{
                boxShadow: "0px 20px 50px rgba(11, 213, 160, 0.7)",
                y: -5,
            }}
        >
            <motion.div
                className="bg-slate-400/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20"
            >
                <motion.h2 
                    className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
                >
                    Login
                </motion.h2>

                <div className="space-y-4 text-white">
                    <Input 
                        label="Email" 
                        placeholder="Enter your email" 
                        onChange={(e) => setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })} 
                        type="email"
                    />
                    <Input 
                        label="Password" 
                        placeholder="Enter your password" 
                        onChange={(e) => setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })} 
                        type="password"
                    />
                </div>

                {error && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-4 text-center"
                    >
                        {error}
                    </motion.p>
                )}

                {success && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-400 text-sm mt-4 text-center"
                    >
                        Login successful!
                    </motion.p>
                )}

                <div className="flex justify-center mt-6">
                    <motion.button 
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-gray-500/70 hover:bg-teal-500/30 
                                 text-cyan-400 transition-all duration-200 flex items-center gap-2 
                                 border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </motion.form>
    )
}