# ATS Resume Builder 🚀

A comprehensive, intelligent resume builder application designed to create ATS (Applicant Tracking System) friendly resumes with advanced scoring, analysis, and job matching capabilities.

![ATS Resume Builder](https://img.shields.io/badge/Version-1.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal)

## ✨ Features

### Core Features
- **📝 Intuitive Resume Editor**: Create and edit resumes with a user-friendly interface
- **👀 Live Preview**: See changes in real-time as you edit
- **📊 ATS Scoring**: Get comprehensive scores (0-100) with detailed breakdowns
- **🔍 ATS Compatibility Analysis**: Check for ATS-friendly formatting and structure
- **💼 Job Matcher**: Compare your resume against job descriptions
- **🎯 Keyword Optimization**: Get suggestions to improve keyword density
- **📄 Multiple Export Formats**: Export to PDF and DOCX
- **🎨 Multiple Templates**: Choose from 5 professional ATS-friendly templates

### Advanced Features
- **AI-Powered Suggestions**: Get intelligent recommendations for improvement
- **Keyword Density Analysis**: Track important keywords by category
- **Quantifiable Achievements Detection**: Identify and suggest measurable results
- **Category-wise Scoring**: Detailed scores for each resume section
- **Job Description Analyzer**: Extract key requirements from job postings
- **Missing Keywords Identification**: Find gaps between your resume and job requirements
- **Readability Analysis**: Ensure your content is clear and concise
- **Action Verb Detection**: Identify strong action verbs in descriptions

### Resume Sections Supported
- ✅ Contact Information (with LinkedIn, GitHub, Portfolio links)
- ✅ Professional Summary
- ✅ Work Experience (with unlimited bullet points)
- ✅ Education
- ✅ Skills (with keyword optimization)
- ✅ Projects (with technologies and links)
- ✅ Certifications
- ✅ Languages

### Scoring Categories
1. **Contact Information** (10 points)
2. **Professional Summary** (10 points)
3. **Work Experience** (30 points)
4. **Education** (15 points)
5. **Skills** (15 points)
6. **Projects** (10 points)
7. **Certifications** (5 points)
8. **Format & ATS Compatibility** (5 points)

## 🏗️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **ReportLab**: PDF generation
- **python-docx**: DOCX generation
- **Pydantic**: Data validation

### Frontend
- **React 18**: Modern UI library
- **Material-UI (MUI)**: Professional component library
- **Recharts**: Data visualization
- **Axios**: HTTP client

### Storage
- JSON-based file storage (easily extendable to PostgreSQL/MongoDB)

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create necessary directories:
```bash
mkdir data
mkdir data/resumes
mkdir data/exports
```

5. Start the backend server:
```bash
python app.py
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🚀 Usage

### Creating a Resume

1. **Open the Application**: Navigate to `http://localhost:3000`

2. **Fill in Your Information**:
   - Start with Contact Information
   - Add a compelling Professional Summary (50-150 words recommended)
   - Add Work Experience with bullet points using action verbs
   - Include Education details
   - List relevant Skills (10-15 recommended)
   - Add Projects and Certifications

3. **Choose a Template**: Select from Professional, Modern, Minimal, Technical, or Executive templates

4. **Save Your Resume**: Click the "Save" button in the top toolbar

### Scoring Your Resume

1. Click the "Score" button in the top toolbar
2. View your overall score (0-100) and grade (A+ to C-)
3. Review the detailed breakdown by section
4. Check strengths and areas for improvement
5. Read AI-powered recommendations

### Matching with Jobs

1. Navigate to "Job Matcher" from the side menu
2. Paste the job title and description
3. Add key requirements (optional)
4. Click "Analyze Match"
5. View your match percentage
6. See matched and missing keywords
7. Get specific optimization suggestions

### Exporting Your Resume

1. Click "Export PDF" or "Export DOCX" in the top toolbar
2. Your resume will be downloaded in the selected format
3. The export uses professional formatting optimized for ATS systems

## 📊 API Endpoints

### Resume Management
- `POST /api/resumes` - Create/update resume
- `GET /api/resumes/{id}` - Get resume by ID
- `GET /api/resumes` - List all resumes
- `DELETE /api/resumes/{id}` - Delete resume

### Analysis & Scoring
- `POST /api/score` - Score resume
- `POST /api/analyze` - Analyze ATS compatibility
- `POST /api/match-job` - Match resume with job
- `POST /api/optimize-keywords` - Get keyword optimization suggestions
- `POST /api/suggestions` - Get AI suggestions

### Export
- `POST /api/export/pdf` - Export as PDF
- `POST /api/export/docx` - Export as DOCX

### Templates
- `GET /api/templates` - Get available templates

## 🎯 Best Practices

### For Maximum ATS Score:

1. **Use Action Verbs**: Start bullet points with strong verbs like "Developed", "Managed", "Increased"
2. **Add Numbers**: Include quantifiable achievements (e.g., "Increased sales by 30%")
3. **Match Keywords**: Use keywords from job descriptions
4. **Keep It Concise**: Aim for 1-2 pages (400-800 words)
5. **Use Standard Sections**: Stick to common section names
6. **Avoid Graphics**: ATS systems can't read images
7. **Use Simple Formatting**: Avoid tables, text boxes, headers/footers
8. **Include Contact Info**: Email, phone, and LinkedIn are essential
9. **Spell Out Acronyms**: At least on first use
10. **Proofread**: Spelling and grammar matter

## 🎨 Available Templates

1. **Professional** (ATS Score: 95%)
   - Clean and professional layout
   - Suitable for corporate positions

2. **Modern** (ATS Score: 90%)
   - Contemporary design
   - Subtle colors

3. **Minimal** (ATS Score: 98%)
   - Simple and elegant
   - Maximum ATS compatibility

4. **Technical** (ATS Score: 96%)
   - Optimized for technical roles
   - Emphasizes skills and projects

5. **Executive** (ATS Score: 93%)
   - Sophisticated layout
   - For senior positions

## 🔧 Configuration

### Backend Configuration

Edit `backend/app.py` to customize:
- Port number
- CORS origins
- Storage location

### Frontend Configuration

Edit `frontend/package.json` to change:
- Proxy settings
- Build configuration

## 📈 Scoring Algorithm

The scoring algorithm evaluates:

1. **Completeness**: All required sections present
2. **Content Quality**: Use of action verbs and quantifiable achievements
3. **Keyword Density**: Relevant industry keywords
4. **Format Compliance**: ATS-friendly formatting
5. **Length**: Appropriate resume length
6. **Consistency**: Uniform formatting throughout

## 🐛 Troubleshooting

### Backend Issues

**Issue**: Module not found errors
```bash
# Solution: Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Issue**: Port already in use
```bash
# Solution: Change port in app.py or kill the process
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill
```

### Frontend Issues

**Issue**: Dependencies installation fails
```bash
# Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: API connection errors
- Ensure backend is running on port 8000
- Check CORS settings in backend
- Verify proxy setting in package.json

## 🚀 Future Enhancements

- [ ] User authentication and accounts
- [ ] Cloud storage integration
- [ ] LinkedIn profile import
- [ ] Cover letter generator
- [ ] Multiple resume versions management
- [ ] Resume comparison tool
- [ ] Industry-specific templates
- [ ] Advanced AI suggestions using GPT
- [ ] Grammar and spell-check integration
- [ ] Real-time collaboration
- [ ] Mobile application
- [ ] Browser extension

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by the Development Team

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy Resume Building! 🎉**

*Remember: A well-crafted resume is your ticket to landing interviews. Make every word count!*
