import toast from 'react-hot-toast';
import { Ban, BanIcon, CircleAlertIcon, Search } from 'lucide-react';


const baseStyles = "flex items-center gap-2 rounded-lg shadow-md px-4 py-3 min-w-[240px]"

export const showSuccessToast = (message  : String) => {
    toast.custom((t)=> (
  <div className={`${baseStyles} bg-green-50 text-green-800 ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >

    <Search/>
    <span>{message}</span>
</div>
    ));
};




export const showErrorToast = (message: string) => {
  toast.custom((t) => (
    <div
      className={`${baseStyles} bg-red-50 text-red-800 ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <BanIcon />
      <span>{message}</span>
    </div>
  ));
};

export const showWarningToast = (message: string) => {
  toast.custom((t) => (
    <div
      className={`${baseStyles} bg-yellow-50 text-yellow-800 ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <CircleAlertIcon />
      <span>{message}</span>
    </div>
  ));
};
