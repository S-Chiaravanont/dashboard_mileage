import React from 'react';
import { Avatar, Box, Toolbar, Typography, AppBar, Drawer, List, ListItem, ListItemText, Collapse, IconButton, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import AppContext from '../../lib/app-context';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DriveEtaIcon from '@mui/icons-material/DriveEta';

export default function TopNavigationBar() {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {user} = React.useContext(AppContext);
    const [mileageOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = () => {
        return (
            <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                <Drawer
                    variant={isMobile ? "temporary" : "permanent"}
                    open={isMobile ? open : true}  // <-- Change this back to `open`
                    onClose={() => setOpen(false)}
                    anchor="left"
                    sx={{
                        width: 250, // Increase the width as you need
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                        width: 250, // Make sure this is the same as Drawer's width
                        backgroundColor: '#263238', // Dark grey background
                        boxSizing: 'border-box',
                        },
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                >
                    <Box>
                        <List sx={{ mt: 10, color: 'white' }}> {/* White text color */}
                            <ListItem>
                                <DriveEtaIcon sx={{ mr: 1 }} />
                                <ListItemText primary="Mileage" />
                            </ListItem>
                            <Collapse in={mileageOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                <ListItem component={Link} to="/mileage">
                                    <ListItemText primary="Mileage" sx={{ pl: 3, color: 'white' }} />
                                </ListItem>
                                <ListItem component={Link} to="/mileageHR">
                                    <ListItemText primary="Mileage HR" sx={{ pl: 3, color: 'white' }} />
                                </ListItem>
                                </List>
                            </Collapse>
                        </List>
                    </Box>
                </Drawer>
            </Box>
        )
    };

    const TopAppBar = () => {
        return (
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: '#01579b',
                    padding: '5px',
                    marginBottom: '15px',
                }}
                >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => handleClick()}
                        sx={{ marginRight: 2 }}
                        >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
                        My Application
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">{user && user.FullName}</Typography>
                        <Link to="/">
                            <Avatar src="" />
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>
        )
    }

    return (
        <div>
            {TopAppBar()}
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList()}
            </Drawer>
        </div>
    );
}