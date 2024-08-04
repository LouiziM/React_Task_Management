import { useTheme } from "@mui/material/styles";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { useState,useEffect } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import SnackbarComponent from "../../../components/misc/snackBar";
import { frFR } from "@mui/x-data-grid/locales";
import { useGetAllTachesWithDetailsByIdQuery, useUpdateTacheMutation, useDeleteDetailsTacheMutation } from '../../../features/tacheApiSlice';
import AssignTaskDialog from './assignTaskDialog'; 
import { CustomTooltip } from "../../../components/misc/customTooltip.tsx";
import dayjs from "dayjs";

const TachesParEntete = ({enteteId}) => {
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTache, setSelectedTache] = useState(null);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const {
        data: taches = [],
        isLoading,
        error,
        refetch
      } = useGetAllTachesWithDetailsByIdQuery(enteteId, {
        skip: !enteteId 
      });    
    const [deleteTache] = useDeleteDetailsTacheMutation();
    const [updateTache] = useUpdateTacheMutation();
    const onHandleNormalError = (errorMessage) => {
        setSnackbarState({
            open: true,
            severity: 'error',
            message: errorMessage,
        });
    };

    const onHandleNormalSuccess = (successMessage) => {
        setSnackbarState({
            open: true,
            severity: 'success',
            message: successMessage,
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbarState({ ...snackbarState, open: false });
    };

    const handleEditTacheClick = (tache) => {
        setSelectedTache(tache);
        setOpenDialog(true);
    };
    const refetchData = async () => {
        try {
            await refetch(); 
        } catch (error) {
            console.error('Error refetching data:', error);
        }
    };
    useEffect(() => {
        if (enteteId) {
            refetchData();
        }
    }, [enteteId]);

    const handleDeleteTacheClick = async (id) => {
        try {
            await deleteTache(id).unwrap();
            onHandleNormalSuccess('Tâche supprimée avec succès');
            await refetchData();
        } catch (error) {
            onHandleNormalError('Erreur lors de la suppression de la tâche');
        }
    };

    const handleUpdateTache = async (updatedTask) => {
        try {
            await updateTache(updatedTask).unwrap();
            onHandleNormalSuccess('Tâche mise à jour avec succès');
            await refetchData();
        } catch (error) {
            onHandleNormalError('Erreur lors de la mise à jour de la tâche');
        }
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
                const formattedDate = dayjs(row.HDebut).subtract(2, 'hour').format('YYYY-MM-DD [à] HH:mm');//here is how you substract one hour
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
                const formattedDate = dayjs(row.HFin).subtract(2, 'hour').format('YYYY-MM-DD [à] HH:mm');//here is how you substract one hour
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
                  );}
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
                            onClick={() => handleDeleteTacheClick(params.id)}
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
                    slots={{ toolbar: QuickSearchToolbar }}
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
                    onClick={() => {/* Your export logic here */}}
                    sx={{ mt: 2 }}
                >
                    Exporter tout en PDF
                </Button>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={() => {/* Your export logic here */}}
                    sx={{ mt: 2, ml: 2 }}
                >
                    Exporter tout en HTML
                </Button>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={() => {/* Your export logic here */}}
                    sx={{ mt: 2, ml: 2 }}
                >
                    Exporter tout en CSV
                </Button>
            </Box>
            <AssignTaskDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                tache={selectedTache}
            />
            <SnackbarComponent
                open={snackbarState.open}
                onClose={handleCloseSnackbar}
                severity={snackbarState.severity}
                message={snackbarState.message}
            />
        </>
    );
};

function QuickSearchToolbar() {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p="0rem 0.5rem"
            width="100%"
            height="50px"
        >
            <GridToolbarQuickFilter
                quickFilterParser={(searchInput) =>
                    searchInput
                        .split(',')
                        .map((value) => value.trim())
                        .filter((value) => value !== '')
                }
                sx={{
                    width: "100%",
                    pt: 1.5,
                    pb: 0,
                }}
            />
        </Box>
    );
}

export default TachesParEntete;
