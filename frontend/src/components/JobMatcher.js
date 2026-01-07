import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  Divider,
  CircularProgress,
  Fade,
  Zoom,
  Grow,
} from '@mui/material';
import {
  TrendingUp as MatchIcon,
  Lightbulb as SuggestionIcon,
  KeyboardArrowRight as ArrowIcon,
  WorkOutline as JobIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { matchJob, optimizeKeywords } from '../services/api';
import LoadingAnimation from './LoadingAnimation';

function JobMatcher({ resume }) {
  const [jobDescription, setJobDescription] = useState({
    title: '',
    company: '',
    description: '',
    requirements: []
  });
  const [matchResult, setMatchResult] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requirementInput, setRequirementInput] = useState('');

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setJobDescription({
        ...jobDescription,
        requirements: [...jobDescription.requirements, requirementInput.trim()]
      });
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (index) => {
    setJobDescription({
      ...jobDescription,
      requirements: jobDescription.requirements.filter((_, i) => i !== index)
    });
  };

  const handleMatch = async () => {
    setLoading(true);
    try {
      const result = await matchJob(resume, jobDescription);
      setMatchResult(result);
      
      const optResult = await optimizeKeywords(resume, jobDescription);
      setOptimization(optResult);
    } catch (error) {
      console.error('Error matching job:', error);
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  return (
    <Box className="animate-fade-in">
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
        }}
      >
        🎯 Job Matcher & Keyword Optimizer
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
        💡 Paste a job description to see how well your resume matches and get optimization suggestions.
      </Typography>

      {/* Job Description Input */}
      <Paper 
        elevation={4}
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
          📄 Job Description
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Job Title"
              value={jobDescription.title}
              onChange={(e) => setJobDescription({ ...jobDescription, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company (Optional)"
              value={jobDescription.company}
              onChange={(e) => setJobDescription({ ...jobDescription, company: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Job Description"
              placeholder="Paste the full job description here..."
              value={jobDescription.description}
              onChange={(e) => setJobDescription({ ...jobDescription, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Key Requirements (Optional)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Add Requirement"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
              />
              <Button variant="contained" onClick={handleAddRequirement}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {jobDescription.requirements.map((req, index) => (
                <Chip
                  key={index}
                  label={req}
                  onDelete={() => handleRemoveRequirement(index)}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    border: '2px solid',
                    borderColor: 'primary.light',
                    fontWeight: 600,
                    transition: 'all 0.3s',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              onClick={handleMatch}
              disabled={!jobDescription.title || !jobDescription.description || loading}
              sx={{
                py: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.3s',
              }}
            >
              {loading ? 'Analyzing...' : '🔍 Analyze Match'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading State */}
      {loading && <LoadingAnimation message="Analyzing job match..." type="searching" />}

      {/* Match Results */}
      {matchResult && (
        <Fade in timeout={800}>
          <Box>
            {/* Overall Match Score */}
            <Paper 
              elevation={4}
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
                🎯 Match Score
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Zoom in timeout={600}>
                    <Card 
                      elevation={4}
                      sx={{
                        background: `linear-gradient(135deg, ${matchResult.overall_score >= 75 ? '#4caf50' : matchResult.overall_score >= 50 ? '#ff9800' : '#f44336'} 0%, ${matchResult.overall_score >= 75 ? '#66bb6a' : matchResult.overall_score >= 50 ? '#ffa726' : '#ef5350'} 100%)`,
                        color: 'white',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="h2" fontWeight="bold">
                          {matchResult.overall_score}%
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                          Overall Match
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card 
                  elevation={3}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {matchResult.keyword_density.matched}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                      Keywords Matched
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card 
                  elevation={3}
                  sx={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(240, 147, 251, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {matchResult.keyword_density.job}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                      Total Job Keywords
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card 
                  elevation={3}
                  sx={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(79, 172, 254, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {matchResult.keyword_density.resume}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                      Resume Keywords
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Category Scores */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Category Breakdown
              </Typography>
              {Object.entries(matchResult.category_scores).map(([category, score]) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" textTransform="capitalize">
                      {category}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {score}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={score}
                    color={getScoreColor(score)}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Matched Keywords */}
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              mb: 3,
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
              }}
            >
              ✅ Matched Keywords ({matchResult.matched_keywords.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {matchResult.matched_keywords.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(129, 199, 132, 0.15) 100%)',
                    border: '2px solid',
                    borderColor: 'success.main',
                    color: 'success.dark',
                    fontWeight: 600,
                    transition: 'all 0.3s',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(129, 199, 132, 0.25) 100%)',
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Missing Keywords */}
          {matchResult.missing_keywords.length > 0 && (
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                mb: 3,
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
                }}
              >
                ⚠️ Missing Keywords ({matchResult.missing_keywords.length})
              </Typography>
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                💡 Consider adding these keywords to your resume if they are relevant to your experience.
              </Alert>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {matchResult.missing_keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 193, 7, 0.15) 100%)',
                      border: '2px solid',
                      borderColor: 'error.main',
                      color: 'error.dark',
                      fontWeight: 600,
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.25) 0%, rgba(255, 193, 7, 0.25) 100%)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Paper>
          )}

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
              <SuggestionIcon />
              💡 Recommendations
            </Typography>
            <List>
              {matchResult.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ArrowIcon color="primary" sx={{ mr: 1 }} />
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Paper>
          </Box>
        </Fade>
      )}

      {/* Optimization Suggestions */}
      {optimization && (
        <Fade in timeout={800}>
          <Paper 
            elevation={4}
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
              🎯 Keyword Optimization Strategy
            </Typography>
            
            {/* Priority Keywords */}
            {optimization.priority_keywords.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                  High-Priority Keywords to Add
                </Typography>
                <List>
                  {optimization.priority_keywords.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.keyword}
                        secondary={item.reason}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                      <Chip label={item.priority.toUpperCase()} color="error" size="small" />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {/* Section-specific Suggestions */}
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Section-Specific Suggestions
            </Typography>
            
            {optimization.suggested_additions.summary.length > 0 && (
              <>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Professional Summary
                </Typography>
                <List dense>
                  {optimization.suggested_additions.summary.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ArrowIcon fontSize="small" sx={{ mr: 1 }} />
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {optimization.suggested_additions.experience.length > 0 && (
              <>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Experience Section
                </Typography>
                <List dense>
                  {optimization.suggested_additions.experience.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ArrowIcon fontSize="small" sx={{ mr: 1 }} />
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {optimization.suggested_additions.skills.length > 0 && (
              <>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Skills Section
                </Typography>
                <List dense>
                  {optimization.suggested_additions.skills.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ArrowIcon fontSize="small" sx={{ mr: 1 }} />
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Optimization Tips */}
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              General Tips
            </Typography>
            <List dense>
              {optimization.optimization_tips.map((tip, index) => (
                <ListItem key={index}>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>

            {/* Example Phrases */}
            {optimization.example_phrases.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Example Phrases
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Here are some example phrases you can adapt for your resume:
                </Alert>
                {optimization.example_phrases.map((phrase, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 1, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" fontStyle="italic">
                      "{phrase}"
                    </Typography>
                  </Paper>
                ))}
              </>
            )}
          </Paper>
        </Fade>
      )}
    </Box>
  );
}

export default JobMatcher;
