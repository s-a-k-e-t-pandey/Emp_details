import { useState, FormEvent } from 'react';
import * as motion from 'motion/react-client';
import { X } from 'lucide-react';
import { Input } from './Input';

interface EditUserModalProps {
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        avatar: string;
    };
    onClose: () => void;
    onSave: (id: number, data: { first_name: string; last_name: string; email: string }) => Promise<void>;
}

export const EditUserModal = ({ user, onClose, onSave }: EditUserModalProps) => {
    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validateForm = () => {
        const errors: string[] = [];
        if (!formData.first_name.trim()) errors.push("First name is required");
        if (!formData.last_name.trim()) errors.push("Last name is required");
        if (!formData.email.trim()) {
            errors.push("Email is required");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push("Invalid email format");
        }
        return errors;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const errors = validateForm();
        if (errors.length > 0) {
            setError(errors.join(", "));
            return;
        }

        setLoading(true);

        try {
            await onSave(user.id, formData);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof typeof formData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        setTouched(prev => ({ ...prev, [field]: true }));
        setError(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-slate-800 rounded-xl p-6 w-full max-w-md relative"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Edit User
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="First Name"
                        placeholder="Enter first name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleInputChange('first_name')}
                        className={`${touched.first_name && !formData.first_name.trim() ? 'border-red-500' : ''}`}
                    />
                    <Input
                        label="Last Name"
                        placeholder="Enter last name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleInputChange('last_name')}
                        className={`${touched.last_name && !formData.last_name.trim() ? 'border-red-500' : ''}`}
                    />
                    <Input
                        label="Email"
                        placeholder="Enter email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        className={`${touched.email && (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) ? 'border-red-500' : ''}`}
                    />

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm"
                        >
                            {error}
                        </motion.p>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/80 to-teal-500/80 
                                     text-white hover:from-cyan-500/90 hover:to-teal-500/90 
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}; 