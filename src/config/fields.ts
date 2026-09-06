// Single source of truth for the fields on each record type — same pattern
// as the sales field tool. Define a FieldDef[] per entity here, and
// DynamicForm + list views pick it up automatically.

export type FieldType = 'text' | 'textarea' | 'date' | 'phone' | 'email';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  /** Shown in the list summary line. */
  showInList?: boolean;
}

export const EVENT_FIELDS: FieldDef[] = [
  { key: 'date', label: 'Date', type: 'date', required: true, showInList: true },
  { key: 'title', label: 'Event', type: 'text', required: true, showInList: true },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export const TEACHER_FIELDS: FieldDef[] = [
  { key: 'lastName', label: 'Last Name', type: 'text', required: true, showInList: true },
  { key: 'gradeLevel', label: 'Grade Level', type: 'text', required: true, showInList: true },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

// Books also store a `teacherIds` key (a JSON-encoded array of teacher
// record ids) for which classes it's been read to — a real many-to-many
// link, not a simple text field, so it's handled by a custom picker in
// BooksPage rather than through this FieldDef/DynamicForm pattern.
export const BOOK_FIELDS: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text', required: true, showInList: true },
];
