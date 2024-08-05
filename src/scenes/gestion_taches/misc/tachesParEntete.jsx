import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  useTheme,
  Snackbar,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { useGetAllTachesWithDetailsByIdQuery, useUpdateTacheMutation, useDeleteDetailsTacheMutation } from '../../../features/tacheApiSlice';
import AssignTaskDialog from './assignTaskDialog';
import { CustomTooltip } from "../../../components/misc/customTooltip.tsx";
import dayjs from "dayjs";
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { parse } from 'json2csv';
import SnackbarComponent from "../../../components/misc/snackBar";
import { frFR } from "@mui/x-data-grid/locales";

const TachesParEntete = ({ enteteId }) => {
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTache, setSelectedTache] = useState(null);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteTache] = useDeleteDetailsTacheMutation();
    const [updateTache] = useUpdateTacheMutation();
    const {
        data: taches = [],
        isLoading,
        error,
        refetch
    } = useGetAllTachesWithDetailsByIdQuery(enteteId, {
        skip: !enteteId
    });

    // Function to handle normal success messages
    const onHandleNormalSuccess = (successMessage) => {
        setSnackbarState({
            open: true,
            severity: 'success',
            message: successMessage,
        });
    };

    // Function to handle normal error messages
    const onHandleNormalError = (errorMessage) => {
        setSnackbarState({
            open: true,
            severity: 'error',
            message: errorMessage,
        });
    };

    // Function to close snackbar
    const handleCloseSnackbar = () => {
        setSnackbarState({ ...snackbarState, open: false });
    };

    // Function to refetch data
    const refetchData = async () => {
        try {
            await refetch();
        } catch (error) {
            console.error('Error refetching data:', error);
        }
    };

    // Effect to refetch data when enteteId changes
    useEffect(() => {
        if (enteteId) {
            refetchData();
        }
    }, [enteteId]);

    // Function to handle edit task click
    const handleEditTacheClick = (tache) => {
        setSelectedTache(tache);
        setOpenDialog(true);
    };

    // Function to handle delete task click
    const handleDeleteTacheClick = (id) => {
        setSelectedTache(id); // Store selected task ID for delete confirmation
        setConfirmDeleteOpen(true);
    };

    // Function to confirm delete action
    const handleDelete = async () => {
        try {
            await deleteTache(selectedTache).unwrap();
            onHandleNormalSuccess('Tâche supprimée avec succès');
            await refetchData();
            setConfirmDeleteOpen(false); // Close confirmation dialog after delete
        } catch (error) {
            onHandleNormalError('Erreur lors de la suppression de la tâche');
        }
    };

    // Function to update task
    const handleUpdateTache = async (updatedTask) => {
        try {
            await updateTache(updatedTask).unwrap();
            onHandleNormalSuccess('Tâche mise à jour avec succès');
            await refetchData();
            setOpenDialog(false); // Close dialog after update
        } catch (error) {
            onHandleNormalError('Erreur lors de la mise à jour de la tâche');
        }
    };

    // Function to export all data to PDF
    const exportAllToPDF = () => {
        const doc = new jsPDF();
        doc.text("Liste des Tâches", 20, 20);
        doc.autoTable({
            startY: 30,
            head: [['Tâche', 'Heure Début', 'Heure Fin', 'Temps Différence (minutes)', 'Coefficient', 'Prix Calculé', 'Remarques']],
            body: taches.map(row => [
                row.LibelleTache,
                dayjs(row.HDebut).subtract(2, 'hour').format('YYYY-MM-DD HH:mm'),
                dayjs(row.HFin).subtract(2, 'hour').format('YYYY-MM-DD HH:mm'),
                `${row.TempsDiff} min`,
                row.TacheCoefficient,
                row.PrixCalc,
                row.DetailRemarques
            ])
        });
        doc.save(`taches_details.pdf`);
    };

    // Function to export all data to HTML
    const exportAllToHTML = () => {
        const htmlContent = `
            <html>
                <head>
                    <title>Liste des Tâches</title>
                    <style>
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h2>Liste des Tâches</h2>
                    <table>
                        <tr>
                            <th>Tâche</th>
                            <th>Heure Début</th>
                            <th>Heure Fin</th>
                            <th>Temps Différence (minutes)</th>
                            <th>Coefficient</th>
                            <th>Prix Calculé</th>
                            <th>Remarques</th>
                        </tr>
                        ${taches.map(row => `
                            <tr>
                                <td>${row.LibelleTache}</td>
                                <td>${dayjs(row.HDebut).subtract(2, 'hour').format('YYYY-MM-DD HH:mm')}</td>
                                <td>${dayjs(row.HFin).subtract(2, 'hour').format('YYYY-MM-DD HH:mm')}</td>
                                <td>${row.TempsDiff} min</td>
                                <td>${row.TacheCoefficient}</td>
                                <td>${row.PrixCalc}</td>
                                <td>${row.DetailRemarques}</td>
                            </tr>
                        `).join('')}
                    </table>
                </body>
            </html>
        `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        saveAs(blob, 'taches_details.html');
    };

    // Function to export all data to CSV
    const exportAllToCSV = () => {
        const fields = ['LibelleTache', 'HDebut', 'HFin', 'TempsDiff', 'TacheCoefficient', 'PrixCalc', 'DetailRemarques'];
        const opts = { fields };
        const csv = parse(taches, opts);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'taches_details.csv');
    };


    const columns = [
        {
            field: 'Tache',
            headerName: 'Tâche',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                return <CustomTooltip title={row.LibelleTache}>{row.LibelleTache}</CustomTooltip>;
            }
        },
        {
            field: 'HeureDebut',
            headerName: 'Heure Début',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                const formattedDate = dayjs(row.HDebut).subtract(2, 'hour').format('YYYY-MM-DD HH:mm');
                return <CustomTooltip title={formattedDate}>{formattedDate}</CustomTooltip>;
            }
        },
        {
            field: 'HeureFin',
            headerName: 'Heure Fin',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                const formattedDate = dayjs(row.HFin).subtract(2, 'hour').format('YYYY-MM-DD HH:mm');
                return <CustomTooltip title={formattedDate}>{formattedDate}</CustomTooltip>;
            }
        },
        {
            field: 'TempsDifference',
            headerName: 'Temps Différence (minutes)',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                return (
                    <CustomTooltip title={`${row.TempsDiff} min`}>
                        {`${row.TempsDiff} min`}
                    </CustomTooltip>
                );
            }
        },
        {
            field: 'Coefficient',
            headerName: 'Coefficient',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                return <CustomTooltip title={row.TacheCoefficient}>{row.TacheCoefficient}</CustomTooltip>;
            }
        },
        {
            field: 'PrixCalcule',
            headerName: 'Prix Calculé',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                return <CustomTooltip title={row.PrixCalc}>{row.PrixCalc}</CustomTooltip>;
            }
        },
        {
            field: 'Remarques',
            headerName: 'Remarques',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: ({ row }) => {
                return <CustomTooltip title={row.DetailRemarques}>{row.DetailRemarques}</CustomTooltip>;
            }
        },
        {
            field: 'Action',
            headerName: 'Action',
            flex: 1,
            align: "center",
            headerClassName: 'bold-weight',
            renderCell: (params) => (
                <>
                    <Tooltip title="Editer">
                        <IconButton
                            color="primary"
                            onClick={() => handleEditTacheClick(params.row)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton
                            color="secondary"
                            onClick={() => handleDeleteTacheClick(params.row.DetailsTacheID)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <>
            <Box sx={{ height: 450, width: '100%' }}>
                <DataGrid
                    rows={taches}
                    columns={columns}
                    pageSize={5}
                    loading={isLoading}
                    rowsPerPageOptions={[5]}
                    initialState={{
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterLogicOperator: GridLogicOperator.Or,
                            },
                        },
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
                    sx={{
                        height: 400,
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bold',
                        }
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={exportAllToPDF}
                    sx={{ mt: 2 }}
                >
                    Exporter tout en PDF
                </Button>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={exportAllToHTML}
                    sx={{ mt: 2, ml: 2 }}
                >
                    Exporter tout en HTML
                </Button>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={exportAllToCSV}
                    sx={{ mt: 2, ml: 2 }}
                >
                    Exporter tout en CSV
                </Button>
            </Box>
            <AssignTaskDialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    refetchData();
                }}
                tache={selectedTache}
            />

            <SnackbarComponent
                open={snackbarState.open}
                handleClose={handleCloseSnackbar}
                severity={snackbarState.severity}
                message={snackbarState.message}
            />
            <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                aria-labelledby="confirm-delete-dialog"
                aria-describedby="confirm-delete-dialog-description"
            >
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <Typography>
                        Êtes-vous sûr de supprimer cette tâche ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)} sx={{
                        backgroundColor: theme.palette.blue.first,
                        color: theme.palette.white.first,
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: theme.palette.blue.first,
                            color: theme.palette.white.first
                        }
                    }}>
                        Annuler
                    </Button>
                    <Button onClick={handleDelete} color="secondary"
                        sx={{
                            backgroundColor: theme.palette.red.first,
                            color: theme.palette.white.first,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: theme.palette.red.first,
                                color: theme.palette.white.first
                            }
                        }}>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TachesParEntete;
