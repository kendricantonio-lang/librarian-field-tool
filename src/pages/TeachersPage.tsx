import { useEffect, useState } from 'react';
import { TEACHER_FIELDS } from '../config/fields';
import { DynamicForm, type FieldValues } from '../components/DynamicForm';
import { createTeacher, listTeachers, updateTeacher, type TeacherRecord } from '../lib/db';

const ACTIVE_TEACHER_KEY = 'lft.activeTeacherId';

const listFields = TEACHER_FIELDS.filter((f) => f.showInList);

/** Numeric compare when both sides parse as numbers, otherwise alphabetical. */
function compareFieldValues(a: string, b: string): number {
  const aNum = Number(a);
  const bNum = Number(b);
  if (a.trim() !== '' && b.trim() !== '' && !Number.isNaN(aNum) && !Number.isNaN(bNum)) {
    return aNum - bNum;
  }
  return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

function FieldList({ fields, data }: { fields: typeof TEACHER_FIELDS; data: FieldValues }) {
  return (
    <>
      {fields.map((f) =>
        data[f.key] ? (
          <span key={f.key} className="record-field">
            <span className="field-label">{f.label}:</span> {data[f.key]}
          </span>
        ) : null
      )}
    </>
  );
}

export function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(TEACHER_FIELDS[0].key);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FieldValues>({});
  const [showForm, setShowForm] = useState(false);
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_TEACHER_KEY);
    } catch {
      return null;
    }
  });
  const [notesDraft, setNotesDraft] = useState('');

  useEffect(() => {
    refresh();
  }, []);

  const activeTeacher = teachers.find((t) => t.id === activeTeacherId) ?? null;

  useEffect(() => {
    setNotesDraft(activeTeacher?.data.notes ?? '');
  }, [activeTeacher?.id, activeTeacher?.data.notes]);

  async function refresh() {
    setLoading(true);
    try {
      setTeachers(await listTeachers());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  }

  function setActive(id: string) {
    const nextId = activeTeacherId === id ? null : id;
    setActiveTeacherId(nextId);
    try {
      if (nextId) {
        localStorage.setItem(ACTIVE_TEACHER_KEY, nextId);
      } else {
        localStorage.removeItem(ACTIVE_TEACHER_KEY);
      }
    } catch {
      // localStorage unavailable — active pin just won't survive a reload.
    }
  }

  function startCreate() {
    setEditingId(null);
    setFormValues({});
    setShowForm(true);
  }

  function startEdit(teacher: TeacherRecord) {
    setEditingId(teacher.id);
    setFormValues(teacher.data);
    setShowForm(true);
  }

  async function handleSave() {
    try {
      if (editingId) {
        await updateTeacher(editingId, formValues);
      } else {
        await createTeacher(formValues);
      }
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save teacher');
    }
  }

  async function handleSaveNotes() {
    if (!activeTeacher) return;
    try {
      await updateTeacher(activeTeacher.id, { ...activeTeacher.data, notes: notesDraft });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notes');
    }
  }

  const filtered = teachers.filter((t) => {
    if (!search.trim()) return true;
    const haystack = Object.values(t.data).join(' ').toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const sorted = [...filtered].sort((a, b) =>
    compareFieldValues(a.data[sortBy] ?? '', b.data[sortBy] ?? '')
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>Teachers</h2>
        <button onClick={startCreate}>+ Add Teacher</button>
      </div>

      {activeTeacher && (
        <div className="panel active-record-panel">
          <div className="panel-title-row">
            <h3>📌 Active Teacher</h3>
            <button className="link-button" onClick={() => setActive(activeTeacher.id)}>
              Unpin
            </button>
          </div>
          <div className="record-summary">
            <FieldList fields={listFields.filter((f) => f.key !== 'notes')} data={activeTeacher.data} />
          </div>
          <h4>Notes</h4>
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Quick notes about this teacher..."
            rows={4}
          />
          <div className="panel-actions">
            <button onClick={handleSaveNotes} disabled={notesDraft === (activeTeacher.data.notes ?? '')}>
              Save Notes
            </button>
            <button className="secondary" onClick={() => startEdit(activeTeacher)}>
              Edit Teacher Info
            </button>
          </div>
        </div>
      )}

      <div className="filter-row">
        <input
          className="search-box"
          placeholder="Search teachers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {TEACHER_FIELDS.map((f) => (
            <option key={f.key} value={f.key}>
              Sort: {f.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading...</p>}

      {showForm && (
        <div className="panel">
          <h3>{editingId ? 'Edit Teacher' : 'New Teacher'}</h3>
          <DynamicForm
            fields={TEACHER_FIELDS}
            values={formValues}
            onChange={(key, value) => setFormValues((prev) => ({ ...prev, [key]: value }))}
          />
          <div className="panel-actions">
            <button onClick={handleSave}>Save</button>
            <button className="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {sorted.length > 1 && <p className="carousel-hint">← Swipe to browse teachers →</p>}

      <ul className={`record-list card-carousel${activeTeacher ? ' is-compact' : ''}`}>
        {sorted.map((teacher) => (
          <li
            key={teacher.id}
            className={`record-card carousel-card${teacher.id === activeTeacherId ? ' is-active' : ''}`}
            onClick={() => setActive(teacher.id)}
          >
            <div className="record-summary">
              <FieldList fields={listFields.filter((f) => f.key !== 'notes')} data={teacher.data} />
            </div>
            <button
              className="secondary edit-button"
              onClick={(e) => {
                e.stopPropagation();
                startEdit(teacher);
              }}
            >
              Edit
            </button>
          </li>
        ))}
        {!loading && sorted.length === 0 && <p>No teachers yet.</p>}
      </ul>
    </div>
  );
}
