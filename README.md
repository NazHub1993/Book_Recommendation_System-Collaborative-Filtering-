#📚 Movie Recommender System


A sophisticated, full-stack web application that suggests books based on user interest using Collaborative Filtering. By analyzing a dataset of over 270,000 users and 1.1 million ratings, the engine identifies patterns in reading habits to recommend your next favorite book.

🚀 Features
Intelligent Search: A custom-built searchable combobox that filters through 2,400+ popular titles in real-time.

Vector-Based Discovery: Uses Cosine Similarity to calculate the distance between book vectors in a high-dimensional space.

Chained Recommendations: Click on any recommended book card to instantly trigger a new search for similar titles.

Modern UI: A sleek, dark-themed responsive interface built with React and Tailwind CSS.

High Performance: Backend powered by FastAPI for near-instant recommendation processing.

🛠️ Tech Stack
Frontend
React.js (Functional Components & Hooks)

Tailwind CSS (Modern Styling)

Lucide React (Iconography)

Axios (API Communication)

Backend
FastAPI (Python Web Framework)

Uvicorn (ASGI Server)

Pickle (Model Serialization)

Machine Learning / Data Science
Pandas (Data Wrangling & Filtering)

NumPy (Matrix Operations)

Scikit-learn (Cosine Similarity)

🧠 How it Works
Data Cleaning: The dataset was filtered to include only "Active Users" (those who have rated >200 books) and "Famous Books" (titles with >50 ratings) to ensure high-quality, reliable recommendations.

Pivot Table: A matrix was created where User-IDs are columns and Book-Titles are rows, filled with user ratings.

Similarity Matrix: Using cosine_similarity, we calculated the angular distance between every book vector.

The Engine: When a user selects a book, the engine finds the 5 closest vectors (most similar books) and returns their metadata (Title, Author, Image) to the frontend.

🏃 Setup & Installation
1. Backend Setup
Navigate to the backend folder.

Install dependencies:

Bash
pip install fastapi uvicorn pandas numpy scikit-learn
Place your pt.pkl, books.pkl, and similarity_scores.pkl in the root of the backend folder.

Start the server:

Bash
uvicorn main:app --reload
2. Frontend Setup
Navigate to the frontend folder.

Install dependencies:

Bash
npm install
Create a .env file and add:

Code snippet
VITE_BASE_URL=http://localhost:8000
Start the development server:

Bash
npm run dev
📸 Screenshots
<img width="1876" height="862" alt="image" src="https://github.com/user-attachments/assets/9837a81a-6215-45a7-a733-0dcddafe4282" />


👨‍💻 Author
[Your Name]

ML Engineer / Full-Stack Developer

[Link to your LinkedIn/Portfolio]
