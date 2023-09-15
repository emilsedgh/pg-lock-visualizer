CREATE TABLE locks (
    id uuid not null primary key, 
    created_at timestamp without time zone, 
    unblocked_at timestamp without time zone, 
    position int NOT NULL DEFAULT 0,

    blocked_pid int, 
    blocked_user text, 
    blocked_statement text, 
    blocked_application text, 

    blocking_pid int, 
    blocking_user text, 
    blocking_statement text, 
    blocking_application text,
    blocking_query_start timestamp without time zone
);