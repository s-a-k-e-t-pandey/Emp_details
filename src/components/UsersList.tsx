import * as motion from "motion/react-client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';


interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

interface UserResponse {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: User[];
}

export default function UsersList(){
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page: number) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get<UserResponse>(
                `https://reqres.in/api/users?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
            setUsers(response.data.data);
            setTotalPages(response.data.total_pages);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-black px-8"> 
            <div className="flex flex-1 w-[180px] h-full flex-col">
                <motion.div className="flex flex-1 top-12 text-slate-400 font-bold px-54 text-4xl justify-center mt-6 gap-2">
                    Employe Details
                </motion.div>
                <div className="relative bottom-30 bg-neutral-200 h-[380px] left-48 w-[380px] rounded-xl border border-dashed inset-shadow-sm inset-shadow-indigo-500">
                    {hoveredIndex !== null && users[hoveredIndex] && (
                        <motion.div 
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white/90 w-full h-full rounded-xl shadow-lg overflow-hidden"
                            >
                                <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
                                    <motion.img
                                        src={users[hoveredIndex].avatar}
                                        alt={`${users[hoveredIndex].first_name} ${users[hoveredIndex].last_name}`}
                                        className="w-32 h-32 rounded-full shadow-lg object-cover"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                    />
                                    <div className="text-center space-y-2">
                                        <motion.h3 
                                            className="text-2xl font-semibold text-gray-800"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            {users[hoveredIndex].first_name} {users[hoveredIndex].last_name}
                                        </motion.h3>
                                        <motion.p 
                                            className="text-lg text-gray-600"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {users[hoveredIndex].email}
                                        </motion.p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
                <motion.div className="relative flex bottom-4 px-54 justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <motion.button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg ${
                                currentPage === page 
                                    ? 'bg-gray-500/70 text-cyan-400' 
                                    : 'bg-gray-500/40 text-gray-300 hover:bg-teal-500/30 hover:text-cyan-400'
                            } transition-all duration-200 flex items-center justify-center`}
                        >
                            {page}
                        </motion.button>
                    ))}
                </motion.div>
            </div>
            <motion.div 
                className="relative w-180 min-h-[42.5rem] bg-cyan-200/90 rounded-xl inset-shadow-sm inset-shadow-indigo-500"
                whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                }}
            >
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                    </div>
                ) : error ? (
                    <div className="text-red-400 text-center">{error}</div>
                ) : (
                    <div className="absolute inset-0 h-full w-full bg-white rounded-xl divide-y">
                        {users.map((user, index) => (
                            <motion.div 
                                key={user.id}
                                className="flex gap-2 p-6 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                whileHover={{
                                    scale: 1.05,
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                                    <img
                                        src={user.avatar}
                                        alt={`${user.first_name} ${user.last_name}`}
                                        className="w-16 h-16 rounded-full"
                                    />
                                </div>
                                <div className="flex flex-col right-0">
                                    <h2 className="text-lg font-semibold text-neutral-400 px-8 pt-4">
                                        {user.first_name} {user.last_name}
                                    </h2>
                                    <p className="text-neutral-400 absolute pt-4 right-44">{user.email}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}