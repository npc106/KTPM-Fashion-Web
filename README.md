# KTPM-Fashion-Web

## Frontend storefront prototype

The current frontend slice is a React + TypeScript storefront prototype built
with Vite. It includes the reference screens from `Hình/`: login, product
listing/filtering, product details with cart summary, and order overview. The
shopping data remains mocked so the team can review the UI before the User,
Product, Cart and Order Services exist.

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

After signing in, use:

```text
Email:    demo@example.com
Password: password123
```

The storefront currently mocks:

- Reference-style product listing with left-side filters.
- Product search and category filtering.
- Product detail screen with size, color and quantity controls.
- Add-to-bag, cart summary, quantity changes and subtotal calculation.
- Customer order cards and an admin order-summary preview.
- Vietnamese/English labels for the shopping flow.

### Frontend structure

```text
src/
├── features/
│   └── auth/
│       ├── auth.api.ts         # Replace mock login with the User Service client
│       ├── auth.types.ts       # Request/session/error contracts
│       └── auth.validation.ts  # Client-side validation only
│   └── catalog/
│       ├── CatalogPage.tsx     # Storefront, product details and cart preview
│       └── catalog.mock.ts     # Typed product data used until Product Service exists
├── i18n.ts                     # Vietnamese/English UI translations
├── App.tsx                     # Login-to-storefront composition
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

The mock catalog is intentionally isolated in `src/features/catalog`. Replace
the `mockProducts` import with a Product Service adapter when the API contract
is ready. Keep the current `MockProduct` shape aligned with the eventual
`GET /api/products` response, including localized names/descriptions, variants,
price and inventory. Cart state should then move from component state into a
Cart Service client or an application-level store.
