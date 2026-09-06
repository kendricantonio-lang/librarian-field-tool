export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Actual colors live in CSS as `.swatch-<key>` classes (index.css) — this
// list just drives the swatch picker and iteration order.
export const BLOCK_COLORS = [
  { key: 'red', label: 'Red' },
  { key: 'peach', label: 'Peach' },
  { key: 'yellow', label: 'Yellow' },
  { key: 'green', label: 'Green' },
  { key: 'blue', label: 'Blue' },
  { key: 'purple', label: 'Purple' },
  { key: 'teal', label: 'Teal' },
  { key: 'gray', label: 'Gray' },
];

const ORDINAL_LABELS: Record<string, string> = {
  'First Grade': '1st',
  'Second Grade': '2nd',
  'Third Grade': '3rd',
  'Fourth Grade': '4th',
  'Fifth Grade': '5th',
  'Sixth Grade': '6th',
};

/** Best-effort short label suggestion from a teacher's grade level — always editable afterward. */
export function suggestLabel(gradeLevel: string | undefined): string {
  if (!gradeLevel) return '';
  return ORDINAL_LABELS[gradeLevel] ?? gradeLevel;
}

export function formatTime12h(time: string | undefined): string {
  if (!time) return '';
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${mStr} ${period}`;
}
