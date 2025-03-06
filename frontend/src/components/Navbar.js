import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Brightness4, Brightness7, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = ({ user, onSignupOpen, onLoginOpen, onLogout, onToggleMode, currentMode, onChangeLanguage }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [langMenuAnchor, setLangMenuAnchor] = React.useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLangMenuOpen = (event) => setLangMenuAnchor(event.currentTarget);
  const handleLangMenuClose = () => setLangMenuAnchor(null);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
      <Toolbar sx={{ height: 80, px: 2 }}>
        {/* Logo */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <img
            src={require('../logos/Logo.png')}
            alt="Logo"
            style={{ cursor: 'pointer', height: 100, width: 'auto' }}
            onClick={() => navigate('/')}
          />
        </Box>

        {/* Navigation Options */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {/* Language Selector */}
          <Button color="inherit" onClick={handleLangMenuOpen}>
            {t('language')}
          </Button>
          <Menu
            anchorEl={langMenuAnchor}
            open={Boolean(langMenuAnchor)}
            onClose={handleLangMenuClose}
          >
            <MenuItem onClick={() => { onChangeLanguage('en'); handleLangMenuClose(); }}>
              English
            </MenuItem>
            <MenuItem onClick={() => { onChangeLanguage('ar'); handleLangMenuClose(); }}>
              العربية
            </MenuItem>
          </Menu>

          {/* Theme Toggle */}
          <IconButton color="inherit" onClick={onToggleMode}>
            {currentMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate(`/profile/${user.id}`)}>
                {t('profile')}
              </Button>
              {user.isAdmin && (
                <Button color="inherit" onClick={() => navigate('/admin')}>
                  {t('adminPanel')}
                </Button>
              )}
              <Button color="inherit" onClick={() => navigate('/feedback')}>
                {t('feedback')}
              </Button>
              <Button color="inherit" onClick={onLogout}>
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={onSignupOpen}>
                {t('signup')}
              </Button>
              <Button color="inherit" onClick={onLoginOpen}>
                {t('login')}
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>{t('home')}</MenuItem>
            {user ? (
              <>
                <MenuItem onClick={() => { navigate(`/profile/${user.id}`); handleMenuClose(); }}>
                  {t('profile')}
                </MenuItem>
                {user.isAdmin && (
                  <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                    {t('adminPanel')}
                  </MenuItem>
                )}
                <MenuItem onClick={() => { navigate('/feedback'); handleMenuClose(); }}>
                  {t('feedback')}
                </MenuItem>
                <MenuItem onClick={() => { onLogout(); handleMenuClose(); }}>
                  {t('logout')}
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => { onSignupOpen(); handleMenuClose(); }}>
                  {t('signup')}
                </MenuItem>
                <MenuItem onClick={() => { onLoginOpen(); handleMenuClose(); }}>
                  {t('login')}
                </MenuItem>
              </>
            )}
            <MenuItem onClick={handleLangMenuOpen}>
              {t('language')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
