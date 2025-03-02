# Time Tracker

A modern time tracking application built with React, TypeScript, and Firebase. Track work hours, breaks, and time off with an easy-to-use interface.

## Features

- User authentication with email/password and Google sign-in
- Clock in/out functionality
- Break time tracking
- Daily activity log
- Dark mode support
- Responsive design

## Tech Stack

- React
- TypeScript
- Firebase (Authentication & Firestore)
- TailwindCSS
- React Router
- React Query
- React Hook Form
- Zod
- Vite

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/time-tracker.git
cd time-tracker
```

2. Install dependencies
```bash
npm install
```

3. Create a Firebase project and add your configuration
- Create a new project in Firebase Console
- Enable Authentication (Email/Password and Google providers)
- Enable Firestore Database
- Create a .env file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Start the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Project Structure

```
time-tracker/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── config/        # Configuration files
│   ├── assets/        # Static assets
│   ├── App.tsx        # Main App component
│   └── main.tsx       # Entry point
├── public/            # Public assets
├── index.html         # HTML template
└── package.json       # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
