import React, { useState } from 'react';
import TradeDataForm from './TradeDataForm';  // 引入新组件
import useTradeData from './useTradeData';  // 引入自定义 Hook
import { Fab } from '@mui/material';
import RobotIcon from '@mui/icons-material/SmartToy';  // 引入机器人图标
import TradeDialog from './Dialog';  // 引入机器人对话框组件
import Sidebar from './Sidebar';  // 引入侧边栏组件

const TradeData = () => {
    const {
        trades,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        symbol,
        setSymbol,
        marketType,
        setMarketType,
        isRealTime,
        setIsRealTime,
        fetchTrades,
        exportTrades,
        loading
    } = useTradeData();

    const [open, setOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <TradeDataForm
                    startTime={startTime}
                    setStartTime={setStartTime}
                    endTime={endTime}
                    setEndTime={setEndTime}
                    symbol={symbol}
                    setSymbol={setSymbol}
                    marketType={marketType}
                    setMarketType={setMarketType}
                    isRealTime={isRealTime}
                    setIsRealTime={setIsRealTime}
                    fetchTrades={fetchTrades}
                    exportTrades={exportTrades}
                    trades={trades}
                    loading={loading}
                />
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={handleClickOpen}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <RobotIcon />
                </Fab>
                <TradeDialog
                    open={open}
                    handleClose={handleClose}
                    isExpanded={isExpanded}
                    handleToggleExpand={handleToggleExpand}
                />
            </div>
            <Sidebar />
        </div>
    );
};

export default TradeData;