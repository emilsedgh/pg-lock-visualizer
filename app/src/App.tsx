import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Locks from './Locks';
import Query from './Query';

import getTree from './get-tree'

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export default function HomePage() {
  const [fromTime, setFromTime] = React.useState<Dayjs | null>(dayjs.utc().add(-2, 'hour'))
  const [toTime, setToTime] = React.useState<Dayjs | null>(null)
  const [locks, setLocks] = React.useState([])

  const [selectedQuery, setSelectedQuery] = React.useState<Query | null>(null)

  React.useEffect(() => {
    const endpoint = `/api/locks.json?from=${fromTime?.unix() ?? ''}&to=${toTime?.unix() ?? ''}`
    fetch(endpoint).then(async response => {
      const locks = await response.json()
      setLocks(locks)
    })
  }, [fromTime, toTime])

  const {
    roots,
    queries,
    parents,
    children
   } = getTree(locks)


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Grid container marginTop={4}>
          <Grid item xs={9}>
            <DateTimePicker label="From" value={fromTime?.local()} onChange={setFromTime} />
          </Grid>

          <Grid item xs={3}>
            <DateTimePicker label="To" value={toTime?.local()} onChange={setToTime} />
          </Grid>
        </Grid>
      </Container>

      <Locks locks={locks} fromTime={fromTime} toTime={toTime} roots={ roots } setSelectedQuery={ setSelectedQuery } />

      <Query query={selectedQuery} parents={ parents } children={children} queries={queries} />
    </LocalizationProvider>
  );
}