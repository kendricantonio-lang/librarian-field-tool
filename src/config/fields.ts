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
