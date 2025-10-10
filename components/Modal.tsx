import React from 'react';
import { XMarkIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-center items-center p-4 animate-fadeInUp"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl text-text-main dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-xl font-bold text-text-main dark:text-gray-50">{title}</h2>
          <button onClick={onClose} aria-label="Close modal" className="text-text-muted hover:text-text-main transition-colors dark:text-gray-400 dark:hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;