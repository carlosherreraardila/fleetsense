# Test Cases — Authentication & Access Control

**Feature:** FleetSense authentication, role-based access, and route protection
**Related automated suite:** `tests/e2e/login.spec.ts`

Each case below is traced to its automated counterpart via the **Automated test** field. Cases without automation are flagged for future coverage.

---

## TC-AUTH-001 — Admin logs in successfully

| Field | Value |
| --- | --- |
| **Priority** | Critical |
| **Type** | Functional, positive |
| **Preconditions** | App is reachable; user `admin` exists with a valid password |
| **Automated test** | `admin inicia sesión y ve el dashboard con su rol` |

**Steps**

1. Navigate to `/login`.
2. Enter username `admin` and password `admin123`.
3. Click **Ingresar**.

**Expected result**

- The user is redirected to `/dashboard`.
- The dashboard displays the current role as `admin`.
- A session token is persisted for the session.

---

## TC-AUTH-002 — Viewer logs in with read-only role

| Field | Value |
| --- | --- |
| **Priority** | High |
| **Type** | Functional, positive |
| **Preconditions** | User `viewer` exists with a valid password |
| **Automated test** | `viewer inicia sesión y ve el dashboard con su rol` |

**Steps**

1. Navigate to `/login`.
2. Enter username `viewer` and password `viewer123`.
3. Click **Ingresar**.

**Expected result**

- The user is redirected to `/dashboard`.
- The dashboard displays the current role as `viewer`.

---

## TC-AUTH-003 — Invalid credentials are rejected

| Field | Value |
| --- | --- |
| **Priority** | Critical |
| **Type** | Functional, negative |
| **Preconditions** | App is reachable |
| **Automated test** | `credenciales inválidas muestran error y no permiten entrar` |

**Steps**

1. Navigate to `/login`.
2. Enter username `admin` and an incorrect password.
3. Click **Ingresar**.

**Expected result**

- An error message is displayed: "Usuario o contraseña incorrectos".
- The user remains on `/login`.
- No session token is created.

---

## TC-AUTH-004 — Protected route redirects unauthenticated users

| Field | Value |
| --- | --- |
| **Priority** | Critical |
| **Type** | Security / access control |
| **Preconditions** | No active session (clean browser state) |
| **Automated test** | `una ruta protegida redirige al login sin sesión` |

**Steps**

1. With no session, navigate directly to `/dashboard` via URL.

**Expected result**

- The user is redirected to `/login`.
- No dashboard content is rendered at any point.

---

## TC-AUTH-005 — User can log out

| Field | Value |
| --- | --- |
| **Priority** | High |
| **Type** | Functional, positive |
| **Preconditions** | User is logged in |
| **Automated test** | `el usuario puede cerrar sesión` |

**Steps**

1. Log in as `admin`.
2. Click **Cerrar sesión**.

**Expected result**

- The session token is cleared.
- The user is redirected to `/login`.
- Navigating back to `/dashboard` redirects to `/login` again.

---

## Candidate cases for future coverage (not yet automated)

| ID | Title | Priority | Notes |
| --- | --- | --- | --- |
| TC-AUTH-006 | Session persists across page refresh | High | Verify token survives a reload |
| TC-AUTH-007 | Expired / tampered token is rejected | Critical | Relevant once real JWT validation is added |
| TC-AUTH-008 | Viewer cannot see admin-only actions | High | Pairs with the export feature (role-gated UI) |
| TC-AUTH-009 | Empty username or password is handled | Medium | Field-level validation / edge case |