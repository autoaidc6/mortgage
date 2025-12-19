# System Architecture: SmartMortgage

## 1. High-Level Design
The application follows a client-side only architecture for maximum privacy and performance. All financial logic is decoupled from UI components.

## 2. Component Hierarchy
- `App`: Root component managing global view state and calculation triggers.
  - `InputGroup`: Reusable controlled input component.
  - `ResultsDashboard`: Displays summary and breakdown (integrated in App for layout efficiency).
  - `LegalViews`: (PrivacyPolicy, TermsOfService, Disclaimer) Lazy-switched views for documentation.
  - `MortgageChart`: Data visualization using Recharts.

## 3. Service Layer
- `mortgageCalculator.ts`: Pure functional service that takes `MortgageInputs` and returns `MortgageResults`.
- Uses a month-by-month simulation to handle the "Accelerated Scenario" vs "Standard Scenario".

## 4. Data Flow
1. User interacts with UI (inputs).
2. State updates in `App.tsx`.
3. `useMemo` triggers `calculateMortgage` service.
4. Results are derived and passed down to display components.
5. On user request, results are sent to Gemini API for context-aware interpretation.

## 5. State Management
- **React State**: Local component state for form inputs and view routing.
- **Derived State**: Calculation results are derived using `useMemo` to prevent unnecessary re-computations.

## 6. Integrations
- **Google Gemini API**: Utilized for generating the "Smart AI Insight" feature.
- **Lucide React**: Vector icon set for visual cues.
