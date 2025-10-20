import { toast as toastifyToast, ToastOptions, Id } from 'react-toastify';

interface ToastifyOptions {
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  position?: ToastOptions['position'];
  autoClose?: ToastOptions['autoClose'];
  hideProgressBar?: ToastOptions['hideProgressBar'];
  closeOnClick?: ToastOptions['closeOnClick'];
  pauseOnHover?: ToastOptions['pauseOnHover'];
  draggable?: ToastOptions['draggable'];
  theme?: ToastOptions['theme'];
}

interface ToastReturn {
  id: Id;
  dismiss: () => void;
  update: (options: ToastifyOptions) => void;
}

// Configurações padrão para cada tipo de toast
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

function toast({ title, description, type, ...options }: ToastifyOptions): ToastReturn {
  let message = '';
  if (title && description) {
    message = `${title}: ${description}`;
  } else if (title) {
    message = title;
  } else if (description) {
    message = description;
  }

  const id = toastifyToast(message, {
    ...defaultOptions,
    type: type || 'default',
    ...options,
  });

  return {
    id,
    dismiss: () => toastifyToast.dismiss(id),
    update: (updateOptions: ToastifyOptions) => {
      let updateMessage = '';
      if (updateOptions.title && updateOptions.description) {
        updateMessage = `${updateOptions.title}: ${updateOptions.description}`;
      } else if (updateOptions.title) {
        updateMessage = updateOptions.title;
      } else if (updateOptions.description) {
        updateMessage = updateOptions.description;
      }
      
      toastifyToast.update(id, {
        render: updateMessage,
        ...updateOptions,
      });
    },
  };
}

// Funções de conveniência para diferentes tipos
toast.success = (options: ToastifyOptions): ToastReturn => {
  return toast({ ...options, type: 'success' });
};

toast.error = (options: ToastifyOptions): ToastReturn => {
  return toast({ ...options, type: 'error' });
};

toast.warning = (options: ToastifyOptions): ToastReturn => {
  return toast({ ...options, type: 'warning' });
};

toast.info = (options: ToastifyOptions): ToastReturn => {
  return toast({ ...options, type: 'info' });
};

// Hook personalizado
export function useToastify() {
  return {
    toast,
    dismiss: (id?: Id) => id ? toastifyToast.dismiss(id) : toastifyToast.dismiss(),
    dismissAll: () => toastifyToast.dismiss(),
  };
}

export { toast };