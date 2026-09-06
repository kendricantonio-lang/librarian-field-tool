-- One-time bulk import of the library schedule, transcribed from the
-- Monday-Friday time-block sheet. Run this once in the Supabase SQL Editor,
-- after schema.sql has been applied AND after seed-teachers.sql (this script
-- links blocks to teachers by last name, so the teachers table must already
-- have those rows).
--
-- This was a snapshot when the sheet was made — parts have since changed.
-- Everything here is editable in the Schedule tab; treat this as a starting
-- point to correct, not a source of truth.
--
-- Assumes there is exactly one Supabase auth user in this project (you).

insert into schedule_blocks (user_id, data)
select (select id from auth.users limit 1), block
from (values
  (jsonb_build_object('day','Monday','startTime','08:45','endTime','09:25','teacherId',(select id::text from teachers where data->>'lastName'='Perez' limit 1),'label','1st','color','red')),
  (jsonb_build_object('day','Monday','startTime','09:35','endTime','10:15','teacherId',null,'label','K','color','peach')),
  (jsonb_build_object('day','Monday','startTime','10:25','endTime','11:05','teacherId',(select id::text from teachers where data->>'lastName'='Arroyo' limit 1),'label','SDC TK','color','purple')),
  (jsonb_build_object('day','Monday','startTime','11:15','endTime','11:45','teacherId',(select id::text from teachers where data->>'lastName'='Louden' limit 1),'label','SDC 4-6','color','teal')),

  (jsonb_build_object('day','Tuesday','startTime','08:45','endTime','09:25','teacherId',(select id::text from teachers where data->>'lastName'='Navarro' limit 1),'label','3rd','color','green')),
  (jsonb_build_object('day','Tuesday','startTime','09:35','endTime','10:15','teacherId',(select id::text from teachers where data->>'lastName'='Young' limit 1),'label','4th','color','blue')),
  (jsonb_build_object('day','Tuesday','startTime','10:30','endTime','11:10','teacherId',(select id::text from teachers where data->>'lastName'='Cummins' limit 1),'label','2nd','color','yellow')),
  (jsonb_build_object('day','Tuesday','startTime','11:15','endTime','11:55','teacherId',(select id::text from teachers where data->>'lastName'='Chong' limit 1),'label','2nd','color','yellow')),

  (jsonb_build_object('day','Wednesday','startTime','08:45','endTime','09:25','teacherId',(select id::text from teachers where data->>'lastName'='Yee' limit 1),'label','4th','color','blue')),
  (jsonb_build_object('day','Wednesday','startTime','09:35','endTime','10:15','teacherId',(select id::text from teachers where data->>'lastName'='Vitwar' limit 1),'label','3rd','color','green')),
  (jsonb_build_object('day','Wednesday','startTime','10:30','endTime','11:10','teacherId',(select id::text from teachers where data->>'lastName'='Nishimuta' limit 1),'label','2nd','color','yellow')),
  (jsonb_build_object('day','Wednesday','startTime','11:15','endTime','11:45','teacherId',(select id::text from teachers where data->>'lastName'='Driscoll' limit 1),'label','5th','color','teal')),

  (jsonb_build_object('day','Thursday','startTime','08:45','endTime','09:25','teacherId',(select id::text from teachers where data->>'lastName'='Klaiber' limit 1),'label','1st','color','red')),
  (jsonb_build_object('day','Thursday','startTime','09:35','endTime','10:15','teacherId',(select id::text from teachers where data->>'lastName'='Jimenez-Wilson' limit 1),'label','3rd','color','green')),
  (jsonb_build_object('day','Thursday','startTime','10:25','endTime','10:45','teacherId',(select id::text from teachers where data->>'lastName'='Robinson' limit 1),'label','TK','color','red')),
  (jsonb_build_object('day','Thursday','startTime','10:50','endTime','11:10','teacherId',null,'label','TK','color','red')),
  (jsonb_build_object('day','Thursday','startTime','11:15','endTime','11:45','teacherId',(select id::text from teachers where data->>'lastName'='Hedgpeth' limit 1),'label','5th','color','teal')),

  (jsonb_build_object('day','Friday','startTime','08:45','endTime','09:25','teacherId',(select id::text from teachers where data->>'lastName'='Scofield' limit 1),'label','K','color','peach')),
  (jsonb_build_object('day','Friday','startTime','09:35','endTime','10:15','teacherId',(select id::text from teachers where data->>'lastName'='Ortega' limit 1),'label','K','color','peach')),
  (jsonb_build_object('day','Friday','startTime','10:30','endTime','11:10','teacherId',(select id::text from teachers where data->>'lastName'='Vaughn' limit 1),'label','1st','color','red')),
  (jsonb_build_object('day','Friday','startTime','11:15','endTime','11:45','teacherId',(select id::text from teachers where data->>'lastName'='Hirano' limit 1),'label','SDC 1-3','color','purple'))
) as t(block);
