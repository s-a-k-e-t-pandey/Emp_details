interface InputProps {
    label: string;
    placeholder: string;
    type: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    value?: string;
}

export const Input = ({ label, placeholder, type, onChange, className = "", value }: InputProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-cyan-400/80 text-sm font-medium">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                className={`bg-slate-800/50 border border-cyan-500/20 rounded-lg px-4 py-2.5 
                          text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 
                          focus:ring-cyan-500/40 transition-all duration-200 ${className}`}
            />
        </div>
    )
}