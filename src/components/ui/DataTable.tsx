'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SearchOutlined, AddOutlined } from '@mui/icons-material';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => React.ReactNode; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface DataTableProps {
    columns: Column[];
    rows: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    title?: string;
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
    onAdd?: () => void;
    addButtonLabel?: string;
    loading?: boolean;
}

export default function DataTable({
    columns,
    rows,
    title,
    searchPlaceholder = 'Search...',
    onSearch,
    onAdd,
    addButtonLabel = 'Add New',
    loading = false,
}: DataTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        if (onSearch) {
            onSearch(event.target.value);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                overflow: 'hidden',
                p: 3,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                {title && (
                    <Typography variant="h6" component="div" fontWeight={700}>
                        {title}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                    {onSearch && (
                        <TextField
                            size="small"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlined fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                minWidth: 250,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'background.default',
                                }
                            }}
                        />
                    )}

                    {onAdd && (
                        <Button
                            variant="contained"
                            startIcon={<AddOutlined />}
                            onClick={onAdd}
                            sx={{ px: 3 }}
                        >
                            {addButtonLabel}
                        </Button>
                    )}
                </Box>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                                        color: 'text.secondary',
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        py: 2.5,
                                        px: 3,
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row._id || index}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                                                transform: 'scale(1.001)',
                                            }
                                        }}
                                    >
                                        {columns.map(column => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    sx={{
                                                        py: 2.5,
                                                        px: 3,
                                                        fontSize: '0.875rem',
                                                        fontWeight: 500,
                                                        color: 'text.primary',
                                                        borderBottom: '1px solid',
                                                        borderColor: (theme) => alpha(theme.palette.divider, 0.5),
                                                    }}
                                                >
                                                    {column.format ? column.format(row) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        {rows.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 10 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No data found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Try adjusting your search or filters
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                    }
                }}
            />
        </Paper>
    );
}
