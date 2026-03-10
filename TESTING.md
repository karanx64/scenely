# TESTING.md - Scenely Test Suite

## Table of Contents
1. [Testing Strategy](#testing-strategy)
2. [Manual Test Cases](#manual-test-cases)
3. [Automated Tests Setup](#automated-tests-setup)
4. [Test Data & Fixtures](#test-data--fixtures)
5. [Performance Testing](#performance-testing)
6. [Security Testing](#security-testing)

---

## Testing Strategy

### Test Pyramid

```
        /\
       /  \      E2E Tests (10%)
      /----\     Integration Tests (30%)
     /------\    Unit Tests (60%)
    /________\
```

### Coverage Goals
- **Unit Tests:** 60% - Test individual functions and components
- **Integration Tests:** 30% - Test feature flows and API interactions
- **E2E Tests:** 10% - Test critical user journeys
- **Manual Tests:** Always - UX, visual, and exploratory testing

---

## Manual Test Cases

### 1. Authentication Flow

#### Test Case 1.1: User Registration
**Priority:** Critical  
**Preconditions:** None

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to `/register` | Registration form displays | ☐ |
| 2 | Enter username: "testuser123" | Input accepted | ☐ |
| 3 | Enter email: "test@example.com" | Input accepted | ☐ |
| 4 | Enter password: "password123" | Input accepted, masked | ☐ |
| 5 | Click "Register" | Loading state shows | ☐ |
| 6 | Wait for response | Success message appears | ☐ |
| 7 | Auto redirect | Redirects to `/select-avatar` | ☐ |

**Test Data:**
- Valid username: `testuser123`
- Valid email: `test@example.com`
- Valid password: `password123`

**Edge Cases:**
- [ ] Empty fields show validation errors
- [ ] Duplicate email shows error
- [ ] Weak password rejected
- [ ] Special characters in username handled

---

#### Test Case 1.2: User Login
**Priority:** Critical  
**Preconditions:** User already registered

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to `/login` | Login form displays | ☐ |
| 2 | Enter registered email | Input accepted | ☐ |
| 3 | Enter correct password | Input accepted, masked | ☐ |
| 4 | Click "Login" | Loading state shows | ☐ |
| 5 | Wait for response | Redirects to home `/` | ☐ |
| 6 | Check auth state | User avatar visible in sidebar | ☐ |

**Edge Cases:**
- [ ] Wrong password shows error
- [ ] Non-existent email shows error
- [ ] Already logged in redirects to home
- [ ] Session persists after page refresh

---

#### Test Case 1.3: Avatar Selection
**Priority:** High  
**Preconditions:** User registered, no avatar set

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to `/select-avatar` | Upload interface displays | ☐ |
| 2 | Click file input | File picker opens | ☐ |
| 3 | Select image (JPG/PNG) | Image preview shows | ☐ |
| 4 | Adjust crop area | Crop overlay moves | ☐ |
| 5 | Adjust zoom (1.0 - 3.0) | Image zooms smoothly | ☐ |
| 6 | Click "Save and Continue" | Uploading state shows | ☐ |
| 7 | Wait for upload | Redirects to home `/` | ☐ |
| 8 | Check avatar | Avatar displays in sidebar | ☐ |

**Edge Cases:**
- [ ] Large file (>10MB) handled/rejected
- [ ] Invalid file type rejected
- [ ] Portrait image shows warning
- [ ] Upload failure shows error message

---

### 2. Post Creation Flow

#### Test Case 2.1: Single Image Post
**Priority:** Critical  
**Preconditions:** User logged in

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to `/upload` | Upload form displays | ☐ |
| 2 | Click file input | File picker opens | ☐ |
| 3 | Select 1 image | Preview shows | ☐ |
| 4 | Click "Continue" | Crop interface shows | ☐ |
| 5 | Adjust crop to square | Crop overlay adjusts | ☐ |
| 6 | Click "Continue" | Review screen shows | ☐ |
| 7 | Search movie: "Inception" | Search results appear | ☐ |
| 8 | Select "Inception (2010)" | Movie data fills in | ☐ |
| 9 | Enter caption: "Dream within a dream" | Text appears | ☐ |
| 10 | Select emoji: 😱 | Emoji selected | ☐ |
| 11 | Click "Post" | Uploading state shows | ☐ |
| 12 | Wait for upload | Redirects to `/profile` | ☐ |
| 13 | Verify post | Post appears in profile | ☐ |

**Edge Cases:**
- [ ] No movie selected shows error
- [ ] Empty caption allowed
- [ ] Special characters in caption handled
- [ ] Very long caption handled

---

#### Test Case 2.2: Multiple Image Post
**Priority:** High  
**Preconditions:** User logged in

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to `/upload` | Upload form displays | ☐ |
| 2 | Select 5 images at once | All previews show | ☐ |
| 3 | Crop image 1 | Individual crop interface | ☐ |
| 4 | Click "Next" | Moves to image 2 | ☐ |
| 5 | Crop images 2-5 | Each crops independently | ☐ |
| 6 | Click "Continue" on last | Review shows all 5 | ☐ |
| 7 | Navigate between images | Carousel works | ☐ |
| 8 | Add metadata and post | All images upload | ☐ |
| 9 | View post | Carousel shows on post | ☐ |

**Edge Cases:**
- [ ] Uploading 10+ images
- [ ] Mixed file types
- [ ] Skipping crop on one image shows error
- [ ] Upload fails on one image shows which

---

### 3. Social Features

#### Test Case 3.1: Like/Unlike Post
**Priority:** High  
**Preconditions:** User logged in, posts exist

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to `/` home | Posts display | ☐ |
| 2 | Find unliked post | Heart icon empty | ☐ |
| 3 | Note like count (e.g., 5) | Count visible | ☐ |
| 4 | Click heart icon | Icon fills red | ☐ |
| 5 | Check count | Increases to 6 | ☐ |
| 6 | Click heart again | Icon empties | ☐ |
| 7 | Check count | Decreases to 5 | ☐ |
| 8 | Refresh page | Like state persists | ☐ |

**Edge Cases:**
- [ ] Rapid clicking (debouncing works)
- [ ] Offline like queues
- [ ] Like count never goes negative

---

#### Test Case 3.2: Follow/Unfollow User
**Priority:** High  
**Preconditions:** Two users exist

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Login as User A | Home page loads | ☐ |
| 2 | Search for User B | User B appears in results | ☐ |
| 3 | Click User B | Profile page loads | ☐ |
| 4 | Note follower count (e.g., 10) | Count visible | ☐ |
| 5 | Click "Follow" | Button changes to "Unfollow" | ☐ |
| 6 | Check follower count | Increases to 11 | ☐ |
| 7 | Click "Unfollow" | Button changes to "Follow" | ☐ |
| 8 | Check follower count | Decreases to 10 | ☐ |
| 9 | Logout and login as User B | Home loads | ☐ |
| 10 | Check followers list | User A appears/disappears | ☐ |

**Edge Cases:**
- [ ] Cannot follow yourself
- [ ] Following count updates correctly
- [ ] Followers modal shows correct users

---

#### Test Case 3.3: View Post Details
**Priority:** Medium  
**Preconditions:** User logged in, posts exist

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to home | Posts display | ☐ |
| 2 | View a post | View count increases after 2s | ☐ |
| 3 | Check view count | Shows +1 | ☐ |
| 4 | Refresh page | View count doesn't increase again | ☐ |
| 5 | Open incognito window | Navigate to same post | ☐ |
| 6 | Wait 2 seconds | View count increases | ☐ |

**Edge Cases:**
- [ ] View count unique per user/session
- [ ] Anonymous views tracked
- [ ] View persists across sessions

---

### 4. Messaging System

#### Test Case 4.1: Send Message
**Priority:** Critical  
**Preconditions:** Two users logged in

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | User A: Navigate to `/messages` | Messages page loads | ☐ |
| 2 | Search for User B | User B appears | ☐ |
| 3 | Click User B | Conversation opens | ☐ |
| 4 | Type: "Hello User B!" | Text appears in input | ☐ |
| 5 | Press Enter | Message sends | ☐ |
| 6 | Check conversation | Message appears on right | ☐ |
| 7 | User B: Open messages | New conversation appears | ☐ |
| 8 | User B: Click conversation | Message visible on left | ☐ |

**Edge Cases:**
- [ ] Empty message not sent
- [ ] Very long message handled
- [ ] Special characters work
- [ ] Emoji support works

---

#### Test Case 4.2: Real-time Message Delivery
**Priority:** Critical  
**Preconditions:** Two users in same conversation

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Open two browser windows | Both logged in different users | ☐ |
| 2 | Window 1: Open conversation | Conversation loads | ☐ |
| 3 | Window 2: Open same conversation | Conversation loads | ☐ |
| 4 | Window 1: Send message | Message appears in Window 1 | ☐ |
| 5 | Check Window 2 | Message appears INSTANTLY | ☐ |
| 6 | Window 2: Send reply | Reply appears in Window 2 | ☐ |
| 7 | Check Window 1 | Reply appears INSTANTLY | ☐ |

**Timing:**
- Messages should appear in < 500ms
- No refresh required
- Scroll to bottom automatic

---

#### Test Case 4.3: Delete Conversation
**Priority:** Medium  
**Preconditions:** User has conversations

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to `/messages` | Conversations list shows | ☐ |
| 2 | Find conversation | Conversation visible | ☐ |
| 3 | Click delete icon | Confirmation appears (optional) | ☐ |
| 4 | Confirm delete | Conversation disappears | ☐ |
| 5 | Refresh page | Conversation stays deleted | ☐ |
| 6 | Login as other user | Their copy still exists | ☐ |

---

### 5. Profile & Settings

#### Test Case 5.1: View Own Profile
**Priority:** High  
**Preconditions:** User logged in with posts

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click profile icon/link | Profile page loads | ☐ |
| 2 | Check avatar | User's avatar displays | ☐ |
| 3 | Check username | Correct username shows | ☐ |
| 4 | Check email | Email displays | ☐ |
| 5 | Check posts | All user's posts show | ☐ |
| 6 | Check followers count | Correct count shows | ☐ |
| 7 | Check following count | Correct count shows | ☐ |

---

#### Test Case 5.2: Delete Account
**Priority:** Critical  
**Preconditions:** User logged in

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to `/settings` | Settings page loads | ☐ |
| 2 | Scroll to "Danger Zone" | Delete button visible | ☐ |
| 3 | Click "Delete Account" | Confirmation modal appears | ☐ |
| 4 | Confirm deletion | Account deletion processes | ☐ |
| 5 | Wait for completion | Redirects to `/register` | ☐ |
| 6 | Try to login | Login fails (account gone) | ☐ |
| 7 | Check database (Studio) | User gone from users table | ☐ |
| 8 | Check auth users | User gone from auth.users | ☐ |
| 9 | Check posts | All posts deleted (cascade) | ☐ |

**Edge Cases:**
- [ ] Posts deleted cascade
- [ ] Likes deleted cascade
- [ ] Follows deleted cascade
- [ ] Messages deleted cascade

---

### 6. Search & Discovery

#### Test Case 6.1: Search Users
**Priority:** Medium  
**Preconditions:** Multiple users exist

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to `/explore` | Explore page loads | ☐ |
| 2 | Type in search: "test" | Search box updates | ☐ |
| 3 | Click search icon | Results appear | ☐ |
| 4 | Verify results | All "test*" users show | ☐ |
| 5 | Click a user | Navigates to their profile | ☐ |
| 6 | Click clear button | Results clear | ☐ |

**Edge Cases:**
- [ ] Case-insensitive search
- [ ] Partial match works
- [ ] No results shows message
- [ ] Special characters handled

---

### 7. Responsive Design

#### Test Case 7.1: Mobile Navigation
**Priority:** High  
**Preconditions:** User logged in

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Resize browser to 375px width | Mobile view activates | ☐ |
| 2 | Check sidebar | Sidebar hidden | ☐ |
| 3 | Check bottom nav | Bottom nav visible | ☐ |
| 4 | Click each nav item | Navigation works | ☐ |
| 5 | Scroll page | Bottom nav stays fixed | ☐ |

---

#### Test Case 7.2: Tablet View
**Priority:** Medium  
**Preconditions:** User logged in

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Resize to 768px width | Tablet view activates | ☐ |
| 2 | Check sidebar | Sidebar visible/collapsed | ☐ |
| 3 | Check post grid | 2-3 columns show | ☐ |
| 4 | Test all pages | Layouts adapt correctly | ☐ |

---

## Automated Tests Setup

### Frontend Testing (Vitest + React Testing Library)

**Install dependencies:**
```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Create `frontend/vite.config.js` test config:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
  },
})
```

**Create `frontend/src/tests/setup.js`:**
```javascript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
```

---

### Sample Unit Tests

**`frontend/src/tests/components/PostCard.test.jsx`:**
```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PostCard from '../../components/PostCard'

const mockPost = {
  id: '123',
  image_urls: ['https://example.com/image.jpg'],
  caption: 'Test caption',
  emoji: '😀',
  users: {
    username: 'testuser',
    avatar: 'https://example.com/avatar.jpg'
  }
}

describe('PostCard', () => {
  it('renders post caption', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Test caption')).toBeInTheDocument()
  })

  it('renders post image', () => {
    render(<PostCard post={mockPost} />)
    const img = screen.getByAltText(/Post/)
    expect(img).toHaveAttribute('src', mockPost.image_urls[0])
  })

  it('shows username', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('displays emoji', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('😀')).toBeInTheDocument()
  })
})
```

---

**`frontend/src/tests/contexts/AuthContext.test.jsx`:**
```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => 
        Promise.resolve({ data: { session: null } })
      ),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    }
  }
}))

function TestComponent() {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>
  return <div>Logged in as {user.email}</div>
}

describe('AuthContext', () => {
  it('provides auth state to children', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument()
    })
  })
})
```

---

### Integration Tests

**`frontend/src/tests/integration/login.test.jsx`:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../../pages/Login'
import { supabase } from '../../lib/supabase'

vi.mock('../../lib/supabase')

describe('Login Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('successfully logs in user', async () => {
    const mockUser = { email: 'test@example.com' }
    
    supabase.auth.signInWithPassword = vi.fn(() =>
      Promise.resolve({ data: { user: mockUser }, error: null })
    )

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('shows error on invalid credentials', async () => {
    supabase.auth.signInWithPassword = vi.fn(() =>
      Promise.resolve({ 
        data: null, 
        error: { message: 'Invalid credentials' } 
      })
    )

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
})
```

---

### Backend API Tests

**Install dependencies:**
```bash
cd backend
npm install -D vitest supertest
```

**`backend/tests/routes/posts.test.js`:**
```javascript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../server.js'
import { supabase } from '../config/supabase.js'

describe('Posts API', () => {
  let authToken
  let testUserId

  beforeAll(async () => {
    // Create test user and get token
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpass123'
    })
    testUserId = data.user.id
    authToken = data.session.access_token
  })

  afterAll(async () => {
    // Cleanup: delete test user
    await supabase.from('users').delete().eq('id', testUserId)
  })

  it('GET /api/posts returns posts', async () => {
    const response = await request(app)
      .get('/api/posts')
      .expect(200)

    expect(Array.isArray(response.body)).toBe(true)
  })

  it('POST /api/posts creates a post', async () => {
    const newPost = {
      imageUrls: ['https://example.com/test.jpg'],
      caption: 'Test post',
      emoji: '😀',
      tags: ['test'],
      media: { title: 'Test Movie', type: 'movie' }
    }

    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newPost)
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.caption).toBe('Test post')
  })

  it('POST /api/posts requires auth', async () => {
    const newPost = {
      imageUrls: ['https://example.com/test.jpg'],
      caption: 'Test post'
    }

    await request(app)
      .post('/api/posts')
      .send(newPost)
      .expect(401)
  })
})
```

---

### Run Tests

**Add to `package.json`:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Run:**
```bash
npm test                    # Run all tests
npm run test:ui            # Visual test UI
npm run test:coverage      # Coverage report
```

---

## Test Data & Fixtures

### Sample Users
```javascript
export const testUsers = [
  {
    username: 'alice',
    email: 'alice@example.com',
    password: 'password123'
  },
  {
    username: 'bob',
    email: 'bob@example.com',
    password: 'password123'
  },
  {
    username: 'charlie',
    email: 'charlie@example.com',
    password: 'password123'
  }
]
```

### Sample Posts
```javascript
export const testPosts = [
  {
    image_urls: ['https://picsum.photos/800/800?random=1'],
    caption: 'Beautiful sunset scene',
    emoji: '🌅',
    media: {
      title: 'Blade Runner 2049',
      type: 'movie',
      year: 2017
    }
  },
  {
    image_urls: [
      'https://picsum.photos/800/800?random=2',
      'https://picsum.photos/800/800?random=3'
    ],
    caption: 'Epic battle sequence',
    emoji: '⚔️',
    media: {
      title: 'Game of Thrones',
      type: 'tv',
      year: 2011
    }
  }
]
```

### Seed Script

**`supabase/seed.sql`:**
```sql
-- Insert test users (passwords will be hashed by Supabase Auth)
-- Insert via auth.users, then add profiles

-- Insert test posts
INSERT INTO posts (user_id, image_urls, caption, emoji, media) VALUES
  (
    (SELECT id FROM users WHERE username = 'alice' LIMIT 1),
    ARRAY['https://picsum.photos/800/800?random=1'],
    'Test post 1',
    '😀',
    '{"title": "Inception", "type": "movie", "year": 2010}'::jsonb
  ),
  (
    (SELECT id FROM users WHERE username = 'bob' LIMIT 1),
    ARRAY['https://picsum.photos/800/800?random=2', 'https://picsum.photos/800/800?random=3'],
    'Test post 2',
    '🎬',
    '{"title": "Breaking Bad", "type": "tv", "year": 2008}'::jsonb
  );
```

---

## Performance Testing

### Load Testing with k6

**Install k6:**
```bash
# macOS
brew install k6

# Windows
choco install k6

# Linux
sudo apt-get install k6
```

**`tests/load/posts.js`:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 0 },   // Ramp down to 0
  ],
};

export default function () {
  // Test GET /api/posts
  let response = http.get('http://localhost:5000/api/posts');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

**Run:**
```bash
k6 run tests/load/posts.js
```

---

### Performance Benchmarks

**Target Metrics:**
- **Page Load:** < 2s
- **API Response:** < 300ms
- **Real-time Message Delivery:** < 500ms
- **Image Upload:** < 5s per image
- **Search Results:** < 1s

---

## Security Testing

### Checklist

#### Authentication
- [ ] Passwords hashed (Supabase handles this)
- [ ] Session tokens expire appropriately
- [ ] Cannot access protected routes without auth
- [ ] Logout clears session completely

#### Authorization (RLS)
- [ ] Users can only delete their own posts
- [ ] Users can only see their own messages
- [ ] Cannot modify other users' profiles
- [ ] Follow/unfollow respects permissions

#### Input Validation
- [ ] XSS prevention (React escapes by default)
- [ ] SQL injection prevented (Supabase parameterized queries)
- [ ] File upload size limits enforced
- [ ] File type validation works

#### Data Privacy
- [ ] User emails not exposed in public queries
- [ ] Deleted accounts fully removed
- [ ] Deleted posts fully removed
- [ ] Private messages remain private

---

### SQL Injection Test

**Test RLS policies:**
```sql
-- In Supabase Studio SQL Editor
-- Set role to authenticated user
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO 'user-uuid-here';

-- Try to access other users' data
SELECT * FROM messages WHERE recipient_id != 'user-uuid-here';
-- Should return empty (blocked by RLS)

-- Try to delete other users' posts
DELETE FROM posts WHERE user_id != 'user-uuid-here';
-- Should fail (blocked by RLS)
```

---

## CI/CD Integration

### GitHub Actions Example

**`.github/workflows/test.yml`:**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install
          cd frontend && npm install
          cd ../backend && npm install
      
      - name: Run frontend tests
        run: cd frontend && npm test
      
      - name: Run backend tests
        run: cd backend && npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Testing Checklist

### Before Each Release

- [ ] All manual test cases pass
- [ ] Unit test coverage > 60%
- [ ] No console errors in production build
- [ ] All critical user flows tested
- [ ] Mobile responsive design verified
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Performance benchmarks met
- [ ] Security checklist completed
- [ ] Database migrations tested
- [ ] Real-time features verified

---

## Known Issues & Edge Cases

### Current Limitations
1. **Real-time subscriptions** - May disconnect on poor network
2. **Image uploads** - Large files (>10MB) may timeout
3. **Search** - Only searches usernames, not full profiles
4. **Messages** - No read receipts implemented
5. **Notifications** - No push notifications

### Future Test Cases
- [ ] Offline mode behavior
- [ ] Network error recovery
- [ ] Concurrent edits handling
- [ ] Rate limiting tests
- [ ] Accessibility (WCAG) compliance

---

## Resources

- **Vitest:** https://vitest.dev/
- **React Testing Library:** https://testing-library.com/react
- **Supabase Testing:** https://supabase.com/docs/guides/testing
- **k6 Load Testing:** https://k6.io/docs/

---

## Contributing Test Cases

When adding new features:
1. Write test cases first (TDD approach)
2. Add to manual test suite
3. Create automated tests
4. Update this document
5. Run full test suite before PR

**Test Coverage Target:** 70%+ for new code

---

**Last Updated:** March 2026  
**Test Suite Version:** 1.0.0
