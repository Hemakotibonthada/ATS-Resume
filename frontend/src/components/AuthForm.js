import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock
} from '@mui/icons-material';

function AuthForm({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

  const evaluatePasswordStrength = (password) => {
    let score = 0;
    let messages = [];

    if (password.length >= 8) score++;
    else messages.push('at least 8 characters');

    if (/[a-z]/.test(password)) score++;
    else messages.push('lowercase letter');

    if (/[A-Z]/.test(password)) score++;
    else messages.push('uppercase letter');

    if (/\d/.test(password)) score++;
    else messages.push('number');

    if (/[@$!%*?&#]/.test(password)) score++;

    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['error.main', 'warning.main', 'info.main', 'success.light', 'success.main'];

    return {
      score,
      label: strengthLabels[score - 1] || 'Too Weak',
      color: strengthColors[score - 1] || 'error.main',
      message: messages.length > 0 ? `Missing: ${messages.join(', ')}` : 'Strong password!'
    };
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: value });
    setError('');
    setSuccess('');

    // Evaluate password strength on signup
    if (field === 'password' && !isLogin) {
      setPasswordStrength(evaluatePasswordStrength(value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Frontend validation
    if (!isLogin) {
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters long');
        setLoading(false);
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        // Enhanced error handling based on status codes
        if (response.status === 400) {
          setError(data.detail || 'Please check your input and try again.');
        } else if (response.status === 401) {
          setError(data.detail || 'Invalid email or password.');
        } else if (response.status === 403) {
          setError(data.detail || 'Account is locked. Please try again later.');
        } else if (response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(data.detail || 'Authentication failed. Please try again.');
        }
        throw new Error(data.detail || 'Authentication failed');
      }

      // Show success message
      if (data.message) {
        setSuccess(data.message);
      }

      // Save token and user info
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Small delay to show success message
      setTimeout(() => {
        onSuccess(data.user);
      }, 500);

    } catch (err) {
      console.error('Authentication error:', err);
      // Error already set above
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setPasswordStrength({ score: 0, message: '' });
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 450,
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: 40 }}>📄</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isLogin
              ? 'Sign in to access your resumes'
              : 'Join us to build amazing resumes'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={handleChange('username')}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            required
            sx={{ mb: !isLogin && formData.password ? 1 : 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!isLogin && formData.password && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Password Strength:
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600,
                    color: passwordStrength.color
                  }}
                >
                  {passwordStrength.label}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(passwordStrength.score / 5) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: passwordStrength.color,
                    borderRadius: 3
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {passwordStrength.message}
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
              },
              transition: 'all 0.3s',
            }}
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link
              component="button"
              type="button"
              onClick={toggleMode}
              sx={{
                fontWeight: 600,
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default AuthForm;
