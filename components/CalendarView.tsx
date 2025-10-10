import React, { useState, useEffect, useRef } from 'react';
import type { CalendarDay } from '../types';
import { BellIcon, CheckCircleIcon, PlusIcon } from './Icons';
import ReminderModal from './ReminderModal';
import EventDetailModal from './EventDetailModal';

// --- Base64 encoded alarm sound ---
const alarmSound = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT19AAAAAP/B4eHg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg..."

interface RingingReminderModalProps {
    event: CalendarDay;
    onClose: () => void;
    onMarkAsDone: () => void;
}

const RingingReminderModal: React.FC<RingingReminderModalProps> = ({ event, onClose, onMarkAsDone }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.play().catch(e => console.error("Audio playback failed:", e));
            const timer = setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, 10000); // Play for 10 seconds

            return () => {
                clearTimeout(timer);
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            };
        }
    }, []);

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeInUp"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ringing-reminder-title"
        >
            <audio ref={audioRef} src={alarmSound} loop />
            <div
                className="bg-surface-light border-2 border-yellow-400 rounded-xl shadow-2xl w-full max-w-md text-text-main-light dark:bg-surface-dark dark:border-yellow-500 dark:text-text-main-dark"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 id="ringing-reminder-title" className="text-xl font-bold flex items-center gap-2">
                        <BellIcon className="w-6 h-6 text-yellow-500 animate-pulse" />
                        Reminder!
                    </h2>
                </header>
                <div className="p-6 text-center space-y-4">
                    <p className="text-text-muted-light dark:text-text-muted-dark">It's time for your scheduled post:</p>
                    <p className="text-lg font-semibold text-primary">{event.title}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Format: {event.format}</p>
                </div>
                <footer className="grid grid-cols-2 gap-px">
                     <button
                        onClick={onClose}
                        className="w-full px-4 py-3 rounded-bl-lg bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-dark-bg dark:hover:bg-gray-700 font-semibold"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={onMarkAsDone}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-br-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors"
                    >
                        <CheckCircleIcon className="w-5 h-5"/>
                        Mark as Done
                    </button>
                </footer>
            </div>
        </div>
    );
};


interface CalendarViewProps {
  calendarData: CalendarDay[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ calendarData }) => {
  const [events, setEvents] = useState<CalendarDay[]>(calendarData);
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  
  useEffect(() => {
     const initialEvents = calendarData.map(e => ({ ...e, status: e.status || 'pending' }));
     setEvents(initialEvents);
  }, [calendarData]);

  const daysInPlan = 30;
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const [showReminderModalFor, setShowReminderModalFor] = useState<CalendarDay | null>(null);
  const [eventForModal, setEventForModal] = useState<CalendarDay | null>(null);
  const [reminders, setReminders] = useState<Record<number, { time: string, timeoutId: number }>>({});
  const [ringingReminder, setRingingReminder] = useState<CalendarDay | null>(null);
  
  // Fix: Explicitly type the Map to ensure correct type inference for `content`.
  const calendarMap = new Map<number, CalendarDay>(events.map(item => [item.day, item]));

  const handleSetReminder = (event: CalendarDay, dateTime: string) => {
    if (reminders[event.day]) {
      clearTimeout(reminders[event.day].timeoutId);
    }

    const reminderTime = new Date(dateTime).getTime();
    const now = new Date().getTime();
    const delay = reminderTime - now;

    if (delay > 0) {
      const timeoutId = window.setTimeout(() => {
        setRingingReminder(event);
        setEvents(prev => prev.map(e => e.day === event.day ? { ...e, status: 'missed' } : e));

        setReminders(prev => {
            const newReminders = {...prev};
            delete newReminders[event.day];
            return newReminders;
        });
      }, delay);
      
      setReminders(prev => ({
        ...prev,
        [event.day]: { time: dateTime, timeoutId: timeoutId }
      }));
      
      alert(`Reminder set for ${new Date(dateTime).toLocaleString()}!`);

    } else {
      alert("Please select a future date and time for the reminder.");
    }
    setShowReminderModalFor(null);
  };
  
  const handleSaveChanges = (updatedEvent: CalendarDay) => {
    setEvents(prevEvents => {
        const eventExists = prevEvents.some(event => event.day === updatedEvent.day);
        if (eventExists) {
            return prevEvents.map(event => event.day === updatedEvent.day ? updatedEvent : event);
        } else {
            return [...prevEvents, updatedEvent].sort((a, b) => a.day - b.day);
        }
    });
    setEventForModal(null);
  };
  
  const handleDeleteEvent = (day: number) => {
    setEvents(prevEvents => prevEvents.filter(event => event.day !== day));
    setEventForModal(null);
  };

  const handleMarkAsDone = (day: number) => {
    setEvents(prev => prev.map(e => (e.day === day ? { ...e, status: 'done' } : e)));
    setRingingReminder(null);
  };

  const renderCells = () => {
    const cells = [];
    for (let day = 1; day <= daysInPlan; day++) {
      const content = calendarMap.get(day);
      
      if (content) {
        let eventBgClass = '';
        let eventTextClass = 'text-yellow-800 dark:text-accent';
        if (content.status === 'missed') {
          eventBgClass = 'bg-red-100 border-red-200 dark:bg-red-500/20 dark:border-red-500/30';
          eventTextClass = 'text-red-600 dark:text-red-400';
        } else if (content.status === 'done') {
          eventBgClass = 'bg-green-100 border-green-200 dark:bg-green-500/20 dark:border-green-500/30';
           eventTextClass = 'text-green-600 dark:text-green-400';
        } else {
          eventBgClass = 'bg-accent/20 border-accent/30 dark:bg-accent/20 dark:border-accent/30';
        }

        cells.push(
          <div key={day} className="relative p-2 border-b border-r border-gray-200 min-h-[120px] flex flex-col group transition-all duration-200 bg-surface-light hover:bg-gray-50 hover:scale-105 hover:z-10 hover:shadow-lg dark:bg-surface-dark dark:border-gray-700/50 dark:hover:bg-dark-bg">
            <div className="font-bold text-sm text-text-muted-light group-hover:text-text-main-light dark:text-text-muted-dark dark:group-hover:text-text-main-dark">{day}</div>
            <>
              <button 
                onClick={() => setShowReminderModalFor(content)} 
                className={`absolute top-1 right-1 p-1 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 ${reminders[day] ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                aria-label="Set reminder"
              >
                <BellIcon className="w-4 h-4" />
              </button>
              <div 
                onClick={() => setEventForModal(content)}
                className={`mt-1 text-xs flex-grow p-2 rounded-md cursor-pointer hover:border-accent dark:hover:border-accent ${eventBgClass}`}
              >
                <p className={`font-bold ${eventTextClass} ${content.status === 'done' ? 'line-through' : ''}`}>{content.format}</p>
                <p className={`text-text-main-light mt-1 dark:text-text-main-dark ${content.status === 'done' ? 'line-through' : ''}`}>{content.title}</p>
              </div>
            </>
          </div>
        );
      } else {
        cells.push(
            <div key={day} className="relative p-2 border-b border-r border-gray-200 min-h-[120px] flex flex-col group transition-all duration-200 bg-surface-light hover:bg-gray-50 dark:bg-surface-dark dark:border-gray-700/50 dark:hover:bg-dark-bg">
                <div className="font-bold text-sm text-text-muted-light dark:text-text-muted-dark">{day}</div>
                <div className="flex-grow flex items-center justify-center">
                    <button 
                        onClick={() => setEventForModal({ day, title: '', format: '', status: 'pending' })}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                        aria-label={`Add event for day ${day}`}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Event
                    </button>
                </div>
            </div>
        );
      }
    }
    // Fill up a 5-week (35 cell) grid for a clean layout
    const totalCells = 35;
    while(cells.length < totalCells) {
        cells.push(<div key={`empty-${cells.length}`} className="border-b border-r border-gray-200 bg-gray-50/50 dark:border-gray-700/50 dark:bg-surface-dark/50"></div>)
    }
    return cells;
  };

  return (
    <>
      <div className="bg-surface-light border border-gray-200 rounded-lg overflow-hidden dark:bg-surface-dark dark:border-gray-700/50">
        <div className="text-center py-3">
          <h4 className="font-bold text-text-main-light dark:text-text-main-dark">{monthName} {year}</h4>
        </div>
        <div className="grid grid-cols-7 bg-gray-50 border-t border-b border-gray-200 dark:bg-dark-bg dark:border-t-gray-700/50 dark:border-b-gray-700/50">
          {weekdays.map(day => (
            <div key={day} className="text-center py-2 text-xs font-semibold text-text-muted-light border-r border-gray-200 last:border-r-0 dark:text-text-muted-dark dark:border-gray-700/50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-5">
          {renderCells()}
        </div>
      </div>
      {showReminderModalFor && (
        <ReminderModal
          event={showReminderModalFor}
          onClose={() => setShowReminderModalFor(null)}
          onSetReminder={(dateTime) => handleSetReminder(showReminderModalFor, dateTime)}
        />
      )}
      {eventForModal && (
        <EventDetailModal
            event={eventForModal}
            onClose={() => setEventForModal(null)}
            onSave={handleSaveChanges}
            onDelete={handleDeleteEvent}
        />
      )}
       {ringingReminder && (
        <RingingReminderModal
          event={ringingReminder}
          onClose={() => setRingingReminder(null)}
          onMarkAsDone={() => handleMarkAsDone(ringingReminder.day)}
        />
      )}
    </>
  );
};

export default CalendarView;
