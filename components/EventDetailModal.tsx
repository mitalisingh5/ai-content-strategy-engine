import React, { useState, useEffect } from 'react';
import type { CalendarDay } from '../types';
import { PencilIcon, TrashIcon, XMarkIcon, PlusIcon } from './Icons';

interface EventDetailModalProps {
  event: CalendarDay;
  onClose: () => void;
  onSave: (updatedEvent: CalendarDay) => void;
  onDelete: (day: number) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(event.title);
  const [format, setFormat] = useState(event.format);
  const isNew = event.title === '' && event.format === '';

  useEffect(() => {
    setTitle(event.title);
    setFormat(event.format);
  }, [event]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...event, title, format });
  };
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the event "${event.title}"?`)) {
        onDelete(event.day);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeInUp"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div
        className="bg-surface-light border border-gray-200 rounded-xl shadow-2xl w-full max-w-lg text-text-main-light dark:bg-surface-dark dark:border-gray-700/50 dark:text-text-main-dark"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/50">
          <h2 id="event-modal-title" className="text-lg font-bold flex items-center gap-2">
            {isNew ? <PlusIcon className="w-5 h-5 text-primary"/> : <PencilIcon className="w-5 h-5 text-primary"/>}
            {isNew ? 'Add New Event' : 'Edit Event Details'}
          </h2>
          <button onClick={onClose} aria-label="Close modal" className="text-text-muted-light hover:text-text-main-light transition-colors dark:text-text-muted-dark dark:hover:text-text-main-dark">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <form onSubmit={handleSave}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="event-title" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Title</label>
              <input
                id="event-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-text-main-light placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 dark:bg-dark-bg dark:border-gray-600 dark:text-text-main-dark"
                required
                autoFocus={isNew}
              />
            </div>
            <div>
              <label htmlFor="event-format" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Format</label>
              <input
                id="event-format"
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-text-main-light placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 dark:bg-dark-bg dark:border-gray-600 dark:text-text-main-dark"
                required
              />
            </div>
          </div>
          <footer className="flex justify-between items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg/50 border-t border-gray-200 dark:border-gray-700/50">
            <div>
              {!isNew && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-md text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-500/20 font-semibold flex items-center gap-2 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete Event
                </button>
              )}
            </div>
            <div className="flex gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-text-muted-light hover:bg-gray-200 transition-colors dark:text-text-muted-dark dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-primary text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isNew ? 'Add Event' : 'Save Changes'}
                </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default EventDetailModal;