# Developer Documentation for TriageNow

This guide provides detailed information for developers who want to understand, modify, or extend the TriageNow health triage application.

## Development Environment Setup

### Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- A code editor with TypeScript support (VS Code recommended)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/medisort.git
   cd medisort
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The application will be available at `http://localhost:5000`

## Architecture Overview

TriageNow follows a modern frontend architecture with a lightweight backend:

- **Frontend**: React with TypeScript using functional components and hooks
- **State Management**: Zustand for global state
- **Styling**: TailwindCSS for utility-first styling
- **Routing**: Wouter for lightweight client-side routing
- **Backend**: Express.js server with in-memory storage
- **Data Validation**: Zod for schema validation
- **Type Safety**: TypeScript throughout the stack
- **API Communication**: Tanstack Query for data fetching and caching

## Key Directories and Files

### Frontend (client/)

- `src/components/`: Reusable UI components
- `src/hooks/`: Custom React hooks
- `src/lib/`: Utility functions and API client
- `src/pages/`: Page components corresponding to routes
- `src/store/`: Zustand store definitions
- `src/App.tsx`: Main application component and routing
- `src/main.tsx`: Application entry point

### Backend (server/)

- `index.ts`: Server entry point
- `routes.ts`: API route definitions
- `storage.ts`: In-memory data storage implementation
- `vite.ts`: Vite server configuration

### Shared (shared/)

- `schema.ts`: Database schema and shared types

## State Management

The application uses Zustand for state management. The main store is defined in `client/src/store/index.ts` and includes:

1. **User Context**: Role selection and patient/staff flow
2. **Health Data**: Patient metrics, vital signs, and health statuses
3. **Questionnaire**: Patient symptom data and assessment results
4. **Chat Messages**: AI assistant interaction history

### Example of accessing the store:

```tsx
import useStore from '@/store';

function MyComponent() {
  const { role, patientOption, setRole, setPatientOption } = useStore();
  
  // Use state values and actions
}
```

## Component Architecture

Components follow a hierarchical structure:

1. **Page Components**: Top-level components for each route
2. **Layout Components**: Page structure with headers and navigation
3. **Feature Components**: Specific functional units (e.g., QuestionnaireModal)
4. **UI Components**: Reusable interface elements (buttons, cards, etc.)

### Component Best Practices

- Use functional components with hooks
- Leverage TypeScript interfaces for props
- Keep components focused on a single responsibility
- Extract reusable logic to custom hooks
- Use composition over inheritance

## API Structure

The backend API follows RESTful principles:

- `GET /api/patients`: Retrieve all patients
- `GET /api/patients/:id`: Get a specific patient
- `POST /api/patients`: Create a new patient
- `PATCH /api/patients/:id`: Update a patient
- `GET /api/health-metrics/:patientId`: Get health metrics for a patient
- `POST /api/health-metrics`: Create new health metrics
- `GET /api/triage/:patientId`: Get triage record for a patient
- `POST /api/triage`: Create a new triage record
- `PATCH /api/triage/:id`: Update a triage record

## Data Models

The key data models are defined in `shared/schema.ts`:

### User

Represents a system user (patient or medical staff).

### Patient

Contains patient identification and basic information.

### HealthMetrics

Stores vital sign measurements like heart rate, blood pressure, etc.

### TriageRecord

Tracks triage status, assessment results, and care priority.

## Adding New Features

### Adding a New Page

1. Create a new component in `client/src/pages/`
2. Add the route in `client/src/App.tsx`:
   ```tsx
   <Route path="/new-feature" component={NewFeaturePage} />
   ```

### Adding a New API Endpoint

1. Define the endpoint in `server/routes.ts`
2. Implement the necessary storage methods in `server/storage.ts`
3. Create front-end query functions in `client/src/lib/queryClient.ts`

### Adding New UI Components

1. Create the component in `client/src/components/`
2. Use TailwindCSS for styling
3. Define TypeScript interfaces for props
4. Export the component for use in other parts of the application

## Testing

### Running Tests

```bash
npm test
```

### Testing Strategy

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test interactions between components
- **E2E Tests**: Test complete user flows

## Build and Deployment

### Creating a Production Build

```bash
npm run build
```

This will generate optimized assets in the `dist/` directory.

### Deployment Considerations

- Set appropriate environment variables
- Configure a production database
- Set up proper authentication and authorization
- Implement HTTPS
- Consider containerization with Docker

## Performance Optimization

- Use React.memo for expensive components
- Leverage useMemo and useCallback for memoization
- Optimize API calls with React Query's caching
- Implement code splitting and lazy loading
- Use production builds with tree shaking

## Accessibility Guidelines

- Ensure semantic HTML structure
- Maintain appropriate color contrast
- Provide alt text for images
- Support keyboard navigation
- Test with screen readers
- Follow ARIA best practices

## Troubleshooting Common Issues

### API Connection Problems

- Check if the server is running
- Verify API endpoint URLs
- Check network tab in browser dev tools
- Look for CORS issues

### State Management Issues

- Check Zustand store configuration
- Verify component subscriptions to the store
- Use React DevTools to inspect component props

### Styling Problems

- Verify TailwindCSS classes
- Check for conflicting styles
- Inspect the computed styles in browser dev tools

## Contributing

Please follow these guidelines when contributing:

1. Follow the established code style and architecture
2. Write descriptive commit messages
3. Document new features or changes
4. Add appropriate tests
5. Submit pull requests against the development branch

## Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Express.js Documentation](https://expressjs.com/)