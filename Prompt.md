**Act as a Senior Full-Stack Software Architect and UI/UX Designer.**

I want to build a highly advanced, local-first Resume/CV Builder application on my laptop that rivals and exceeds the capabilities of "Enhancv.com".

**Project Name:** "ProResume Architect"

**Tech Stack:** - **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion (for smooth animations).
- **State Management:** Zustand (for handling the complex resume data structure).
- **Backend/Storage:** SQLite (local database) or LocalStorage for a privacy-first approach.
- **PDF Generation:** Puppeteer or React-PDF (critical for pixel-perfect exports).
- **AI Integration:** OpenAI API or support for Local LLMs (via Ollama) for text generation.

### Phase 1: Core Features (Enhancv Parity)
The application must include these features found in Enhancv:
1.  **Dual-Pane Editor:** A real-time split view. The left side is for data entry (forms), and the right side is a live, A4/Letter-sized preview of the document.
2.  **Drag-and-Drop Layout:** The ability to rearrange sections (Experience, Education, Skills) seamlessly using a library like `dnd-kit`.
3.  **Modular Sections:**
    -   Standard: Contact, Experience, Education, Skills, Languages.
    -   Creative (Enhancv style): "My Time" (Pie charts of daily routine), "Life Philosophy" (Quote blocks), "Books Read" (Visual icons), and "Proudest Achievements."
4.  **Smart Date Handling:** Automatic calculation of employment duration (e.g., "Jan 2020 - Present · 4 yrs").
5.  **Visual Customization:**
    -   Global Color Themes (Primary, Secondary, Text colors).
    -   Font Pairings (Header vs. Body fonts).
    -   Background textures or subtle watermarks.
    -   Adjustable margins and line heights.
6.  **ATS Checker:** A built-in logic that analyzes the resume JSON and warns if the layout is unreadable by Applicant Tracking Systems (e.g., minimizing icons in critical text areas).

### Phase 2: Innovative "Killer" Features (The Upgrade)
I want you to innovate beyond the standard clone with these features:
1.  **"Job Description Matcher" (AI):** A text box where I can paste a Job Description (JD) from LinkedIn. The app should analyze my resume against the JD and give a "Match Score" (0-100%) and suggest keywords I am missing.
2.  **Git-Like Version Control:** "Resume Time Travel." I want to save versions of my resume (e.g., "Google Application v1," "Startup Version v2") and be able to diff/compare them or roll back changes.
3.  **Local-First Privacy:** Unlike web apps, all data must be stored locally on my machine in a JSON file. No data leaves my laptop unless I specifically choose to use an AI feature.
4.  **Markdown Support:** Allow me to write bullet points using Markdown syntax for bolding, italics, and lists for speed.
5.  **Smart Bullet Points:** If I type "Managed a team," the AI should suggest: "Led a cross-functional team of 10 engineers, increasing productivity by 20%." (Action Verb + Task + Result).
6.  **QR Code Generator:** A dynamic section that generates a QR code pointing to my LinkedIn or GitHub portfolio.

### Your Task:
1.  **Project Structure:** Create the folder structure for this Next.js project.
2.  **Data Schema:** Define the TypeScript interface/Schema for the `Resume` object (this is the most critical part).
3.  **Core Components:** Provide the code for the main `ResumeBuilder` layout shell.
4.  **Implementation Plan:** Give me a step-by-step roadmap to build this, starting with the environment setup.

Let's start with Step 1 and Step 2.

phase -2 : - 

### Phase 2: The "Eightfold Optimizer" (Deep Learning Calibration)
To ensure this resume passes Qualcomm's Eightfold.ai system, the app must go beyond simple keywords and focus on *Semantic Relevance* and *Parsability*.

1.  **Semantic Job Mapper (The "Context" Engine):**
    * **Function:** Instead of just checking for keywords, the app uses an LLM (like OpenAI/Ollama) to analyze the *Job Description's* hidden requirements.
    * **The Logic:** "The user listed 'Python', but the Job Description implies 'Distributed Systems'. Suggest rewriting the bullet point to: 'Built distributed systems using Python' to create a semantic link."
    * **Goal:** Create a strong "Skill-to-Task" relationship that Eightfold's knowledge graph loves.

2.  **Standardized Title Suggester:**
    * **Problem:** Eightfold normalizes job titles. If I use a non-standard title, I might lose ranking.
    * **Feature:** If I type a title like "Junior Coder," the app should popup: *"Recommendation: Change to 'Associate Software Engineer' to match Standard Occupational Classifications (SOC) used by enterprise AI."*

3.  **"Ghost" Text Layer (Parsability Assurance):**
    * **The Tech:** When exporting the PDF, use a library like `react-pdf` to ensure the text layer is purely linear and hierarchical.
    * **Why:** Eightfold parses the raw text. The app must ensure that even if I use columns visually, the underlying text stream is read strictly as `Header -> Work History -> Job 1 -> Job 2`. No floating text boxes that confuse the parser.

4.  **Quantifiable Impact Prompter:**
    * Eightfold ranks "High Potential" candidates higher.
    * **Feature:** If a bullet point lacks a number, show a warning: *"Eightfold algorithms prioritize quantifiable impact. Add a metric here (e.g., 'improved latency by 20%')."*

5.  **Resume Schema (JSON-LD) Embedding:**
    * **Advanced Feature:** Embed invisible `application/ld+json` (Schema.org/Resume) metadata inside the PDF or provide a separate JSON export.
    * **Benefit:** This feeds structured data directly to the AI, bypassing the need for it to "guess" where your Education section ends and Experience begins.

6. **"Fluff" Detector (AI Copyeditor):**
   - **Feature:** If the user types generic phrases like "hard worker" or "seeking growth," the AI highlights them in red.
   - **Correction:** It suggests replacing them with Hard Skills.
   - **Example:** * *Input:* "I want to learn new things."
     * *AI Suggestion:* "Replace with: 'Committed to continuous upskilling in [Target Technology] and [Industry Standard] practices.'"

7. **The "So What?" Test (Impact Calculator):**
   - **Logic:** If I type a sentence that stops at the task (e.g., "Fixed bugs"), the app blocks me.
   - **Prompt:** It must ask: "So what? Did it save money? Did it save time? By how much?"
   - **Auto-Complete:** It then helps me format it: "[Action Verb] + [Task] + [Result with Numbers]."