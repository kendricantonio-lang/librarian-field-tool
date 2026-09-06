import { useEffect, useState } from 'react';
import { BOOK_FIELDS } from '../config/fields';
import { DynamicForm, type FieldValues } from '../components/DynamicForm';
import {
  compareGradeGroups,
  gradeGroupLabel,
  parseTeacherIds,
  serializeTeacherIds,
} from '../lib/teacherLinks';
import {
  createBook,
  deleteBook,
  listBooks,
  listTeachers,
  updateBook,
  type BookRecord,
  type TeacherRecord,
} from '../lib/db';

function teacherLabel(teacher: TeacherRecord): string {
  const grade = teacher.data.gradeLevel ? ` (${teacher.data.gradeLevel})` : '';
  return `${teacher.data.lastName ?? 'Unnamed'}${grade}`;
}

function resolveTeachers(ids: string[], teachers: TeacherRecord[]): TeacherRecord[] {
  const byId = new Map(teachers.map((t) => [t.id, t]));
  return ids.map((id) => byId.get(id)).filter((t): t is TeacherRecord => !!t);
}

function TeacherPicker({
  teachers,
  selectedIds,
  onToggle,
}: {
  teachers: TeacherRecord[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const groups = new Map<string, TeacherRecord[]>();
  for (const teacher of teachers) {
    const group = gradeGroupLabel(teacher.data.gradeLevel ?? '');
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(teacher);
  }
  const orderedGroups = [...groups.entries()].sort((a, b) => compareGradeGroups(a[0], b[0]));

  return (
    <div className="form-field">
      <span className="form-label">Read to these classes</span>
      <div className="teacher-picker">
        {orderedGroups.map(([group, groupTeachers]) => (
          <div key={group} className="teacher-picker-group">
            <h5>{group}</h5>
            {groupTeachers.map((teacher) => (
              <label key={teacher.id} className="teacher-picker-item">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(teacher.id)}
                  onChange={() => onToggle(teacher.id)}
                />
                {teacher.data.lastName}
              </label>
            ))}
          </div>
        ))}
        {teachers.length === 0 && <p className="muted">No teachers on file yet.</p>}
      </div>
    </div>
  );
}

export function BooksPage() {
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FieldValues>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    const [bookResult, teacherResult] = await Promise.allSettled([listBooks(), listTeachers()]);
    if (bookResult.status === 'fulfilled') setBooks(bookResult.value);
    if (teacherResult.status === 'fulfilled') setTeachers(teacherResult.value);

    const failure =
      bookResult.status === 'rejected' ? bookResult.reason : teacherResult.status === 'rejected' ? teacherResult.reason : null;
    setError(failure instanceof Error ? failure.message : failure ? 'Failed to load data' : null);
    setLoading(false);
  }

  function startCreate() {
    setEditingId(null);
    setFormValues({ teacherIds: serializeTeacherIds([]) });
    setShowForm(true);
  }

  function startEdit(book: BookRecord) {
    setEditingId(book.id);
    setFormValues(book.data);
    setShowForm(true);
  }

  function toggleTeacher(id: string) {
    setFormValues((prev) => {
      const current = parseTeacherIds(prev.teacherIds);
      const next = current.includes(id) ? current.filter((t) => t !== id) : [...current, id];
      return { ...prev, teacherIds: serializeTeacherIds(next) };
    });
  }

  async function handleSave() {
    try {
      if (editingId) {
        await updateBook(editingId, formValues);
      } else {
        await createBook(formValues);
      }
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this book?')) return;
    try {
      await deleteBook(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete book');
    }
  }

  const filtered = books.filter((book) => {
    if (!search.trim()) return true;
    const readTo = resolveTeachers(parseTeacherIds(book.data.teacherIds), teachers)
      .map(teacherLabel)
      .join(' ');
    const haystack = `${book.data.title ?? ''} ${readTo}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <div className="page">
      <div className="page-header">
        <h2>Books</h2>
        <button onClick={startCreate}>+ Add Book</button>
      </div>

      <input
        className="search-box"
        placeholder="Search by title or teacher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading...</p>}

      {showForm && (
        <div className="panel">
          <h3>{editingId ? 'Edit Book' : 'New Book'}</h3>
          <DynamicForm
            fields={BOOK_FIELDS}
            values={formValues}
            onChange={(key, value) => setFormValues((prev) => ({ ...prev, [key]: value }))}
          />
          <TeacherPicker
            teachers={teachers}
            selectedIds={parseTeacherIds(formValues.teacherIds)}
            onToggle={toggleTeacher}
          />
          <div className="panel-actions">
            <button onClick={handleSave}>Save</button>
            <button className="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="record-list">
        {filtered.map((book) => {
          const readTo = resolveTeachers(parseTeacherIds(book.data.teacherIds), teachers);
          return (
            <li key={book.id} className="record-card">
              <div className="record-summary" onClick={() => startEdit(book)}>
                <span className="record-field">{book.data.title}</span>
                {readTo.length === 0 ? (
                  <span className="muted">Not marked as read to any class yet</span>
                ) : (
                  <ul className="chip-list">
                    {readTo.map((t) => (
                      <li key={t.id} className="chip">
                        {teacherLabel(t)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button className="delete-button" onClick={() => handleDelete(book.id)}>
                Delete
              </button>
            </li>
          );
        })}
        {!loading && filtered.length === 0 && <p>No books yet.</p>}
      </ul>
    </div>
  );
}
