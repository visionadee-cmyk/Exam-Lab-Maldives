# Exam Lab MV

A comprehensive full-stack exam practice platform for O Level and A Level students in the Maldives.

## Features

- **6 Subjects**: Mathematics, Physics, Chemistry, Accounting, Business, ICT
- **Question Types**: MCQ, Short Answer, Structured, Calculation, Graph-based, Image-based
- **Practice Mode**: Topic-specific practice with instant feedback
- **Exam Mode**: Timed full exam simulation with auto-submit
- **Progress Tracking**: Performance analytics with charts and weak area identification
- **PWA Support**: Installable app with offline capabilities
- **Admin Panel**: Question management system
- **Mobile-First**: Responsive design optimized for all devices

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Charts**: Recharts
- **PWA**: Vite PWA Plugin with Workbox
- **Storage**: Cloudinary (for images)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd exam-lab-mv
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Demo Credentials

- **Admin**: admin@examlab.mv / admin123
- **Student**: student@examlab.mv / student123

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Vercel (Frontend)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Firebase (Backend)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login and initialize:
```bash
firebase login
firebase init
```

3. Deploy:
```bash
firebase deploy
```

## Project Structure

```
exam-lab-mv/
├── src/
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React contexts (Auth, etc.)
│   ├── data/          # Static data (subjects, types)
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # Firebase configuration
│   └── utils/         # Utility functions
├── public/            # Static assets and PWA files
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
