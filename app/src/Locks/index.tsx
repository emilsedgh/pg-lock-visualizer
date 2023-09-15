import * as React from 'react';

import { Dayjs } from 'dayjs';
import draw from './draw'

interface LocksProps {
  locks: Lock[],
  fromTime: Dayjs | null,
  toTime: Dayjs | null,
  roots: Query[]
  setSelectedQuery: (query: Query) => void
}

export default function Locks(props: LocksProps) {
  const { locks, fromTime, toTime, roots, setSelectedQuery } = props
  
  const d3Container = React.useRef<any>(null);

  React.useEffect(() => {
    if (!d3Container.current) return;

    draw(d3Container.current, {roots, fromTime, toTime, setSelectedQuery})

    return () => {
      console.log('Clreaning up', d3Container.current)
      d3Container.current && (d3Container.current.innerHTML = '')
    }
  }, [locks, d3Container.current])

  return (
    <svg
      className="d3-component"
      width={400}
      height={200}
      ref={d3Container}
    />
  )
}