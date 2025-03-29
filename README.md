# User Management Dashboard

A modern React application for managing user data with authentication, built with TypeScript and featuring a sleek UI design.

## Features

### Authentication
- Secure login system
- JWT token-based authentication
- Persistent session management
- Animated login interface
- Form validation

### User Management
- View paginated list of users
- Edit user information (first name, last name, email)
- Delete users
- Persistent state management
- Real-time validation
- Success/error notifications
- Animated user interactions

### Technical Features
- TypeScript support
- Responsive design
- Code splitting with lazy loading
- Modern UI with animations
- Form validation
- API integration
- Local storage persistence

## Technologies Used

- React 18
- TypeScript
- React Router v6
- Axios for API calls
- TailwindCSS for styling
- Motion for animations
- Lucide React for icons

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
- git clone <https://github.com/s-a-k-e-t-pandey/Emp_details>

2. Install dependencies
- npm install

3. Start the development server
- npm run dev


## Usage

### Login
- Use the following credentials to log in:
  - Email: `eve.holt@reqres.in`
  - Password: `cityslicka`

### User Management
- View users list on the dashboard
- Click edit icon to modify user details
- Click delete icon to remove a user
- Changes persist across sessions

## API Integration

The application uses the ReqRes API for demonstration:
- Login: POST https://reqres.in/api/login
- Users List: GET https://reqres.in/api/users
- Update User: PUT https://reqres.in/api/users/{id}
- Delete User: DELETE https://reqres.in/api/users/{id}

## Project Structure

src/
├── components/
│ ├── AuthScreen.tsx # Login component
│ ├── UsersList.tsx # Users dashboard
│ ├── EditUserModal.tsx # Edit user modal
│ └── Input.tsx # Reusable input component
├── App.tsx # Main application component
└── index.tsx # Application entry point



## Features in Detail

### Authentication Screen
- Modern gradient design
- Animated form elements
- Real-time validation
- Success/error notifications
- Smooth transitions

### Users Dashboard
- Paginated user list
- Hover animations
- Edit/Delete functionality
- Persistent state
- Success/error notifications
- Smooth transitions between pages

### Edit User Modal
- Pre-filled form data
- Real-time validation
- Email format validation
- Success/error handling
- Animated transitions


## Acknowledgments

- ReqRes API for providing the test API
- TailwindCSS for the styling system
- Motion for the animation library