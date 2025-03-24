import React, { useMemo } from 'react';
import { Paper, Typography, Box, Divider, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { projectStatus, chartOptions } from './data';

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

    const updatedChartOptions = {
        payments: {
            labels: ["Opłacone", "Nieopłacone", "Częściowo opłacone"],
            colors: ["#4CAF50", "#f44336", "#FFC107"]
        },
        monthlyRevenue: chartOptions.monthlyRevenue,
        categories: chartOptions.categories
    };

    const paymentChartConfig = {
        labels: updatedChartOptions.payments.labels,
        datasets: [
            {
                data: paymentStatusData.data,
                backgroundColor: updatedChartOptions.payments.colors,
                borderWidth: 1
            },
        ],
    };

    const monthlyRevenueConfig = {
        labels: chartOptions.monthlyRevenue.labels,
        datasets: [
            {
                label: 'Miesięczny obrót (PLN)',
                data: monthlyRevenueData.data,
                borderColor: '#3f51b5',
                backgroundColor: 'rgba(63, 81, 181, 0.1)',
                fill: true,
                tension: 0.3
            },
        ],
    };

    const categoriesConfig = {
        labels: chartOptions.categories.labels,
        datasets: [
            {
                label: 'Udział kategorii w %',
                data: categoriesData.data,
                backgroundColor: chartOptions.categories.colors,
                borderWidth: 1
            },
        ],
    };

    return (
        <Grid container spacing={3}>
            {/* Statystyki */}
            <Grid size={{ xs: 12, md: 8 }}>
                {/* Kafelki z podstawowymi danymi */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Paper sx={{ p: 2, height: '100%', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {loading ? (
                                <CircularProgress size={30} />
                            ) : (
                                <>
                                    <Typography variant="h3" color="primary">{invoiceCount}</Typography>
                                    <Typography variant="subtitle1">Faktury</Typography>
                                </>
                            )}
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Paper sx={{ p: 2, height: '100%', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {loading ? (
                                <CircularProgress size={30} />
                            ) : (
                                <>
                                    <Typography variant="h3" color="primary">{contractorCount}</Typography>
                                    <Typography variant="subtitle1">Kontrahenci</Typography>
                                </>
                            )}
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Paper sx={{ p: 2, height: '100%', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {loading ? (
                                <CircularProgress size={30} />
                            ) : (
                                <>
                                    <Typography variant="h3" color={overdueCount > 0 ? "error" : "success"}>{overdueCount}</Typography>
                                    <Typography variant="subtitle1">Zaległe płatności</Typography>
                                </>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                {/* Wykresy */}
                <Grid container spacing={3}>
                    {/* Wykres płatności */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, height: '300px', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" gutterBottom>Status płatności</Typography>
                            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <Doughnut
                                        data={paymentChartConfig}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false
                                        }}
                                    />
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Wykres kategorii */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, height: '300px', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" gutterBottom>Struktura obrotu</Typography>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Całkowity obrót: {categoriesData.totalValue.toLocaleString()} PLN
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <Bar
                                        data={categoriesConfig}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    max: 100
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Wykres miesięcznych obrotów */}
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 2, height: '300px', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" gutterBottom>Obrót miesięczny</Typography>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Bieżący miesiąc: {monthlyRevenueData.currentMonthRevenue.toLocaleString()} PLN
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <CircularProgress />
                                ) : (
                                    <Line
                                        data={monthlyRevenueConfig}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>

            {/* Status zadań - dynamiczny z danych */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 2, height: '97%' }}>
                    <Typography variant="h6" gutterBottom>Status projektu</Typography>

                    {projectStatus.map((section, index) => (
                        <React.Fragment key={section.title}>
                            {index > 0 && <Divider sx={{ my: 2 }} />}
                            <Box sx={{ mb: index === projectStatus.length - 1 ? 0 : 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold" color={section.color}>
                                    {section.title}
                                </Typography>
                                <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex}>{item}</li>
                                    ))}
                                </ul>
                            </Box>
                        </React.Fragment>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Dashboard;