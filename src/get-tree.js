export default function getTree(locks: Lock[]) {
    const transactions = {}

    const children = {}
    const parents = {}

    const getTotals = (transaction) => {
        const childs = children[transaction.pid]
        if (!childs)
            return 0
    
        let total = 0
        for(const child of childs) {
            total += getTotals(child)
        }
        
        return total + childs.size
    }

    for(const lock of locks) {
        if (!transactions[lock.blocking_pid]) {
            transactions[lock.blocking_pid] = {
                name:lock.blocking_application, 
                application: lock.blocking_application,
                pid: lock.blocking_pid,
                sql: lock.blocking_statement,
                started_at: lock.blocking_query_start,
                ended_at: lock.unblocked_at,
                position: lock.position
            }
        }


        if (!transactions[lock.blocked_pid])
            transactions[lock.blocked_pid] = {
                name:lock.blocked_application,
                application: lock.blocked_application,
                pid: lock.blocked_pid,
                sql: lock.blocked_statement,
                ended_at: lock.unblocked_at,
                started_at: lock.created_at,
                position: lock.position
            }

        if (!children[lock.blocking_pid])
            children[lock.blocking_pid] = new Set

        if (!parents[lock.blocked_pid])
            parents[lock.blocked_pid] = new Set

        children[lock.blocking_pid].add(lock.blocked_pid)
        parents[lock.blocked_pid].add(lock.blocking_pid)
    }

    for(const query of Object.values(transactions)) {
        query.total_block_count = getTotals(query)
        // console.log(query.sql, query.total_block_count)
    }

    const roots = Object.values(transactions)

    return { roots, children, parents, queries: transactions }
}