# TriageNow - Health Triage Application

## Overview

TriageNow is a responsive health triage application designed to prioritize patient emergencies using advanced UI/UX principles. The application helps both patients and medical staff efficiently manage and respond to health concerns based on urgency and symptoms.

## Features

### For Patients

- **Symptom Assessment**: Complete a comprehensive health questionnaire to evaluate your symptoms
- **Smart Watch Integration**: Connect your wearable device to automatically track and share vital signs
- **AI-Powered Health Assistant**: Receive personalized health guidance based on your symptoms
- **Multiple Entry Points**:
  - Need hospital evaluation
  - General health check
  - Ambulance request assistance
  - Emergency room check-in optimization

### For Medical Staff

- **Patient Prioritization**: Quickly identify critical cases with color-coded triage statuses
- **Vital Sign Monitoring**: View real-time health metrics from connected smart watches
- **Comprehensive Patient Data**: Access symptom details, medical history, and AI-generated insights
- **Efficient Resource Allocation**: Optimize care delivery based on urgency and resource availability

## Technical Overview

TriageNow is built with modern web technologies focusing on performance, accessibility, and responsive design:

### Frontend
- **React.js**: Component-based UI development
- **TailwindCSS**: Utility-first styling for consistent, responsive design
- **TypeScript**: Type-safe code to reduce runtime errors
- **Zustand**: Lightweight state management
- **Shadcn UI**: Accessible, reusable UI components 
- **Wouter**: Lightweight routing solution

### Backend
- **Express.js**: Fast, unopinionated web framework for Node.js
- **Drizzle ORM**: Type-safe database queries and schema management
- **Memory Storage**: In-memory storage for prototype development (configurable for production database)


## Project Structure

```
├── client/                # Frontend code
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── App.tsx        # Main application component
│   │   └── main.tsx       # Application entry point
│   │
├── server/                # Backend code
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage implementation
│   └── vite.ts            # Vite server configuration
│
├── shared/                # Shared code between frontend and backend
│   └── schema.ts          # Database schema and type definitions
│
├── package.json           # Project dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
└── vite.config.ts         # Vite bundler configuration
```

## Key Components

### Patient Flow

1. **Role Selection**: Choose between patient or medical staff role
2. **Patient Option Selection**: Select the appropriate healthcare scenario
3. **Smartwatch Connection** (optional): Link your wearable device for vital sign monitoring
4. **Symptom Assessment**: Complete the questionnaire to provide detailed health information
5. **AI Recommendation**: Receive guidance based on your assessment results

### Medical Staff Flow

1. **Dashboard View**: See all patients with their triage status and vital signs
2. **Patient Details**: Access comprehensive information for each patient
3. **Priority Management**: Set next-in-line patients or rush ambulance services
4. **Real-time Monitoring**: View live vital sign trends and alerts

## Usage Examples

### Assessing Patient Symptoms

1. Select the "Patient" role on the role selection screen
2. Choose "I need to check my health" from the options
3. If you have a smartwatch, click "My Watch Is On" or choose "I don't have a smartwatch"
4. Answer the symptom questionnaire providing detailed information about your condition
5. Review the AI-generated health assessment and recommendations

### Medical Staff Triage

1. Select the "Medical Staff" role on the role selection screen
2. View the dashboard showing all current patients and their triage status
3. Click on a patient card to view detailed information
4. Use the "Set Next In Line" or "Rush Ambulance" options for critical cases
5. Monitor vital signs and triage updates in real-time

## Triage Status Levels

- **Critical** (Red): Immediate medical attention required
- **High** (Orange): Urgent care needed, significant concern
- **Medium** (Yellow): Moderate concern, needs attention soon
- **Low** (Green): Stable condition, routine care appropriate

## Future Development

- **Database Integration**: Connect to permanent storage for patient data
- **User Authentication**: Secure login for patients and medical staff
- **Notifications**: Alert system for critical changes in patient status
- **Telemedicine Integration**: Direct connection to healthcare providers
- **Machine Learning**: Enhanced symptom analysis and prediction


## Acknowledgments

- All the open-source libraries that made this project possible
- Healthcare professionals who provided domain expertise
- UI/UX research on emergency healthcare systems

---

*Note: This is a prototype application intended for demonstration purposes. It is not a substitute for professional medical advice, diagnosis, or treatment.*