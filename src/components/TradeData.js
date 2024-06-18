import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Switch, FormControlLabel, Grid, Backdrop } from '@mui/material';
import '../TradeData.css';  // 引入CSS文件
import { Chip } from '@mui/material';


const TradeData = () => {
    const [trades, setTrades] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [symbol, setSymbol] = useState('btcusdt');  // 新增交易对选择
    const [marketType, setMarketType] = useState('spot');  // 新增市场类型选择
    const [isRealTime, setIsRealTime] = useState(false);  // 新增实时数据开关
    const [loading, setLoading] = useState(false);  // 新增加载状态

    const fetchTrades = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:5003/get-orderbook', {  // 更新端口
                params: {
                    start_time: startTime,
                    end_time: endTime,
                    symbol: symbol,  // 添加交易对参数
                    market_type: marketType  // 添加市场类型参数
                }
            });
            console.log('Fetched trades:', response.data);  // 打印返回的数据
            const filteredTrades = response.data.filter(trade => trade.quantity > 0.5);  // 过滤掉数量小于等于0.5的
            setTrades(filteredTrades.slice(0, 100));  // 只显示前100条数据
        } catch (error) {
            console.error('Error fetching trades:', error);
        } finally {
            setLoading(false);
        }
    }, [startTime, endTime, symbol, marketType]);

    const fetchLatestTrades = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:5003/get-latest-orderbook', {
                params: {
                    market_type: marketType  // 添加市场类型参数
                }
            });
            console.log('Latest trades:', response.data);  // 打印返回的数据
            const filteredTrades = response.data.filter(trade => trade.quantity > 0.5);  // 过滤掉数量小于等于0.5的
            setTrades(prevTrades => {
                const updatedTrades = [...filteredTrades, ...prevTrades].slice(0, 100);  // 更新数据并限制为前100条
                return updatedTrades;
            });
        } catch (error) {
            console.error('Error fetching latest trades:', error);
        } finally {
            setLoading(false);
        }
    }, [marketType]);

    const exportTrades = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5003/export-orderbook', {  // 更新端口
                params: {
                    start_time: startTime,
                    end_time: endTime,
                    symbol: symbol,  // 添加交易对参数
                    market_type: marketType  // 添加市场类型参数
                },
                responseType: 'blob'  // 确保接收的是二进制数据
            });

            // 创建一个URL链接到文件
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'orderbook.csv');  // 设置下载文件的名称
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error exporting trades:', error);
        }
    };

    useEffect(() => {
        if (isRealTime) {
            const interval = setInterval(fetchLatestTrades, 5000);  // 每5秒获取一次最新数据
            return () => clearInterval(interval);  // 清除定时器
        } else {
            setTrades([]);  // 清除加载的数据
        }
    }, [isRealTime, marketType, fetchLatestTrades]);  // 添加marketType, isRealTime, fetchLatestTrades作为依赖

    useEffect(() => {
        if (!isRealTime && startTime && endTime) {
            fetchTrades();
        }
    }, [startTime, endTime, symbol, marketType, isRealTime, fetchTrades]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>订单簿数据</Typography>
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
                                <TableCell>{marketType === 'spot' ? '现货' : '合约'}</TableCell> {/* 修改这里 */}
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

export default TradeData;