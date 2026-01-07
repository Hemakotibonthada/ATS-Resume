import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  IconButton,
  Divider,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import PhotoUpload from './PhotoUpload';

function ResumeEditor({ resume, setResume }) {
  const handlePhotoChange = (photoData) => {
    setResume({
      ...resume,
      photo: photoData
    });
  };
  const handleContactChange = (field, value) => {
    setResume({
      ...resume,
      contactInfo: { ...resume.contactInfo, [field]: value }
    });
  };

  const handleSummaryChange = (value) => {
    setResume({ ...resume, summary: value });
  };

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    };
    setResume({ ...resume, experience: [...resume.experience, newExperience] });
  };

  const handleExperienceChange = (id, field, value) => {
    setResume({
      ...resume,
      experience: resume.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const handleDescriptionChange = (expId, index, value) => {
    setResume({
      ...resume,
      experience: resume.experience.map(exp =>
        exp.id === expId
          ? {
              ...exp,
              description: exp.description.map((desc, i) =>
                i === index ? value : desc
              )
            }
          : exp
      )
    });
  };

  const handleAddDescription = (expId) => {
    setResume({
      ...resume,
      experience: resume.experience.map(exp =>
        exp.id === expId
          ? { ...exp, description: [...exp.description, ''] }
          : exp
      )
    });
  };

  const handleRemoveDescription = (expId, index) => {
    setResume({
      ...resume,
      experience: resume.experience.map(exp =>
        exp.id === expId
          ? {
              ...exp,
              description: exp.description.filter((_, i) => i !== index)
            }
          : exp
      )
    });
  };

  const handleRemoveExperience = (id) => {
    setResume({
      ...resume,
      experience: resume.experience.filter(exp => exp.id !== id)
    });
  };

  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResume({ ...resume, education: [...resume.education, newEducation] });
  };

  const handleEducationChange = (id, field, value) => {
    setResume({
      ...resume,
      education: resume.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const handleRemoveEducation = (id) => {
    setResume({
      ...resume,
      education: resume.education.filter(edu => edu.id !== id)
    });
  };

  const handleAddSkill = (skill) => {
    if (skill && !resume.skills.includes(skill)) {
      setResume({ ...resume, skills: [...resume.skills, skill] });
    }
  };

  const handleRemoveSkill = (skill) => {
    setResume({
      ...resume,
      skills: resume.skills.filter(s => s !== skill)
    });
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    };
    setResume({ ...resume, projects: [...resume.projects, newProject] });
  };

  const handleProjectChange = (id, field, value) => {
    setResume({
      ...resume,
      projects: resume.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    });
  };

  const handleRemoveProject = (id) => {
    setResume({
      ...resume,
      projects: resume.projects.filter(proj => proj.id !== id)
    });
  };

  const handleAddCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      link: ''
    };
    setResume({ ...resume, certifications: [...resume.certifications, newCert] });
  };

  const handleCertificationChange = (id, field, value) => {
    setResume({
      ...resume,
      certifications: resume.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };

  const handleRemoveCertification = (id) => {
    setResume({
      ...resume,
      certifications: resume.certifications.filter(cert => cert.id !== id)
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography 
          variant="h4" 
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ✏️ Resume Editor
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Completeness:
          </Typography>
          <Chip 
            label={`${Math.min(100, (
              (resume.contactInfo.fullName ? 10 : 0) +
              (resume.contactInfo.email ? 10 : 0) +
              (resume.summary ? 15 : 0) +
              (resume.experience.length > 0 ? 25 : 0) +
              (resume.education.length > 0 ? 15 : 0) +
              (resume.skills.length > 0 ? 15 : 0) +
              (resume.projects.length > 0 ? 10 : 0)
            ))}%`}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white',
              fontWeight: 700,
            }}
          />
        </Box>
      </Box>

      {/* Template Selection */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 3,
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ fontWeight: 600, color: 'primary.main' }}
        >
          🎨 Template
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Select Template</InputLabel>
          <Select
            value={resume.template}
            label="Select Template"
            onChange={(e) => setResume({ ...resume, template: e.target.value })}
          >
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="modern">Modern</MenuItem>
            <MenuItem value="minimal">Minimal</MenuItem>
            <MenuItem value="technical">Technical</MenuItem>
            <MenuItem value="executive">Executive</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Profile Photo */}
      <Box sx={{ mb: 2 }}>
        <PhotoUpload 
          photo={resume.photo} 
          onPhotoChange={handlePhotoChange}
        />
      </Box>

      {/* Contact Information */}
      <Accordion 
        defaultExpanded
        sx={{
          mb: 2,
          borderRadius: '12px !important',
          '&:before': { display: 'none' },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '12px',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>👤 Contact Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={resume.contactInfo.fullName}
                onChange={(e) => handleContactChange('fullName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={resume.contactInfo.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={resume.contactInfo.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={resume.contactInfo.location}
                onChange={(e) => handleContactChange('location', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="LinkedIn"
                value={resume.contactInfo.linkedin}
                onChange={(e) => handleContactChange('linkedin', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="GitHub"
                value={resume.contactInfo.github}
                onChange={(e) => handleContactChange('github', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Portfolio"
                value={resume.contactInfo.portfolio}
                onChange={(e) => handleContactChange('portfolio', e.target.value)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Professional Summary */}
      <Accordion
        sx={{
          mb: 2,
          borderRadius: '12px !important',
          '&:before': { display: 'none' },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '12px',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>📝 Professional Summary</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Summary"
            placeholder="Write a compelling professional summary highlighting your key achievements and skills..."
            value={resume.summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              💡 Recommended: 50-150 words
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: resume.summary.split(' ').length >= 50 && resume.summary.split(' ').length <= 150 ? 'success.main' : 'text.secondary',
                fontWeight: 600,
              }}
            >
              {resume.summary.split(' ').filter(w => w).length} words
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Experience */}
      <Accordion
        sx={{
          mb: 2,
          borderRadius: '12px !important',
          '&:before': { display: 'none' },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '12px',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>💼 Experience</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {resume.experience.map((exp, index) => (
            <Paper 
              key={exp.id} 
              elevation={2}
              sx={{ 
                p: 3, 
                mb: 2, 
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'primary.main' }}>
                  Experience #{index + 1}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleRemoveExperience(exp.id)}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      background: 'rgba(244, 67, 54, 0.1)',
                      transform: 'rotate(90deg) scale(1.2)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={exp.location}
                    onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={exp.current}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={exp.current}
                        onChange={(e) => handleExperienceChange(exp.id, 'current', e.target.checked)}
                      />
                    }
                    label="Current"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Descriptions (Bullet Points)
                  </Typography>
                  {exp.description.map((desc, descIndex) => (
                    <Box key={descIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Start with an action verb (e.g., Developed, Managed, Increased...)"
                        value={desc}
                        onChange={(e) => handleDescriptionChange(exp.id, descIndex, e.target.value)}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveDescription(exp.id, descIndex)}
                        disabled={exp.description.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddDescription(exp.id)}
                    size="small"
                    variant="outlined"
                    sx={{
                      mt: 1,
                      borderStyle: 'dashed',
                      '&:hover': {
                        borderStyle: 'solid',
                        background: 'rgba(102, 126, 234, 0.05)',
                      },
                    }}
                  >
                    Add Bullet Point
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    💡 Tip: Start with action verbs and quantify your achievements
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddExperience}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              py: 1.5,
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
            Add Experience
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Education */}
      <Accordion
        sx={{
          mb: 2,
          borderRadius: '12px !important',
          '&:before': { display: 'none' },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '12px',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>🎓 Education</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {resume.education.map((edu, index) => (
            <Paper 
              key={edu.id} 
              elevation={2}
              sx={{ 
                p: 3, 
                mb: 2, 
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'primary.main' }}>
                  Education #{index + 1}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleRemoveEducation(edu.id)}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      background: 'rgba(244, 67, 54, 0.1)',
                      transform: 'rotate(90deg) scale(1.2)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Field of Study"
                    value={edu.field}
                    onChange={(e) => handleEducationChange(edu.id, 'field', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={edu.location}
                    onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="GPA"
                    value={edu.gpa}
                    onChange={(e) => handleEducationChange(edu.id, 'gpa', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEducation}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              py: 1.5,
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
            Add Education
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Skills */}
      <Accordion
        sx={{
          mb: 2,
          borderRadius: '12px !important',
          '&:before': { display: 'none' },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '12px',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>🚀 Skills</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            label="Add Skill"
            placeholder="Press Enter to add"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSkill(e.target.value);
                e.target.value = '';
              }
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: '2px',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {resume.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleRemoveSkill(skill)}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              💡 Recommended: 10-15 skills
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: resume.skills.length >= 10 ? 'success.main' : 'warning.main',
                fontWeight: 600,
              }}
            >
              {resume.skills.length} skills added
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Projects */}
      <Accordion
        sx={{
          mb: 2,
          borderRadius: '12px !important',
          '&:before': { display: 'none' },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '12px',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>🛠️ Projects</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {resume.projects.map((proj, index) => (
            <Paper 
              key={proj.id} 
              elevation={2}
              sx={{ 
                p: 3, 
                mb: 2, 
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'primary.main' }}>
                  Project #{index + 1}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleRemoveProject(proj.id)}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      background: 'rgba(244, 67, 54, 0.1)',
                      transform: 'rotate(90deg) scale(1.2)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Project Name"
                    value={proj.name}
                    onChange={(e) => handleProjectChange(proj.id, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={proj.description}
                    onChange={(e) => handleProjectChange(proj.id, 'description', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Technologies (comma-separated)"
                    value={proj.technologies.join(', ')}
                    onChange={(e) => handleProjectChange(proj.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Link (optional)"
                    value={proj.link}
                    onChange={(e) => handleProjectChange(proj.id, 'link', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddProject}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              py: 1.5,
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
            Add Project
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Certifications */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Certifications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {resume.certifications.map((cert, index) => (
            <Paper key={cert.id} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Certification #{index + 1}
                </Typography>
                <IconButton size="small" onClick={() => handleRemoveCertification(cert.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Certification Name"
                    value={cert.name}
                    onChange={(e) => handleCertificationChange(cert.id, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Issuing Organization"
                    value={cert.issuer}
                    onChange={(e) => handleCertificationChange(cert.id, 'issuer', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="month"
                    value={cert.date}
                    onChange={(e) => handleCertificationChange(cert.id, 'date', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Credential Link (optional)"
                    value={cert.link}
                    onChange={(e) => handleCertificationChange(cert.id, 'link', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCertification}
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              py: 1.5,
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
            Add Certification
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default ResumeEditor;
