-- Data export from SQLite

BEGIN;

INSERT INTO public.users (id, email, hashed_password, role, full_name, semester, branch, phone, hostel, room, created_at)
VALUES
(1, 'admin@hostel.com', '$2b$12$Zjy.4BqGM.zzFGLdtcGPEeZKBoUtjt9qQR9/aEYIk1VguRuvG5dxK', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-17 17:19:50'),
(2, 'student@hostel.com', '$2b$12$KOx7beGAyoDT6/yS1yjWcunadhYSYYo8BhRXkA7yVq3WMk4gLVWEW', 'student', NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-17 17:19:50'),
(3, 'goriyash@gmail.com', '$2b$12$MtklHtHW2QzvETOvBu3QN.53Pfx/jT2b7XBH.KL6HBCX0FuqnuBmi', 'student', NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-17 17:29:13'),
(4, 'goriyashkashyap999@gmail.com', '$2b$12$XZu4eYOa8j4CwRYycEjU0O0a4Z3foFFpT9nzIYevPDLzN2p3TJyxC', 'student', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-25 17:23:48'),
(5, 'goriyashkashyap777@gmail.com', '$2b$12$BBTL8aDe6REN6yfPNtgPrenlxtOFeSB5a6Cr2cYlbPXFbpBdRdU6y', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-25 17:30:03');

INSERT INTO public.complaints (id, user_id, title, description, hostel, block, category, status, urgency_score, created_at)
VALUES
(1, 4, 'water not available', 'water', 'hostel 1', '1', 'Plumbing', 'In Progress', 6, '2026-04-25 17:24:26'),
(2, 4, 'health issues', 'high blood Pressure
', 'hostel 1', 'block b', 'Medical', 'Resolved', 9, '2026-04-25 17:43:05');

COMMIT;
