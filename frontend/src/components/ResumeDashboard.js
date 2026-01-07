import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fade,
  Zoom,
  Grow
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Description as ResumeIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import LoadingAnimation from './LoadingAnimation';

function ResumeDashboard({ onSelectResume, onCreateNew }) {
  const { user, logout, getToken } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, resumeId: null });

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8000/api/resumes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadResume = async (resumeId) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:8000/api/resumes/${resumeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const resumeData = await response.json();
        onSelectResume(resumeData);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:8000/api/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setResumes(resumes.filter(r => r.id !== resumeId));
        setDeleteDialog({ open: false, resumeId: null });
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        px: 2
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Paper
          elevation={6}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'white'
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              My Resumes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back, {user?.username}!
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateNew}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              Create New Resume
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={logout}
              color="error"
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {/* Resume List */}
        {loading ? (
          <Paper
            elevation={6}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'white',
            }}
          >
            <LoadingAnimation
              message="Loading your resumes..."
              type="searching"
            />
          </Paper>
        ) : resumes.length === 0 ? (
          <Fade in={!loading}>
            <Paper
              elevation={6}
              sx={{
                p: 8,
                textAlign: 'center',
                borderRadius: 3,
                animation: 'fadeInUp 0.6s ease-out',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Zoom in={!loading}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                      },
                      '50%': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  <ResumeIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                </Box>
              </Zoom>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                No Resumes Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create your first resume to get started!
              </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateNew}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              Create Resume
            </Button>
          </Paper>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {resumes.map((resume, index) => (
              <Grid item xs={12} sm={6} md={4} key={resume.id}>
                <Grow
                  in={!loading}
                  style={{ transformOrigin: '0 0 0' }}
                  timeout={300 + index * 100}
                >
                  <Card
                    elevation={4}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      },
                    }}
                  >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <ResumeIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {resume.title}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={`Created: ${formatDate(resume.created_at)}`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip
                        label={`Updated: ${formatDate(resume.updated_at)}`}
                        size="small"
                        color="primary"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => handleLoadResume(resume.id)}
                      sx={{ fontWeight: 600 }}
                    >
                      Edit
                    </Button>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, resumeId: resume.id })}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, resumeId: null })}
      >
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this resume? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, resumeId: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteResume(deleteDialog.resumeId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ResumeDashboard;
