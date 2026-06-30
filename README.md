# scenely

## Table of Contents

- [Description](#description)
- [Showcase](#showcase)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [License](#license)

## Description

scenely; a social /s media platform built for cinephiles and otakus to share the screenshots of the media they are watching and find scenes worthy of sharing with other like minded individuals. no comments. no negativity.

## Showcase

**Register Page**|**Login Page**
|:--:|:--:|
<img width="1920" height="1080" alt="Screenshot from 2026-06-28 20-29-19" src="https://github.com/user-attachments/assets/fcd8ca5b-ec49-4827-b28c-865ff2a43822" />|<img width="1920" height="1080" alt="Screenshot from 2026-06-28 20-29-15" src="https://github.com/user-attachments/assets/bab4c88a-6f1d-475e-bb94-02f7e79a9850" />
**Upload Page**|**Home Page**
<img width="1920" height="1080" alt="Screenshot from 2026-06-28 00-16-33" src="https://github.com/user-attachments/assets/518258ff-9b5d-4a80-ac6b-4608e74a1127" />|<img width="1920" height="1080" alt="Screenshot from 2026-06-28 16-20-41" src="https://github.com/user-attachments/assets/8618ccfe-c95e-494e-b6d8-638720ff0f44" />
**Messages**|**Settings**
<img width="1920" height="1080" alt="Screenshot from 2026-06-28 16-20-28" src="https://github.com/user-attachments/assets/0a8fe3a0-1f22-41ac-8853-e7f5d5823143" />|<img width="1920" height="1080" alt="Screenshot from 2026-06-28 16-20-13" src="https://github.com/user-attachments/assets/ef7e27b8-e8e3-4e7c-8a06-ca908493ed1e" />
**Profile**|
<img width="1920" height="1080" alt="Screenshot from 2026-06-28 16-20-06" src="https://github.com/user-attachments/assets/4df25455-33c6-42f0-b6a8-0436b1867119" />|




## Tech Stack

- **Node.js, Express.js**
- **React.js**
- **Tailwind CSS, daisyUI, lucide icons**
- **mongodb**

**Notable libraries:** cloudinary, multer

## Quick Start


1. Clone the repository
```bash
git clone https://github.com/karanx64/scenely.git
```

 2. Install dependencies
```bash
cd scenely && npm i
cd frontend && npm i
cd ..
cd backend && npm i
```
 3. Create ```.env``` file and copy environment variables from ```env.sample``` and replace placeholder values with real values, i.e. create mongodb database and cloudinary cloud and appropriate presets.


 4. Start the dev server (from scenely/ folder.)
    Scenely uses ```concurrently``` to start frontend and backend at once.
```bash
npm run dev
```

## Project Structure

```
.
├── backend
│   ├── config
│   │   └── env.js
│   ├── env.sample
│   ├── middleware
│   │   └── auth.js
│   ├── models
│   │   ├── Message.js
│   │   ├── Post.js
│   │   └── User.js
│   ├── package.json
│   ├── routes
│   │   ├── auth.js
│   │   ├── message.js
│   │   ├── posts.js
│   │   ├── upload.js
│   │   └── user.js
│   ├── server.js
│   └── utils
│       └── cloudinary.js
├── frontend
│   ├── env.sample
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   ├── _redirects
│   │   └── scenely.png
│   ├── src
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── BottomNav.jsx
│   │   │   ├── ExploreMosaic.jsx
│   │   │   ├── FollowersModal.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Messages
│   │   │   │   ├── ConversationList.jsx
│   │   │   │   └── MessageThread.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── MovieSearch.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostList.jsx
│   │   │   ├── PostPreview.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SearchUsers.jsx
│   │   │   ├── SharePostModal.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ThemeSwitcher.jsx
│   │   │   ├── UploadForm.jsx
│   │   │   └── UserAvatar.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Explore.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SelectAvatar.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Upload.jsx
│   │   │   └── UserProfile.jsx
│   │   └── utils
│   │       └── cropImage.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── package.json
```

## License

This project is licensed under the **ISC** License.

