import React, { useState, useRef } from 'react';
import { ThemeContext } from '../ThemeContext';

const getGlassStyles = (isDark: boolean) => ({
  background: isDark 
    ? 'rgba(30, 30, 30, 0.85)' 
    : 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  borderRadius: '20px',
  boxShadow: isDark 
    ? '0 8px 32px rgba(0,0,0,0.3)' 
    : '0 8px 32px rgba(0,0,0,0.1)',
});

// --- Local Glassmorphic Date Picker ---
function GlassDatePicker({ value, onChange, isDark }) {
  const [show, setShow] = React.useState(false);
  const [month, setMonth] = React.useState(() => value ? new Date(value).getMonth() : new Date().getMonth());
  const [year, setYear] = React.useState(() => value ? new Date(value).getFullYear() : new Date().getFullYear());
  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const ref = React.useRef();
  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setShow(false);
    }
    if (show) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [show]);
  function selectDate(day) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${year}-${mm}-${dd}`);
    setShow(false);
  }
  let displayValue = value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [yyyy, mm, dd] = value.split('-');
    displayValue = `${dd}/${mm}/${yyyy}`;
  }
  return (
    <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }} ref={ref}>
      <input
        type="text"
        value={displayValue || ''}
        onFocus={() => setShow(true)}
        readOnly
        placeholder="Date (DD/MM/YYYY)"
        style={{
          width: '100%',
          padding: '14px 18px',
          borderRadius: 10,
          border: `2px solid ${isDark ? '#333' : '#ddd'}`,
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          color: isDark ? '#fff' : '#111',
          fontSize: 18,
          marginBottom: 0,
          outline: 'none',
          boxSizing: 'border-box',
          marginTop: 4,
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
        }}
      />
      {show && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '100%',
          zIndex: 1000,
          width: '100%',
          minWidth: '100%',
          maxWidth: '100%',
          borderRadius: 16,
          boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
          border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.18)' : '#e5e7eb'}`,
          background: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255,255,255,0.95)',
          padding: 20,
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button type="button" onClick={() => { if (month === 0) { setMonth(11); setYear(year - 1); } else { setMonth(month - 1); } }} style={{ background: 'none', border: 'none', color: isDark ? '#fff' : '#222', fontSize: 18, cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}>←</button>
            <span style={{ fontWeight: 600, fontSize: 16, color: isDark ? '#fff' : '#222' }}>{monthNames[month]} {year}</span>
            <button type="button" onClick={() => { if (month === 11) { setMonth(0); setYear(year + 1); } else { setMonth(month + 1); } }} style={{ background: 'none', border: 'none', color: isDark ? '#fff' : '#222', fontSize: 18, cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}>→</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {['S','M','T','W','T','F','S'].map((day, i) => (
              <div key={i} style={{ textAlign: 'center', fontWeight: 600, color: isDark ? '#aaa' : '#666', fontSize: 12, padding: '4px 0' }}>{day}</div>
            ))}
            {Array(firstDay).fill(null).map((_, i) => <div key={'empty'+i} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
              const isSelected = value && new Date(value).getDate() === day && new Date(value).getMonth() === month && new Date(value).getFullYear() === year;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(day)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '6px',
                    border: isToday ? '2px solid #fff' : 'none',
                    background: isSelected ? '#fff' : 'transparent',
                    color: isSelected ? '#000' : (isDark ? '#fff' : '#222'),
                    fontWeight: isSelected || isToday ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px',
                  }}
                >{day}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Local Glassmorphic Time Picker ---
function GlassTimePicker({ value, onChange, isDark }) {
  const [open, setOpen] = React.useState(false);
  const [hour, setHour] = React.useState('');
  const [minute, setMinute] = React.useState('');
  const ref = React.useRef();
  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);
  React.useEffect(() => {
    if (value && /^\d{2}:\d{2}$/.test(value)) {
      const [h, m] = value.split(':');
      setHour(h);
      setMinute(m);
    }
  }, [value]);
  const handleSelect = (h, m) => {
    setHour(h);
    setMinute(m);
    onChange(`${h}:${m}`);
    setOpen(false);
  };
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  return (
    <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }} ref={ref}>
      <input
        type="text"
        value={value}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={e => {
          const val = e.target.value;
          if (/^\d{2}:\d{2}$/.test(val)) {
            const [h, m] = val.split(':');
            setHour(h);
            setMinute(m);
            onChange(val);
          } else {
            setHour('');
            setMinute('');
            onChange(val);
          }
        }}
        placeholder="Time"
        style={{
          width: '100%',
          padding: '14px 18px',
          borderRadius: 10,
          border: `2px solid ${isDark ? '#333' : '#ddd'}`,
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          color: isDark ? '#fff' : '#111',
          fontSize: 18,
          marginBottom: 0,
          outline: 'none',
          boxSizing: 'border-box',
          marginTop: 4,
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
        }}
        maxLength={5}
      />
      {open && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '100%',
          marginTop: 8,
          width: '100%',
          minWidth: '100%',
          maxWidth: '100%',
          display: 'flex',
          gap: 8,
          borderRadius: 16,
          boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
          border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.18)' : '#e5e7eb'}`,
          background: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255,255,255,0.95)',
          zIndex: 1000,
          maxHeight: 220,
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 220 }}>
            {hours.map(h => (
              <div
                key={h}
                onMouseDown={() => handleSelect(h, minute || '00')}
                style={{
                  padding: '8px 0',
                  textAlign: 'center',
                  background: h === hour ? '#fff' : 'transparent',
                  color: h === hour ? '#000' : (isDark ? '#fff' : '#222'),
                  fontWeight: h === hour ? 700 : 400,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 16,
                  transition: 'all 0.2s',
                }}
              >
                {h}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 220 }}>
            {minutes.map(m => (
              <div
                key={m}
                onMouseDown={() => handleSelect(hour || '00', m)}
                style={{
                  padding: '8px 0',
                  textAlign: 'center',
                  background: m === minute ? '#fff' : 'transparent',
                  color: m === minute ? '#000' : (isDark ? '#fff' : '#222'),
                  fontWeight: m === minute ? 700 : 400,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 16,
                  transition: 'all 0.2s',
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MultipleChoiceModuleModal({ open, onClose, onNext, guests }) {
  const { theme } = React.useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0,5);
  });
  const [step, setStep] = useState(1);
  const [selectedGuests, setSelectedGuests] = useState([]);

  if (!open) return null;

  const handleAddOption = () => setOptions([...options, '']);
  const handleOptionChange = (idx, val) => setOptions(options.map((o, i) => i === idx ? val : o));
  const handleRemoveOption = idx => setOptions(options.filter((_, i) => i !== idx));

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        ...getGlassStyles(isDark),
        width: 420,
        maxWidth: '95vw',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        {step === 1 && <>
          <h2 style={{ color: isDark ? '#fff' : '#111', fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Create Multiple Choice Module</h2>
          <div style={{ width: '100%', marginBottom: 24 }}>
            <label style={{ color: isDark ? '#aaa' : '#444', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Question</label>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Enter your question..."
              style={{ width: '100%', padding: '14px 18px', borderRadius: 10, border: `2px solid ${isDark ? '#333' : '#ddd'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', color: isDark ? '#fff' : '#111', fontSize: 18, outline: 'none', marginTop: 4, transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}
            />
          </div>
          <div style={{ width: '100%', marginBottom: 24 }}>
            <label style={{ color: isDark ? '#aaa' : '#444', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Options</label>
            {options.map((opt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <input
                  value={opt}
                  onChange={e => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${isDark ? '#333' : '#ddd'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', color: isDark ? '#fff' : '#111', fontSize: 16, outline: 'none', marginRight: 8 }}
                />
                {options.length > 1 && (
                  <button
                    onClick={() => handleRemoveOption(idx)}
                    style={{
                      width: 28,
                      height: 28,
                      minWidth: 28,
                      minHeight: 28,
                      borderRadius: 6,
                      border: `1.5px solid ${isDark ? '#f87171' : '#dc2626'}`,
                      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(220,38,38,0.08)',
                      color: isDark ? '#f87171' : '#dc2626',
                      fontWeight: 700,
                      fontSize: 18,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      marginLeft: 0,
                    }}
                    aria-label={`Remove option ${idx + 1}`}
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button onClick={handleAddOption} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px dashed #aaa', background: 'none', color: isDark ? '#fff' : '#222', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 4 }}>+ Add Option</button>
          </div>
          <div style={{ width: '100%', marginBottom: 24 }}>
            <label style={{ color: isDark ? '#aaa' : '#444', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Date</label>
            <GlassDatePicker value={date} onChange={setDate} isDark={isDark} />
          </div>
          <div style={{ width: '100%', marginBottom: 24 }}>
            <label style={{ color: isDark ? '#aaa' : '#444', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Time</label>
            <GlassTimePicker value={time} onChange={setTime} isDark={isDark} />
          </div>
          <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '12px 28px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: isDark ? '#222' : '#eee', color: isDark ? '#fff' : '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 8 }}>Cancel</button>
            <button onClick={() => setStep(2)} disabled={!question || options.some(opt => !opt)} style={{ padding: '12px 28px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: isDark ? '#444' : '#f3f4f6', color: isDark ? '#fff' : '#222', fontWeight: 700, fontSize: 16, cursor: (!question || options.some(opt => !opt)) ? 'not-allowed' : 'pointer', opacity: (!question || options.some(opt => !opt)) ? 0.7 : 1 }}>Next</button>
          </div>
        </>}
        {step === 2 && <div style={{ width: '100%' }}>
          <h2 style={{ color: isDark ? '#fff' : '#111', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Select Guests for Module</h2>
          <div style={{ width: '100%', marginBottom: 18, display: 'flex', gap: 8 }}>
            <button onClick={() => setSelectedGuests(guests.map(g => g.id))} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: isDark ? '#222' : '#eee', color: isDark ? '#fff' : '#222', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Select All</button>
            <button onClick={() => setSelectedGuests([])} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: isDark ? '#222' : '#eee', color: isDark ? '#fff' : '#222', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Clear All</button>
          </div>
          <div style={{ width: '100%', maxHeight: 260, overflowY: 'auto', marginBottom: 24 }}>
            {guests.map(g => (
              <label key={g.id} style={{ display: 'flex', alignItems: 'center', padding: 10, borderRadius: 8, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', marginBottom: 6, cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedGuests.includes(g.id)} onChange={() => setSelectedGuests(sel => sel.includes(g.id) ? sel.filter(i => i !== g.id) : [...sel, g.id])} style={{ marginRight: 12, width: 16, height: 16 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{g.first_name || g.last_name ? `${g.first_name || ''} ${g.last_name || ''}`.trim() : g.email}</div>
                  <div style={{ fontSize: 12, color: isDark ? '#aaa' : '#666' }}>{g.email}</div>
                </div>
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '12px 28px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: isDark ? '#222' : '#eee', color: isDark ? '#fff' : '#222', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 8 }}>Cancel</button>
            <button onClick={() => onNext({ question, options, date, time, guests: selectedGuests })} disabled={selectedGuests.length === 0} style={{ padding: '12px 28px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: isDark ? '#444' : '#f3f4f6', color: isDark ? '#fff' : '#222', fontWeight: 700, fontSize: 16, cursor: selectedGuests.length ? 'pointer' : 'not-allowed', opacity: selectedGuests.length ? 1 : 0.7 }}>Save & Post</button>
          </div>
        </div>}
      </div>
    </div>
  );
} 