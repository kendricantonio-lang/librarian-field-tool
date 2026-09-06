// A book's `teacherIds` field is a JSON-encoded array of teacher record ids,
// kept as a plain string so it still fits the Record<string,string> shape
// every other field uses — parse/serialize here rather than scattering
// JSON.parse calls around the page.

export function parseTeacherIds(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function serializeTeacherIds(ids: string[]): string {
  return JSON.stringify(ids);
}

// Canonical grade order for grouping/sorting the teacher picker and any
// resolved teacher lists — matches the order on the source staff sheet.
// Unrecognized grade labels (future additions) sort after these, alphabetically.
const GRADE_ORDER = [
  'TK',
  'Kindergarten',
  'First Grade',
  'Second Grade',
  'Third Grade',
  'Fourth Grade',
  'Fifth Grade',
  'Sixth Grade',
  'SDC',
];

/** SDC entries carry a grade-span suffix (e.g. "SDC (TK-K)") — group them all under "SDC". */
export function gradeGroupLabel(gradeLevel: string): string {
  return gradeLevel.startsWith('SDC') ? 'SDC' : gradeLevel;
}

export function compareGradeGroups(a: string, b: string): number {
  const ai = GRADE_ORDER.indexOf(a);
  const bi = GRADE_ORDER.indexOf(b);
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  return a.localeCompare(b);
}
