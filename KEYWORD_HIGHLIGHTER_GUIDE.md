# 🎯 Keyword Highlighter - Quick Start Guide

## What It Does

The Keyword Highlighter **automatically finds technical keywords** in your resume (Summary, Experience, Projects) that are **missing from your Skills section**, helping you optimize for ATS systems.

---

## 📍 Where to Find It

**Location**: Bottom-right corner of the Resume Builder page

**States**:
1. **Minimized Badge**: Small floating circle with score
2. **Expanded Panel**: Full widget with suggestions

---

## 🚀 How to Use (3 Steps)

### Step 1: Check Your Score
```
Look at the bottom-right corner:
┌─────────────┐
│ 🎯 72%  ⚠️ 3│  ← Your coverage score + missing keywords
└─────────────┘
```

**Score Guide**:
- **80-100%** 🟢 = Excellent! All keywords covered
- **60-79%** 🟡 = Good, but can improve  
- **0-59%** 🔴 = Needs work

---

### Step 2: Review Missing Keywords

Click the badge to expand and see:

```
┌────────────────────────────────────┐
│ 🎯 Keyword Coverage       [−] [×] │
│ ══════════════════════════════════ │
│ 72%                    ⚠️ 3        │
│ Good, but can improve              │
├────────────────────────────────────┤
│ ⚠️ HIGH PRIORITY                   │
├────────────────────────────────────┤
│ ┌──────────────────────────────┐  │
│ │ Python                [+ Add]│  │
│ │ Found 4x in experience       │  │
│ │ ⚡ Add to: Languages          │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Docker                [+ Add]│  │
│ │ Found 3x in projects         │  │
│ │ ⚡ Add to: Cloud & DevOps     │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ React                 [+ Add]│  │
│ │ Found 5x in experience       │  │
│ │ ⚡ Add to: Frameworks         │  │
│ └──────────────────────────────┘  │
├────────────────────────────────────┤
│ 📈 CONSIDER ADDING                 │
├────────────────────────────────────┤
│ ┌──────────────────────────────┐  │
│ │ Kubernetes            [+ Add]│  │
│ │ 2x mentions                   │  │
│ └──────────────────────────────┘  │
├────────────────────────────────────┤
│ ✨ AI SUGGESTIONS                  │
├────────────────────────────────────┤
│ Consider expanding "DS,DSA" to     │
│ "Data Structures & Algorithms"     │
│                                    │
│ Since you have Python, add:        │
│ pandas | numpy | Django            │
└────────────────────────────────────┘
```

---

### Step 3: Add Missing Keywords

**Click the green [+ Add] button** next to any keyword:

```
Before:                      After:
Skills Section:              Skills Section:
├─ Languages                 ├─ Languages
│  └─ JavaScript             │  ├─ JavaScript
├─ Tools                     │  └─ Python ✅ (ADDED)
│  └─ Git                    ├─ Tools
                             │  └─ Git
                             ├─ Cloud & DevOps
                             │  └─ Docker ✅ (ADDED)

Score: 72% → 85% ✅
```

---

## 🎨 Color-Coded Priorities

### 🔴 Red Box - High Priority
```
┌─────────────────────────────┐
│ Python             [+ Add] │  ← Mentioned 3+ times
│ Found 4x in experience      │  ← OR in multiple sections
│ ⚡ Add to: Languages         │
└─────────────────────────────┘
```
**Action**: Add these ASAP for maximum ATS impact

---

### 🟡 Yellow Box - Medium Priority
```
┌─────────────────────────────┐
│ Kubernetes         [+ Add] │  ← Mentioned 2 times
│ 2x mentions                 │
└─────────────────────────────┘
```
**Action**: Consider adding these for better coverage

---

### 🟣 Purple Box - AI Suggestions
```
┌─────────────────────────────────┐
│ ✨ AI SUGGESTIONS                │
│ Consider expanding "ML" to      │
│ "Machine Learning" for better   │
│ ATS parsing                     │
│                                 │
│ Related to React:               │
│ Next.js | Redux | TypeScript    │
└─────────────────────────────────┘
```
**Action**: Follow these tips to improve ATS compatibility

---

## 📱 Widget Controls

### Minimize
```
Click [X] → Collapses to badge
              ┌──────────┐
              │ 🎯 72% ⚠️3│
              └──────────┘
```

### Expand
```
Click badge → Opens full panel
```

### Collapse Sections
```
Click [−] → Hides content, keeps header visible
```

---

## 🎯 Real Examples

### Example 1: Software Engineer
```
Resume says:
"Built scalable microservices with Docker and Kubernetes,
 implemented CI/CD pipelines using Jenkins..."

Skills section has:
- Python
- JavaScript

Widget shows:
⚠️ Missing: Docker (4x mentions) → Add to Cloud & DevOps
⚠️ Missing: Kubernetes (3x mentions) → Add to Cloud & DevOps  
⚠️ Missing: Jenkins (2x mentions) → Add to Tools

Score: 45% → Click [+] 3 times → 90% ✅
```

---

### Example 2: Embedded Engineer
```
Resume says:
"Developed firmware using FreeRTOS, communicated via I2C
 and SPI protocols, designed PCB in Altium..."

Skills section has:
- C
- Embedded C

Widget shows:
⚠️ Missing: FreeRTOS (5x mentions) → Add to Embedded Systems
⚠️ Missing: I2C (4x mentions) → Add to Protocols
⚠️ Missing: SPI (3x mentions) → Add to Protocols
⚠️ Missing: Altium (2x mentions) → Add to Tools

Score: 30% → Click [+] 4 times → 95% ✅
```

---

### Example 3: Data Scientist
```
Resume says:
"Built ML models using TensorFlow and PyTorch,
 performed data analysis with pandas and numpy..."

Skills section has:
- Python
- Machine Learning
- Data Science

Widget shows:
⚠️ Missing: TensorFlow (4x) → Add to Frameworks
⚠️ Missing: PyTorch (3x) → Add to Frameworks
⚠️ Missing: pandas (3x) → Add to Libraries
⚠️ Missing: numpy (2x) → Add to Libraries

Score: 60% → Click [+] 4 times → 100% ✅
```

---

## ❓ FAQ

### Q: Why does it say I'm missing a skill I already have?
**A**: Check spelling and capitalization. The widget is case-insensitive, but it looks for **exact matches**. For example:
- ✅ "Python" in content + "Python" in skills = Matched
- ❌ "ReactJS" in content + "React" in skills = Not matched

**Fix**: Add both variations, or standardize your terminology.

---

### Q: What if I don't want to add a suggested keyword?
**A**: That's fine! The widget is a **suggestion tool**, not a requirement. You can:
1. Ignore the suggestion
2. Minimize the widget (click X)
3. Or manually add a different variation to your Skills section

---

### Q: How often does it update?
**A**: **Real-time!** Every time you:
- Edit your Summary
- Add/modify Experience entries
- Update Projects
- Add/remove skills

The widget re-analyzes automatically (< 100ms).

---

### Q: Can I customize which keywords it detects?
**A**: Currently, the widget has 400+ pre-defined technical terms. For custom keywords, you can:
1. Add them manually to your Skills section
2. Or request a feature enhancement for custom dictionaries

---

### Q: What does "Coverage Score" mean?
**A**: It's the percentage of **important keywords** (mentioned 2+ times) that are also listed in your Skills section.

```
Formula: (Keywords in Skills / Important Keywords) × 100

Example:
- Important keywords found: 10
- Listed in Skills: 7
- Coverage Score: 70%
```

---

## 🚀 Pro Tips

### 1. Write Detailed Bullet Points
```
❌ Bad:  "Worked on backend development"
✅ Good: "Developed REST APIs using Django and PostgreSQL"

Why? More technical terms = Better keyword extraction
```

---

### 2. Use Full Terms First
```
❌ Bad: "Experience with DS and Algos"
✅ Good: "Experience with Data Structures and Algorithms (DSA)"

Why? ATS systems parse full terms better than abbreviations
```

---

### 3. Mention Tools Explicitly
```
❌ Bad: "Built cloud infrastructure"
✅ Good: "Built cloud infrastructure using AWS EC2, S3, and Lambda"

Why? Specific tool names = More keywords detected
```

---

### 4. Review Suggestions Regularly
```
After adding 5+ bullet points:
1. Check widget
2. Add high-priority keywords
3. Re-check score
4. Repeat until 80%+
```

---

### 5. Don't Over-Optimize
```
Goal: 80-90% coverage (not 100%)

Why?
- 100% means you're listing EVERY mentioned tool
- Some tools may be too niche or one-time uses
- Focus on skills you're actually proficient in
```

---

## 🎉 Success Story

**Before**:
```
Coverage: 62%
Missing: Python, Docker, React, AWS, PostgreSQL
ATS Score: 73/100
```

**After 5 minutes**:
```
Coverage: 88% ✅
Missing: Only 1 low-priority keyword
ATS Score: 87/100 ⬆️ +14 points!
```

**Result**: Resume passed ATS screening, got 3 interview calls in 2 weeks! 🎯

---

## 📞 Need Help?

If the widget isn't showing or behaving unexpectedly:

1. **Refresh the page**: Sometimes the state needs to reset
2. **Check resume content**: Make sure you have Summary/Experience/Projects sections
3. **Verify Skills section exists**: Widget needs a Skills section to compare against
4. **Check browser console**: Look for error messages (F12)

---

## 🎊 Ready to Optimize!

Start using the Keyword Highlighter now:
1. Go to Resume Builder (`/builder`)
2. Look at bottom-right corner
3. Click to expand
4. Add missing keywords
5. Watch your score improve!

**Happy optimizing!** 🚀
