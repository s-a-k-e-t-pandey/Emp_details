
export const Input = ({label, placeholder, onChange, type="text"}: {
    label: string,
    placeholder: string,
    onChange : (e: any) => void,
    type: "email" | "password" | "text"
}) =>{

    return (
        <div className="pt-2 text-slate-900">
            <div>
            * <label>{label}</label>
            </div>
            <input type={type} placeholder={placeholder} onChange={onChange} className="border rounded text-gray-400 px-2 py-2 w-full"/>
        </div>
    )
}