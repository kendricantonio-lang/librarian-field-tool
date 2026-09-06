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
