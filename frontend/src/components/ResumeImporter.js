import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  IconButton,
  Chip,
  Fade,
  Zoom,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Scanner as ScannerIcon,
  FindInPage as FindInPageIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

const ResumeImporter = ({ onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [atsData, setAtsData] = useState(null);
  const [scanningStage, setScanningStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const scanningStages = [
    { label: 'Uploading', icon: <CloudUploadIcon /> },
    { label: 'Scanning Document', icon: <ScannerIcon /> },
    { label: 'Extracting Data', icon: <FindInPageIcon /> },
    { label: 'Analyzing Content', icon: <PsychologyIcon /> },
    { label: 'Complete', icon: <CheckCircleIcon /> },
  ];

  // Simulate scanning progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
      setScanningStage(0);
    }
  }, [loading]);

  useEffect(() => {
    if (progress < 25) setScanningStage(0);
    else if (progress < 50) setScanningStage(1);
    else if (progress < 75) setScanningStage(2);
    else if (progress < 100) setScanningStage(3);
    else setScanningStage(4);
  }, [progress]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
    
    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
      setError('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB');
      return;
    }

    setFile(selectedFile);
    setError('');
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:8000/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      setSuccess(true);
      setLoading(false);
      
      // Store ATS data
      if (data.ats_score) {
        setAtsData({
          score: data.ats_score,
          recommendations: data.ats_recommendations || [],
          metadata: data.parsing_metadata || {}
        });
      }
      
      // Call parent callback with parsed data
      if (onImportComplete) {
        onImportComplete(data);
      }

      // Clear file after showing results
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
      }, 5000);

    } catch (err) {
      setError(err.message || 'Failed to upload and parse resume');
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError('');
    setSuccess(false);
    setAtsData(null);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        border: '2px dashed',
        borderColor: dragActive ? 'primary.main' : 'grey.300',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          📄 Import Your Resume
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload your existing resume to auto-populate fields and optimize for ATS
        </Typography>
      </Box>

      {/* Drag and Drop Zone */}
      <Box
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.400',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          bgcolor: dragActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent)',
            animation: dragActive ? 'shimmer 2s infinite' : 'none',
          },
          '@keyframes shimmer': {
            '0%': { left: '-100%' },
            '100%': { left: '100%' },
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
          },
        }}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        
        <Zoom in={!loading}>
          <CloudUploadIcon
            sx={{
              fontSize: 60,
              color: dragActive ? 'primary.main' : 'grey.400',
              mb: 2,
              animation: dragActive ? 'float 2s ease-in-out infinite' : 'none',
              transition: 'all 0.3s ease',
            }}
          />
        </Zoom>
        
        <Typography variant="h6" gutterBottom color={dragActive ? 'primary.main' : 'text.primary'}>
          {dragActive ? 'Drop your file here' : 'Drag & Drop your resume'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          or click to browse
        </Typography>
        
        <Chip
          label="PDF"
          size="small"
          sx={{ mr: 1, bgcolor: 'error.light', color: 'white', fontWeight: 600 }}
        />
        <Chip
          label="DOCX"
          size="small"
          sx={{ mr: 1, bgcolor: 'info.light', color: 'white', fontWeight: 600 }}
        />
        <Chip
          label="TXT"
          size="small"
          sx={{ bgcolor: 'success.light', color: 'white', fontWeight: 600 }}
        />
      </Box>

      {/* Scanning Animation */}
      {loading && (
        <Fade in={loading}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 2,
              bgcolor: 'rgba(102, 126, 234, 0.05)',
              border: '1px solid',
              borderColor: 'primary.light',
              borderRadius: 2,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  mb: 2,
                }}
              >
                <CircularProgress
                  size={80}
                  thickness={4}
                  sx={{
                    color: 'primary.main',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 30,
                  }}
                >
                  {scanningStages[scanningStage]?.icon}
                </Box>
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {scanningStages[scanningStage]?.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we analyze your resume...
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                mb: 2,
                bgcolor: 'rgba(102, 126, 234, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                },
              }}
            />

            <Stepper activeStep={scanningStage} alternativeLabel>
              {scanningStages.map((stage, index) => (
                <Step key={stage.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: index <= scanningStage ? 'primary.main' : 'grey.300',
                          color: 'white',
                          transition: 'all 0.3s ease',
                          transform: index === scanningStage ? 'scale(1.2)' : 'scale(1)',
                        }}
                      >
                        {index < scanningStage ? (
                          <CheckCircleIcon sx={{ fontSize: 20 }} />
                        ) : (
                          <Typography variant="caption">{index + 1}</Typography>
                        )}
                      </Box>
                    )}
                  >
                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                      {stage.label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Fade>
      )}

      {/* Selected File Display */}
      {file && !loading && (
        <Fade in={!!file}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              mb: 2,
              border: '1px solid',
              borderColor: 'grey.300',
              animation: 'slideIn 0.3s ease-out',
              '@keyframes slideIn': {
                from: {
                  opacity: 0,
                  transform: 'translateY(-10px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DescriptionIcon color="primary" />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={clearFile} size="small" disabled={loading}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Fade>
      )}

      {/* Upload Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleUpload}
        disabled={!file || loading}
        startIcon={loading ? null : <CloudUploadIcon />}
        sx={{
          py: 1.5,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontWeight: 600,
          fontSize: '1rem',
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
          },
          '&.Mui-disabled': {
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
            color: 'rgba(255, 255, 255, 0.5)',
          },
        }}
      >
        {loading ? 'Parsing Resume...' : 'Upload & Parse Resume'}
      </Button>

      {/* Loading Progress */}
      {loading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            Extracting information from your resume...
          </Typography>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Success Message */}
      {success && (
        <>
          <Alert
            severity="success"
            sx={{ mt: 2 }}
            icon={<CheckCircleIcon />}
          >
            Resume parsed successfully! Your information has been imported.
          </Alert>
          
          {/* ATS Score Display */}
          {atsData && (
            <Box sx={{ mt: 2 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  background: atsData.score >= 75 
                    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(102, 187, 106, 0.1) 100%)'
                    : atsData.score >= 60
                    ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 115, 115, 0.1) 100%)',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: atsData.score >= 75 ? '#4caf50' : atsData.score >= 60 ? '#ff9800' : '#f44336',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: atsData.score >= 75 
                        ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                        : atsData.score >= 60
                        ? 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)'
                        : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      {atsData.score}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                      / 100
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      📊 ATS Compatibility Score
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {atsData.score >= 90 ? 'Excellent! Highly optimized for ATS systems.' :
                       atsData.score >= 75 ? 'Good! Your resume is well-optimized.' :
                       atsData.score >= 60 ? 'Fair. Some improvements recommended.' :
                       'Needs improvement. Follow recommendations below.'}
                    </Typography>
                  </Box>
                </Box>

                {/* Metadata */}
                {atsData.metadata && (
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    {atsData.metadata.skills_count > 0 && (
                      <Chip
                        label={`${atsData.metadata.skills_count} Skills`}
                        size="small"
                        sx={{ bgcolor: 'primary.light', color: 'white', fontWeight: 600 }}
                      />
                    )}
                    {atsData.metadata.has_action_verbs && (
                      <Chip
                        label="✓ Action Verbs"
                        size="small"
                        sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 600 }}
                      />
                    )}
                    {atsData.metadata.has_quantifiable_results && (
                      <Chip
                        label="✓ Quantified Results"
                        size="small"
                        sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 600 }}
                      />
                    )}
                  </Box>
                )}

                {/* Recommendations */}
                {atsData.recommendations && atsData.recommendations.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      💡 Recommendations for Improvement:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {atsData.recommendations.slice(0, 5).map((rec, index) => (
                        <Typography
                          component="li"
                          variant="body2"
                          key={index}
                          sx={{ mb: 0.5, color: 'text.secondary' }}
                        >
                          {rec}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </>
      )}

      {/* Info */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 2, border: '1px solid', borderColor: 'info.light' }}>
        <Typography variant="caption" color="info.dark">
          <strong>💡 Tip:</strong> Our AI will extract and structure your resume data, then optimize it for ATS systems.
          Supported formats: PDF, DOCX, TXT (Max 5MB)
        </Typography>
      </Box>
    </Paper>
  );
};

export default ResumeImporter;
