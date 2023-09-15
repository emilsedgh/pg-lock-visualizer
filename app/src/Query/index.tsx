import React from 'react'


interface QueryProps {
    query: Query | null
    queries: {}
    parents: {}
    children: {}
}

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import draw from './draw'


export default function Query(props: QueryProps) {
    const { query, parents, children } = props
    if (!query)
        return null

        const d3Container = React.useRef<any>(null);

        React.useEffect(() => {
          if (!d3Container.current) return;
      
          draw(d3Container.current, {query, parents, children})
      
          return () => {
            d3Container.current && (d3Container.current.innerHTML = '')
          }
        }, [query, d3Container.current])


    return (
        <Container>
            <Box>
        <Card>
            <CardContent>
                <Typography  variant="caption" sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {query.name}
                </Typography>
                
                <Box sx={{mt: 2,}}>
                    <Typography  sx={{ fontSize: 14 }} gutterBottom>
                    {query.sql}
                    </Typography>
                </Box>

                <Box>
                <svg
                    className="d3-component"
                    ref={d3Container}
                />
                </Box>

                <CardActions>
                <Button size="small">Kill</Button>
                </CardActions>
            </CardContent>
        </Card>
        </Box>
        </Container>
    )
}