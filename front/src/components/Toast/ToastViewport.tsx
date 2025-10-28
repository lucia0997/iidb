import { DFToast } from "@df/ui";
import { useToast } from "@df/utils"

export const ToastViewport: React.FC = () => {
    const { toast, hideToast }  = useToast();

    return <DFToast toast={toast ?? null} onClose={hideToast} /> 
}