
# GitInsight AI 🚀

**GitInsight AI** is a professional full-stack intelligence dashboard designed for recruiters to evaluate developer portfolios efficiently. By leveraging **Spring Boot 3.2**, **Spring AI**, and **Google Gemini**, it transforms complex GitHub data into concise, actionable insights and allows for persistent candidate management.

## ✨ Features

- **Profile Intelligence:** Fetches real-time GitHub profile metadata including repositories, followers, and activity.
- **AI-Powered Summarization:** Analyzes project `README.md` files via the backend to generate 2-sentence professional summaries using Gemini LLM.
- **Persistent Bookmarking:** Bookmark standout candidates to a local database (H2/JPA) to build a "Saved Users" talent pool.
- **AI Vision Analysis:** Multi-modal support allowing recruiters to upload project screenshots or architecture diagrams for AI-driven technical interpretation.
- **Modern Full-Stack Architecture:** Built with Java 21, Spring Boot, React 19, and Tailwind CSS.
- **Secure Backend:** All API keys and GitHub tokens are managed server-side, ensuring no sensitive data is exposed to the frontend.

## 🛠️ Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.2.x**
- **Spring AI:** Native integration with Google Gemini for text and vision models.
- **Spring Data JPA:** For candidate persistence.
- **H2 Database:** High-performance in-memory database for rapid prototyping and deployment.
- **RestClient:** Modern, functional-style HTTP client for GitHub API interaction.

### Frontend
- **React 19**
- **TypeScript**
- **Tailwind CSS:** Dark-mode "Recruiter" aesthetic with glassmorphism effects.
- **ES Modules:** Optimized loading without heavy bundler overhead.

## 🚀 Getting Started

### Prerequisites
- **JDK 21** or higher.
- **Maven 3.9+**.
- A **Google Gemini API Key** ([Get it here](https://ai.google.dev/)).

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/gitinsight-ai.git
   cd gitinsight-ai
   ```

2. **Configure Environment Variables:**
   Update `resources/application.properties` or set environment variables:
   ```properties
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   GITHUB_TOKEN=YOUR_OPTIONAL_GITHUB_TOKEN
   ```

3. **Build and Run the Backend:**
   ```bash
   mvn clean spring-boot:run
   ```
   The application will be accessible at `http://localhost:8080`.

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/insight/profile/{user}` | Fetch GitHub profile metadata. |
| `GET` | `/api/insight/repos/{user}` | List top public repositories. |
| `GET` | `/api/insight/{user}/{repo}` | AI analysis of a specific repository. |
| `POST` | `/api/insight/candidates` | Bookmark a user to the database. |
| `GET` | `/api/insight/candidates` | List all saved users in the pipeline. |
| `DELETE` | `/api/insight/candidates/{id}`| Remove a user from the database. |
| `POST` | `/api/insight/edit-image` | Multi-modal vision analysis of an image. |

## 📦 Deployment
The project is designed to be packaged as a single executable JAR. Simply build using `mvn package` and run the resulting file in the `target/` directory.

## 📄 License
MIT License - see the LICENSE file for details.
