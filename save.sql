WITH locks AS (
    SELECT 
        blocked_pid, 
        blocked_user, 
        blocked_statement, 
        blocked_application, 

        blocking_pid, 
        blocking_user, 
        blocking_statement, 
        blocking_application,
        blocking_query_start
    FROM JSONB_POPULATE_RECORDSET(null::locks, $1::jsonb)
),

to_save AS (
    SELECT 
        md5(TO_JSONB(locks.*)::text)::uuid as id,
        NOW() as created_at, 
        blocked_pid, 
        blocked_user, 
        blocked_statement, 
        blocked_application, 

        blocking_pid, 
        blocking_user, 
        blocking_statement, 
        blocking_application,
        blocking_query_start
    FROM locks
),

saved AS (
    INSERT INTO locks (
        id,
        created_at,
        blocked_pid, 
        blocked_user, 
        blocked_statement, 
        blocked_application, 

        blocking_pid, 
        blocking_user, 
        blocking_statement, 
        blocking_application,
        blocking_query_start
    )
    SELECT * FROM to_save
    ON CONFLICT(id) DO NOTHING
    RETURNING id
)

UPDATE locks SET unblocked_at = NOW()
WHERE unblocked_at IS NULL 
AND blocking_pid NOT IN(SELECT blocking_pid FROM to_save)
RETURNING id;
