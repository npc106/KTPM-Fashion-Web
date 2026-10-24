# KTPM-Fashion-Web

## Frontend login scaffold

The first frontend slice is a React + TypeScript login screen built with Vite.
It intentionally uses a mock authentication adapter because the User Service and
database are not available yet.

### Run locally

```powershell
npm install
npm run dev
```

Open the URL printed by Vite. The demo account is:

```text
Email:    demo@example.com
Password: password123
```

### Frontend structure

```text
src/
├── features/
│   └── auth/
│       ├── auth.api.ts         # Replace mock login with the User Service client
│       ├── auth.types.ts       # Request/session/error contracts
│       └── auth.validation.ts  # Client-side validation only
├── i18n.ts                     # Vietnamese/English UI translations
├── App.tsx                     # Login page composition
├── main.tsx
└── styles.css
```

### Connecting the real backend later

Replace `src/features/auth/auth.api.ts` with an HTTP client that calls the
agreed API contract, for example:

```text
POST /api/auth/login
Content-Type: application/json
Accept-Language: vi
```

The UI expects a session containing an access token and a user role. Token
storage, refresh-token handling and route protection should be implemented
centrally after the User Service contract is finalized. Client-side validation
must not replace validation and authorization in the backend.