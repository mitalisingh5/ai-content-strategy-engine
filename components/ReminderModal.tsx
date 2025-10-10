import React, { useState } from 'react';
import type { CalendarDay } from '../types';
import { BellIcon, XMarkIcon } from './Icons';

interface ReminderModalProps {
  event: CalendarDay;
  onClose: () => void;
  onSetReminder: (dateTime: string) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ event, onClose, onSetReminder }) => {
  const now = new Date();
  // Add a 1-minute buffer to the current time for a better default
  now.setMinutes(now.getMinutes() + 1);
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const [date, setDate] = useState(today);
  const [time, setTime] = useState(currentTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) {
      onSetReminder(`${date}T${time}`);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeInUp"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-modal-title"
    >
      <div
        className="bg-surface-light border border-gray-200 rounded-xl shadow-2xl w-full max-w-md text-text-main-light dark:bg-surface-dark dark:border-gray-700/50 dark:text-text-main-dark"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/50">
          <h2 id="reminder-modal-title" className="text-lg font-bold flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-primary"/>
            Set Reminder
          </h2>
          <button onClick={onClose} aria-label="Close modal" className="text-text-muted-light hover:text-text-main-light transition-colors dark:text-text-muted-dark dark:hover:text-text-main-dark">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Set a reminder for the event:</p>
                <p className="font-semibold text-primary">{event.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="reminder-date" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Date</label>
                    <input
                        id="reminder-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={today}
                        className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-text-main-light placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 dark:bg-dark-bg dark:border-gray-600 dark:text-text-main-dark"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="reminder-time" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Time</label>
                    <input
                        id="reminder-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-text-main-light placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 dark:bg-dark-bg dark:border-gray-600 dark:text-text-main-dark"
                        required
                    />
                </div>
            </div>
          </div>
          <footer className="flex justify-end gap-4 p-4 bg-gray-50 dark:bg-dark-bg/50 border-t border-gray-200 dark:border-gray-700/50">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-text-muted-light hover:bg-gray-200 transition-colors dark:text-text-muted-dark dark:hover:bg-gray-700">
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-primary text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Set Reminder
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;