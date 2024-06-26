// AI对话框组件
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, List, ListItem, ListItemText, Paper, TextField, InputAdornment, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const TradeDialog = ({ open, handleClose, isExpanded, handleToggleExpand }) => {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);

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

    const handleSuggestionClick = (suggestion) => {
        setUserInput(suggestion);
    };

    return (
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
                    minHeight: '400px'
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
                            <ListItemText primary="账户停用/封禁查询" primaryTypographyProps={{ color: 'textSecondary', fontSize: '0.875rem' }} />
                        </Paper>
                    </ListItem>
                </List>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px' }}>
                    若上方没有您要咨询的问题，请在输入框内输入您的问题。
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
                            style: { fontSize: '0.875rem' },
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
        );
    };
    
    export default TradeDialog;