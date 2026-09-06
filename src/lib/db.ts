import { supabase } from './supabaseClient';
import type { FieldValues } from '../components/DynamicForm';

export interface EventRecord {
  id: string;
  data: FieldValues;
  created_at: string;
  updated_at: string;
}

export async function listEvents(): Promise<EventRecord[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as EventRecord[];
}

export async function createEvent(values: FieldValues): Promise<EventRecord> {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('events')
    .insert({ data: values, user_id: userData.user?.id })
    .select()
    .single();
  if (error) throw error;
  return data as EventRecord;
}

export async function updateEvent(id: string, values: FieldValues): Promise<EventRecord> {
  const { data, error } = await supabase
    .from('events')
    .update({ data: values, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as EventRecord;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}

export interface TeacherRecord {
  id: string;
  data: FieldValues;
  created_at: string;
  updated_at: string;
}

export async function listTeachers(): Promise<TeacherRecord[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as TeacherRecord[];
}

export async function createTeacher(values: FieldValues): Promise<TeacherRecord> {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('teachers')
    .insert({ data: values, user_id: userData.user?.id })
    .select()
    .single();
  if (error) throw error;
  return data as TeacherRecord;
}

export async function updateTeacher(id: string, values: FieldValues): Promise<TeacherRecord> {
  const { data, error } = await supabase
    .from('teachers')
    .update({ data: values, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as TeacherRecord;
}

export interface BookRecord {
  id: string;
  data: FieldValues;
  created_at: string;
  updated_at: string;
}

export async function listBooks(): Promise<BookRecord[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as BookRecord[];
}

export async function createBook(values: FieldValues): Promise<BookRecord> {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('books')
    .insert({ data: values, user_id: userData.user?.id })
    .select()
    .single();
  if (error) throw error;
  return data as BookRecord;
}

export async function updateBook(id: string, values: FieldValues): Promise<BookRecord> {
  const { data, error } = await supabase
    .from('books')
    .update({ data: values, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as BookRecord;
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id);
  if (error) throw error;
}

export interface ScheduleBlockRecord {
  id: string;
  data: FieldValues;
  created_at: string;
  updated_at: string;
}

export async function listScheduleBlocks(): Promise<ScheduleBlockRecord[]> {
  const { data, error } = await supabase
    .from('schedule_blocks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as ScheduleBlockRecord[];
}

export async function createScheduleBlock(values: FieldValues): Promise<ScheduleBlockRecord> {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('schedule_blocks')
    .insert({ data: values, user_id: userData.user?.id })
    .select()
    .single();
  if (error) throw error;
  return data as ScheduleBlockRecord;
}

export async function updateScheduleBlock(id: string, values: FieldValues): Promise<ScheduleBlockRecord> {
  const { data, error } = await supabase
    .from('schedule_blocks')
    .update({ data: values, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ScheduleBlockRecord;
}

export async function deleteScheduleBlock(id: string): Promise<void> {
  const { error } = await supabase.from('schedule_blocks').delete().eq('id', id);
  if (error) throw error;
}
