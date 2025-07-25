import React, { useMemo } from 'react';
import { Paper, Typography, Box, Divider, CircularProgress, useTheme } from '@mui/material';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { projectStatus, chartOptions, lightChartColors, darkChartColors, getChartOptions } from './data';

import useFetchInvoices from '../../../features/invoices/hooks/useFetchInvoices';
import useFetchContractors from '../../../features/contractors/hooks/useFetchContractors';
import { PaymentStatus } from '@/types/types';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title
);

function Dashboard() {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const chartColors = isDarkMode ? darkChartColors : lightChartColors;
    const baseChartOptions = getChartOptions(isDarkMode);

    const { invoices, loading: loadingInvoices } = useFetchInvoices();
    const { contractors, loading: loadingContractors } = useFetchContractors();

    const loading = loadingInvoices || loadingContractors;

    const invoiceCount = invoices?.length || 0;
    const contractorCount = contractors?.length || 0;

    const overdueCount = useMemo(() => {
        return invoices ? invoices.filter(invoice =>
            invoice.paymentStatus === PaymentStatus.Overdue ||
            (invoice.dueDate && new Date(invoice.dueDate) < new Date() && invoice.paymentStatus !== PaymentStatus.Paid)
        ).length : 0;
    }, [invoices]);

    const paymentStatusData = useMemo(() => {
        if (!invoices) return { data: [0, 0, 0] };

        const paid = invoices.filter(inv => inv.paymentStatus === PaymentStatus.Paid).length;
        const partiallyPaid = invoices.filter(inv => inv.paymentStatus === PaymentStatus.PartiallyPaid).length;
        const unpaid = invoices.filter(inv => inv.paymentStatus === PaymentStatus.Unpaid).length;
        const overdue = invoices.filter(inv => inv.paymentStatus === PaymentStatus.Overdue).length;

        return {
            data: [paid, overdue + unpaid, partiallyPaid],
        };
    }, [invoices]);

    const monthlyRevenueData = useMemo(() => {
        const monthlyData = Array(12).fill(0);
        let currentMonthRevenue = 0;
        const currentMonth = new Date().getMonth();

        if (invoices) {
            invoices.forEach(invoice => {
                if (invoice.issueDate) {
                    const date = new Date(invoice.issueDate);
                    const month = date.getMonth();
                    const amount = Number(invoice.totalAmount || 0);

                    monthlyData[month] += amount;

                    if (month === currentMonth && date.getFullYear() === new Date().getFullYear()) {
                        currentMonthRevenue += amount;
                    }
                }
            });
        }

        return {
            data: monthlyData,
            currentMonthRevenue
        };
    }, [invoices]);

    const categoriesData = useMemo(() => {
        type CategoryKey = "Usługi" | "Produkty" | "Konsultacje" | "Szkolenia" | "Wsparcie";

        const categoryCounts = {
            "Usługi": 0,
            "Produkty": 0,
            "Konsultacje": 0,
            "Szkolenia": 0,
            "Wsparcie": 0
        };

        let totalValue = 0;

        if (invoices) {
            invoices.forEach((invoice, index) => {
                const categoryIndex = invoice.contractorId ?
                    Math.abs(invoice.contractorId) % 5 :
                    index % 5;

                const categories: CategoryKey[] = ["Usługi", "Produkty", "Konsultacje", "Szkolenia", "Wsparcie"];
                const category = categories[categoryIndex];

                const amount = Number(invoice.totalAmount || 0);
                categoryCounts[category] += amount;
                totalValue += amount;
            });
        }

        const data = Object.values(categoryCounts).map(val =>
            totalValue > 0 ? Number(((val / totalValue) * 100).toFixed(1)) : 0
        );

        return {
            data,
            totalValue
        };
    }, [invoices]);

    const paymentChartConfig = {
        labels: chartColors.payments.labels,
        datasets: [
            {
                data: paymentStatusData.data,
                backgroundColor: chartColors.payments.colors,
                borderWidth: isDarkMode ? 0 : 1,
                borderColor: isDarkMode ? 'transparent' : chartColors.payments.colors.map(color => color.replace('0.6', '1'))
            },
        ],
    };

    const monthlyRevenueConfig = {
        labels: chartOptions.monthlyRevenue.labels,
        datasets: [
            {
                label: 'Miesięczny obrót (PLN)',
                data: monthlyRevenueData.data,
                borderColor: chartColors.monthlyRevenue.borderColor,
                backgroundColor: chartColors.monthlyRevenue.backgroundColor,
                fill: true,
                tension: 0.3,
                borderWidth: 2,
                pointBackgroundColor: chartColors.monthlyRevenue.borderColor,
                pointBorderColor: isDarkMode ? '#1e1e1e' : '#fff',
                pointHoverBackgroundColor: chartColors.monthlyRevenue.borderColor,
                pointHoverBorderColor: isDarkMode ? '#1e1e1e' : '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
        ],
    };

    const categoriesConfig = {
        labels: chartColors.categories.labels,
        datasets: [
            {
                label: 'Udział kategorii w %',
                data: categoriesData.data,
                backgroundColor: chartColors.categories.colors,
                borderWidth: isDarkMode ? 0 : 1,
                borderColor: isDarkMode ? 'transparent' : chartColors.categories.colors.map(color => color.replace('0.7', '1'))
            },
        ],
    };

    // Loader color for dark mode
    const loaderColor = isDarkMode ? '#42a5f5' : 'primary';

    // Specjalne opcje dla wykresu kołowego - bez siatki!
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
            legend: {
                labels: {
                    color: baseChartOptions.plugins?.legend?.labels?.color,
                },
                position: 'bottom' as const,
            },
            tooltip: baseChartOptions.plugins?.tooltip,
        },
        // Brak scales dla wykresu kołowego - to eliminuje siatkę
    };

    // Używamy układu z dwoma kolumnami z proporcjami 67% / 33%
    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
            {/* Lewa kolumna - statystyki i wykresy - 67% szerokości */}
            <Box sx={{ width: { xs: '100%', md: '80%' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Górny rząd - statystyki */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Paper sx={{
                        p: 2,
                        flex: '1 1 0',
                        minWidth: '200px',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {loading ? (
                            <CircularProgress size={30} sx={{ color: loaderColor }} />
                        ) : (
                            <>
                                <Typography variant="h3" color="primary">{invoiceCount}</Typography>
                                <Typography variant="subtitle1">Faktury</Typography>
                            </>
                        )}
                    </Paper>

                    <Paper sx={{
                        p: 2,
                        flex: '1 1 0',
                        minWidth: '200px',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {loading ? (
                            <CircularProgress size={30} sx={{ color: loaderColor }} />
                        ) : (
                            <>
                                <Typography variant="h3" color="primary">{contractorCount}</Typography>
                                <Typography variant="subtitle1">Kontrahenci</Typography>
                            </>
                        )}
                    </Paper>

                    <Paper sx={{
                        p: 2,
                        flex: '1 1 0',
                        minWidth: '200px',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {loading ? (
                            <CircularProgress size={30} sx={{ color: loaderColor }} />
                        ) : (
                            <>
                                <Typography variant="h3" color={overdueCount > 0 ? "error" : "success"}>{overdueCount}</Typography>
                                <Typography variant="subtitle1">Zaległe płatności</Typography>
                            </>
                        )}
                    </Paper>
                </Box>

                {/* Środkowy rząd - wykresy */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Paper sx={{
                        p: 3,
                        flex: '1 1 0',
                        minWidth: '300px',
                        height: '300px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography variant="h6" gutterBottom>Status płatności</Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            {loading ? (
                                <CircularProgress sx={{ color: loaderColor }} />
                            ) : (
                                <Doughnut
                                    data={paymentChartConfig}
                                    options={doughnutOptions}
                                />
                            )}
                        </Box>
                    </Paper>

                    <Paper sx={{
                        p: 3,
                        flex: '1 1 0',
                        minWidth: '300px',
                        height: '300px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography variant="h6" gutterBottom>Struktura obrotu</Typography>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Całkowity obrót: {categoriesData.totalValue.toLocaleString()} PLN
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            {loading ? (
                                <CircularProgress sx={{ color: loaderColor }} />
                            ) : (
                                <Bar
                                    data={categoriesConfig}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        ...baseChartOptions,
                                        scales: {
                                            ...baseChartOptions.scales,
                                            y: {
                                                ...baseChartOptions.scales?.y,
                                                beginAtZero: true,
                                                max: 100,
                                                ticks: {
                                                    ...baseChartOptions.scales?.y?.ticks,
                                                    callback: function(value) {
                                                        return value + '%';
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            )}
                        </Box>
                    </Paper>
                </Box>

                {/* Dolny rząd - wykres obrotów */}
                <Paper sx={{
                    p: 3,
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Typography variant="h6" gutterBottom>Obrót miesięczny</Typography>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Bieżący miesiąc: {monthlyRevenueData.currentMonthRevenue.toLocaleString()} PLN
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {loading ? (
                            <CircularProgress sx={{ color: loaderColor }} />
                        ) : (
                            <Line
                                data={monthlyRevenueConfig}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    ...baseChartOptions,
                                    interaction: {
                                        mode: 'index',
                                        intersect: false,
                                    },
                                    scales: {
                                        ...baseChartOptions.scales,
                                        y: {
                                            ...baseChartOptions.scales?.y,
                                            beginAtZero: true,
                                            ticks: {
                                                ...baseChartOptions.scales?.y?.ticks,
                                                callback: function(value) {
                                                    return value.toLocaleString() + ' zł';
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        )}
                    </Box>
                </Paper>
            </Box>

            {/* Prawa kolumna - status projektu */}
            <Paper sx={{
                p: 3,
                width: { xs: '100%', md: '20%' },
                display: 'flex',
                flexDirection: 'column',
                height: { xs: 'auto', md: 'auto' },
                alignSelf: 'stretch'
            }}>
                <Typography variant="h6" gutterBottom>Status projektu</Typography>

                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {projectStatus.map((section, index) => (
                        <React.Fragment key={section.title}>
                            {index > 0 && <Divider sx={{ my: 2 }} />}
                            <Box sx={{ mb: index === projectStatus.length - 1 ? 0 : 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold" color={section.color}>
                                    {section.title}
                                </Typography>
                                <ul style={{ 
                                    paddingLeft: '20px', 
                                    margin: '8px 0',
                                    color: theme.palette.text.secondary 
                                }}>
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} style={{ marginBottom: '4px' }}>{item}</li>
                                    ))}
                                </ul>
                            </Box>
                        </React.Fragment>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}

export default Dashboard;
