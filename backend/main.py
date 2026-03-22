from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import pandas as pd

app = FastAPI(title="Book Recommendation API")

# 1. Enable CORS (Cross-Origin Resource Sharing)
# This allows your React frontend to make requests to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load the Pickled Data
# Make sure these files exist in the same directory as main.py
try:
    pt = pickle.load(open('pt.pkl', 'rb'))
    # This should be your 'filter_rating' df
    books = pickle.load(open('filter_rating.pkl', 'rb'))
    similarity_score = pickle.load(open('similarity.pkl', 'rb'))
    print("✅ ML Models and Data loaded successfully")
except FileNotFoundError:
    print("❌ Error: Pickle files not found. Please export pt.pkl, books.pkl, and similarity_scores.pkl")


@app.get("/")
def read_root():
    return {"status": "Book Recommendation API is running"}


@app.get("/book_list")
def get_book_list():
    """Returns a list of all available book titles for the dropdown"""
    return {"books": list(pt.index)}


@app.get("/recommend")
def recommend(book_name: str):
    """Returns top 5 recommendations for a given book name"""
    try:
        # Fetch the index of the book
        index = np.where(pt.index == book_name)[0][0]

        # Get similarity scores for THIS specific book
        distances = similarity_score[index]

        # Sort and get top 5 (excluding the book itself at index 0)
        similar_items = sorted(list(enumerate(distances)),
                               key=lambda x: x[1], reverse=True)[1:10]

        recommendations = []
        for i in similar_items:
            # Find the book details in the original filtered dataframe
            temp_df = books[books['Book-Title'] == pt.index[i[0]]]

            # Remove duplicates to get one clean entry
            item = temp_df.drop_duplicates('Book-Title').iloc[0]

            # Format: [Title, Author, ImageURL]
            recommendations.append([
                str(item['Book-Title']),
                str(item['Book-Author']),
                str(item['Image-URL-M'])
            ])

        return {"recommendations": recommendations}

    except IndexError:
        raise HTTPException(
            status_code=404, detail="Book not found in database")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run('main:app', host="127.0.0.1",port=3000,reload=True)