
import { useState, useCallback, useRef } from 'react';

interface ConfirmationOptions {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const useConfirmationMessage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const confirmAction = useRef<(() => void) | null>(null);
  const cancelAction = useRef<(() => void) | null>(null);

  const showConfirmation = useCallback(({ message, onConfirm, onCancel }: ConfirmationOptions) => {
    setMessage(message);
    confirmAction.current = onConfirm;
    cancelAction.current = onCancel ?? null;
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    confirmAction.current?.();
    setIsOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    cancelAction.current?.();
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    message,
    showConfirmation,
    handleConfirm,
    handleCancel,
  };
};