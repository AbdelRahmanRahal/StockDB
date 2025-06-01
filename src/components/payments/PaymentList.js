import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip
} from '@mui/material';
import { Add, Visibility, Receipt } from '@mui/icons-material';
import { paymentService } from '../../services/paymentService';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [formData, setFormData] = useState({
        order_id: '',
        amount: '',
        payment_method: 'credit_card',
        status: 'pending'
    });

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            const data = await paymentService.getAllPayments();
            setPayments(data);
        } catch (error) {
            console.error('Error loading payments:', error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            completed: 'success',
            failed: 'error',
            refunded: 'info'
        };
        return colors[status] || 'default';
    };

    const handleViewPayment = (payment) => {
        setSelectedPayment(payment);
        setFormData(payment);
        setOpen(true);
    };

    const handleGenerateReceipt = async (payment) => {
        try {
            await paymentService.generateReceipt(payment.id);
        } catch (error) {
            console.error('Error generating receipt:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedPayment) {
                await paymentService.updatePayment(selectedPayment.id, formData);
            } else {
                await paymentService.createPayment(formData);
            }
            setOpen(false);
            loadPayments();
        } catch (error) {
            console.error('Error saving payment:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Payments</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setSelectedPayment(null);
                        setFormData({
                            order_id: '',
                            amount: '',
                            payment_method: 'credit_card',
                            status: 'pending'
                        });
                        setOpen(true);
                    }}
                >
                    Process Payment
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Payment ID</TableCell>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.id}</TableCell>
                                <TableCell>{payment.order_id}</TableCell>
                                <TableCell>${payment.amount}</TableCell>
                                <TableCell>{payment.payment_method}</TableCell>
                                <TableCell>
                                    {new Date(payment.payment_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={payment.status}
                                        color={getStatusColor(payment.status)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleViewPayment(payment)}
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleGenerateReceipt(payment)}
                                    >
                                        <Receipt />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Payment Processing Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedPayment ? 'Payment Details' : 'Process Payment'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Order</InputLabel>
                                <Select
                                    value={formData.order_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            order_id: e.target.value
                                        })
                                    }
                                >
                                    {/* Add order options */}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        amount: e.target.value
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    value={formData.payment_method}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            payment_method: e.target.value
                                        })
                                    }
                                >
                                    <MenuItem value="credit_card">Credit Card</MenuItem>
                                    <MenuItem value="debit_card">Debit Card</MenuItem>
                                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        {selectedPayment ? 'Update' : 'Process Payment'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaymentList;