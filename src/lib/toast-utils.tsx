
import { Ban, BanIcon, CircleAlertIcon, Search } from 'lucide-react';
import { toast } from 'sonner';


const baseStyles = "flex items-center gap-2 rounded-lg shadow-md px-4 py-3 min-w-[240px]"

export const showSuccessToast = (message  : String) => {
    toast.custom((t)=> (
  <div className={`${baseStyles} bg-green-50 text-green-800 animate-enter
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
      className={`${baseStyles} bg-red-50 text-red-800 animate-enter
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
      className={`${baseStyles} bg-yellow-50 text-yellow-800
        animate-enter
      }`}
    >
      <CircleAlertIcon />
      <span>{message}</span>
    </div>
  ));
};
