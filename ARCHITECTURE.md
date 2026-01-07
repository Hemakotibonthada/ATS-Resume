# Project Structure

```
ResumeBuilder/
│
├── backend/                          # Python FastAPI Backend
│   ├── app.py                       # Main FastAPI application
│   ├── resume_scorer.py             # Resume scoring logic
│   ├── ats_analyzer.py              # ATS compatibility analysis
│   ├── keyword_optimizer.py         # Keyword optimization engine
│   ├── resume_generator.py          # PDF/DOCX generation
│   ├── requirements.txt             # Python dependencies
│   └── data/                        # Data storage
│       ├── resumes/                 # Saved resumes (JSON)
│       └── exports/                 # Exported files (PDF/DOCX)
│
├── frontend/                         # React Frontend
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── ResumeEditor.js     # Main editor component
│   │   │   ├── ResumePreview.js    # Live preview component
│   │   │   ├── ScoreDashboard.js   # Scoring dashboard
│   │   │   └── JobMatcher.js       # Job matching component
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.js                   # Main App component
│   │   ├── index.js                 # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json                 # NPM dependencies
│   └── README.md                    # Frontend documentation
│
├── README.md                         # Main documentation
├── QUICKSTART.md                    # Quick start guide
├── FEATURES.md                      # Detailed features list
├── .gitignore                       # Git ignore rules
├── .env.example                     # Environment variables template
├── package.json                     # Root package file
├── setup.bat                        # Windows setup script
└── start.bat                        # Windows start script
```

## Component Architecture

### Backend Components

#### 1. app.py (Main Application)
- FastAPI application initialization
- CORS middleware configuration
- API endpoint definitions
- Request/response handling
- Service integration

#### 2. resume_scorer.py (Scoring Engine)
**Classes:**
- `ResumeScorer`: Main scoring class

**Key Methods:**
- `score_resume()`: Calculate overall score
- `_score_contact()`: Score contact section
- `_score_summary()`: Score summary section
- `_score_experience()`: Score experience section
- `_score_education()`: Score education section
- `_score_skills()`: Score skills section
- `_score_projects()`: Score projects section
- `_score_certifications()`: Score certifications
- `_get_breakdown()`: Generate detailed breakdown
- `get_suggestions()`: Generate AI suggestions

**Scoring Criteria:**
- Action verb usage
- Quantifiable achievements
- Content quality
- Completeness
- Keyword density

#### 3. ats_analyzer.py (ATS Analysis)
**Classes:**
- `ATSAnalyzer`: ATS compatibility analyzer

**Key Methods:**
- `analyze()`: Comprehensive ATS analysis
- `_check_standard_sections()`: Validate sections
- `_check_contact_info()`: Validate contact
- `_check_consistent_formatting()`: Check formatting
- `_analyze_keywords()`: Keyword analysis
- `_check_quantifiable_achievements()`: Check metrics
- `_analyze_readability()`: Readability analysis

**Analysis Points:**
- Format compatibility (10 checks)
- Keyword density
- Readability metrics
- Standard sections presence
- Special character detection

#### 4. keyword_optimizer.py (Keyword Engine)
**Classes:**
- `KeywordOptimizer`: Keyword optimization

**Key Methods:**
- `match_job()`: Match resume to job
- `optimize()`: Get optimization suggestions
- `_extract_keywords()`: Extract job keywords
- `_extract_resume_keywords()`: Extract resume keywords
- `_identify_technical_keywords()`: Find technical terms
- `_calculate_category_match()`: Category-wise matching
- `_generate_example_phrases()`: Create examples

**Features:**
- Technical keyword identification
- Skills extraction
- Experience keyword detection
- Category-wise matching
- Priority ranking
- Example phrase generation

#### 5. resume_generator.py (Export Engine)
**Classes:**
- `ResumeGenerator`: PDF/DOCX generator

**Key Methods:**
- `generate_pdf()`: Create PDF
- `generate_docx()`: Create DOCX
- `_generate_professional_template()`: Professional layout
- `_generate_minimal_template()`: Minimal layout
- `_add_docx_content()`: Add DOCX content

**Templates:**
- Professional
- Modern
- Minimal
- Technical
- Executive

### Frontend Components

#### 1. App.js (Main Component)
**Responsibilities:**
- Application state management
- Navigation handling
- API integration
- Global actions (save, score, export)
- Snackbar notifications

**State:**
- Current view
- Resume data
- Score data
- Analysis data

#### 2. ResumeEditor.js (Editor Component)
**Features:**
- Form-based editing
- Dynamic field management
- Section accordions
- Validation
- Real-time updates

**Sections:**
- Template selection
- Contact information
- Professional summary
- Experience (dynamic)
- Education (dynamic)
- Skills (chip-based)
- Projects (dynamic)
- Certifications (dynamic)

#### 3. ResumePreview.js (Preview Component)
**Features:**
- Live preview
- ATS-friendly layout
- Responsive design
- Print-ready format

**Display:**
- Formatted contact info
- Styled sections
- Professional appearance
- Color-coded elements

#### 4. ScoreDashboard.js (Dashboard Component)
**Features:**
- Overall score display
- Section breakdown
- Visual charts (Recharts)
- Strengths & weaknesses
- Recommendations
- ATS compatibility details
- Keyword analysis

**Visualizations:**
- Bar charts
- Progress bars
- Score cards
- Keyword categories

#### 5. JobMatcher.js (Matcher Component)
**Features:**
- Job description input
- Requirements management
- Match calculation
- Keyword comparison
- Optimization suggestions
- Example phrases

**Analysis:**
- Overall match percentage
- Category scores
- Matched keywords
- Missing keywords
- Priority suggestions
- Section-specific tips

## Data Flow

### 1. Resume Creation Flow
```
User Input → ResumeEditor → App State → API Call → Backend → Storage
                                                              ↓
User Preview ← ResumePreview ← App State ← Response ← Backend
```

### 2. Scoring Flow
```
Resume Data → API Call → resume_scorer.py → Scoring Algorithm
                                           ↓
Score Dashboard ← Response ← Calculations ← Section Analysis
```

### 3. Job Matching Flow
```
Resume + Job Description → API Call → keyword_optimizer.py
                                     ↓
                                Match Analysis
                                     ↓
                    [Keyword Extraction → Comparison → Suggestions]
                                     ↓
Job Matcher Component ← Response ← Optimization Results
```

### 4. Export Flow
```
Resume Data → API Call → resume_generator.py → Template Selection
                                              ↓
                                    [PDF/DOCX Generation]
                                              ↓
Download ← File Response ← Generated Document
```

## API Endpoints

### Resume Management
- `POST /api/resumes` - Create/update resume
- `GET /api/resumes/:id` - Get specific resume
- `GET /api/resumes` - List all resumes
- `DELETE /api/resumes/:id` - Delete resume

### Analysis
- `POST /api/score` - Score resume
- `POST /api/analyze` - ATS analysis
- `POST /api/match-job` - Job matching
- `POST /api/optimize-keywords` - Keyword optimization
- `POST /api/suggestions` - Get suggestions

### Export
- `POST /api/export/pdf` - Export PDF
- `POST /api/export/docx` - Export DOCX

### Configuration
- `GET /api/templates` - List templates

## State Management

### Frontend State
```javascript
{
  resume: {
    id: string,
    contactInfo: {...},
    summary: string,
    experience: [...],
    education: [...],
    skills: [...],
    projects: [...],
    certifications: [...],
    template: string
  },
  score: {
    overall: number,
    grade: string,
    sections: {...},
    breakdown: {...}
  },
  analysis: {
    compatibility_score: number,
    issues: [...],
    warnings: [...],
    passed_checks: [...],
    keyword_density: {...}
  }
}
```

## Dependencies

### Backend
- **FastAPI**: Web framework
- **uvicorn**: ASGI server
- **pydantic**: Data validation
- **reportlab**: PDF generation
- **python-docx**: DOCX generation

### Frontend
- **React**: UI library
- **Material-UI**: Component library
- **axios**: HTTP client
- **recharts**: Charts library

## Design Patterns

### Backend
- **MVC Pattern**: Separation of concerns
- **Service Layer**: Business logic isolation
- **Data Models**: Pydantic models for validation
- **Dependency Injection**: Service initialization

### Frontend
- **Component-Based**: Reusable components
- **Props Down, Events Up**: Data flow pattern
- **Container/Presenter**: Smart and dumb components
- **Service Layer**: API abstraction

## Performance Considerations

### Backend
- Async operations where possible
- Efficient algorithms (O(n) complexity)
- File I/O optimization
- Response caching ready

### Frontend
- Component memoization ready
- Lazy loading ready
- Code splitting ready
- Optimized re-renders

## Security

### Backend
- Input validation
- CORS configuration
- File size limits
- Sanitized outputs

### Frontend
- XSS prevention
- Input sanitization
- Secure API calls
- Error boundaries

## Testing Strategy

### Backend (Future)
- Unit tests for scoring algorithms
- Integration tests for API endpoints
- Validation tests for data models

### Frontend (Future)
- Component unit tests
- Integration tests
- E2E tests with Cypress
- Accessibility tests

## Deployment Considerations

### Backend
- Environment variables
- Database migration ready
- Cloud storage ready
- Containerization ready (Docker)

### Frontend
- Production build optimization
- Static file serving
- CDN ready
- Progressive Web App ready

## Scalability

### Current Architecture
- JSON file storage (suitable for small scale)
- Synchronous processing
- Local file exports

### Future Scalability
- Database integration (PostgreSQL/MongoDB)
- Async job processing (Celery)
- Cloud storage (S3/Azure Blob)
- Microservices architecture
- Load balancing
- Caching layer (Redis)
