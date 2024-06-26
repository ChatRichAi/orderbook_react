import React, { useState } from 'react';
import { Container, TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Switch, FormControlLabel, Grid, Backdrop, Chip, ToggleButton, ToggleButtonGroup, LinearProgress } from '@mui/material';

const TradeDataForm = ({ startTime, setStartTime, endTime, setEndTime, symbol, setSymbol, marketType, setMarketType, isRealTime, setIsRealTime, fetchTrades, exportTrades, trades, loading, dataType, setDataType }) => {
    const [exportLoading, setExportLoading] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [fetchProgress, setFetchProgress] = useState(0);

    const handleExportTrades = async () => {
        setExportLoading(true);
        setExportProgress(0);

        // 模拟导出过程，更新进度
        for (let i = 0; i <= 100; i++) {
            setExportProgress(i);
            await new Promise(resolve => setTimeout(resolve, 50)); // 模拟延迟
        }

        await exportTrades();
        setExportLoading(false);
    };

    const handleFetchTrades = async () => {
        setFetchLoading(true);
        setFetchProgress(0);

        // 模拟获取数据过程，更新进度
        for (let i = 0; i <= 100; i++) {
            setFetchProgress(i);
            await new Promise(resolve => setTimeout(resolve, 30)); // 模拟延迟
        }

        await fetchTrades(false, dataType);
        setFetchLoading(false);
    };

    const buyTrades = trades.filter(trade => trade.order_type === 'B');
    const sellTrades = trades.filter(trade => trade.order_type === 'S');

    return (
        <Container>
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
                    <ToggleButtonGroup
                        value={dataType}
                        exclusive
                        onChange={(e, newDataType) => setDataType(newDataType)}
                        aria-label="data type"
                    >
                        <ToggleButton value="orderbook" aria-label="order book">
                            订单簿
                        </ToggleButton>
                        <ToggleButton value="trades" aria-label="trades">
                            实时成交
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Button variant="contained" color="primary" onClick={handleFetchTrades} disabled={fetchLoading} fullWidth>
                        获取数据
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Button variant="contained" color="secondary" onClick={handleExportTrades} disabled={exportLoading} fullWidth>
                        导出数据
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {fetchLoading && (
                        <>
                            <LinearProgress variant="determinate" value={fetchProgress} />
                            <Typography variant="body2" color="textSecondary">{`${fetchProgress}%`}</Typography>
                        </>
                    )}
                    {exportLoading && (
                        <>
                            <LinearProgress variant="determinate" value={exportProgress} />
                            <Typography variant="body2" color="textSecondary">{`${exportProgress}%`}</Typography>
                        </>
                    )}
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper} style={{ marginTop: '10px' }}>
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
                                {buyTrades.map((trade, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{new Date(trade.timestamp).toLocaleString('zh-CN', { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</TableCell>
                                        <TableCell>{trade.symbol}</TableCell>
                                        <TableCell>{trade.price}</TableCell>
                                        <TableCell>
                                            {trade.quantity > 10 && (
                                                <span style={{ color: 'green' }}>●</span>
                                            )}
                                            {trade.quantity}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label="买单"
                                                style={{
                                                    backgroundColor: 'green',
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
                </Grid>
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper} style={{ marginTop: '10px' }}>
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
                                {sellTrades.map((trade, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{new Date(trade.timestamp).toLocaleString('zh-CN', { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</TableCell>
                                        <TableCell>{trade.symbol}</TableCell>
                                        <TableCell>{trade.price}</TableCell>
                                        <TableCell>
                                            {trade.quantity > 10 && (
                                                <span style={{ color: 'red' }}>●</span>
                                            )}
                                            {trade.quantity}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label="卖单"
                                                style={{
                                                    backgroundColor: 'red',
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
                </Grid>
            </Grid>
        </Container>
    );
};

export default TradeDataForm;