import React, { useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Popover,
    Paper,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
    Tooltip,
    Divider
} from '@mui/material';
import {
    Close as CloseIcon,
    DragIndicator as DragIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    RestoreOutlined as ResetIcon,
} from '@mui/icons-material';
// Importy DnD-kit (wykomentowane ale zachowane)
/*
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
*/
import { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

interface CustomColumnsPanelProps {
    open: boolean;
    onClose: () => void;
    columns: GridColDef[];
    columnVisibilityModel: GridColumnVisibilityModel;
    onColumnVisibilityModelChange: (model: GridColumnVisibilityModel) => void;
    onResetColumns: () => void;
    onApplyColumnOrder: (newOrder: string[]) => void;
    allowReorder?: boolean;
    anchorEl: HTMLElement | null; // Nowy prop do określenia elementu kotwiczącego popover
}

// Komponent pojedynczego elementu listy (nie sortowalne teraz)
const ColumnItem = ({
    column,
    isVisible,
    isLocked,
    onToggleVisibility,
    allowReorder
}: {
    column: GridColDef;
    isVisible: boolean;
    isLocked: boolean;
    onToggleVisibility: () => void;
    allowReorder: boolean;
}) => {
    // Usunięto DnD-kit hooks

    const style = {
        backgroundColor: undefined,
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '4px',
        marginBottom: '4px',
        opacity: isVisible ? 1 : 0.6,
        position: 'relative' as const
    };

    return (
        <ListItem
            style={style}
            secondaryAction={
                allowReorder && !isLocked ? (
                    <IconButton
                        edge="end"
                        size="small"
                        sx={{ cursor: 'default', visibility: 'hidden' }} // Ukrywamy ikonę, ale zachowujemy miejsce
                        aria-label="przeciągnij kolumnę"
                    >
                        <DragIcon fontSize="small" />
                    </IconButton>
                ) : null
            }
            dense
        >
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isVisible}
                        onChange={onToggleVisibility}
                        disabled={isLocked}
                        size="small"
                    />
                }
                label={
                    <ListItemText
                        primary={column.headerName || column.field}
                        primaryTypographyProps={{
                            sx: {
                                fontWeight: isVisible ? 'bold' : 'normal',
                                color: isLocked ? 'text.disabled' : 'text.primary',
                                fontSize: '0.875rem'
                            }
                        }}
                        secondary={isLocked ? "Kolumna wymagana" : null}
                    />
                }
                sx={{ ml: 0, width: '100%' }}
            />
        </ListItem>
    );
};

const CustomColumnsPanel: React.FC<CustomColumnsPanelProps> = ({
    open,
    onClose,
    columns,
    columnVisibilityModel,
    onColumnVisibilityModelChange,
    onResetColumns,
    onApplyColumnOrder,
    allowReorder = true,
    anchorEl
}) => {
    // Stan przechowujący aktualną kolejność kolumn
    const [currentColumns, setCurrentColumns] = useState<GridColDef[]>([]);

    // Wykomentowano konfigurację sensorów dla dnd-kit
    /*
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    */

    // Aktualizujemy lokalny stan przy otwarciu modalu
    React.useEffect(() => {
        if (open) {
            // Sortujemy kolumny - ukryte na końcu, widoczne wg bieżącej kolejności
            const sortedColumns = [...columns].sort((a, b) => {
                // Wykomentowano filtrowanie kolumny "actions"
                // if (a.field === 'actions') return 1;
                // if (b.field === 'actions') return -1;

                const aHidden = columnVisibilityModel[a.field] === false;
                const bHidden = columnVisibilityModel[b.field] === false;
                if (aHidden && !bHidden) return 1;
                if (!aHidden && bHidden) return -1;
                return 0;
            });

            // Filtrujemy kolumnę "actions" z listy
            const filteredColumns = sortedColumns.filter(col => col.field !== 'actions');
            setCurrentColumns(filteredColumns);
        }
    }, [columns, columnVisibilityModel, open]);

    // Obsługa zmiany widoczności kolumny
    const handleVisibilityChange = (field: string) => {
        const newModel = {
            ...columnVisibilityModel,
            [field]: !columnVisibilityModel[field]
        };
        onColumnVisibilityModelChange(newModel);
    };

    // Obsługa resetowania ustawień
    const handleReset = () => {
        onResetColumns();
    };

    // Wykomentowano obsługę przeciągania i upuszczania
    /*
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setCurrentColumns((items) => {
                const oldIndex = items.findIndex(item => item.field === active.id);
                const newIndex = items.findIndex(item => item.field === over?.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };
    */

    // Zastosowanie zmian kolejności kolumn
    const handleApplyOrder = () => {
        const newOrder = currentColumns.map(col => col.field);
        onApplyColumnOrder(newOrder);
        onClose();
    };

    // Włączanie/wyłączanie wszystkich kolumn
    const handleToggleAll = (visible: boolean) => {
        const newModel = columns.reduce((model: GridColumnVisibilityModel, column) => {
            // Nie zmieniamy kolumn, które są oznaczone jako niepomijalne (hideable: false)
            if (column.hideable === false) {
                model[column.field] = true;
            } else {
                model[column.field] = visible;
            }
            return model;
        }, {});

        onColumnVisibilityModelChange(newModel);
    };

    // Liczba widocznych kolumn
    const visibleColumnsCount = currentColumns.filter(
        col => columnVisibilityModel[col.field] !== false
    ).length;

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                sx: {
                    width: 320,
                    maxHeight: 450,
                    overflow: 'hidden'
                }
            }}
        >
            <Paper elevation={0} sx={{ width: '100%' }}>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        Zarządzanie kolumnami
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={onClose}
                        aria-label="zamknij"
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ px: 2, py: 0.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Widoczne: {visibleColumnsCount}/{currentColumns.length}
                    </Typography>
                    <Box>
                        <Tooltip title="Pokaż wszystkie">
                            <IconButton
                                size="small"
                                onClick={() => handleToggleAll(true)}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Ukryj wszystkie">
                            <IconButton
                                size="small"
                                onClick={() => handleToggleAll(false)}
                            >
                                <VisibilityOffIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Divider />

                <Box sx={{ maxHeight: 250, overflow: 'auto', p: 1 }}>
                    {/* Wykomentowano DnD-kit context, zastąpiono zwykłą listą */}
                    {/*
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={currentColumns.map(col => col.field)}
                            strategy={verticalListSortingStrategy}
                        >
                    */}
                    <List dense disablePadding>
                        {currentColumns.map((column) => {
                            const isVisible = columnVisibilityModel[column.field] !== false;
                            const isLocked = column.hideable === false;

                            return (
                                <ColumnItem
                                    key={column.field}
                                    column={column}
                                    isVisible={isVisible}
                                    isLocked={isLocked}
                                    onToggleVisibility={() => handleVisibilityChange(column.field)}
                                    allowReorder={allowReorder && !isLocked}
                                />
                            );
                        })}
                    </List>
                    {/*
                        </SortableContext>
                    </DndContext>
                    */}
                </Box>

                <Divider />

                <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tooltip title="Przywróć domyślne ustawienia">
                        <IconButton size="small" onClick={handleReset} color="error">
                            <ResetIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Box>
                        <Button
                            size="small"
                            onClick={onClose}
                            sx={{ mr: 1 }}
                        >
                            Anuluj
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={handleApplyOrder}
                        >
                            Zastosuj
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Popover>
    );
};

export default CustomColumnsPanel;