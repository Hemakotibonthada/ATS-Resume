import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  Fade,
  Zoom,
  Grow,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import LoadingAnimation from './LoadingAnimation';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ScoreDashboard({ score, analysis, resume }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    if (score && score.sections) {
      const data = Object.entries(score.sections).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        score: value,
        maxScore: getMaxScore(key)
      }));
      setChartData(data);
      
      // Trigger animations
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setAnimateScore(true), 300);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [score]);

  const getMaxScore = (section) => {
    const maxScores = {
      contact: 10,
      summary: 10,
      experience: 30,
      education: 15,
      skills: 15,
      projects: 10,
      certifications: 5,
      format: 5
    };
    return maxScores[section] || 10;
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#4caf50';
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'warning';
    return 'error';
  };

  if (!score || !analysis) {
    return (
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 6,
              maxWidth: 600,
              mx: 'auto',
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            }}
          >
            <Zoom in timeout={1000}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      transform: 'scale(1)',
                      boxShadow: '0 0 0 0 rgba(102, 126, 234, 0.7)',
                    },
                    '50%': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 0 20px rgba(102, 126, 234, 0)',
                    },
                  },
                }}
              >
                <AssessmentIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
            </Zoom>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Ready to Score Your Resume?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Click the "Score" button in the top menu to analyze your resume and get detailed recommendations for improvement.
            </Typography>
            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-message': {
                  width: '100%',
                }
              }}
            >
              💡 Make sure you've filled in your resume details before scoring for the best results!
            </Alert>
          </Paper>
        </Box>
      </Fade>
    );
  }

  if (loading) {
    return <LoadingAnimation message="Analyzing your resume..." type="analyzing" />;
  }

  const COLORS = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#ffeb3b', '#795548'];

  return (
    <Fade in={!loading} timeout={600}>
      <Box>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
          }}
        >
          📊 Resume Score & Analysis
        </Typography>

        {/* Overall Score Card */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Zoom in={animateScore} timeout={800}>
              <Card 
                elevation={6}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                  },
                }}
              >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                {score.overall}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Overall Score
              </Typography>
              <Chip
                label={`Grade: ${score.grade}`}
                sx={{ 
                  mt: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              />
            </CardContent>
          </Card>
            </Zoom>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={4}
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(79, 172, 254, 0.3)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                {analysis.compatibility_score}%
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                ATS Compatibility
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                {analysis.compatibility_score >= 80 ? '✅ Excellent' : analysis.compatibility_score >= 60 ? '👍 Good' : '⚠️ Needs Improvement'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={4}
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(240, 147, 251, 0.3)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                {analysis.keyword_density.total_keywords}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Keywords Found
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                {analysis.keyword_density.total_keywords >= 10 ? '🎯 Well Optimized' : '📈 Add More Keywords'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section Scores */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontWeight: 600, 
            color: 'primary.main',
            mb: 3,
          }}
        >
          📊 Section Breakdown
        </Typography>
        <Grid container spacing={2}>
          {chartData.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.name}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{section.name}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {section.score.toFixed(1)}/{section.maxScore}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(section.score / section.maxScore) * 100}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getScoreColor((section.score / section.maxScore) * 100),
                      borderRadius: 5,
                      transition: 'transform 1s ease-in-out',
                    }
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="url(#colorScore)" name="Your Score" radius={[8, 8, 0, 0]} />
              <Bar dataKey="maxScore" fill="#e3f2fd" name="Max Score" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Strengths and Weaknesses */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3,
              borderRadius: 3,
              border: '2px solid',
              borderColor: '#4caf50',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: 'success.main',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CheckIcon />
              ✅ Strengths
            </Typography>
            <List>
              {score.breakdown.strengths.map((strength, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={strength} />
                </ListItem>
              ))}
            </List>
            {score.breakdown.strengths.length === 0 && (
              <Typography variant="body2" color="textSecondary">
                No strengths identified yet. Keep improving your resume!
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3,
              borderRadius: 3,
              border: '2px solid',
              borderColor: '#ff9800',
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: 'error.main',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <WarningIcon />
              ⚠️ Areas for Improvement
            </Typography>
            <List>
              {score.breakdown.weaknesses.map((weakness, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WarningIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary={weakness} />
                </ListItem>
              ))}
            </List>
            {score.breakdown.weaknesses.length === 0 && (
              <Typography variant="body2" color="textSecondary">
                Great job! No major weaknesses detected.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recommendations */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
          border: '2px solid',
          borderColor: 'primary.light',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TrendingUpIcon />
          💡 Recommendations
        </Typography>
        <List>
          {score.breakdown.recommendations.map((rec, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <AssessmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={rec} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* ATS Analysis Details */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 3,
          }}
        >
          🎯 ATS Compatibility Details
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="success.main">
              Passed Checks ({analysis.passed_checks.length})
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="warning.main">
              Warnings ({analysis.warnings.length})
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="error.main">
              Issues ({analysis.issues.length})
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {analysis.passed_checks.length > 0 && (
          <>
            <Typography variant="subtitle2" color="success.main" gutterBottom>
              ✓ Passed Checks
            </Typography>
            <List dense>
              {analysis.passed_checks.map((check, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={check} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {analysis.warnings.length > 0 && (
          <>
            <Typography variant="subtitle2" color="warning.main" gutterBottom sx={{ mt: 2 }}>
              ⚠ Warnings
            </Typography>
            <List dense>
              {analysis.warnings.map((warning, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WarningIcon color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={warning} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {analysis.issues.length > 0 && (
          <>
            <Typography variant="subtitle2" color="error.main" gutterBottom sx={{ mt: 2 }}>
              ✗ Issues to Fix
            </Typography>
            <List dense>
              {analysis.issues.map((issue, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ErrorIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={issue} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>

      {/* Keyword Analysis */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Keyword Analysis by Category
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(analysis.keyword_density.categories).map(([category, data], index) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Grow
                in={animateScore}
                timeout={1200 + index * 150}
                style={{ transformOrigin: '0 0 0' }}
              >
                <Card 
                  variant="outlined"
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Typography>
                    <Typography variant="h4" color="textSecondary">
                      {data.count}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Keywords found
                    </Typography>
                    {data.keywords.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {data.keywords.slice(0, 3).map((kw, idx) => (
                          <Chip 
                            key={idx} 
                            label={kw} 
                            size="small" 
                            sx={{ 
                              mr: 0.5, 
                              mb: 0.5,
                              animation: `fadeIn 0.5s ease-in ${idx * 0.1}s`,
                              '@keyframes fadeIn': {
                                '0%': {
                                  opacity: 0,
                                  transform: 'scale(0.8)',
                                },
                                '100%': {
                                  opacity: 1,
                                  transform: 'scale(1)',
                                },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Paper>
      </Box>
    </Fade>
  );
}

export default ScoreDashboard;
