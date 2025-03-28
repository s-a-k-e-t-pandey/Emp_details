import { useState, FormEvent } from "react"
import { Input } from "./Input"
import * as motion from "motion/react-client";
import axios from "axios"
import { Loader2, User, Lock } from "lucide-react"
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
                throw new Error("Please fill in all Credentials")
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usersList');
        localStorage.removeItem('deletedUsers');
        localStorage.removeItem('editedUsers');
        navigate('/login');
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-black px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <motion.form 
                    onSubmit={handleSubmit} 
                    className="relative overflow-hidden"
                    whileHover={{
                        boxShadow: "0px 20px 50px rgba(11, 213, 160, 0.3)",
                    }}
                >
                    <motion.div
                        className="bg-slate-400/40 backdrop-blur-lg rounded-xl p-8 border border-cyan-500/20"
                    >
                        <motion.div 
                            className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-200/30 to-purple-200/30 blur-3xl"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 45, 0],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        />

                        <motion.h2 
                            className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Login
                        </motion.h2>

                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="relative">
                                    <User className="absolute left-3 top-3/2 -translate-y-1/2 h-5 w-5 text-cyan-400/60" />
                                    <Input 
                                        label="Email"
                                        placeholder="Enter your email"
                                        onChange={(e) => setPostInputs({
                                            ...postInputs,
                                            email: e.target.value
                                        })} 
                                        type="email"
                                        className="pl-10"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3/2 -translate-y-1/2 h-5 w-5 text-cyan-400/60" />
                                    <Input 
                                        label="Password"
                                        placeholder="Enter your password"
                                        onChange={(e) => setPostInputs({
                                            ...postInputs,
                                            password: e.target.value
                                        })} 
                                        type="password"
                                        className="pl-10"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {error && (
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm mt-4 text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        {success && (
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-teal-400 text-sm mt-4 text-center"
                            >
                                Login successful!
                            </motion.p>
                        )}

                        <motion.div 
                            className="mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.button 
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500/80 to-teal-500/80 
                                         text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 
                                         hover:from-cyan-500/90 hover:to-teal-500/90 disabled:opacity-50 disabled:cursor-not-allowed
                                         shadow-lg shadow-cyan-500/20"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
    )
}