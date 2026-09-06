// Single source of truth for the fields on each record type — same pattern
// as the sales field tool. Define a FieldDef[] per entity here once the
// library-specific data model is known, and DynamicForm + list views will
// pick it up automatically.
//
// Example:
// export const PATRON_FIELDS: FieldDef[] = [
//   { key: 'name', label: 'Name', type: 'text', required: true, showInList: true },
//   { key: 'cardNumber', label: 'Card Number', type: 'text', showInList: true },
// ];

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
