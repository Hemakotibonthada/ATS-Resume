# Quick Start Guide

## Installation

### Option 1: Automated Setup (Windows)
1. Run `setup.bat` - This will install all dependencies
2. Run `start.bat` - This will start both servers

### Option 2: Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
mkdir data data\resumes data\exports
python app.py
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Usage

1. **Access the App**: Open http://localhost:3000
2. **Create Resume**: Fill in all sections
3. **Live Preview**: See changes in real-time
4. **Score**: Click "Score" button to analyze
5. **Job Match**: Use Job Matcher to compare with job postings
6. **Export**: Download as PDF or DOCX

## Features at a Glance

### Resume Editor
- Contact info with social links
- Professional summary
- Work experience with bullet points
- Education
- Skills (10-15 recommended)
- Projects
- Certifications

### Scoring System
- Overall score: 0-100
- Grade: A+ to C-
- Section breakdown
- Strengths & weaknesses
- Actionable recommendations

### ATS Analysis
- Compatibility score
- Format checks
- Keyword density
- Readability analysis
- Missing elements detection

### Job Matcher
- Match percentage
- Category scores (Technical, Skills, Experience)
- Matched keywords
- Missing keywords
- Optimization suggestions
- Example phrases

## Tips for High Scores

1. **Use Action Verbs**: Start bullets with "Developed", "Managed", "Led"
2. **Add Numbers**: "Increased sales by 30%", "Managed team of 10"
3. **Match Keywords**: Use terms from job descriptions
4. **Be Specific**: Avoid vague statements
5. **Keep it Concise**: 1-2 pages (400-800 words)
6. **Proofread**: Check spelling and grammar

## Score Ranges

- **90-100 (A+/A)**: Excellent - Ready to submit
- **80-89 (A-/B+)**: Very Good - Minor improvements
- **70-79 (B/B-)**: Good - Some optimization needed
- **60-69 (C+/C)**: Fair - Needs work
- **<60 (C-)**: Needs significant improvement

## Keyboard Shortcuts

- `Enter` in Skills field: Add skill
- `Enter` in Requirements: Add requirement

## Export Formats

### PDF
- Professional formatting
- ATS-compatible
- Standard fonts
- No special formatting issues

### DOCX
- Microsoft Word compatible
- Editable after export
- Standard formatting
- Easy to customize

## Troubleshooting

**Backend not starting?**
- Check if port 8000 is free
- Verify Python 3.8+ installed
- Ensure all dependencies installed

**Frontend not loading?**
- Check if port 3000 is free
- Verify Node.js installed
- Clear npm cache: `npm cache clean --force`

**Scores not showing?**
- Ensure backend is running
- Check browser console for errors
- Verify resume has content

## Support

For issues or questions:
1. Check README.md for detailed documentation
2. Review error messages in terminal
3. Check browser console (F12)
