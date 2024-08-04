import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { AccountCircle, Group, Assignment, Folder, Description } from '@mui/icons-material';

const TableauDeBord = () => {
  const theme = useTheme();

  const [usersCount, setUsersCount] = useState(3);
  const [familleUsersCount, setFamilleUsersCount] = useState(3);
  const [tachesCount, setTachesCount] = useState(3);
  const [entetTachesCount, setEntetTachesCount] = useState(9);
  const [detTachesCount, setDetTachesCount] = useState(8);

  // Array of cool colors for cards
  const coolColors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#673ab7'];

  const fetchData = () => {
    // Simulating fetching data with setTimeout
    setTimeout(() => {
      // Simulated data update
      setUsersCount(3);
      setFamilleUsersCount(3);
      setTachesCount(3);
      setEntetTachesCount(9);
      setDetTachesCount(8);
    }, 1000); // Simulate API delay
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container spacing={3} p={5}>
      {/* Card for Utilisateurs */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ bgcolor: coolColors[0], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Utilisateurs
              </Typography>
              <AccountCircle fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {usersCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card for Utilisateurs de famille */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ bgcolor: coolColors[1], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Utilisateurs de famille
              </Typography>
              <Group fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {familleUsersCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card for Tâches */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ bgcolor: coolColors[2], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Tâches
              </Typography>
              <Assignment fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {tachesCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card for Entêtes de tâches */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ bgcolor: coolColors[3], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Entêtes de tâches
              </Typography>
              <Folder fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {entetTachesCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card for Détails de tâches */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card sx={{ bgcolor: coolColors[4], color: theme.palette.white.first, borderRadius: 3, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5" component="h2" sx={{ color: theme.palette.white.first }}>
                Détails de tâches
              </Typography>
              <Description fontSize="large" sx={{ color: theme.palette.white.first }} />
            </Box>
            <Typography variant="h1" component="h1" sx={{ fontSize: 24, fontWeight: 'bold', color: theme.palette.white.first }}>
              {detTachesCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TableauDeBord;
