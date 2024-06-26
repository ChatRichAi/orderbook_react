import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssetsIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationIcon from '@mui/icons-material/Notifications';
import TradeIcon from '@mui/icons-material/TrendingUp';
import PremiumIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import UpgradeIcon from '@mui/icons-material/Upgrade';

const Sidebar = () => {
    return (
        <div style={{ width: '250px', position: 'fixed', right: '0', top: '0', height: '100%', backgroundColor: '#fff', boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.3)', zIndex: 1000 }}>
            <List>
                <ListItem button>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><AssetsIcon /></ListItemIcon>
                    <ListItemText primary="My assets" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><NotificationIcon /></ListItemIcon>
                    <ListItemText primary="Notification" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><TradeIcon /></ListItemIcon>
                    <ListItemText primary="Trade" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><TradeIcon /></ListItemIcon>
                    <ListItemText primary="10px AI" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><PremiumIcon /></ListItemIcon>
                    <ListItemText primary="Premium" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemIcon><UpgradeIcon /></ListItemIcon>
                    <ListItemText primary="Upgrade to Pro" />
                </ListItem>
            </List>
        </div>
    );
};

export default Sidebar;