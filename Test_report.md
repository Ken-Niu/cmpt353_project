# Test Report

This project is  using manual test cases

### TC-01: User Registration
- **Steps**: Go to /register, fill email, display name, password, submit
- **Expected**: Redirected to home, navbar shows "Hi, [name]"
- **Result**: PASS

### TC-02: User Login
- **Steps**: Go to /login, enter admin@example.com / admin123
- **Expected**: Redirected to home, navbar shows "Hi, Admin"
- **Result**: PASS

### TC-03: Create Channel (Not Logged In)
- **Steps**: Logout, go to home page
- **Expected**: No "+ New Channel" button visible
- **Result**: PASS

### TC-04: Create Channel (Logged In)
- **Steps**: Login, click "+ New Channel", fill name, submit
- **Expected**: Channel appears in list
- **Result**: PASS

### TC-05: Create Post
- **Steps**: Login, open channel, click "+ New Post", fill title and body, submit
- **Expected**: Post appears in channel with author name
- **Result**: PASS

### TC-06: Reply and Nested Reply
- **Steps**: Open post, write reply, submit. Then click Reply on that reply, submit
- **Expected**: Reply appears, nested reply indented under parent
- **Result**: PASS

### TC-07: Upload Screenshot
- **Steps**: Open post, select PNG under 5MB, click Reply
- **Expected**: Image displayed in reply
- **Result**: PASS

### TC-08: Vote on Post
- **Steps**: Login, click ▲ on a post, then ▼
- **Expected**: Score updates correctly
- **Result**: PASS

### TC-09: Search Content
- **Steps**: Go to /search, type keyword, click Search
- **Expected**: Matching posts and replies shown with links
- **Result**: PASS

### TC-10: Admin Moderation
- **Steps**: Login as admin, go to /admin, delete a user, channel, and post
- **Expected**: Items removed after confirmation dialog
- **Result**: PASS