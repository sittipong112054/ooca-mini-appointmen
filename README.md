# Mini Appointment Management App

A full-stack web application for managing medical appointments, built for the ooca Full Stack Developer Intern assessment.

---

## 1. Setup and Run Instructions

Follow these steps to run the application locally on a clean environment.

### Prerequisites
* **Node.js**: v18 or higher installed
* **MySQL Database**: Running locally or accessible via cloud (e.g., Railway/Render)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/sittipong112054/node-expres-mysql.git
cd node-expres-mysql

Step 2: Backend Setup
Navigate to the backend directory:

Bash
cd backend
Install dependencies:

Bash
npm install

Create a .env file in the backend folder and populate it with your configuration:

ข้อมูลโค้ด
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=appointment_db
DB_PORT=3306
# Or use a full connection string:
# DATABASE_URL=mysql://user:password@host:port/database
Build and start the backend server:

Bash
npm run build
npm start
# For development mode with hot-reload:
# npm run dev
The backend server will run on http://localhost:5000.

Step 3: Frontend Setup
Open a new terminal and navigate to the frontend directory:

Bash
cd frontend
Install dependencies:

Bash
npm install
Create a .env.local file in the frontend folder:

ข้อมูลโค้ด
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
Start the frontend development server:

Bash
npm run dev
2. Tech Stack Choices and Reasons
Frontend: Next.js (React Framework) & Tailwind CSS
Next.js (App Router): Chosen for its built-in routing, server-side rendering support, and seamless developer experience when building full-stack applications.

Tailwind CSS: Allows rapid UI development with clean, utility-first styling and built-in support for responsive dark mode UI.

Backend: Node.js with Express & TypeScript
Node.js & Express: Lightweight, fast, and easy to set up for RESTful APIs. It provides flexible routing and middleware handling.

TypeScript: Adds static typing, reducing runtime bugs and providing auto-completion and better code maintainability.

Database: MySQL (via mysql2/promise)
MySQL: A reliable, relational database suitable for handling structured appointment schedules and date/time queries.

mysql2/promise: Provides native async/await connection pooling to easily manage database queries.

Deployment / Hosting
Render: Hosted the Node.js Express backend service.

Railway: Managed the cloud MySQL database instance and public proxy connections.

3. What Was Not Finished & Next Steps
What I Did Not Finish
User Authentication & Authorization: Currently, anyone can create or modify appointments. Role-based access control (e.g., Doctor vs. Patient views) was not implemented within the given timeframe.

Pagination & Search Filters: The list displays all appointments; filtering is basic without pagination.

Automated Unit / Integration Tests: Backend API endpoints and React components rely on manual testing without automated Jest/Supertest coverage.

Next Steps with More Time
Authentication System: Implement JWT-based authentication for patients and administrative staff.

Automated Testing: Write unit tests for API routes (handling 400, 409, 201 codes) and end-to-end tests for the frontend form.

Advanced Time Slot Management: Allow dynamic slot durations (beyond the default 30-minute block) and calendar views (e.g., FullCalendar integration).

Email / SMS Notifications: Send automated confirmation emails or reminders when an appointment is booked or updated.

4. AI Tool Usage
AI Assistance: AI tools (Gemini) were used during development to assist with:

Troubleshooting and debugging database connection timeout errors (ETIMEDOUT and connection pooling with SSL/Proxy on cloud deployments).

Structuring clean TypeScript types for MySQL query results and request body validations.

Formatting clean documentation and setup instructions.

Code Understanding: All generated snippets and configuration logic were thoroughly reviewed, tested, and integrated manually. I can explain the implementation, architecture, and logic behind every line of code submitted.



