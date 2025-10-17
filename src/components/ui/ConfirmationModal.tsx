import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  variant = 'primary',
  isLoading,
}) => {
  if (!isOpen) return null;

  const confirmButtonVariant = variant === 'danger' ? 'danger' : 'primary';

  return (
    <div className="w-screen fixed inset-0 bg-black/75 flex justify-center items-center z-50">
      <div className="absolute top-1/2 left-1/2 bg-white opacity-100 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-start">
          <div
            className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
              variant === 'danger' ? 'bg-red-100' : 'bg-blue-100'
            } sm:mx-0 sm:h-10 sm:w-10`}
          >
            <i
              className={`fas ${
                variant === 'danger' ? 'fa-exclamation-triangle text-red-600' : 'fa-info-circle text-blue-600'
              }`}
            ></i>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button
            onClick={onConfirm}
            variant={confirmButtonVariant}
            className="w-full sm:ml-3 sm:w-auto"
            isLoading={isLoading}
          >
            {confirmButtonText}
          </Button>
          <Button onClick={onClose} variant="secondary" className="mt-3 w-full sm:mt-0 sm:w-auto">
            Batal
          </Button>
        </div>
      </div>
    </div>
  );
};