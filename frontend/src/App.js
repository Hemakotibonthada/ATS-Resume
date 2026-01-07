import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Description as ResumeIcon,
  Assessment as ScoreIcon,
  Work as JobMatchIcon,
  Lightbulb as SuggestionsIcon,
  GetApp as ExportIcon,
  Save as SaveIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';
import ScoreDashboard from './components/ScoreDashboard';
import JobMatcher from './components/JobMatcher';
import ResumeImporter from './components/ResumeImporter';
import AuthForm from './components/AuthForm';
import ResumeDashboard from './components/ResumeDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { saveResume, scoreResume, analyzeResume } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#764ba2',
      dark: '#4c63d2',
    },
    secondary: {
      main: '#f093fb',
      light: '#f5576c',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
  },
});

function AppContent() {
  const { user, logout, loading: authLoading } = useAuth();
  const [showDashboard, setShowDashboard] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState('editor');
  const [resume, setResume] = useState({
    contactInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    photo: null,
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    template: 'professional'
  });
  const [score, setScore] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleSelectResume = (resumeData) => {
    setResume(resumeData);
    setShowDashboard(false);
    setCurrentView('editor');
  };

  const handleCreateNew = () => {
    setResume({
      contactInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: ''
      },
      photo: null,
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      template: 'professional'
    });
    setShowDashboard(false);
    setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setShowDashboard(true);
  };

  const handleSaveResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resume)
      });

      if (response.ok) {
        const data = await response.json();
        setResume({ ...resume, id: data.id });
        showSnackbar('Resume saved successfully!', 'success');
        
        // Auto-score after saving
        await handleScoreResume();
      } else {
        throw new Error('Failed to save resume');
      }
    } catch (error) {
      showSnackbar('Error saving resume', 'error');
      console.error('Error saving resume:', error);
    }
  };

  const handleScoreResume = async () => {
    try {
      const scoreResult = await scoreResume(resume);
      setScore(scoreResult);
      
      const analysisResult = await analyzeResume(resume);
      setAnalysis(analysisResult);
      
      setCurrentView('score');
      showSnackbar(`Resume scored: ${scoreResult.overall}/100 (${scoreResult.grade})`, 'info');
    } catch (error) {
      showSnackbar('Error scoring resume', 'error');
      console.error('Error scoring resume:', error);
    }
  };

  const handleExport = (format) => {
    const endpoint = format === 'pdf' ? '/api/export/pdf' : '/api/export/docx';
    
    fetch(`http://localhost:8000${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resume),
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume_${resume.contactInfo.fullName.replace(/\s/g, '_')}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSnackbar(`Resume exported as ${format.toUpperCase()}`, 'success');
      })
      .catch(error => {
        showSnackbar(`Error exporting as ${format.toUpperCase()}`, 'error');
        console.error('Error exporting:', error);
      });
  };

  const handleImportResume = (parsedData) => {
    // Update resume state with parsed data
    setResume(prevResume => ({
      ...prevResume,
      contactInfo: {
        ...prevResume.contactInfo,
        fullName: parsedData.personalInfo.fullName || prevResume.contactInfo.fullName,
        email: parsedData.personalInfo.email || prevResume.contactInfo.email,
        phone: parsedData.personalInfo.phone || prevResume.contactInfo.phone,
        location: parsedData.personalInfo.location || prevResume.contactInfo.location,
        linkedin: parsedData.personalInfo.linkedin || prevResume.contactInfo.linkedin,
        github: parsedData.personalInfo.github || prevResume.contactInfo.github,
      },
      summary: parsedData.summary || prevResume.summary,
      skills: parsedData.skills.length > 0 ? parsedData.skills : prevResume.skills,
      experience: parsedData.experience.length > 0 ? parsedData.experience : prevResume.experience,
      education: parsedData.education.length > 0 ? parsedData.education : prevResume.education,
      projects: parsedData.projects.length > 0 ? parsedData.projects : prevResume.projects,
      certifications: parsedData.certifications.length > 0 ? parsedData.certifications : prevResume.certifications,
    }));
    
    showSnackbar('Resume imported successfully! Review and edit as needed.', 'success');
    setCurrentView('editor');
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const menuItems = [
    { text: 'Resume Editor', icon: <ResumeIcon />, view: 'editor' },
    { text: 'Score & Analysis', icon: <ScoreIcon />, view: 'score' },
    { text: 'Job Matcher', icon: <JobMatchIcon />, view: 'matcher' },
    { text: 'AI Suggestions', icon: <SuggestionsIcon />, view: 'suggestions' },
  ];

  if (authLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthForm onSuccess={() => {}} />
      </ThemeProvider>
    );
  }

  if (showDashboard) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ResumeDashboard 
          onSelectResume={handleSelectResume}
          onCreateNew={handleCreateNew}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* App Bar with Gradient */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Toolbar sx={{ py: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                mr: 2,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)',
                  transition: 'all 0.2s',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🚀 ATS Resume Builder
            </Typography>
            <Button
              color="inherit"
              startIcon={<SaveIcon />}
              onClick={handleSaveResume}
              sx={{ 
                mr: 1,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s',
              }}
            >
              Save
            </Button>
            <Button
              color="inherit"
              startIcon={<ScoreIcon />}
              onClick={handleScoreResume}
              sx={{ 
                mr: 1,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s',
              }}
            >
              Score
            </Button>
            <Button
              color="inherit"
              startIcon={<ExportIcon />}
              onClick={() => handleExport('pdf')}
              sx={{ 
                mr: 1,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s',
              }}
            >
              Export PDF
            </Button>
            <Button
              color="inherit"
              startIcon={<ExportIcon />}
              onClick={() => handleExport('docx')}
              sx={{
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s',
              }}
            >
              Export DOCX
            </Button>
          </Toolbar>
        </AppBar>

        {/* Enhanced Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            },
          }}
        >
          <Box sx={{ width: 280 }} role="presentation" className="animate-slide-in">
            <List>
              <ListItem sx={{ py: 3 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  📋 Navigation
                </Typography>
              </ListItem>
              <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
              {menuItems.map((item) => (
                <ListItemButton
                  key={item.view}
                  selected={currentView === item.view}
                  onClick={() => {
                    setCurrentView(item.view);
                    setDrawerOpen(false);
                  }}
                  sx={{
                    my: 0.5,
                    mx: 1,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateX(5px)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontWeight: currentView === item.view ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
            <Box
              sx={{
                mt: 'auto',
                p: 2,
                textAlign: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Built with ❤️
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255, 255, 255, 0.5)', mt: 0.5 }}>
                Version 1.0.0
              </Typography>
            </Box>
          </Box>
        </Drawer>

        {/* Main Content with Animation */}
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Box className="animate-fade-in">
            {currentView === 'editor' && (
              <>
                {/* Resume Importer Section */}
                <Box sx={{ mb: 4 }}>
                  <ResumeImporter onImportComplete={handleImportResume} />
                </Box>
                
                {/* Editor and Preview */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', lg: 'nowrap' }, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: '45%' } }}>
                    <ResumeEditor resume={resume} setResume={setResume} />
                  </Box>
                  <Box sx={{ 
                    flex: 1, 
                    minWidth: { xs: '100%', lg: '45%' },
                    position: { xs: 'relative', lg: 'sticky' },
                    top: { lg: 20 },
                    alignSelf: 'flex-start',
                    maxHeight: { lg: 'calc(100vh - 120px)' },
                    overflow: { lg: 'auto' },
                  }}>
                    <ResumePreview resume={resume} />
                  </Box>
                </Box>
              </>
            )}
            )}
            {currentView === 'score' && (
              <ScoreDashboard score={score} analysis={analysis} resume={resume} />
            )}
            {currentView === 'matcher' && (
              <JobMatcher resume={resume} />
            )}
            {currentView === 'suggestions' && (
              <Box>
                <Paper 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    border: '2px dashed',
                    borderColor: 'primary.main',
                  }}
                >
                  <SuggestionsIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    AI-Powered Suggestions
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                    Score your resume to get personalized AI suggestions for improvement.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ScoreIcon />}
                    onClick={handleScoreResume}
                    sx={{
                      mt: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Score Resume Now
                  </Button>
                </Paper>
              </Box>
            )}
          </Box>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              borderRadius: 2,
            },
          }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              fontWeight: 600,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Drawer Menu */}
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 280, pt: 2 }}>
            <Box sx={{ px: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Menu
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Navigate your resume builder
              </Typography>
            </Box>
            <Divider />
            <List>
              <ListItemButton onClick={handleBackToDashboard}>
                <ListItemIcon>
                  <DashboardIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="My Resumes" />
              </ListItemButton>
              {menuItems.map((item, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => {
                    setCurrentView(item.view);
                    setDrawerOpen(false);
                  }}
                  selected={currentView === item.view}
                  sx={{
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      borderRight: '4px solid #667eea',
                    }
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItemButton onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
