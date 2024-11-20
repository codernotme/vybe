# VYBE - Connect, Collaborate, and Thrive 🚀

VYBE is a unique social platform that empowers students, mentors, and communities within colleges to connect meaningfully. Designed to foster collaboration, build communities, and facilitate mentorship, VYBE redefines campus social interactions.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js, NextUI, TypeScript, TailwindCSS  
- **Authentication**: Clerk  
- **Database & State Management**: Convex, Redis  
- **Containerization**: Docker  

---

## ✨ Features

### User Types
- **Normal User**: Post content, chat, share stories, join group chats, follow communities, and participate in anonymous discussions.  
- **Tech User**: All features of a Normal User + access to a project workbench, GitHub integration, and collaborative tools.  
- **Community View**: Stay updated on public events, club posts, and community announcements.  
- **Mentor View**: Guide students, connect with peers, and oversee projects.  
- **Admin View**: Manage users, moderate content, and supervise platform activities.  

### Key Highlights
- **Project Workbench**: Collaborate on tech projects with public GitHub repositories, creating vibrant communities around shared goals.  
- **Anonymous Networking**: Safely exchange ideas and collaborate without revealing identities.  
- **Event Management**: Stay on top of campus happenings, club activities, and key announcements.  
- **Real-Time Chat**: Engage in dynamic group chats, private messaging, and immersive stories.  

---

## 🚀 Getting Started

### Prerequisites
Ensure the following are installed:  
- **Node.js** (v18+)  
- **Docker**  
- **Git**  

---

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codernotme/vybe.git
   cd vybe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env.local` file and add the following keys:

   ```env
   # Clerk Configuration
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
   CLERK_SECRET_KEY=<your_clerk_secret_key>
   CLERK_JWT_ISSUER_DOMAIN=<your_clerk_issuer_domain>

   # Convex Configuration
   CONVEX_DEPLOYMENT=<your_convex_deployment_id>
   NEXT_PUBLIC_CONVEX_URL=<your_convex_url>

   # YouTube API Key
   NEXT_PUBLIC_YOUTUBE_API_KEY=<your_youtube_api_key>
   ```

   Replace placeholders with your actual credentials.

4. Start the application:
   ```bash
   docker-compose up --build
   ```

5. Open the app:
   ```
   http://localhost:3000
   ```

---

## 🛠️ Additional Setup

### Enabling Convex

1. **Set Up Convex**:
   - Visit the [Convex Dashboard](https://dashboard.convex.dev/) and create a project.

2. **Deploy Convex Functions**:
   - Initialize Convex locally:
     ```bash
     npx convex dev
     ```
   - Deploy the Convex functions:
     ```bash
     npx convex deploy
     ```
   - Add the `CONVEX_DEPLOYMENT` ID (e.g., `dev:moonlit-crow-448`) to your `.env.local` file.

3. **Install Convex**:
   ```bash
   npm install convex
   ```

### Integrating Clerk with Convex

1. Install necessary packages:
   ```bash
   npm install convex @clerk/nextjs
   ```

2. Configure Clerk JWT for Convex authentication:  
   - Set up middleware to validate tokens.  
   Refer to [Clerk Docs](https://clerk.com/docs/) and [Convex Docs](https://docs.convex.dev/auth/clerk) for details.

---

### Make sure your Convex and Clerk must have these following -
1) **Clerk**
   ![Screenshot 2024-11-20 130955](https://github.com/user-attachments/assets/563b2953-6ec6-4102-9c64-e5ae2d889719)
   ![Screenshot 2024-11-20 130922](https://github.com/user-attachments/assets/85265679-5f1f-463f-ba23-bac72443a41e)
2) **Convex**
   ![Screenshot 2024-11-20 131104](https://github.com/user-attachments/assets/66839ca7-7dd9-4e62-9fb4-55c2ee7963d5)


### Securing Environment Variables
To ensure security, exclude `.env.local` from version control by adding it to `.gitignore`:
```bash
.env.local
```

---

## 📂 Project Structure
```
vybe/
├── components/        # Reusable UI components
├── app/               # Application entry points and pages
├── utils/             # Utility functions and helpers
├── styles/            # Global styles and themes
├── hooks/             # Custom React hooks
└── services/          # API services and integrations
```

---

## 📄 License
![License](https://img.shields.io/badge/License-CreativeCommons%20BY--NC%204.0%20International-blue)

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
For more details, see the [LICENSE](./LICENSE) file.

---

## 🤝 Contributing
We welcome contributions! Please review our [Contributing Guide](CONTRIBUTING.md) for guidelines.

---

## 📬 Contact
Questions or feedback? Reach out to **codernotme@gmail.com**.

---
## Preview
![image](https://github.com/user-attachments/assets/cc8ea663-5f2d-4aa1-b3b4-752ba639a655)
