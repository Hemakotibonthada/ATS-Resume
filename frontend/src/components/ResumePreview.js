import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Button,
  Grid,
  Fade
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  DateRange as DateRangeIcon,
  CheckCircle as CheckIcon,
  Code as CodeIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';

function ResumePreview({ resume }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box className="animate-fade-in" sx={{ position: 'relative' }}>
      <Box
        className="no-print"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.default',
          py: 1.5,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography 
          variant="h4" 
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🔍 Live Preview
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={handlePrint}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          📄 Print / Save as PDF
        </Button>
      </Box>

      {/* Resume Paper - Professional A4 Format */}
      <Paper 
        elevation={6}
        className="resume-page"
        sx={{ 
          bgcolor: 'white',
          borderRadius: 0,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s',
          width: '210mm',
          minHeight: '297mm',
          mx: 'auto',
          p: '15mm',
          position: 'relative',
          '&:hover': {
            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
          },
          '@media print': {
            width: '210mm',
            minHeight: '297mm',
            margin: 0,
            padding: '15mm',
            boxShadow: 'none',
            pageBreakAfter: 'always',
          },
        }}
      >
        {!resume.contactInfo.fullName && !resume.summary && resume.experience.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Fade in timeout={800}>
              <Box>
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
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                    },
                  }}
                >
                  <Typography sx={{ fontSize: 60 }}>📄</Typography>
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  Your Resume Preview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Start filling in your details on the left to see your resume come to life here!
                </Typography>
              </Box>
            </Fade>
          </Box>
        ) : (
          <>
            {/* Header Section */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h3" 
                    sx={{
                      fontWeight: 800,
                      color: '#000',
                      mb: 0.5,
                      fontSize: '2.2rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {resume.contactInfo.fullName || 'YOUR NAME'}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{
                      color: '#2196f3',
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    {resume.contactInfo.title || resume.experience[0]?.position || 'Professional Title'}
                  </Typography>
                </Box>
                
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    border: '3px solid #e3f2fd',
                    flexShrink: 0,
                    ml: 2,
                  }}
                >
                  {resume.contactInfo.fullName ? 
                    resume.contactInfo.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
                    : 'HK'}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {resume.contactInfo.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 14, color: '#2196f3' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {resume.contactInfo.phone}
                    </Typography>
                  </Box>
                )}
                {resume.contactInfo.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 14, color: '#2196f3' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {resume.contactInfo.email}
                    </Typography>
                  </Box>
                )}
                {resume.contactInfo.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationIcon sx={{ fontSize: 14, color: '#2196f3' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {resume.contactInfo.location}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 2, borderWidth: 1, borderColor: '#000' }} />

            <Grid container spacing={2.5}>
              <Grid item xs={12} md={7.5}>
                {resume.summary && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        color: '#000',
                        mb: 1,
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        borderBottom: '2.5px solid #000',
                        pb: 0.4,
                        letterSpacing: '0.5px',
                      }}
                    >
                      SUMMARY
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#424242', 
                        lineHeight: 1.7,
                        textAlign: 'justify',
                        fontSize: '0.82rem',
                      }}
                    >
                      {resume.summary}
                    </Typography>
                  </Box>
                )}

                {resume.experience.length > 0 && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        color: '#000',
                        mb: 1,
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        borderBottom: '2.5px solid #000',
                        pb: 0.4,
                        letterSpacing: '0.5px',
                      }}
                    >
                      EXPERIENCE
                    </Typography>
                    {resume.experience.map((exp, index) => (
                      <Box key={exp.id || index} sx={{ mb: 2, pageBreakInside: 'avoid' }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 700, 
                            color: '#000',
                            fontSize: '0.9rem',
                            lineHeight: 1.3,
                          }}
                        >
                          {exp.position}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#2196f3', 
                            fontWeight: 600,
                            fontSize: '0.83rem',
                            mb: 0.3,
                          }}
                        >
                          {exp.company}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                            <DateRangeIcon sx={{ fontSize: 12, color: '#757575' }} />
                            <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.72rem' }}>
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </Typography>
                          </Box>
                          {exp.location && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                              <LocationIcon sx={{ fontSize: 12, color: '#757575' }} />
                              <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.72rem' }}>
                                {exp.location}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#424242', 
                            lineHeight: 1.6,
                            fontSize: '0.8rem',
                            mb: 0.5,
                          }}
                        >
                          {exp.description}
                        </Typography>
                        {exp.achievements && exp.achievements.length > 0 && (
                          <Box component="ul" sx={{ mt: 0.5, pl: 2, mb: 0, '& li': { mb: 0.3 } }}>
                            {exp.achievements.map((achievement, idx) => (
                              <Typography 
                                component="li" 
                                key={idx} 
                                variant="body2" 
                                sx={{ 
                                  color: '#424242', 
                                  lineHeight: 1.6,
                                  fontSize: '0.8rem',
                                }}
                              >
                                {achievement}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}

                {resume.projects && resume.projects.length > 0 && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        color: '#000',
                        mb: 1,
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        borderBottom: '2.5px solid #000',
                        pb: 0.4,
                        letterSpacing: '0.5px',
                      }}
                    >
                      PROJECTS
                    </Typography>
                    {resume.projects.map((proj, index) => (
                      <Box key={proj.id || index} sx={{ mb: 1.5, pageBreakInside: 'avoid' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.3 }}>
                          <CodeIcon sx={{ fontSize: 14, color: '#2196f3' }} />
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000',
                              fontSize: '0.85rem',
                            }}
                          >
                            {proj.name}
                          </Typography>
                        </Box>
                        {proj.date && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.3, ml: 2 }}>
                            <DateRangeIcon sx={{ fontSize: 11, color: '#757575' }} />
                            <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.7rem' }}>
                              {proj.date}
                            </Typography>
                          </Box>
                        )}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#424242', 
                            lineHeight: 1.6, 
                            ml: 2, 
                            mb: 0.4,
                            fontSize: '0.8rem',
                          }}
                        >
                          {proj.description}
                        </Typography>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, ml: 2 }}>
                            {proj.technologies.slice(0, 8).map((tech, idx) => (
                              <Chip
                                key={idx}
                                label={tech}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  bgcolor: '#e3f2fd',
                                  color: '#1976d2',
                                  fontWeight: 600,
                                  border: '1px solid #90caf9',
                                  '& .MuiChip-label': { px: 0.8 },
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={4.5}>
                {resume.skills && resume.skills.length > 0 && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        color: '#000',
                        mb: 1,
                        fontSize: '0.95rem',
                        textTransform: 'UPPERCASE',
                        borderBottom: '2.5px solid #000',
                        pb: 0.4,
                        letterSpacing: '0.5px',
                      }}
                    >
                      STRENGTHS
                    </Typography>
                    {resume.skills.slice(0, 5).map((skill, idx) => (
                      <Box key={idx} sx={{ mb: 1.2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.6, mb: 0.2 }}>
                          <CheckIcon sx={{ fontSize: 14, color: '#2196f3', mt: 0.2 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#000',
                              fontSize: '0.82rem',
                            }}
                          >
                            {skill}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block', 
                            color: '#424242', 
                            ml: 2, 
                            lineHeight: 1.5,
                            fontSize: '0.7rem',
                          }}
                        >
                          Strong knowledge and expertise
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {resume.education.length > 0 && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        color: '#000',
                        mb: 1,
                        fontSize: '0.95rem',
                        textTransform: 'UPPERCASE',
                        borderBottom: '2.5px solid #000',
                        pb: 0.4,
                        letterSpacing: '0.5px',
                      }}
                    >
                      EDUCATION
                    </Typography>
                    {resume.education.map((edu, index) => (
                      <Box key={edu.id || index} sx={{ mb: 1.5, pageBreakInside: 'avoid' }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 700, 
                            color: '#000',
                            fontSize: '0.85rem',
                            lineHeight: 1.3,
                          }}
                        >
                          {edu.degree}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#2196f3', 
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            mb: 0.2,
                          }}
                        >
                          {edu.school || edu.institution}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.2 }}>
                          <DateRangeIcon sx={{ fontSize: 11, color: '#757575' }} />
                          <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.7rem' }}>
                            {edu.startDate} - {edu.endDate}
                          </Typography>
                        </Box>
                        {edu.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                            <LocationIcon sx={{ fontSize: 11, color: '#757575' }} />
                            <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.7rem' }}>
                              {edu.location}
                            </Typography>
                          </Box>
                        )}
                        {edu.gpa && (
                          <Typography variant="caption" sx={{ color: '#424242', display: 'block', fontSize: '0.7rem', mt: 0.2 }}>
                            GPA: {edu.gpa}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}

                {resume.skills.length > 0 && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        color: '#000',
                        mb: 1,
                        fontSize: '0.95rem',
                        textTransform: 'UPPERCASE',
                        borderBottom: '2.5px solid #000',
                        pb: 0.4,
                        letterSpacing: '0.5px',
                      }}
                    >
                      SKILLS
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                      {resume.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: '#f5f5f5',
                            color: '#000',
                            fontWeight: 600,
                            border: '1px solid #e0e0e0',
                            '& .MuiChip-label': { px: 0.8 },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {resume.certifications && resume.certifications.length > 0 && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        color: '#000',
                        mb: 1,
                        fontSize: '0.95rem',
                        textTransform: 'UPPERCASE',
                        borderBottom: '2.5px solid #000',
                        pb: 0.4,
                        letterSpacing: '0.5px',
                      }}
                    >
                      CERTIFICATION
                    </Typography>
                    {resume.certifications.map((cert, index) => (
                      <Box key={cert.id || index} sx={{ mb: 1.2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.6 }}>
                          <CheckIcon sx={{ fontSize: 13, color: '#2196f3', mt: 0.2 }} />
                          <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 700, 
                                color: '#000',
                                fontSize: '0.8rem',
                                lineHeight: 1.3,
                              }}
                            >
                              {cert.name}
                            </Typography>
                            {cert.issuer && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: '#757575',
                                  fontSize: '0.7rem',
                                }}
                              >
                                {cert.issuer}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}

                {resume.achievements && resume.achievements.length > 0 && (
                  <Box sx={{ mb: 2.5 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 700,
                        color: '#000',
                        mb: 1,
                        fontSize: '0.95rem',
                        textTransform: 'UPPERCASE',
                        borderBottom: '2.5px solid #000',
                        pb: 0.4,
                        letterSpacing: '0.5px',
                      }}
                    >
                      KEY ACHIEVEMENTS
                    </Typography>
                    {resume.achievements.map((achievement, idx) => (
                      <Box key={idx} sx={{ mb: 1.2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.6 }}>
                          <LightbulbIcon sx={{ fontSize: 13, color: '#2196f3', mt: 0.2 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#424242', 
                              lineHeight: 1.6,
                              fontSize: '0.8rem',
                            }}
                          >
                            {achievement.title || achievement}
                          </Typography>
                        </Box>
                        {achievement.description && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              color: '#757575', 
                              ml: 2.2,
                              fontSize: '0.7rem',
                            }}
                          >
                            {achievement.description}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Paper>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            @page {
              size: A4;
              margin: 0;
            }
            .no-print {
              display: none !important;
            }
            .resume-page {
              page-break-after: always;
            }
            .resume-page:last-child {
              page-break-after: auto;
            }
          }
        `}
      </style>
    </Box>
  );
}

export default ResumePreview;
