CREATE TABLE locks (
    id uuid not null primary key, 
    created_at timestamp, 
    unblocked_at timestamp, 
    blocked_pid int, 
    blocked_user text, 
    blocked_statement text, 
    blocked_application text, 

    blocking_pid int, 
    blocking_user text, 
    blocking_statement text, 
    blocking_application text,
    blocking_query_start timestamp
);