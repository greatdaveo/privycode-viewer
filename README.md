
# 🔐 PrivyCode

This is the **React Frontend** of the PrivyCode project.

PrivyCode is a secure platform that allows developers to share **read-only access to their private GitHub repositories** with recruiters or collaborators - without making them public or exposing secrets.

---

## 🚀 Features

- Generate expiring viewer links to private GitHub repositories
- Allow recruiters to browse your code - no GitHub login required
- Read-only access - no forking or editing
- Track view limits and expiration per link
- Developer dashboard to manage links
- Copy, edit, delete links with ease

---

## 🧰 Tech Stack

| Frontend               | Backend              | Database      |
|------------------------|----------------------|---------------|
| React + TypeScript     | Go (net/http + GORM) | PostgreSQL    |
| TailwindCSS            | GitHub OAuth2 API    |               |
| Monaco Editor          | JWT-style token auth |               |

---

## 🖼️ Live Demo
[https://privycode.com](https://privycode.com)

---

## 🔐 Authentication Flow

- Users log in via GitHub OAuth
- A secure token is stored in localStorage
- Authenticated users can generate, view, edit, and delete their viewer links

---

```bash
# Clone the repo
git clone https://github.com/greatdaveo/privycode-viewer 
cd privycode-viewer
npm install
npm run dev
```

Create a `.env` file in the project root:

```
VITE_BACKEND_URL=http://localhost:8080 or your backend url
```
---

## 🤝 Contributing
Contributions are welcome!
If you'd like to suggest new features, improve UI/UX, or report bugs, feel free to fork the project, open an issue and possibly submit a pull request.

---

## 👨‍💻 Developed By
> Olowomeye David [GitHub](https://github.com/greatdaveo) [LinkedIn](https://linkedin.com/in/greatdaveo)

---

```
