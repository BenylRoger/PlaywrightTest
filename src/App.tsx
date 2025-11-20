import React, { FormEvent, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';

const validCredentials = {
  email: 'valid_user@example.com',
  password: 'validPass123'
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const normaliseRoute = (path: string) => (path === '/dashboard' ? '/dashboard' : '/login');

const updateHistory = (path: string, replace = false) => {
  if (replace) {
    window.history.replaceState({}, '', path);
  } else {
    window.history.pushState({}, '', path);
  }
};

const LoginPage: React.FC = () => {
  const [route, setRoute] = useState(() => normaliseRoute(window.location.pathname));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  useEffect(() => {
    updateHistory(route, true);

    const handlePopState = () => {
      setRoute(normaliseRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (route === '/login') {
      setEmail('');
      setPassword('');
      setError('');
      setEmailTouched(false);
    }
  }, [route]);


  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!isValidEmail(email)) {
      // Email validation error is shown in helperText, not in Alert
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedEmail === validCredentials.email && trimmedPassword === validCredentials.password) {
      setError('');
      setRoute('/dashboard');
      updateHistory('/dashboard');
      return;
    }

    setError('Invalid credentials');
  };

  if (route === '/dashboard') {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={(theme) => theme.palette.background.default}
      >
        <Paper elevation={8} sx={{ p: 4, width: 'min(360px, 90vw)', textAlign: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1">
            Welcome back, {validCredentials.email}!
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor={(theme) => theme.palette.background.default}
    >
      <Paper elevation={8} sx={{ p: 4, width: 'min(360px, 90vw)' }}>
        <Typography component="h1" variant="h5" textAlign="center" gutterBottom>
          Sample Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate>
          <Stack spacing={2}>
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(event) => {
                const value = event.target.value;
                setEmail(value);
                setEmailTouched(true);
              }}
              onBlur={(event) => {
                const trimmed = event.target.value.trim();
                setEmail(trimmed);
              }}
              autoComplete="email"
              fullWidth
              error={emailTouched && !!email.trim() && !isValidEmail(email)}
              helperText={emailTouched && !!email.trim() && !isValidEmail(email) ? 'Invalid email' : undefined}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={(event) => {
                const trimmed = event.target.value.trim();
                setPassword(trimmed);
              }}
              autoComplete="current-password"
              fullWidth
            />
            <Button 
              id="loginBtn" 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={!email.trim() || !password.trim() || !isValidEmail(email)}
            >
              Log in
            </Button>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;

