import React from 'react';
import { Container, TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Switch, FormControlLabel, Grid, Backdrop, Chip } from '@mui/material';

const TradeDataForm = ({ startTime, setStartTime, endTime, setEndTime, symbol, setSymbol, marketType, setMarketType, isRealTime, setIsRealTime, fetchTrades, exportTrades, trades, loading }) => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom></Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="开始时间"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="结束时间"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel shrink={symbol !== ''}>交易对</InputLabel>
                        <Select
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            label="交易对"
                            displayEmpty
                        >
                            <MenuItem value="btcusdt">BTCUSDT</MenuItem>
                            <MenuItem value="btcusdt_perp">BTCUSDT_PERP</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel shrink={marketType !== ''}>市场类型</InputLabel>
                        <Select
                            value={marketType}
                            onChange={(e) => setMarketType(e.target.value)}
                            label="市场类型"
                            displayEmpty
                        >
                            <MenuItem value="spot">现货</MenuItem>
                            <MenuItem value="perp">合约</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                <FormControlLabel
                control={<Switch checked={isRealTime} onChange={(e) => setIsRealTime(e.target.checked)} />}
                label="实时数据"
            />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
            <Button variant="contained" color="primary" onClick={fetchTrades} disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : '获取数据'}
            </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
            <Button variant="contained" color="secondary" onClick={exportTrades} fullWidth>
                导出数据
            </Button>
        </Grid>
    </Grid>
    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>时间</TableCell>
                    <TableCell>标的</TableCell>
                    <TableCell>价格</TableCell>
                    <TableCell>数量</TableCell>
                    <TableCell>多空</TableCell>
                    <TableCell>订单类型</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {trades.map((trade, index) => (
                    <TableRow key={index}>
                        <TableCell>{new Date(trade.timestamp).toLocaleString('zh-CN', { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</TableCell>
                        <TableCell>{trade.symbol}</TableCell>
                        <TableCell>{trade.price}</TableCell>
                        <TableCell>
                            {trade.quantity > 10 && (
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: trade.order_type === 'B' ? 'green' : 'red',
                                        marginRight: '5px'
                                    }}
                                ></span>
                            )}
                            {trade.quantity}
                        </TableCell>
                        <TableCell>
                            <Chip
                                label={trade.order_type === 'B' ? '买单' : '卖单'}
                                style={{
                                    backgroundColor: trade.order_type === 'B' ? 'green' : 'red',
                                    color: 'white'
                                }}
                            />
                        </TableCell>
                        <TableCell>{marketType === 'spot' ? '现货' : '合约'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    <Backdrop style={{ color: '#fff', zIndex: 1300 }} open={loading}>
        <CircularProgress color="inherit" />
    </Backdrop>
</Container>
    );
};

export default TradeDataForm;
