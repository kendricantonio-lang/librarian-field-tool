export const ACTIVE_TEACHER_KEY = 'lft.activeTeacherId';

/** Pin a teacher as "active" so the Teachers tab opens with their card already expanded. */
export function pinTeacherActive(id: string): void {
  try {
    localStorage.setItem(ACTIVE_TEACHER_KEY, id);
  } catch {
    // localStorage unavailable — the pin just won't survive a reload.
  }
}
