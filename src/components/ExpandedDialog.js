import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, List, ListItem, ListItemText, IconButton, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';  // 引入关闭图标
import SendIcon from '@mui/icons-material/Send';  // 引入发送图标
import axios from 'axios';

const ExpandedDialog = () => {
    const [userInput, setUserInput] = useState('');
    const [apiResponse, setApiResponse] = useState('');

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSend = async () => {
        try {
            const response = await axios.post(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=AIzaSyCkWWLcyGoI8gF6Lv8EWXwiF8DCPGFsI9Y`, {
                prompt: {
                    text: userInput
                }
            });
            setApiResponse(response.data.choices[0].text);
        } catch (error) {
            console.error('Error sending request to Gemini API:', error);
            setApiResponse('请求失败，请稍后再试。');
        }
    };

    const handleClose = () => {
        window.close();
    };

    return (
        <Dialog
            open={true}
            onClose={handleClose}
            PaperProps={{
                style: {
                    borderRadius: '15px',
                    margin: 0,
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    width: 'auto',
                    height: 'auto',
                    minHeight: '400px'  // 设置最小高度
                }
            }}
        >
            <DialogTitle>
                盘口情报小助手
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
                <Typography variant="h6" gutterBottom>
                    猜您想问
                </Typography>
                <List>
                    <ListItem button>
                        <ListItemText primary="为我分析最近15min盘口" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="为我分析上一次DEMARK支撑盘口" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="选择交易对后无法获取数据" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="账户停用/封禁查询" />
                    </ListItem>
                </List>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px' }}>
                    若上方没有您要咨询的问题，请在输入框内输入您的问题。
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="请在此处输入您的问题"
                    value={userInput}
                    onChange={handleInputChange}
                    style={{ marginTop: '16px' }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="send"
                                    onClick={handleSend}
                                    edge="end"
                                >
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {apiResponse && (
                    <Typography variant="body1" style={{ marginTop: '16px' }}>
                        {apiResponse}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    关闭
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExpandedDialog;