# 📄 Resume Analyser

An web app that analyzes resumes for skills, grammar, readability, and job match percentage, and even provides ATS simulation and visual feedback — helping users optimize their resumes for professional impact.

##### 🔗 [Live Demo:](https://tanyaresumeanalyser.netlify.app/)

##### 💻 [GitHub:](https://github.com/tanyanebhwani/resume-analyser)

# 🚀 Features
- Uploads resumes in PDF/DOCX format
- Detect technical skills (React, Python, SQL, etc.) from resume text.
  Displays: ✅ Matched Skills (Green) and ❌ Missing Skills (Red)
- Uploads a job description.
- Compares resume keywords with job description and gives a Job Description match % score.
- Generates overall score based on skills, experience and formatting of the resume.
- Gives a summary of the readability issues and also detects errors in the grammer.
- <b> Visualization </b> - Displays pie chart for skill match and a chart for readability metrics.
-  <b> ATS Simulation </b> – Mimics how an Applicant Tracking System reads a resume and detects missing sections and skills.

# Tech Stack

### Layer	Technologies Used
- Frontend -	React.js, Tailwind CSS, Recharts
- Backend (Main) -	Node.js, Express.js
- Microservice -	Python (Flask, textstat, language-tool-python)
- File Handling -	multer, pdf-parse, docx

# ⚙️ Installation & Setup
## 🖥️ Clone the Repository
      git clone https://github.com/tanyanebhwani/resume-analyser.git
      cd resume-analyser
      npm install

## 🧩 Backend Setup (Node.js)
     cd server
     npm install
     npm run server

## 🧠 Flask Microservice
    cd backend
    pip install -r requirements.txt
    npm run start-flask-only

## 🌐 Frontend Setup
    cd client
    npm install
    npm run client
  
## Concurrent Setup
    npm run start
 Make sure both backend and Flask servers are running concurrently.

