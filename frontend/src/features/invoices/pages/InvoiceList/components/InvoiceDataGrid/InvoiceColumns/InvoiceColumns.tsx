import React from 'react';
import { Box, IconButton, Chip, Typography } from '@mui/material';
import {
    GridColDef,
    GridRenderCellParams
} from '@mui/x-data-grid';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    ViewColumn as ViewColumnIcon,
    Description as DescriptionIcon,
    CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import { Invoice } from '@app-types/types';
import { formatDate, formatAmount, formatPaymentMethod } from '@shared/utils/formatters';
import { getStatusChipColor, getPaymentStatusLabel } from '@shared/utils/statusHelpers';
import StyledTooltip from '@shared/components/StyledTooltip/StyledTooltip';

// Definicja domyślnych właściwości dla tooltipa na górze - lista faktur
const tooltipDefaultProps = {
    arrow: true,
    enterDelay: 700,
    leaveDelay: 100,
    placement: "top" as const
};

/**
 * Generuje definicje kolumn dla tabeli faktur
 */
export const getInvoiceColumns = (
    renderFilterHeader: (params: any, placeholder: string) => React.ReactNode,
    onEditInvoice: (id: number) => void,
    onDeleteInvoice: (id: number) => void,
    onPreviewInvoice: (invoice: Invoice & { contractorName?: string }) => void,
    onSettleInvoice: (invoice: Invoice & { contractorName?: string }) => void, // Nowy parametr dla funkcji rozliczenia
    onOpenColumnSelector: () => void,
    columnMenuButtonRef: React.RefObject<HTMLButtonElement>
): GridColDef[] => [
        {
            field: 'number',
            headerName: 'Numer',
            flex: 1,
            minWidth: 130,
            renderHeader: (params) => renderFilterHeader(params, 'Filtruj po numerze'),
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '100%',
                    pl: 1
                }}>
                    <Typography
                        variant="body2"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flexGrow: 1
                        }}
                        data-testid={`invoice-number-${params.row.id}`}
                    >
                        {params.value || '-'}
                    </Typography>
                    <StyledTooltip title="Podgląd faktury" {...tooltipDefaultProps}>
                        <IconButton
                            size="small"
                            onClick={() => onPreviewInvoice(params.row)}
                            aria-label="podgląd faktury"
                            sx={{ ml: 1 }}
                            data-testid={`invoice-preview-btn-${params.row.id}`}
                        >
                            <DescriptionIcon fontSize="small" />
                        </IconButton>
                    </StyledTooltip>
                </Box>
            ),
        },
        {
            field: 'contractorName',
            headerName: 'Kontrahent',
            flex: 1.5,
            minWidth: 180,
            renderHeader: (params) => renderFilterHeader(params, 'Filtruj po nazwie'),
            renderCell: (params) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    pl: 1
                }}>
                    <Typography variant="body2" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {params.value || '-'}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'issueDate',
            headerName: 'Data wystawienia',
            flex: 1,
            minWidth: 120,
            renderHeader: (params) => renderFilterHeader(params, 'Filtruj po dacie'),
            renderCell: (params) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    pl: 1
                }}>
                    <Typography variant="body2">
                        {formatDate(params.row.issueDate)}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'paymentMethod',
            headerName: 'Metoda płatności',
            flex: 1,
            minWidth: 130,
            renderHeader: (params) => renderFilterHeader(params, 'Filtruj po metodzie'),
            renderCell: (params) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    pl: 1
                }}>
                    <Typography variant="body2">
                        {formatPaymentMethod(params.row.paymentMethod)}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'totalAmount',
            headerName: 'Kwota',
            flex: 0.8,
            minWidth: 100,
            align: 'right',
            renderHeader: (params) => renderFilterHeader(params, 'Filtruj po kwocie'),
            renderCell: (params) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '100%',
                    height: '100%',
                    pr: 2,
                }}>
                    <Typography variant="body2">
                        {formatAmount(params.row.totalAmount)}
                    </Typography>
                </Box>
            ),
            type: 'number',
        },
        {
            field: 'dueDate',
            headerName: 'Termin płatności',
            flex: 1,
            minWidth: 120,
            renderHeader: (params) => renderFilterHeader(params, 'Filtruj po terminie'),
            renderCell: (params) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    pl: 1
                }}>
                    <Typography variant="body2">
                        {formatDate(params.row.dueDate)}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'paymentStatus',
            headerName: 'Status',
            flex: 1,
            minWidth: 140,
            align: 'center',
            renderHeader: (params) => renderFilterHeader(params, 'Filtruj po statusie'),
            renderCell: (params) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left',
                    width: '100%',
                    height: '100%',
                    pl: 1
                }}>
                    <Chip
                        label={getPaymentStatusLabel(params.row.paymentStatus)}
                        color={getStatusChipColor(params.row.paymentStatus) as any}
                        size="small"
                    />
                </Box>
            ),
        },
        {
            field: 'paidAmount',
            headerName: 'Zapłacono',
            flex: 0.8,
            minWidth: 100,
            align: 'right',
            renderHeader: (params) => renderFilterHeader(params, 'Filtruj po zapłacono'),
            renderCell: (params) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '100%',
                    height: '100%',
                    pl: 0
                }}>
                    <Typography variant="body2">
                        {formatAmount(params.row.paidAmount || 0)}
                    </Typography>
                </Box>
            ),
            type: 'number',
            resizable: false,
            headerClassName: 'last-normal-column',
            cellClassName: 'last-normal-column',
        },
        {
            field: 'actions',
            headerName: '',
            sortable: false,
            filterable: false,
            width: 160,
            align: 'center',
            headerAlign: 'center',
            resizable: false,
            hideable: false,
            disableColumnMenu: true,
            flex: 0,
            cellClassName: 'actions-cell',
            headerClassName: 'actions-header',
            colSpan: 1,
            editable: false,
            renderHeader: () => (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    pr: 1
                }}>
                    <StyledTooltip title="Zarządzaj kolumnami" placement="top">
                        <IconButton
                            size="small"
                            onClick={onOpenColumnSelector}
                            ref={columnMenuButtonRef}
                        >
                            <ViewColumnIcon fontSize="small" />
                        </IconButton>
                    </StyledTooltip>
                </Box>
            ),
            renderCell: (params) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                }}>
                    {/* Nowy przycisk do rozliczania faktury */}
                    <StyledTooltip title="Rozlicz fakturę" {...tooltipDefaultProps}>
                        <IconButton
                            size="small"
                            onClick={() => onSettleInvoice(params.row)}
                            aria-label="rozlicz fakturę"
                            data-testid={`invoice-settle-btn-${params.row.id}`}
                        >
                            <CreditCardIcon fontSize="small" />
                        </IconButton>
                    </StyledTooltip>

                    <StyledTooltip title="Edytuj fakturę" {...tooltipDefaultProps}>
                        <IconButton
                            size="small"
                            onClick={() => onEditInvoice(params.row.id)}
                            aria-label="edytuj"
                            data-testid={`invoice-edit-btn-${params.row.id}`}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </StyledTooltip>

                    <StyledTooltip title="Usuń fakturę" {...tooltipDefaultProps}>
                        <IconButton
                            size="small"
                            onClick={() => onDeleteInvoice(params.row.id)}
                            aria-label="usuń"
                            data-testid={`invoice-delete-btn-${params.row.id}`}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </StyledTooltip>
                </Box>
            ),
        }
    ];