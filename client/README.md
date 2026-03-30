CareerArchitect: AI-Driven Recruitment Platform
CareerArchitect is a full-stack recruitment solution designed to streamline the job posting and application process. It features a custom Express.js backend integrated with the OpenRouter API to provide intelligent, AI-generated job descriptions, significantly reducing the manual effort for recruiters.

🚀 Key Features
AI-Powered Automation: Integrated with OpenRouter API via an Express backend to auto-generate professional job descriptions based on job titles.

Real-Time Data Sync: Leverages Firebase onSnapshot to provide live updates for job listings and application statuses without page refreshes.

Secure Authentication: Robust user session management using Firebase Google OAuth.

Full CRUD Functionality: Recruiters can create, read, update, and delete job postings with instant database persistence.

Application Management: Specialized dashboard (MyJobs) to track applicants, review profile links, and manage recruitment flow.

Premium UI/UX: Styled with Tailwind CSS, featuring glassmorphism effects and a responsive layout for all device sizes.

🛠️ Technical Stack
Frontend: React.js, Redux Toolkit, Tailwind CSS, React Router.

Backend: Node.js, Express.js (Dedicated server for AI API orchestration).

Database & Auth: Firebase Firestore, Firebase Authentication.

AI Integration: OpenRouter API (LLM Integration).

📂 Project Structure
/client: React frontend containing the state management (Redux) and UI components.

/server: Express.js environment handling secure API requests to OpenRouter.

⚙️ Installation & Setup
Clone the Repository:

Bash
git clone https://github.com/Akshay2403
/career-architect.git
Frontend Setup:

Bash
npm install

# Add Firebase credentials to your .env file

npm start
Backend Setup:

Bash
cd server
npm install

# Add OPENROUTER_API_KEY to your .env file

node index.js
