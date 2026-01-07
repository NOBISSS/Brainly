interface InputProps{
    placeholder:string;
    reference?:React.Ref<HTMLInputElement>;
    type?:string;
    value?:string;
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}

export function Input({placeholder,reference,type="text",value,onChange}:InputProps){
    return <div className="flex items-center justify-center">
        <input
         ref={reference}
         type={type}
         placeholder={placeholder}
         value={value}
         onChange={onChange}
         className={`px-4 py-2 border rounded-md w-full m-2 outline-purple-600 ${type==="password" ? "bg-red-50" : "bg-blue-100"}  not-active:shadow-[2px_3px_2px_1px] transition-all duration-300 `} ></input>
    </div>
}