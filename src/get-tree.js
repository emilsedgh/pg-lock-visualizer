export default function getTree(locks: Lock[]) {
    const transactions = {}

    const children = {}
    const parents = {}

    const getTotals = (transaction) => {
        const childs = children[transaction.application]
        if (!childs)
            return 0
    
        let total = 0
        for(const child of childs) {
            total += getTotals(child)
        }
        
        return total + childs.size
    }

    for(const lock of locks) {
        if (!transactions[lock.blocking_application])
            transactions[lock.blocking_application] = {
                name:lock.blocking_application, 
                application: lock.blocking_application,
                pid: lock.blocking_pid,
                sql: lock.blocking_statement,
                started_at: lock.blocking_query_start,
                ended_at: lock.unblocked_at,
                total_block_count: 0,
                position: lock.position
            }

        if (!transactions[lock.blocked_application])
            transactions[lock.blocked_application] = {
                name:lock.blocked_application,
                application: lock.blocked_application,
                pid: lock.blocked_pid,
                sql: lock.blocked_statement,
                ended_at: lock.unblocked_at,
                total_block_count: 0,
                position: lock.position
            }

        if (!children[lock.blocking_application])
            children[lock.blocking_application] = new Set

        if (!parents[lock.blocked_application])
            parents[lock.blocked_application] = new Set

        children[lock.blocking_application].add(lock.blocked_application)
        parents[lock.blocked_application].add(lock.blocking_application)
    }

    for(const query of Object.values(transactions)) {
        query.total_block_count = getTotals(query)
    }

    const roots = Object.values(transactions).filter(q => children[q.application] !== undefined)

    return { roots, children, parents, queries: transactions }
}