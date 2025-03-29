import * as motion from "motion/react-client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Edit2, Trash2 } from 'lucide-react';
import { EditUserModal } from './EditUserModal';


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
    const [users, setUsers] = useState<User[]>(() => {
        const savedUsers = localStorage.getItem('usersList');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [actionStatus, setActionStatus] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);
    const [deletedUsers, setDeletedUsers] = useState<Set<number>>(() => {
        const savedDeleted = localStorage.getItem('deletedUsers');
        return new Set(savedDeleted ? JSON.parse(savedDeleted) : []);
    });
    const [editedUsers, setEditedUsers] = useState<Record<number, User>>(() => {
        const savedEdits = localStorage.getItem('editedUsers');
        return savedEdits ? JSON.parse(savedEdits) : {};
    });

    useEffect(() => {
        localStorage.setItem('usersList', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('deletedUsers', JSON.stringify([...deletedUsers]));
    }, [deletedUsers]);

    useEffect(() => {
        localStorage.setItem('editedUsers', JSON.stringify(editedUsers));
    }, [editedUsers]);

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

            const filteredUsers = response.data.data
                .filter(user => !deletedUsers.has(user.id))
                .map(user => editedUsers[user.id] || user);

            setUsers(filteredUsers);
            setTotalPages(response.data.total_pages);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = async (id: number, data: { first_name: string; last_name: string; email: string }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await axios.put(
                `https://reqres.in/api/users/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                const updatedUser = { 
                    ...users.find(u => u.id === id)!,
                    ...data 
                };
                
                setEditedUsers(prev => ({
                    ...prev,
                    [id]: updatedUser
                }));

                setUsers(users.map(user => 
                    user.id === id ? updatedUser : user
                ));

                setActionStatus({
                    type: 'success',
                    message: 'User updated successfully'
                });
            } else {
                throw new Error('Failed to update user');
            }
            
            setTimeout(() => setActionStatus(null), 3000);
        } catch (err) {
            setActionStatus({
                type: 'error',
                message: err instanceof Error ? err.message : 'Failed to update user'
            });
            setTimeout(() => setActionStatus(null), 3000);
            throw err;
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await axios.delete(
                `https://reqres.in/api/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 204 || response.status === 200) {
                setDeletedUsers(prev => new Set(prev).add(id));
                
                setUsers(users.filter(user => user.id !== id));

                setActionStatus({
                    type: 'success',
                    message: 'User deleted successfully'
                });
            } else {
                throw new Error('Failed to delete user');
            }

            setTimeout(() => setActionStatus(null), 3000);
        } catch (err) {
            setActionStatus({
                type: 'error',
                message: err instanceof Error ? err.message : 'Failed to delete user'
            });
            setTimeout(() => setActionStatus(null), 3000);
        }
    };

    const clearStoredData = () => {
        localStorage.removeItem('usersList');
        localStorage.removeItem('deletedUsers');
        localStorage.removeItem('editedUsers');
    };

    return (
        <div className="h-screen flex justify-center items-center bg-slate-900/90 px-8"> 
            <div className="flex flex-1 w-[180px] h-full flex-col">
                <motion.div className="flex flex-1 top-12 text-slate-400 font-bold px-54 text-4xl justify-center mt-6 gap-2">
                    Employee Details
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
                className="relative w-180 min-h-[42.5rem] bg-cyan-200/90 rounded-xl inset-shadow-sm inset-shadow-indigo-500 "
                whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                }}
            >
                {loading ? (
                    <div className="flex justify-center bottom items-center h-[44rem]">
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                    </div>
                ) : error ? (
                    <div className="text-red-400 text-center">{error}</div>
                ) : (
                    <>
                        {actionStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`absolute top-4 right-4 p-3 rounded-lg ${
                                    actionStatus.type === 'success' 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-red-500/20 text-red-400'
                                }`}
                            >
                                {actionStatus.message}
                            </motion.div>
                        )}
                        <div className="absolute inset-0 h-full w-full bg-white rounded-xl divide-y divide-blue-400/40 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
                            {users.map((user, index) => (
                                <motion.div 
                                    key={user.id}
                                    className="flex items-center gap-2 p-6 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                                        <img
                                            src={user.avatar}
                                            alt={`${user.first_name} ${user.last_name}`}
                                            className="w-16 h-16 rounded-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold text-neutral-400">
                                            {user.first_name} {user.last_name}
                                        </h2>
                                        <p className="text-neutral-400">{user.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </motion.div>

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleEditUser}
                />
            )}
        </div>
    )
}