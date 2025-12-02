import React from 'react';
import { generateDateRange } from '../data/mockData';
import './CalendarView.css';

const CalendarView = ({ schools, startDate, endDate }) => {
    const dates = generateDateRange(startDate, endDate);

    const formatDate = (date) => {
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const getDayOfWeek = (date) => {
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return days[date.getDay()];
    };

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const isSameDate = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const isWithinRange = (date, startStr, endStr) => {
        if (!startStr || !endStr) return false;
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const s = new Date(startStr);
        s.setHours(0, 0, 0, 0);
        const e = new Date(endStr);
        e.setHours(0, 0, 0, 0);
        return d >= s && d <= e;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="school-name-header">
                    学校名
                </div>
                <div className="dates-header-container">
                    {dates.map((date, index) => (
                        <div
                            key={index}
                            className={`date-header-cell ${isWeekend(date) ? 'weekend' : ''}`}
                        >
                            <div className="date-text">{formatDate(date)}</div>
                            <div className="day-text">{getDayOfWeek(date)}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="calendar-body">
                {schools.map(school => (
                    <div key={school.id} className="school-row-group">
                        <div className="school-name-cell-group">
                            {school.name}
                        </div>
                        <div className="school-tracks-container">
                            {school.tracks && school.tracks.map(track => (
                                <div key={track.id} className="track-row">
                                    <div className="track-name-cell">{track.name}</div>
                                    <div className="track-timeline">
                                        {dates.map((date, index) => {
                                            // Find events for this date
                                            const eventsOnDate = track.events.filter(e => {
                                                if (e.start && e.end && e.start !== e.end) {
                                                    return isWithinRange(date, e.start, e.end);
                                                }
                                                return e.start === date.toISOString().split('T')[0] || e.date === date.toISOString().split('T')[0];
                                            });

                                            return (
                                                <div
                                                    key={index}
                                                    className={`timeline-cell ${isWeekend(date) ? 'weekend' : ''}`}
                                                >
                                                    {eventsOnDate.map(event => {
                                                        const isRange = event.start && event.end && event.start !== event.end;
                                                        const isStart = isRange && isSameDate(new Date(event.start), date);
                                                        // Simple visualization: if range, show bar. if point, show marker.
                                                        if (isRange) {
                                                            return (
                                                                <div key={event.id} className="event-bar" title={event.label}>
                                                                    {isStart && <span className="event-label">{event.label}</span>}
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <div
                                                                key={event.id}
                                                                className={`exam-marker ${event.type ? event.type.toLowerCase() : ''}`}
                                                                title={event.label}
                                                            >
                                                                {event.label}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default CalendarView;
