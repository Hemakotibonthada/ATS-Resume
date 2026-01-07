import React from 'react';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import {
  CloudUpload,
  Scanner,
  FindInPage,
  Psychology,
  CheckCircle,
  AutoAwesome
} from '@mui/icons-material';

const LoadingAnimation = ({ 
  message = 'Loading...', 
  type = 'default',
  showIcon = true 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'upload':
        return <CloudUpload sx={{ fontSize: 60 }} />;
      case 'scanning':
        return <Scanner sx={{ fontSize: 60 }} />;
      case 'analyzing':
        return <Psychology sx={{ fontSize: 60 }} />;
      case 'searching':
        return <FindInPage sx={{ fontSize: 60 }} />;
      case 'success':
        return <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />;
      default:
        return <AutoAwesome sx={{ fontSize: 60 }} />;
    }
  };

  return (
    <Fade in={true}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          minHeight: 200,
        }}
      >
        {/* Animated Container */}
        <Box
          sx={{
            position: 'relative',
            mb: 3,
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px)',
              },
              '50%': {
                transform: 'translateY(-15px)',
              },
            },
          }}
        >
          {/* Outer Ring */}
          <Box
            sx={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.main',
              opacity: 0.2,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  transform: 'scale(1)',
                  opacity: 0.2,
                },
                '50%': {
                  transform: 'scale(1.1)',
                  opacity: 0.4,
                },
              },
            }}
          />
          
          {/* Spinning Circle */}
          <CircularProgress
            size={100}
            thickness={3}
            sx={{
              color: 'primary.main',
              position: 'relative',
              zIndex: 2,
            }}
          />
          
          {/* Icon in Center */}
          {showIcon && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
                color: 'primary.main',
                animation: 'rotate 4s linear infinite',
                '@keyframes rotate': {
                  '0%': {
                    transform: 'translate(-50%, -50%) rotate(0deg)',
                  },
                  '100%': {
                    transform: 'translate(-50%, -50%) rotate(360deg)',
                  },
                },
              }}
            >
              {getIcon()}
            </Box>
          )}
        </Box>

        {/* Loading Text */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            animation: 'fadeInOut 2s ease-in-out infinite',
            '@keyframes fadeInOut': {
              '0%, 100%': {
                opacity: 0.6,
              },
              '50%': {
                opacity: 1,
              },
            },
          }}
        >
          {message}
        </Typography>

        {/* Animated Dots */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
                '@keyframes bounce': {
                  '0%, 80%, 100%': {
                    transform: 'scale(0.6)',
                    opacity: 0.5,
                  },
                  '40%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingAnimation;
