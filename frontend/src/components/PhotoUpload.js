import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Button
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  PhotoCamera as CameraIcon
} from '@mui/icons-material';

function PhotoUpload({ photo, onPhotoChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(photo || null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onPhotoChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Profile Photo
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mt: 2 }}>
        {/* Photo Preview */}
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={preview}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              bgcolor: 'rgba(255,255,255,0.2)'
            }}
          >
            {!preview && <CameraIcon sx={{ fontSize: 50, color: 'white' }} />}
          </Avatar>
          
          {preview && (
            <IconButton
              onClick={handleDelete}
              sx={{
                position: 'absolute',
                top: -5,
                right: -5,
                bgcolor: 'error.main',
                color: 'white',
                width: 30,
                height: 30,
                '&:hover': {
                  bgcolor: 'error.dark',
                }
              }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Upload Area */}
        <Box sx={{ flex: 1 }}>
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: '2px dashed rgba(255,255,255,0.5)',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              bgcolor: dragActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
                borderColor: 'white'
              }
            }}
            onClick={handleButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            
            <UploadIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
            
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
              {dragActive ? 'Drop photo here' : 'Click or drag photo here'}
            </Typography>
            
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              JPG, PNG, GIF (max 5MB)
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleButtonClick}
            fullWidth
            sx={{
              mt: 2,
              bgcolor: 'white',
              color: '#667eea',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Choose Photo
          </Button>
        </Box>
      </Box>

      <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.8 }}>
        💡 Tip: A professional headshot improves your resume's impact
      </Typography>
    </Paper>
  );
}

export default PhotoUpload;
