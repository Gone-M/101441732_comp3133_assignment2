# COMP3133 Full Stack Development Assignment 2

## Project Overview
This project implements a full-stack Employee Management System with Angular frontend and GraphQL backend. The system features user authentication, employee management CRUD operations, and responsive UI design.

## Repository Structure
```
101441732_comp3133_assignment2/
├── docker-compose.yml      # Container orchestration
├── backend/                # Node.js GraphQL API
│   ├── src/                # Backend source code
│   ├── Dockerfile          # Backend container configuration
│   └── package.json        # Backend dependencies
└── frontend/               # Angular application
    ├── src/                # Frontend source code
    ├── Dockerfile          # Frontend container configuration
    └── package.json        # Frontend dependencies
```

## Features Implemented

### Authentication
- User signup with form validation
- User login with JWT authentication
- Session management using services and local storage
- Automatic redirection to login for unauthenticated users

### Employee Management
- Complete CRUD operations via GraphQL
- List all employees in a responsive table format
- Add new employees with profile picture upload
- View detailed employee information
- Update existing employee records
- Delete employee records with confirmation

### Search Functionality
- Filter employees by department or position
- Dynamic results updating as you type
- Clear and intuitive UI for search operations

### Routing and Navigation
- Protected routes requiring authentication
- Clean URL structure
- Proper navigation between components

### UI/UX
- Responsive design using Angular Material
- Consistent styling throughout the application
- Form validations with user feedback
- Loading indicators for async operations

## Technologies Used
- **Frontend**: Angular 15, Angular Material, RxJS
- **Backend**: Node.js, Express, GraphQL, MongoDB
- **Authentication**: JWT
- **Deployment**: Docker, Docker Compose
- **Version Control**: Git, GitHub

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Docker and Docker Compose (optional)
- MongoDB connection (provided in environment variables)

### Local Development Setup
1. Clone the repository
```
git clone https://github.com/yourusername/101441732_comp3133_assignment2.git
cd 101441732_comp3133_assignment2
```

2. Start with Docker Compose (recommended)
```
docker-compose up -d
```

3. Or start frontend and backend separately:
   
   Backend:
   ```
   cd backend
   npm install
   npm start
   ```
   
   Frontend:
   ```
   cd frontend
   npm install
   ng serve
   ```

4. Access the application:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:4000/graphql

## Deployment
The application has been deployed to Vercel (frontend) and Cyclic (backend) for demonstration purposes. Live URLs:
- Frontend: https://employee-management-angular.vercel.app
- Backend API: https://comp3133-backend.cyclic.app/graphql

## Learning Outcomes
Through this project, I've gained practical experience with:
- Building GraphQL APIs with Node.js
- Implementing Angular components, services, and modules
- Managing authentication and sessions in a full-stack application
- Creating responsive and accessible user interfaces
- Containerizing applications with Docker
- Cloud deployment of web applications

## Future Improvements
- Add pagination for large employee datasets
- Implement more advanced search and filtering
- Add reporting and analytics features
- Improve error handling and offline capabilities
- Enhance security with refresh tokens
