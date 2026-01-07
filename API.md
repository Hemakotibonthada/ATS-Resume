# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
Currently, no authentication is required. Future versions will include JWT-based authentication.

---

## Resume Endpoints

### Create/Update Resume
Creates a new resume or updates an existing one.

**Endpoint:** `POST /api/resumes`

**Request Body:**
```json
{
  "id": "optional-resume-id",
  "contactInfo": {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-234-567-8900",
    "location": "San Francisco, CA",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "portfolio": "johndoe.com"
  },
  "summary": "Experienced software engineer...",
  "experience": [
    {
      "id": "exp-1",
      "company": "Tech Corp",
      "position": "Senior Software Engineer",
      "location": "San Francisco, CA",
      "startDate": "2020-01",
      "endDate": "2023-12",
      "current": false,
      "description": [
        "Developed scalable microservices...",
        "Led team of 5 engineers..."
      ]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "University of California",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "location": "Berkeley, CA",
      "startDate": "2015-09",
      "endDate": "2019-05",
      "gpa": "3.8"
    }
  ],
  "skills": ["Python", "JavaScript", "React", "AWS"],
  "projects": [
    {
      "id": "proj-1",
      "name": "E-commerce Platform",
      "description": "Built a full-stack...",
      "technologies": ["React", "Node.js", "MongoDB"],
      "link": "github.com/johndoe/project"
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "date": "2022-06",
      "link": "aws.amazon.com/certification"
    }
  ],
  "languages": ["English", "Spanish"],
  "template": "professional"
}
```

**Response:**
```json
{
  "id": "resume-uuid",
  "message": "Resume saved successfully"
}
```

---

### Get Resume
Retrieves a specific resume by ID.

**Endpoint:** `GET /api/resumes/{resume_id}`

**Response:**
```json
{
  "id": "resume-uuid",
  "contactInfo": {...},
  "summary": "...",
  "experience": [...],
  "education": [...],
  "skills": [...],
  "projects": [...],
  "certifications": [...],
  "createdAt": "2024-01-07T10:00:00",
  "updatedAt": "2024-01-07T11:00:00"
}
```

**Error Response (404):**
```json
{
  "detail": "Resume not found"
}
```

---

### List Resumes
Lists all saved resumes.

**Endpoint:** `GET /api/resumes`

**Response:**
```json
[
  {
    "id": "resume-1",
    "name": "John Doe",
    "updatedAt": "2024-01-07T11:00:00",
    "template": "professional"
  },
  {
    "id": "resume-2",
    "name": "Jane Smith",
    "updatedAt": "2024-01-06T15:30:00",
    "template": "modern"
  }
]
```

---

### Delete Resume
Deletes a resume by ID.

**Endpoint:** `DELETE /api/resumes/{resume_id}`

**Response:**
```json
{
  "message": "Resume deleted successfully"
}
```

---

## Analysis Endpoints

### Score Resume
Calculates comprehensive ATS score for a resume.

**Endpoint:** `POST /api/score`

**Request Body:** Same as resume object

**Response:**
```json
{
  "overall": 87,
  "grade": "A-",
  "sections": {
    "contact": 9.5,
    "summary": 8.0,
    "experience": 26.5,
    "education": 13.0,
    "skills": 14.0,
    "projects": 8.5,
    "certifications": 4.0,
    "format": 5.0
  },
  "breakdown": {
    "strengths": [
      "Complete contact information with professional links",
      "Strong professional summary with action verbs",
      "Excellent work experience with quantifiable achievements"
    ],
    "weaknesses": [
      "Consider adding more certifications"
    ],
    "recommendations": [
      "Add LinkedIn profile to contact information",
      "Include more quantifiable achievements in experience section",
      "Add industry-relevant certifications"
    ]
  }
}
```

**Score Ranges:**
- 90-100: A+ / A (Excellent)
- 85-89: A- (Very Good)
- 80-84: B+ (Good)
- 75-79: B (Above Average)
- 70-74: B- (Average)
- 60-69: C+ / C (Below Average)
- <60: C- (Needs Improvement)

---

### Analyze ATS Compatibility
Performs detailed ATS compatibility analysis.

**Endpoint:** `POST /api/analyze`

**Request Body:** Same as resume object

**Response:**
```json
{
  "compatibility_score": 92,
  "issues": [],
  "warnings": [
    "Add more quantifiable achievements (numbers, percentages, results)"
  ],
  "passed_checks": [
    "All standard sections present",
    "Complete contact information",
    "Using ATS-friendly digital format",
    "No problematic images or graphics",
    "Good keyword density (15 keywords found)",
    "Good use of quantifiable achievements (8 found)"
  ],
  "keyword_density": {
    "categories": {
      "technical": {
        "count": 5,
        "keywords": ["developed", "implemented", "designed"]
      },
      "management": {
        "count": 3,
        "keywords": ["managed", "led", "coordinated"]
      },
      "achievement": {
        "count": 4,
        "keywords": ["increased", "improved", "optimized"]
      },
      "collaboration": {
        "count": 2,
        "keywords": ["collaborated", "communicated"]
      },
      "analysis": {
        "count": 1,
        "keywords": ["analyzed"]
      }
    },
    "total_keywords": 15
  },
  "readability": {
    "avg_sentence_length": 18.5,
    "avg_word_length": 5.2,
    "assessment": "Good"
  },
  "formatting": {
    "template": "professional",
    "sections_count": 8,
    "recommendations": [
      "Use consistent bullet point style",
      "Keep font sizes uniform within sections",
      "Use standard fonts (Arial, Calibri, Times New Roman)",
      "Maintain consistent spacing between sections"
    ]
  }
}
```

---

### Match with Job Description
Compares resume against a job description.

**Endpoint:** `POST /api/match-job`

**Request Body:**
```json
{
  "resume": {...},
  "job": {
    "title": "Senior Software Engineer",
    "company": "Tech Company",
    "description": "We are looking for an experienced software engineer...",
    "requirements": [
      "5+ years of Python experience",
      "Experience with AWS",
      "Strong communication skills"
    ]
  }
}
```

**Response:**
```json
{
  "overall_score": 78.5,
  "matched_keywords": [
    "python",
    "aws",
    "software",
    "engineer",
    "developed",
    "implemented"
  ],
  "missing_keywords": [
    "kubernetes",
    "docker",
    "microservices",
    "ci/cd",
    "agile"
  ],
  "category_scores": {
    "technical": 75.0,
    "skills": 82.0,
    "experience": 80.0
  },
  "recommendations": [
    "Your match score is 78.5% - aim for 75%+ for better ATS ranking",
    "Add technical keywords if applicable: kubernetes, docker, microservices",
    "Use exact phrases from job description where accurate",
    "Quantify achievements with metrics relevant to the role"
  ],
  "keyword_density": {
    "resume": 45,
    "job": 62,
    "matched": 35
  }
}
```

---

### Optimize Keywords
Get keyword optimization suggestions for a job.

**Endpoint:** `POST /api/optimize-keywords`

**Request Body:** Same as match-job endpoint

**Response:**
```json
{
  "priority_keywords": [
    {
      "keyword": "kubernetes",
      "priority": "high",
      "reason": "Technical requirement from job description"
    },
    {
      "keyword": "microservices",
      "priority": "high",
      "reason": "Technical requirement from job description"
    }
  ],
  "suggested_additions": {
    "summary": [
      "Incorporate key terms: kubernetes, docker, microservices",
      "Highlight experience with Senior Software Engineer",
      "Add measurable achievements relevant to the position"
    ],
    "experience": [
      "Add bullet points mentioning: kubernetes, docker, ci/cd",
      "Include projects or achievements using required technologies",
      "Quantify results using metrics mentioned in job description"
    ],
    "skills": [
      "Add these skills if you have them: kubernetes, docker, terraform",
      "Include both technical skills and tools mentioned in job posting",
      "Add proficiency levels if significantly experienced"
    ]
  },
  "optimization_tips": [
    "Your match score is 78.5% - aim for 75%+ for better ATS ranking",
    "Use exact phrases from job description when accurate",
    "Don't keyword stuff - incorporate naturally into achievements",
    "Prioritize keywords that appear multiple times in job description"
  ],
  "example_phrases": [
    "Developed and implemented kubernetes solutions resulting in X% improvement",
    "Led team of X engineers using microservices to deliver high-impact projects",
    "Expertise in docker with demonstrated success in production environments"
  ]
}
```

---

### Get Suggestions
Get AI-powered improvement suggestions.

**Endpoint:** `POST /api/suggestions`

**Request Body:** Same as resume object

**Response:**
```json
{
  "general": [
    "Your resume seems brief. Consider adding more details to each section."
  ],
  "experience": [
    "Add more bullet points to Senior Software Engineer at Tech Corp (aim for 3-5)",
    "Start bullet points with action verbs (e.g., 'Developed', 'Managed', 'Increased')"
  ],
  "skills": [
    "Add more relevant skills to increase ATS match rate (aim for 10-15 skills)"
  ],
  "summary": [
    "Expand your summary to 50-150 words for better impact"
  ]
}
```

---

## Export Endpoints

### Export as PDF
Generates and downloads resume as PDF.

**Endpoint:** `POST /api/export/pdf`

**Request Body:** Same as resume object

**Response:** Binary PDF file

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="resume_John_Doe.pdf"
```

---

### Export as DOCX
Generates and downloads resume as DOCX.

**Endpoint:** `POST /api/export/docx`

**Request Body:** Same as resume object

**Response:** Binary DOCX file

**Headers:**
```
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="resume_John_Doe.docx"
```

---

## Configuration Endpoints

### Get Templates
Returns available resume templates.

**Endpoint:** `GET /api/templates`

**Response:**
```json
[
  {
    "id": "professional",
    "name": "Professional",
    "description": "Clean and professional layout suitable for corporate positions",
    "atsScore": 95
  },
  {
    "id": "modern",
    "name": "Modern",
    "description": "Contemporary design with subtle colors",
    "atsScore": 90
  },
  {
    "id": "minimal",
    "name": "Minimal",
    "description": "Simple and elegant design focusing on content",
    "atsScore": 98
  },
  {
    "id": "technical",
    "name": "Technical",
    "description": "Optimized for technical and engineering roles",
    "atsScore": 96
  },
  {
    "id": "executive",
    "name": "Executive",
    "description": "Sophisticated layout for senior positions",
    "atsScore": 93
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request format or missing required fields"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error occurred"
}
```

---

## Rate Limiting
Currently no rate limiting. Future versions will include:
- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## Data Models

### ContactInfo
```typescript
{
  fullName: string (required)
  email: string (required, email format)
  phone: string (required)
  location: string (required)
  linkedin?: string (optional)
  github?: string (optional)
  portfolio?: string (optional)
}
```

### Experience
```typescript
{
  id: string (required)
  company: string (required)
  position: string (required)
  location: string (required)
  startDate: string (required, YYYY-MM format)
  endDate: string (required if not current)
  current: boolean (required)
  description: string[] (required, min 1)
}
```

### Education
```typescript
{
  id: string (required)
  institution: string (required)
  degree: string (required)
  field: string (required)
  location: string (required)
  startDate: string (required)
  endDate: string (required)
  gpa?: string (optional)
}
```

### Project
```typescript
{
  id: string (required)
  name: string (required)
  description: string (required)
  technologies: string[] (required)
  link?: string (optional)
}
```

### Certification
```typescript
{
  id: string (required)
  name: string (required)
  issuer: string (required)
  date: string (required)
  link?: string (optional)
}
```

---

## Usage Examples

### JavaScript/Axios
```javascript
import axios from 'axios';

// Score a resume
const scoreResume = async (resume) => {
  try {
    const response = await axios.post('http://localhost:8000/api/score', resume);
    console.log('Score:', response.data.overall);
    console.log('Grade:', response.data.grade);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// Export as PDF
const exportPDF = async (resume) => {
  try {
    const response = await axios.post(
      'http://localhost:8000/api/export/pdf',
      resume,
      { responseType: 'blob' }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'resume.pdf');
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Python/Requests
```python
import requests

# Score a resume
resume = {
    "contactInfo": {...},
    "summary": "...",
    # ... other fields
}

response = requests.post(
    'http://localhost:8000/api/score',
    json=resume
)

if response.status_code == 200:
    score_data = response.json()
    print(f"Score: {score_data['overall']}")
    print(f"Grade: {score_data['grade']}")
```

### cURL
```bash
# Score a resume
curl -X POST http://localhost:8000/api/score \
  -H "Content-Type: application/json" \
  -d @resume.json

# Export as PDF
curl -X POST http://localhost:8000/api/export/pdf \
  -H "Content-Type: application/json" \
  -d @resume.json \
  --output resume.pdf
```

---

## Best Practices

1. **Always validate data** before sending to API
2. **Handle errors gracefully** with try-catch blocks
3. **Use appropriate content types** (application/json)
4. **Check response status codes** before processing
5. **Implement retry logic** for network failures
6. **Cache template data** to reduce API calls
7. **Debounce auto-save** to avoid excessive requests

---

## Changelog

### v1.0.0 (2024-01-07)
- Initial release
- Resume CRUD operations
- Scoring algorithm
- ATS analysis
- Job matching
- Keyword optimization
- PDF/DOCX export
- Template system
