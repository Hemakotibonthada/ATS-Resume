import React, { useEffect, useState } from 'react';
import { Box, Typography, Zoom, Fade } from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Celebration as CelebrationIcon,
} from '@mui/icons-material';

const SuccessAnimation = ({ message = 'Success!', subtitle, onComplete }) => {
  const [showIcon, setShowIcon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowIcon(true), 100);
    const timer2 = setTimeout(() => setShowConfetti(true), 400);
    const timer3 = setTimeout(() => setShowMessage(true), 700);
    const timer4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  // Generate confetti particles
  const confettiColors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];
  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    size: 8 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Confetti particles */}
      {showConfetti &&
        confettiParticles.map((particle) => (
          <Box
            key={particle.id}
            sx={{
              position: 'absolute',
              left: `${particle.left}%`,
              top: '-20px',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              bgcolor: particle.color,
              borderRadius: particle.size % 2 === 0 ? '50%' : 0,
              animation: `fall ${particle.duration}s linear ${particle.delay}s`,
              transform: `rotate(${particle.rotation}deg)`,
              '@keyframes fall': {
                '0%': {
                  transform: `translateY(0) rotate(${particle.rotation}deg)`,
                  opacity: 1,
                },
                '100%': {
                  transform: `translateY(100vh) rotate(${particle.rotation + 720}deg)`,
                  opacity: 0,
                },
              },
            }}
          />
        ))}

      {/* Success content */}
      <Box
        sx={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Success icon with pulse */}
        <Zoom in={showIcon} timeout={500}>
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              position: 'relative',
              animation: 'successPulse 1.5s ease-in-out infinite',
              '@keyframes successPulse': {
                '0%, 100%': {
                  transform: 'scale(1)',
                  boxShadow: '0 0 0 0 rgba(102, 126, 234, 0.7)',
                },
                '50%': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 0 30px rgba(102, 126, 234, 0)',
                },
              },
            }}
          >
            <SuccessIcon sx={{ fontSize: 80, color: 'white' }} />

            {/* Celebration icon */}
            {showConfetti && (
              <Zoom in timeout={300}>
                <CelebrationIcon
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    fontSize: 40,
                    color: '#f093fb',
                    animation: 'rotate 2s linear infinite',
                    '@keyframes rotate': {
                      '0%': {
                        transform: 'rotate(0deg)',
                      },
                      '100%': {
                        transform: 'rotate(360deg)',
                      },
                    },
                  }}
                />
              </Zoom>
            )}
          </Box>
        </Zoom>

        {/* Success message */}
        <Fade in={showMessage} timeout={800}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 2,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                animation: 'slideUp 0.8s ease-out',
                '@keyframes slideUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              {message}
            </Typography>
            {subtitle && (
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                  animation: 'slideUp 0.8s ease-out 0.2s backwards',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Fade>

        {/* Sparkle effects */}
        {showIcon && (
          <>
            {[...Array(8)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 4,
                  height: 4,
                  bgcolor: '#fff',
                  borderRadius: '50%',
                  animation: `sparkle 2s ease-out ${i * 0.2}s infinite`,
                  transformOrigin: '0 0',
                  '@keyframes sparkle': {
                    '0%': {
                      transform: `translate(0, 0) scale(0)`,
                      opacity: 1,
                    },
                    '100%': {
                      transform: `translate(${Math.cos((i * Math.PI) / 4) * 100}px, ${
                        Math.sin((i * Math.PI) / 4) * 100
                      }px) scale(1)`,
                      opacity: 0,
                    },
                  },
                }}
              />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SuccessAnimation;
