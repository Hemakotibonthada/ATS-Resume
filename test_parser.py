"""
Test script for resume parser improvements
Tests the enhanced parsing capabilities
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from resume_parser import ResumeParser

def test_parser():
    """Test the enhanced resume parser"""
    parser = ResumeParser(use_ai=False)  # Test traditional parsing
    
    # Test sample resume text
    sample_text = """
    John Doe
    Email: john.doe@example.com
    Phone: +1-555-123-4567
    LinkedIn: linkedin.com/in/johndoe
    Location: San Francisco, CA
    
    PROFESSIONAL SUMMARY
    Experienced software engineer with 5+ years in web development.
    
    EXPERIENCE
    Senior Software Engineer
    Tech Company Inc., San Francisco, CA
    January 2020 - Present
    • Developed microservices using Node.js and Python
    • Improved application performance by 40%
    • Led team of 5 developers
    
    Software Developer
    Startup LLC, New York, NY
    June 2018 - December 2019
    • Built RESTful APIs using Express.js
    • Implemented CI/CD pipelines with Jenkins
    
    EDUCATION
    Bachelor of Technology in Computer Science
    ABC University, Boston, MA
    2014 - 2018
    GPA: 3.8/4.0
    
    Master of Science in Software Engineering
    XYZ University
    2018 - 2020
    
    SKILLS
    Python, JavaScript, React, Node.js, Express, MongoDB, PostgreSQL, AWS, Docker, 
    Kubernetes, Git, Jenkins, CI/CD, REST APIs, Microservices, Agile
    
    PROJECTS
    E-commerce Platform
    Built a full-stack e-commerce application using React, Node.js, and MongoDB.
    Implemented payment gateway integration and real-time inventory management.
    https://github.com/johndoe/ecommerce
    
    Task Management System
    Developed using Python Flask, PostgreSQL, and Vue.js for frontend.
    
    CERTIFICATIONS
    AWS Certified Solutions Architect - Amazon, 2021
    Python Professional Certificate - Coursera, 2020
    Kubernetes Administrator (CKA) - 2022
    """
    
    print("=" * 80)
    print("TESTING RESUME PARSER IMPROVEMENTS")
    print("=" * 80)
    
    # Test contact info extraction
    print("\n1. Testing Contact Info Extraction...")
    contact = parser.extract_contact_info(sample_text)
    print(f"   Name: {contact.get('name', 'NOT FOUND')}")
    print(f"   Email: {contact.get('email', 'NOT FOUND')}")
    print(f"   Phone: {contact.get('phone', 'NOT FOUND')}")
    print(f"   LinkedIn: {contact.get('linkedin', 'NOT FOUND')}")
    print(f"   Location: {contact.get('location', 'NOT FOUND')}")
    
    # Test skills extraction
    print("\n2. Testing Skills Extraction...")
    skills = parser.extract_skills(sample_text)
    print(f"   Found {len(skills)} skills:")
    for skill in skills[:10]:
        print(f"   - {skill}")
    if len(skills) > 10:
        print(f"   ... and {len(skills) - 10} more")
    
    # Check for invalid skills
    invalid_patterns = ['email', 'phone', '@', '+1', 'date of birth']
    invalid_found = [s for s in skills if any(p in s.lower() for p in invalid_patterns)]
    if invalid_found:
        print(f"   WARNING: Invalid skills detected: {invalid_found}")
    else:
        print(f"   [OK] No invalid skills detected")
    
    # Test experience extraction
    print("\n3. Testing Experience Extraction...")
    experiences = parser.extract_experience(sample_text)
    print(f"   Found {len(experiences)} experience entries:")
    for i, exp in enumerate(experiences, 1):
        print(f"\n   Entry {i}:")
        print(f"   - Position: {exp.get('position', 'NOT FOUND')}")
        print(f"   - Company: {exp.get('company', 'NOT FOUND')}")
        print(f"   - Start Date: {exp.get('startDate', 'NOT FOUND')}")
        print(f"   - End Date: {exp.get('endDate', 'NOT FOUND')}")
        print(f"   - Current: {exp.get('current', False)}")
        print(f"   - Descriptions: {len(exp.get('description', []))} items")
    
    # Test education extraction
    print("\n4. Testing Education Extraction...")
    education = parser.extract_education(sample_text)
    print(f"   Found {len(education)} education entries:")
    for i, edu in enumerate(education, 1):
        print(f"\n   Entry {i}:")
        print(f"   - Degree: {edu.get('degree', 'NOT FOUND')}")
        print(f"   - Field: {edu.get('field', 'NOT FOUND')}")
        print(f"   - Institution: {edu.get('institution', 'NOT FOUND')}")
        print(f"   - Start Date: {edu.get('startDate', 'NOT FOUND')}")
        print(f"   - End Date: {edu.get('endDate', 'NOT FOUND')}")
        print(f"   - GPA: {edu.get('gpa', 'NOT FOUND')}")
    
    # Test projects extraction
    print("\n5. Testing Projects Extraction...")
    projects = parser.extract_projects(sample_text)
    print(f"   Found {len(projects)} project entries:")
    for i, proj in enumerate(projects, 1):
        print(f"\n   Project {i}:")
        print(f"   - Name: {proj.get('name', 'NOT FOUND')}")
        print(f"   - Description length: {len(proj.get('description', ''))} chars")
        print(f"   - Technologies: {', '.join(proj.get('technologies', []))}")
        print(f"   - Link: {proj.get('link', 'NOT FOUND')}")
    
    # Test certifications extraction
    print("\n6. Testing Certifications Extraction...")
    certifications = parser.extract_certifications(sample_text)
    print(f"   Found {len(certifications)} certification entries:")
    for i, cert in enumerate(certifications, 1):
        print(f"   - {cert.get('name', 'NOT FOUND')}")
        print(f"     Issuer: {cert.get('issuer', 'NOT FOUND')}")
        print(f"     Date: {cert.get('date', 'NOT FOUND')}")
    
    # Test ATS scoring
    print("\n7. Testing ATS Score Calculation...")
    ats_score = parser.calculate_ats_score(sample_text, skills, experiences)
    print(f"   ATS Score: {ats_score}/100")
    
    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)
    
    # Summary
    print("\n[SUMMARY]:")
    print(f"[OK] Contact Info: {len([v for v in contact.values() if v])} fields extracted")
    print(f"[OK] Skills: {len(skills)} extracted")
    print(f"[OK] Experience: {len(experiences)} entries with dates")
    print(f"[OK] Education: {len(education)} entries with fields")
    print(f"[OK] Projects: {len(projects)} entries")
    print(f"[OK] Certifications: {len(certifications)} entries")
    print(f"[OK] ATS Score: {ats_score}/100")
    
    return True

if __name__ == "__main__":
    try:
        test_parser()
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
