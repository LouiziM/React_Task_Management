import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useGetTachesForTheDayQuery, useGetAllTachesWithDetailsQuery } from '../../features/tacheApiSlice';
import EventCard from './misc/eventCard';
import TaskDetailsComponent from './misc/taskDetailsComponent'; 
import dayjs from 'dayjs';

const Calendrier = () => {
  const [dateForQuery, setDateForQuery] = useState(null); // State for selected date
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog open/close
  const [selectedTaskData, setSelectedTaskData] = useState([]); // State for selected task data

  // Query for tasks based on the selected date
  const { data: tasksForTheDay = [] } = useGetTachesForTheDayQuery(dateForQuery, { skip: !dateForQuery });
  const { data: tousTaches = [] } = useGetAllTachesWithDetailsQuery();
  console.log("taskdetail",tasksForTheDay)
  const theme = useTheme();

  // Function to parse tasks to FullCalendar events
  const parseTachesToEvents = useCallback((taches) => {
    return taches.map(tache => ({
      id: tache.TacheID.toString(),
      title: tache.LibelleTache,
      start: tache.HDebut,
      end: tache.HFin,
      extendedProps: {
        LibelleJournee: tache.LibelleJournee,
        UtilisateurID: tache.UtilisateurID,
        UtilisateurNom: tache.UtilisateurNom,
        HDebut: tache.HDebut,
        TempsDiff: tache.TempsDiff,
        Coefficient: tache.DetailCoefficient,
        Remarques: tache.DetailRemarques,
        HFin: tache.HFin,
        LibelleJournee: tache.LibelleJournee,
        calculatedPrice: tache.PrixCalc
      }
    }));
  }, []);

  // Convert tousTaches to events for FullCalendar
  const calendarEvents = parseTachesToEvents(tousTaches);

  // Handle date click to set the selected date
  const handleDateClick = (selected) => {
    const selectedDate = dayjs(selected.startStr).format('YYYY-MM-DD');
    setDateForQuery(selectedDate); // Set date for query
  };

  // Handle event click to open the dialog with task details
  const handleEventClick = ({ event }) => {
    const taskData = [{
      journeeLabel: event.extendedProps.LibelleJournee,
      utilisateur: event.extendedProps.UtilisateurNom,
      operationDate: event.extendedProps.HDebut,
      remarks: event.extendedProps.Remarques,
      taskDetails: event.extendedProps.LibelleJournee,
      task: event.title,
      startTime: event.extendedProps.HDebut,
      endTime: event.extendedProps.HFin,
      timeDifference: event.extendedProps.TempsDiff,
      coefficient: event.extendedProps.Coefficient,
      calculatedPrice: (event.extendedProps.TempsDiff * event.extendedProps.Coefficient).toFixed(2),
    }];
    setSelectedTaskData(taskData);
    setIsDialogOpen(true);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Grid container spacing={2}>
          <Grid item xs={3.5}>
            <Box backgroundColor={'white'} p="15px" borderRadius="4px">
              <Typography variant="h5" mb={2}>Événements : </Typography>
              <Box>
                {tasksForTheDay.map((event) => (
                  <EventCard key={event.TacheID} event={parseTachesToEvents([event])[0]} theme={theme} />
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={8.5}>
            <Box ml="15px">
              <FullCalendar
                height="80vh"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                locale={frLocale}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                initialView="dayGridMonth"
                editable={false}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                select={handleDateClick}
                events={calendarEvents}
                eventClick={handleEventClick} // Add the event click handler
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <TaskDetailsComponent
        open={isDialogOpen}
        taskData={selectedTaskData}
        theme={theme}
        onClose={() => setIsDialogOpen(false)}
      />
    </Box>
  );
};

export default Calendrier;
