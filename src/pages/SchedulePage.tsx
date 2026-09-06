import { useEffect, useState } from 'react';
import type { FieldValues } from '../components/DynamicForm';
import { BLOCK_COLORS, DAYS, formatTime12h, suggestLabel } from '../lib/scheduleUtils';
import {
  createScheduleBlock,
  deleteScheduleBlock,
  listScheduleBlocks,
  listTeachers,
  updateScheduleBlock,
  type ScheduleBlockRecord,
  type TeacherRecord,
} from '../lib/db';

export function SchedulePage() {
  const [blocks, setBlocks] = useState<ScheduleBlockRecord[]>([]);
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FieldValues>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    const [blockResult, teacherResult] = await Promise.allSettled([listScheduleBlocks(), listTeachers()]);
    if (blockResult.status === 'fulfilled') setBlocks(blockResult.value);
    if (teacherResult.status === 'fulfilled') setTeachers(teacherResult.value);

    const failure =
      blockResult.status === 'rejected' ? blockResult.reason : teacherResult.status === 'rejected' ? teacherResult.reason : null;
    setError(failure instanceof Error ? failure.message : failure ? 'Failed to load data' : null);
    setLoading(false);
  }

  function startCreate() {
    setEditingId(null);
    setFormValues({
      day: selectedDay,
      startTime: '',
      endTime: '',
      teacherId: '',
      label: '',
      color: BLOCK_COLORS[0].key,
    });
    setShowForm(true);
  }

  function startEdit(block: ScheduleBlockRecord) {
    setEditingId(block.id);
    setFormValues(block.data);
    setShowForm(true);
  }

  function handleTeacherChange(teacherId: string) {
    const teacher = teachers.find((t) => t.id === teacherId);
    setFormValues((prev) => ({
      ...prev,
      teacherId,
      label: prev.label ? prev.label : suggestLabel(teacher?.data.gradeLevel),
    }));
  }

  async function handleSave() {
    try {
      if (editingId) {
        await updateScheduleBlock(editingId, formValues);
      } else {
        await createScheduleBlock(formValues);
      }
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save block');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this schedule block?')) return;
    try {
      await deleteScheduleBlock(id);
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete block');
    }
  }

  const dayBlocks = blocks
    .filter((b) => b.data.day === selectedDay)
    .sort((a, b) => (a.data.startTime ?? '').localeCompare(b.data.startTime ?? ''));

  return (
    <div className="page">
      <div className="page-header">
        <h2>Schedule</h2>
        <button onClick={startCreate}>+ Add Block</button>
      </div>

      <div className="day-tabs">
        {DAYS.map((day) => (
          <button
            key={day}
            className={day === selectedDay ? 'day-tab' : 'day-tab secondary'}
            onClick={() => setSelectedDay(day)}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading...</p>}

      {showForm && (
        <div className="panel">
          <h3>{editingId ? 'Edit Block' : 'New Block'}</h3>
          <div className="dynamic-form">
            <label className="form-field">
              <span className="form-label">Day</span>
              <select
                value={formValues.day ?? selectedDay}
                onChange={(e) => setFormValues((prev) => ({ ...prev, day: e.target.value }))}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span className="form-label">Start Time</span>
              <input
                type="time"
                value={formValues.startTime ?? ''}
                onChange={(e) => setFormValues((prev) => ({ ...prev, startTime: e.target.value }))}
              />
            </label>
            <label className="form-field">
              <span className="form-label">End Time</span>
              <input
                type="time"
                value={formValues.endTime ?? ''}
                onChange={(e) => setFormValues((prev) => ({ ...prev, endTime: e.target.value }))}
              />
            </label>
            <label className="form-field">
              <span className="form-label">Teacher (optional)</span>
              <select value={formValues.teacherId ?? ''} onChange={(e) => handleTeacherChange(e.target.value)}>
                <option value="">— None / generic —</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.data.lastName} ({t.data.gradeLevel})
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span className="form-label">Label</span>
              <input
                type="text"
                placeholder="e.g. 1st, K, SDC TK"
                value={formValues.label ?? ''}
                onChange={(e) => setFormValues((prev) => ({ ...prev, label: e.target.value }))}
              />
            </label>
            <div className="form-field">
              <span className="form-label">Color</span>
              <div className="color-swatch-row">
                {BLOCK_COLORS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`color-swatch swatch-${c.key}${formValues.color === c.key ? ' selected' : ''}`}
                    aria-label={c.label}
                    onClick={() => setFormValues((prev) => ({ ...prev, color: c.key }))}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="panel-actions">
            <button onClick={handleSave}>Save</button>
            <button className="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            {editingId && (
              <button className="delete-button" onClick={() => handleDelete(editingId)}>
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      <ul className="record-list">
        {dayBlocks.map((block) => {
          const teacher = teachers.find((t) => t.id === block.data.teacherId);
          return (
            <li
              key={block.id}
              className={`schedule-block swatch-${block.data.color || 'gray'}`}
              onClick={() => startEdit(block)}
            >
              <span className="schedule-block-time">
                {formatTime12h(block.data.startTime)}–{formatTime12h(block.data.endTime)}
              </span>
              <span className="schedule-block-label">
                {teacher && <strong>{teacher.data.lastName} </strong>}
                {block.data.label}
              </span>
            </li>
          );
        })}
        {!loading && dayBlocks.length === 0 && <p>No blocks scheduled for {selectedDay}.</p>}
      </ul>
    </div>
  );
}
