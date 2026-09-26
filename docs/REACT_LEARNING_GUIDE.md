# React Learning Guide

This guide turns the MyBlogs frontend into a practical React curriculum. The goal is not to memorise syntax; it is to understand why each part of the application exists and to be able to change it independently.

## 1. Component Composition

Start with `src/pages/Dashboard.js`. It is now a page-level coordinator instead of one large component. It composes:

- `ServiceSummary` for cross-service status
- `NotificationCenter` for Kafka-backed user notifications
- `PostComposer` for controlled post creation
- `PostFeed` and `PostCard` for searching, paging, editing, deleting, and commenting

Be able to explain:

- Why a page should coordinate features instead of containing every implementation detail
- How props move data and callbacks from parent to child
- Why smaller components are easier to test and reuse

Exercise: add a `PostStatistics` component that shows the number of posts on the current page and the number owned by the signed-in user.

## 2. State And Controlled Forms

`PostComposer` and `PostCard` use controlled inputs: React state is the source of truth and every input change updates that state.

Be able to explain:

- `useState`
- Controlled versus uncontrolled inputs
- Immutable object updates with the spread operator
- Client-side validation versus backend validation
- Disabled and submitting states that prevent duplicate requests

Exercise: display a validation message below the title before submission when it has fewer than five characters.

## 3. Effects And Server State

`src/features/dashboard/useDashboard.js` loads the profile, categories, posts, and notifications through effects.

Be able to explain:

- Why API calls are side effects
- Dependency arrays
- Cleanup guards for components that unmount during a request
- The difference between local UI state and server state
- Why loading, empty, success, and error states all matter

Exercise: refresh the notification list every 30 seconds and clean up the timer when the dashboard unmounts.

## 4. Custom Hooks

`useDashboard` groups related state and behaviour behind one reusable interface. The page does not need to know how each API operation is implemented.

Be able to explain:

- Why custom hook names start with `use`
- How a hook can combine state, effects, memoisation, and service calls
- Why business workflows should not be duplicated across components
- When a hook has become too large and should be split again

Exercise: extract notification state and actions into a dedicated `useNotifications` hook.

## 5. Context And Authentication

`src/context/AuthContext.jsx` exposes `authenticated`, `signIn`, and `signOut` to the component tree. `CustomNavbar`, `ProtectedRoute`, `Login`, and `Dashboard` consume the same authentication state.

Be able to explain:

- The problem Context solves
- Why Context is suitable for authentication but not automatically suitable for all application state
- How `ProtectedRoute` performs declarative navigation
- How the custom browser event keeps local token storage and React state synchronized

Security note: the current portfolio application stores its JWT in local storage. For a production system, discuss secure, `HttpOnly`, `Secure`, and `SameSite` cookies with the backend team to reduce token exposure to cross-site scripting.

Exercise: add the signed-in user's name to the navigation bar without making another API request.

## 6. Axios Interceptors

`src/services/helper.js` centralises HTTP concerns:

- The base gateway URL
- JSON headers
- JWT attachment before a request
- Session clearing after an authenticated `401` response

Be able to explain why adding an Authorization header separately in every service method causes duplication and inconsistency.

Exercise: add a response interceptor that reads the gateway correlation ID and logs it only in development mode.

## 7. Immutable Collection Updates

The dashboard updates arrays with `map`, `filter`, and spread syntax. Examples include replacing an edited post, removing a deleted comment, and changing one notification to read.

Be able to explain why directly mutating a state array can prevent predictable rendering.

Exercise: add a "mark all visible notifications as read" action using `Promise.all` and an immutable state update.

## 8. Routing

`src/App.js` declares public and protected routes with React Router.

Be able to explain:

- `BrowserRouter`, `Routes`, and `Route`
- `Navigate` versus `useNavigate`
- Why Nginx must fall back to `index.html` for a direct request to `/dashboard`

Exercise: add a public `/posts/:postId` route that loads a single post using the existing backend endpoint.

## 9. Testing Behaviour

`Dashboard.test.js` uses React Testing Library to verify outcomes visible to a user rather than component internals. API functions are mocked at the service boundary.

Current scenarios cover:

- Loading data owned by multiple services
- Creating posts and comments
- Searching and editing an owned post
- Confirming and deleting an owned post or comment
- Rendering Kafka notifications and marking one as read
- Registration validation
- Application routing

Be able to explain `render`, `screen`, `fireEvent`, async `findBy` queries, and `waitFor`.

Exercise: add a pagination test that moves to the next page and verifies the requested `pageNo`.

## 10. Suggested Study Sequence

1. Trace `App` to `ProtectedRoute` to `Dashboard`.
2. Trace login from the controlled form to `AuthContext` and local storage.
3. Trace a post list request from `useDashboard` to `blog-service` and the Axios interceptor.
4. Trace the resulting state into `PostFeed` and `PostCard` props.
5. Trace a Kafka notification from the backend event to the notification API and UI read state.
6. Run the tests, deliberately break one behaviour, and explain the failure.

Useful commands:

```bash
npm run test:ci
npm run build
docker compose up --build
```

## Interview Positioning

After you can complete the exercises and explain the flows without reading the files, describe this as hands-on personal-project React experience. Keep commercial Java/Spring experience separate from personal React experience. A strong summary is:

> Built and tested a React client for a Spring Boot microservices platform using Context-based authentication, protected routing, reusable components and custom hooks, REST integration, server-side search and pagination, CRUD workflows, and Kafka-backed notifications.
