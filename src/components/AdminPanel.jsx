import React, { useState } from 'react';

const AdminPanel = ({ schools, settings, onAddSchool, onAddExam, onImportData, onUpdateSettings, onDeleteEvent }) => {
    const [newSchoolName, setNewSchoolName] = useState('');
    const [selectedSchoolId, setSelectedSchoolId] = useState('');
    const [trackName, setTrackName] = useState('一般');

    const [examType, setExamType] = useState('Exam');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [examLabel, setExamLabel] = useState('');

    // Settings State
    const [globalStart, setGlobalStart] = useState(settings.startDate);
    const [globalEnd, setGlobalEnd] = useState(settings.endDate);

    const handleUpdateSettings = (e) => {
        e.preventDefault();
        onUpdateSettings({ startDate: globalStart, endDate: globalEnd });
        alert('設定を保存しました');
    };

    const handleAddSchool = (e) => {
        e.preventDefault();
        if (!newSchoolName) return;
        onAddSchool(newSchoolName);
        setNewSchoolName('');
    };

    const handleAddExam = (e) => {
        e.preventDefault();
        if (!selectedSchoolId || !startDate || !examLabel) return;

        // If end date is empty, use start date (single day event)
        const finalEnd = endDate || startDate;

        onAddExam(selectedSchoolId, trackName, {
            type: examType,
            start: startDate,
            end: finalEnd,
            label: examLabel
        });

        setStartDate('');
        setEndDate('');
        setExamLabel('');
    };

    // CSV Export with BOM
    const handleExportCSV = () => {
        const headers = 'School,Track,EventType,Label,StartDate,EndDate';
        const rows = [];

        schools.forEach(school => {
            if (!school.tracks || school.tracks.length === 0) {
                rows.push(`${school.name},,,,,`);
            } else {
                school.tracks.forEach(track => {
                    if (track.events.length === 0) {
                        rows.push(`${school.name},${track.name},,,,`);
                    } else {
                        track.events.forEach(event => {
                            rows.push(`${school.name},${track.name},${event.type},${event.label},${event.start},${event.end}`);
                        });
                    }
                });
            }
        });

        const csvContent = '\uFEFF' + [headers, ...rows].join('\n'); // Add BOM for Excel
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'exam_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up
    };

    // CSV Import
    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n');
            const dataLines = lines.slice(1);

            const newSchoolsMap = new Map();
            let schoolIdCounter = Date.now();

            dataLines.forEach(line => {
                if (!line.trim()) return;
                const [schoolName, trackName, type, label, start, end] = line.split(',');

                if (!schoolName) return;

                if (!newSchoolsMap.has(schoolName)) {
                    newSchoolsMap.set(schoolName, {
                        id: schoolIdCounter++,
                        name: schoolName,
                        tracks: []
                    });
                }

                const school = newSchoolsMap.get(schoolName);

                if (trackName) {
                    let track = school.tracks.find(t => t.name === trackName);
                    if (!track) {
                        track = { id: `t-${Math.random()}`, name: trackName, events: [] };
                        school.tracks.push(track);
                    }

                    if (type && label && start) {
                        track.events.push({
                            id: `e-${Math.random()}`,
                            type: type,
                            label: label,
                            start: start,
                            end: end || start
                        });
                    }
                }
            });

            onImportData(Array.from(newSchoolsMap.values()));
            alert('CSVデータを読み込みました');
        };
        reader.readAsText(file);
    };

    return (
        <div className="admin-panel" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>教員用管理画面</h2>

            <div className="admin-section" style={{ margin: '2rem 0', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>カレンダー設定</h3>
                <form onSubmit={handleUpdateSettings} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>開始日</label>
                        <input type="date" value={globalStart} onChange={e => setGlobalStart(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>終了日</label>
                        <input type="date" value={globalEnd} onChange={e => setGlobalEnd(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                    </div>
                    <button type="submit" style={{ padding: '0.5rem 1rem', background: '#4b5563', color: 'white', border: 'none', borderRadius: '4px' }}>
                        設定保存
                    </button>
                </form>
            </div>

            <div className="admin-section" style={{ margin: '2rem 0', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>CSVデータ管理</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={handleExportCSV} style={{ padding: '0.5rem 1rem', background: '#059669', color: 'white', border: 'none', borderRadius: '4px' }}>
                        CSV書き出し (Excel対応)
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label htmlFor="csv-upload" style={{ cursor: 'pointer', padding: '0.5rem 1rem', background: '#d1d5db', borderRadius: '4px' }}>
                            CSV読み込み
                        </label>
                        <input
                            id="csv-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleImportCSV}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    フォーマット: School,Track,EventType,Label,StartDate,EndDate
                </p>
            </div>

            <div className="admin-section" style={{ margin: '2rem 0', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>学校を追加</h3>
                <form onSubmit={handleAddSchool} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <input
                        type="text"
                        value={newSchoolName}
                        onChange={(e) => setNewSchoolName(e.target.value)}
                        placeholder="学校名を入力"
                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    <button type="submit" style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}>
                        追加
                    </button>
                </form>
            </div>

            <div className="admin-section" style={{ margin: '2rem 0', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>予定を追加</h3>
                <form onSubmit={handleAddExam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <select
                        value={selectedSchoolId}
                        onChange={(e) => setSelectedSchoolId(e.target.value)}
                        style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    >
                        <option value="">学校を選択</option>
                        {schools.map(school => (
                            <option key={school.id} value={school.id}>{school.name}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={trackName}
                        onChange={(e) => setTrackName(e.target.value)}
                        placeholder="区分 (例: 一般, 推薦, 学特Ⅰ)"
                        style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.75rem' }}>開始日</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.75rem' }}>終了日 (単日の場合は空欄)</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <select
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        >
                            <option value="Application">出願/手続き</option>
                            <option value="Exam">試験</option>
                            <option value="Result">発表</option>
                            <option value="Other">その他</option>
                        </select>
                        <input
                            type="text"
                            value={examLabel}
                            onChange={(e) => setExamLabel(e.target.value)}
                            placeholder="表示名 (例: 出願期間, 試験)"
                            style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                    </div>

                    <button type="submit" style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', alignSelf: 'flex-start' }}>
                        予定を追加
                    </button>
                </form>
            </div>

            <div className="admin-section" style={{ margin: '2rem 0', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>登録済み予定一覧</h3>
                {schools.map(school => {
                    const hasEvents = school.tracks && school.tracks.some(track => track.events && track.events.length > 0);
                    if (!hasEvents) return null;

                    return (
                        <div key={school.id} style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '6px' }}>
                            <h4 style={{ marginBottom: '1rem', color: '#1f2937' }}>{school.name}</h4>
                            {school.tracks.map(track => {
                                if (!track.events || track.events.length === 0) return null;
                                return (
                                    <div key={track.id} style={{ marginBottom: '1rem' }}>
                                        <h5 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{track.name}</h5>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {track.events.map(event => (
                                                <div
                                                    key={event.id}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '0.5rem',
                                                        background: 'white',
                                                        borderRadius: '4px',
                                                        border: '1px solid #e5e7eb'
                                                    }}
                                                >
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ fontWeight: '500' }}>{event.label}</span>
                                                        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                            {event.start === event.end ? event.start : `${event.start} 〜 ${event.end}`}
                                                        </span>
                                                        <span
                                                            style={{
                                                                marginLeft: '0.5rem',
                                                                padding: '0.125rem 0.5rem',
                                                                fontSize: '0.75rem',
                                                                borderRadius: '3px',
                                                                background: event.type === 'Exam' ? '#fef2f2' : event.type === 'Result' ? '#eff6ff' : event.type === 'Application' ? '#f0fdf4' : '#f9fafb',
                                                                color: event.type === 'Exam' ? '#991b1b' : event.type === 'Result' ? '#1e40af' : event.type === 'Application' ? '#166534' : '#374151'
                                                            }}
                                                        >
                                                            {event.type === 'Exam' ? '試験' : event.type === 'Result' ? '発表' : event.type === 'Application' ? '出願/手続き' : 'その他'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => onDeleteEvent(school.id, track.id, event.id)}
                                                        style={{
                                                            padding: '0.25rem 0.75rem',
                                                            background: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            fontSize: '0.875rem',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        削除
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
                {!schools.some(school => school.tracks && school.tracks.some(track => track.events && track.events.length > 0)) && (
                    <p style={{ color: '#6b7280', textAlign: 'center', marginTop: '1rem' }}>登録済みの予定はありません</p>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
