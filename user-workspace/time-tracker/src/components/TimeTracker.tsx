import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { ClockIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/solid';

type EntryType = 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END' | 'VACATION' | 'SICK_LEAVE';

interface TimeEntry {
  type: EntryType;
  timestamp: Timestamp;
  userId: string;
  companyId: string;
}

export default function TimeTracker() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lastEntry, setLastEntry] = useState<TimeEntry | null>(null);
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);

  useEffect(() => {
    if (currentUser) {
      loadTodayEntries();
    }
  }, [currentUser]);

  const loadTodayEntries = async () => {
    if (!currentUser) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entriesRef = collection(db, 'timeEntries');
    const q = query(
      entriesRef,
      where('userId', '==', currentUser.uid),
      where('timestamp', '>=', today),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const entries = querySnapshot.docs.map(doc => ({
      ...doc.data() as TimeEntry
    }));

    setTodayEntries(entries);
    setLastEntry(entries[0] || null);
  };

  const recordEntry = async (type: EntryType) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const entry: Omit<TimeEntry, 'id'> = {
        type,
        timestamp: Timestamp.now(),
        userId: currentUser.uid,
        companyId: 'default-company' // This should come from user's profile
      };

      await addDoc(collection(db, 'timeEntries'), entry);
      await loadTodayEntries();
    } catch (error) {
      console.error('Error recording time entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = () => {
    if (!lastEntry) return 'Not clocked in';
    switch (lastEntry.type) {
      case 'CLOCK_IN':
        return 'Currently working';
      case 'BREAK_START':
        return 'On break';
      case 'CLOCK_OUT':
        return 'Clocked out';
      case 'VACATION':
        return 'On vacation';
      case 'SICK_LEAVE':
        return 'On sick leave';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Time Tracker</h2>
          <div className="text-gray-600 dark:text-gray-300">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 text-lg">
            <ClockIcon className="w-6 h-6" />
            <span>{getStatusText()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => recordEntry('CLOCK_IN')}
            disabled={loading || lastEntry?.type === 'CLOCK_IN'}
            className="btn btn-primary flex items-center justify-center space-x-2"
          >
            <PlayIcon className="w-5 h-5" />
            <span>Clock In</span>
          </button>

          <button
            onClick={() => recordEntry('CLOCK_OUT')}
            disabled={loading || lastEntry?.type === 'CLOCK_OUT'}
            className="btn btn-secondary flex items-center justify-center space-x-2"
          >
            <PauseIcon className="w-5 h-5" />
            <span>Clock Out</span>
          </button>

          <button
            onClick={() => recordEntry(lastEntry?.type === 'BREAK_START' ? 'BREAK_END' : 'BREAK_START')}
            disabled={loading}
            className="btn btn-secondary flex items-center justify-center space-x-2"
          >
            {lastEntry?.type === 'BREAK_START' ? 'End Break' : 'Start Break'}
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Today's Activity</h3>
          <div className="space-y-2">
            {todayEntries.map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <span>{entry.type.replace('_', ' ').toLowerCase()}</span>
                <span>{format(entry.timestamp.toDate(), 'HH:mm:ss')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
