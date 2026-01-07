import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Fade,
  Zoom,
  Slide,
} from '@mui/material';
import {
  Description as ResumeIcon,
  Assessment as ScoreIcon,
  CloudUpload as UploadIcon,
  AutoAwesome as SparkleIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Psychology as AIIcon,
} from '@mui/icons-material';

const WelcomeScreen = ({ onGetStarted }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const features = [
    {
      icon: <AIIcon sx={{ fontSize: 50 }} />,
      title: 'AI-Powered Analysis',
      description: 'Smart resume parsing with artificial intelligence',
      color: '#667eea',
    },
    {
      icon: <ScoreIcon sx={{ fontSize: 50 }} />,
      title: 'ATS Optimization',
      description: 'Get scored and optimize for applicant tracking systems',
      color: '#764ba2',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50 }} />,
      title: 'Lightning Fast',
      description: 'Create professional resumes in minutes',
      color: '#f093fb',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50 }} />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and safe with us',
      color: '#43e97b',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'slide 20s linear infinite',
          '@keyframes slide': {
            '0%': {
              transform: 'translateX(0) translateY(0)',
            },
            '100%': {
              transform: 'translateX(-60px) translateY(-60px)',
            },
          },
        }}
      />

      {/* Floating Shapes */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 100 + i * 50,
            height: 100 + i * 50,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,255,255,${
              0.1 - i * 0.02
            }) 0%, transparent 70%)`,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 18}%`,
            animation: `float ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px) translateX(0px)',
              },
              '50%': {
                transform: 'translateY(-20px) translateX(20px)',
              },
            },
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            pt: { xs: 8, md: 12 },
            pb: 6,
            textAlign: 'center',
          }}
        >
          <Fade in={visible} timeout={1000}>
            <Box>
              {/* Main Icon */}
              <Zoom in={visible} timeout={1200}>
                <Box
                  sx={{
                    width: { xs: 100, md: 140 },
                    height: { xs: 100, md: 140 },
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 4,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    animation: 'pulse 3s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                      },
                      '50%': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4)',
                      },
                    },
                  }}
                >
                  <ResumeIcon sx={{ fontSize: { xs: 60, md: 80 }, color: 'white' }} />
                </Box>
              </Zoom>

              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                Resume Builder AI
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                  fontWeight: 400,
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Build ATS-optimized resumes powered by AI. Get hired faster with
                intelligent suggestions and scoring.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onGetStarted}
                  startIcon={<SparkleIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<UploadIcon />}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      borderWidth: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Import Resume
                </Button>
              </Box>
            </Box>
          </Fade>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Slide
                  direction="up"
                  in={visible}
                  timeout={800 + index * 200}
                  mountOnEnter
                  unmountOnExit
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        background: 'rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          color: 'white',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ color: 'white', fontWeight: 700, mb: 1 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats Section */}
        <Fade in={visible} timeout={2000}>
          <Box
            sx={{
              py: 6,
              textAlign: 'center',
            }}
          >
            <Grid container spacing={4}>
              {[
                { number: '10K+', label: 'Resumes Created' },
                { number: '95%', label: 'Success Rate' },
                { number: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box
                    sx={{
                      animation: `countUp 2s ease-out ${index * 0.2}s`,
                      '@keyframes countUp': {
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
                    <Typography
                      variant="h2"
                      sx={{
                        color: 'white',
                        fontWeight: 800,
                        mb: 1,
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default WelcomeScreen;
