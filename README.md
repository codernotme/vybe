# VYBE - Connect, Collaborate, and Thrive 🚀

VYBE is an exclusive social media platform designed to connect students, mentors, and communities within colleges. It fosters collaboration, builds communities, and promotes mentorship through a unique social experience tailored specifically for the campus.

## 🛠️ Tech Stack
- **Frontend**: Next.js, NextUI, TypeScript, TailwindCSS
- **Authentication**: Clerk
- **Database & State Management**: Convex, Redis
- **Containerization**: Docker

## ✨ Features

### 1. User Types
- **Normal User**: Posting, chatting, stories, group chats, following communities, and anonymous chats.
- **Tech User**: Includes Normal View + access to project workbench, GitHub integration, and collaborative features.
- **Community View**: Public events, club posts, and community updates.
- **Mentor View**: Connect with students, offer guidance, and oversee projects.
- **Admin View**: Manage users, moderate content, and oversee platform activities.

### 2. Key Highlights
- **Project Workbench**: Collaborate on tech projects, view public GitHub repos, and build a community around projects.
- **Anonymous Networking**: Share ideas and collaborate with peers without revealing identities.
- **Event Management**: Stay updated on campus events, club activities, and announcements.
- **Real-Time Chat**: Engage in group chats, private messaging, and stories.

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js**: v18+
- **Docker**
- **Git**

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

3. Set up environment variables:
   - Create a `.env.local` file with your **Clerk**, **Convex**, and **Redis** credentials.

4. Run the application:
   ```bash
   docker-compose up --build
   ```

5. Access the app:
   ```
   http://localhost:3000
   ```

## 📂 Project Structure
```
vybe/
├── components/
├── app/
├── utils/
├── styles/
├── hooks/
└── services/
```

## 📄 License
This project is licensed under the MIT License.

## 🤝 Contributing
We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📬 Contact
For any questions, reach out at **codernotme@gmail.com**.
