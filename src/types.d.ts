interface Lock extends SimulationNodeDatum, HierarchyNode {
  id: string
  created_at: Dayjs
  unblocked_at: Dayjs
  blocked_pid: number
  blocked_user: string
  blocked_statement: string
  blocked_application: string
  
  blocking_pid: number
  blocking_user: string
  blocking_statement: string
  blocking_application: string
  blocking_query_start: Dayjs
}

interface Query {
  pid: number
  name: string
  total_block_count: number
  blocked: Query[]
  sql: string
  started_at: Dayjs
  ended_at: Dayjs
  position: number,
}