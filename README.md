# MITRAM - Your Digital Companion

MITRAM is a modern, AI-powered web application designed to be a caring digital companion for the elderly. It provides a suite of tools to help users stay connected, manage their health, and remain safe, all within a friendly and easy-to-use interface.

This project was built with Next.js, Firebase, and Google's Gemini AI model.

## Key Features

- **AI-Powered Chat:** A conversational assistant (MITRAM) to help with daily tasks, answer questions, and provide companionship.
- **Health Dashboard:** A central hub to track and monitor personal wellness.
- **Health Vitals Logging:** Users can log and save key health metrics like blood pressure, heart rate, blood sugar, and oxygen levels directly to their secure profile.
- **Real-Time Reminders:** Set, manage, and receive timely notifications for medications, appointments, or other tasks, complete with audible alerts.
- **Family & Emergency Connect:** Manage a list of family members and emergency contacts, keeping loved ones just a click away.
- **Secure Authentication:** Users can sign up and log in securely using their email and password, with all data stored in Firebase.
- **Light & Dark Mode:** A theme toggle allows users to switch between light and dark modes for comfortable viewing.
- **Responsive Design:** The interface is fully responsive and works beautifully on both desktop and mobile devices.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Generative AI:** [Google's Genkit](https://firebase.google.com/docs/genkit) with the Gemini model
- **UI State Management:** React Hooks & Context API

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your-username/your-repository-name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up your Firebase project and get your configuration keys. Add them to a `.env.local` file in the root of the project.
4. Run the development server
   ```sh
   npm run dev
   ```
5. Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
