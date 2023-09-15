SELECT 
  *,
  created_at::timestamp with time zone as created_at,
  unblocked_at::timestamp with time zone as unblocked_at,
  blocking_query_start::timestamp with time zone as blocking_query_start
FROM locks 
WHERE 
(
      ($1::bigint IS NULL OR created_at >= to_timestamp($1)) 
  AND ($2::bigint IS NULL OR created_at <= to_timestamp($2))
) OR (
  unblocked_at BETWEEN to_timestamp($1) AND to_timestamp($2)
)
