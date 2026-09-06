-- One-time bulk import of teacher records transcribed from the Lindstrom
-- Elementary staff phone extension sheet. Covers every section from "TK"
-- through "SDC" (classroom teachers + Special Day Class), per the source
-- image. Run this once in the Supabase SQL Editor, after schema.sql has
-- been applied (the `teachers` table must already exist).
--
-- Assumes there is exactly one Supabase auth user in this project (you).
-- If that's not the case, replace the subquery below with the specific
-- user's id from Authentication > Users in the Supabase dashboard.

insert into teachers (user_id, data) values
  ((select id from auth.users limit 1), '{"lastName": "Tariq", "gradeLevel": "TK"}'),
  ((select id from auth.users limit 1), '{"lastName": "Robinson", "gradeLevel": "TK"}'),
  ((select id from auth.users limit 1), '{"lastName": "Ortega", "gradeLevel": "Kindergarten"}'),
  ((select id from auth.users limit 1), '{"lastName": "Scofield", "gradeLevel": "Kindergarten"}'),
  ((select id from auth.users limit 1), '{"lastName": "Salcido", "gradeLevel": "Kindergarten"}'),
  ((select id from auth.users limit 1), '{"lastName": "Klaiber", "gradeLevel": "First Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Perez", "gradeLevel": "First Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Vaughn", "gradeLevel": "First Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Nishimuta", "gradeLevel": "Second Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Cummins", "gradeLevel": "Second Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Chong", "gradeLevel": "Second Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Vitwar", "gradeLevel": "Third Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Navarro", "gradeLevel": "Third Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Jimenez-Wilson", "gradeLevel": "Third Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Young", "gradeLevel": "Fourth Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Yee", "gradeLevel": "Fourth Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Hedgpeth", "gradeLevel": "Fifth Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Driscoll", "gradeLevel": "Fifth Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Brockway", "gradeLevel": "Sixth Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Rothery", "gradeLevel": "Sixth Grade"}'),
  ((select id from auth.users limit 1), '{"lastName": "Arroyo", "gradeLevel": "SDC (TK-K)"}'),
  ((select id from auth.users limit 1), '{"lastName": "Hirano", "gradeLevel": "SDC (1-3)"}'),
  ((select id from auth.users limit 1), '{"lastName": "Louden", "gradeLevel": "SDC (4-6)"}');
