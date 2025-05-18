/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid';
import { plPL } from '@mui/x-data-grid/locales';
import TableLoadingOverlay from '@shared/components/DataGridLoaders/TableLoadingOverlay';

interface GridWrapperProps {
    rows: any[];
    columns: GridColDef[];
    loading: boolean;
    columnVisibilityModel: any;
    onColumnVisibilityModelChange: (model: any) => void;
    apiRef: any;
    height: string;
}

/**
 * Wrapper for the DataGrid component with basic configuration
 */
export const GridWrapper: React.FC<GridWrapperProps> = ({
    rows,
    columns,
    loading,
    columnVisibilityModel,
    onColumnVisibilityModelChange,
    apiRef,
    height
}) => {
    return (
        <DataGrid
            showCellVerticalBorder={false}
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            density="standard"
            loading={loading}
            localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 25,
                        page: 0
                    }
                },
                // Added default sorting by issue date descending
                sorting: {
                    sortModel: [
                        {
                            field: 'issueDate',
                            sort: 'desc'
                        }
                    ]
                }
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            slots={{
                loadingOverlay: TableLoadingOverlay,
            }}
            disableColumnMenu={true}
            slotProps={{
                loadingOverlay: {
                    sx: {
                        zIndex: 9999,
                        position: 'absolute',
                        width: '100%',
                        height: '100%'
                    }
                },
                footer: {
                    sx: {
                        marginBottom: 0,
                        borderTop: '1px solid #e0e0e0',
                        paddingBottom: 0
                    }
                }
            }}
            apiRef={apiRef}
            hideFooterSelectedRowCount
            disableVirtualization={false}
            className="invoice-datagrid"
            keepNonExistentRowsSelected
            sx={{
                flexGrow: 1,
                width: '100%',
                height,
                '& .MuiDataGrid-main': {
                    overflow: 'auto !important',
                },
                '.MuiDataGrid-virtualScroller': {
                    overflow: 'auto !important',
                    overflowX: 'hidden',
                    "&::-webkit-scrollbar": {
                        width: "6px",
                        height: "0",
                    },
                    marginBottom: 0
                },
                '.MuiDataGrid-cell': {
                    overflow: 'hidden',
                },
                [`.${gridClasses.columnHeader}, .${gridClasses.cell}`]: {
                    position: 'relative',
                    '& .MuiTooltip-popper, & .MuiPopover-root': {
                        zIndex: 10001,
                    },
                    '& .MuiPopover-paper': {
                        transformOrigin: 'top center !important',
                        position: 'absolute !important'
                    }
                },
                '& .filter-popover': {
                    zIndex: 10001,
                    '& .MuiPaper-root': {
                        overflow: 'visible',
                    }
                },
                '.MuiDataGrid-footerContainer': {
                    marginTop: 'auto',
                    paddingBottom: 0,
                    borderTop: '1px solid #e0e0e0',
                },
            }}
        />
    );
};