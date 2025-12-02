import { useState, useEffect } from 'react'
import CalendarView from './components/CalendarView'
import AdminPanel from './components/AdminPanel'
import { initialSchools } from './data/mockData'
import './index.css'
import { db } from './firebase'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'

function App() {
  const [schools, setSchools] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');

  // Configurable Date Range State
  const [calendarSettings, setCalendarSettings] = useState({
    startDate: '2025-01-01',
    endDate: '2025-03-31'
  });

  // Firebase Synchronization
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "calendar_data", "main"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setSchools(data.schools || []);
        if (data.settings) {
          setCalendarSettings(data.settings);
        }
      } else {
        // Initialize with mock data if DB is empty
        const initialData = {
          schools: initialSchools,
          settings: {
            startDate: '2025-01-01',
            endDate: '2025-03-31'
          }
        };
        setDoc(doc(db, "calendar_data", "main"), initialData);
        setSchools(initialSchools);
      }
    });
    return () => unsub();
  }, []);

  const saveToFirebase = async (newSchools, newSettings) => {
    try {
      await setDoc(doc(db, "calendar_data", "main"), {
        schools: newSchools !== undefined ? newSchools : schools,
        settings: newSettings !== undefined ? newSettings : calendarSettings
      });
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      alert("保存に失敗しました。");
    }
  };

  const handleAddSchool = (name) => {
    const newSchool = {
      id: Date.now(),
      name,
      tracks: []
    };
    const newSchools = [...schools, newSchool];
    saveToFirebase(newSchools);
  };

  const handleAddExam = (schoolId, trackName, event) => {
    const newSchools = schools.map(school => {
      if (school.id === parseInt(schoolId) || school.id === schoolId) {
        let updatedTracks = [...school.tracks];
        let trackIndex = updatedTracks.findIndex(t => t.name === trackName);

        if (trackIndex === -1) {
          // Create new track if it doesn't exist
          updatedTracks.push({
            id: `t-${Date.now()}`,
            name: trackName,
            events: [{ ...event, id: `e-${Date.now()}` }]
          });
        } else {
          // Add to existing track
          updatedTracks[trackIndex] = {
            ...updatedTracks[trackIndex],
            events: [...updatedTracks[trackIndex].events, { ...event, id: `e-${Date.now()}` }]
          };
        }

        return {
          ...school,
          tracks: updatedTracks
        };
      }
      return school;
    });
    saveToFirebase(newSchools);
  };

  const handleImportData = (newSchools) => {
    saveToFirebase(newSchools);
  };

  const handleUpdateSettings = (newSettings) => {
    saveToFirebase(undefined, newSettings);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '215124') {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
    } else {
      alert('パスワードが間違っています');
    }
  };

  const handleDeleteEvent = (schoolId, trackId, eventId) => {
    const newSchools = schools.map(school => {
      if (school.id === schoolId) {
        return {
          ...school,
          tracks: school.tracks.map(track => {
            if (track.id === trackId) {
              return {
                ...track,
                events: track.events.filter(event => event.id !== eventId)
              };
            }
            return track;
          })
        };
      }
      return school;
    });
    saveToFirebase(newSchools);
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowLogin(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      <header style={{ padding: '1rem', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>群馬県高校入試カレンダー</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!isAdmin && !showLogin && (
            <button
              onClick={handlePrint}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              印刷
            </button>
          )}
          <button
            onClick={toggleAdmin}
            style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {isAdmin ? 'カレンダーに戻る' : '管理者ログイン'}
          </button>
        </div>
      </header>
      <main style={{ flex: 1, padding: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {showLogin ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <form onSubmit={handleLogin} style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
              <h2 style={{ textAlign: 'center' }}>管理者ログイン</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}>
                  ログイン
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  style={{ flex: 1, padding: '0.5rem', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        ) : isAdmin ? (
          <AdminPanel
            schools={schools}
            settings={calendarSettings}
            onAddSchool={handleAddSchool}
            onAddExam={handleAddExam}
            onImportData={handleImportData}
            onUpdateSettings={handleUpdateSettings}
            onDeleteEvent={handleDeleteEvent}
          />
        ) : (
          <CalendarView
            schools={schools}
            startDate={calendarSettings.startDate}
            endDate={calendarSettings.endDate}
          />
        )}
      </main>
    </div>
  )
}

export default App
