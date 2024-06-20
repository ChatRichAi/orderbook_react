import React, { useState } from 'react';
import TradeDataForm from './TradeDataForm';  // 引入新组件
import useTradeData from './useTradeData';  // 引入自定义 Hook
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, List, ListItem, ListItemText, IconButton, InputAdornment, Box, Paper } from '@mui/material';
import RobotIcon from '@mui/icons-material/SmartToy';  // 引入机器人图标
import CloseIcon from '@mui/icons-material/Close';  // 引入关闭图标
import SendIcon from '@mui/icons-material/Send';  // 引入发送图标
import OpenInNewIcon from '@mui/icons-material/OpenInNew';  // 引入打开新页面图标
import axios from 'axios';

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
    const [userInput, setUserInput] = useState('');
    const [apiResponse, setApiResponse] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSend = async () => {
        if (userInput.trim() === '') return;

        const newMessage = { text: userInput, type: 'user' };
        setMessages([...messages, newMessage]);
        setUserInput('');

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyCkWWLcyGoI8gF6Lv8EWXwiF8DCPGFsI9Y`,
                {
                    prompt: {
                        text: newMessage.text
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const botMessage = { text: response.data.candidates[0].output, type: 'bot' };
            setMessages([...messages, newMessage, botMessage]);
        } catch (error) {
            console.error('Error sending request to Gemini API:', error);
            const errorMessage = { text: '请求失败，请稍后再试。', type: 'bot' };
            setMessages([...messages, newMessage, errorMessage]);
        }
    };

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSuggestionClick = (suggestion) => {
        setUserInput(suggestion);
    };

    return (
        <div>
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
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        borderRadius: '15px',
                        position: isExpanded ? 'absolute' : 'fixed',
                        bottom: isExpanded ? 'auto' : '80px',
                        right: isExpanded ? 'auto' : '20px',
                        top: isExpanded ? '50%' : 'auto',
                        left: isExpanded ? '50%' : 'auto',
                        transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
                        margin: 0,
                        maxWidth: isExpanded ? '70vw' : '90vw',
                        maxHeight: isExpanded ? '70vh' : '90vh',
                        width: isExpanded ? '70vw' : 'auto',
                        height: isExpanded ? '70vh' : 'auto',
                        minHeight: '400px'  // 设置最小高度
                    }
                }}
            >
                <DialogTitle>
                    盘口情报小助手
                    <IconButton
                        aria-label="open-new"
                        onClick={handleToggleExpand}
                        style={{
                            position: 'absolute',
                            right: 40,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <OpenInNewIcon />
                    </IconButton>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        style={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle1" gutterBottom>
                        猜您想问
                    </Typography>
                    <List>
                        <ListItem button onClick={() => handleSuggestionClick("为我分析最近15min盘口")}>
                            <Paper elevation={1} style={{ padding: '5px 10px', marginBottom: '10px', backgroundColor: '#f5f5f5' }}>
                                <ListItemText primary="为我分析最近15min盘口" primaryTypographyProps={{ color: 'textSecondary', fontSize: '0.875rem' }} />
                            </Paper>
                        </ListItem>
                        <ListItem button onClick={() => handleSuggestionClick("为我分析上一次DEMARK支撑盘口")}>
                            <Paper elevation={1} style={{ padding: '5px 10px', marginBottom: '10px', backgroundColor: '#f5f5f5' }}>
                                <ListItemText primary="为我分析上一次DEMARK支撑盘口" primaryTypographyProps={{ color: 'textSecondary', fontSize: '0.875rem' }} />
                            </Paper>
                        </ListItem>
                        <ListItem button onClick={() => handleSuggestionClick("选择交易对后无法获取数据")}>
                            <Paper elevation={1} style={{ padding: '5px 10px', marginBottom: '10px', backgroundColor: '#f5f5f5' }}>
                                <ListItemText primary="选择交易对后无法获取数据" primaryTypographyProps={{ color: 'textSecondary', fontSize: '0.875rem' }} />
                            </Paper>
                        </ListItem>
                        <ListItem button onClick={() => handleSuggestionClick("账户停用/封禁查询")}>
                            <Paper elevation={1} style={{ padding: '5px 10px', marginBottom: '10px', backgroundColor: '#f5f5f5' }}>
                                <ListItemText primary="请求/封禁查询" primaryTypographyProps={{ color: 'textSecondary', fontSize: '0.875rem' }} />
                            </Paper>
                        </ListItem>
                    </List>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px' }}>
                        若上方没有您要的问题，请在输入框内输入您的问题。
                    </Typography>
                    <Box display="flex" alignItems="center" style={{ marginTop: '16px' }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            maxRows={4}
                            placeholder="请在此处输入您的问题"
                            value={userInput}
                            onChange={handleInputChange}
                            style={{ flexGrow: 1 }}
                            InputProps={{
                                style: { fontSize: '0.875rem' },  // 调整输入框字体大小
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="send"
                                            onClick={handleSend}
                                            edge="end"
                                            color={userInput ? "primary" : "default"}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box style={{ marginTop: '16px' }}>
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                display="flex"
                                justifyContent={message.type === 'user' ? 'flex-end' : 'flex-start'}
                                mb={2}
                            >
                                <Paper
                                    elevation={1}
                                    style={{
                                        padding: '10px',
                                        backgroundColor: message.type === 'user' ? '#e0f7fa' : '#f5f5f5',
                                        maxWidth: '70%',
                                    }}
                                >
                                    <Typography variant="body1">{message.text}</Typography>
                                </Paper>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TradeData;