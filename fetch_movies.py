import aiohttp
import asyncio
import os
from pymongo import UpdateOne
import motor.motor_asyncio

# TMDB API & MongoDB Settings
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjQzNWM3NjM3YTkxMTk0ZGRmYmE0Y2I2MGY4YTIyYiIsIm5iZiI6MTczNzI0MzkwMi4wMzIsInN1YiI6IjY3OGMzY2ZlNDJmMjdjNzU0YzY1MDI4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G3C0WA05F6CBl9JwSIgTRqrypMleiKhLJ4CPYKHg-Ao")
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://tnolet:Scorpius1!@movies.n7xwrso.mongodb.net/?retryWrites=true&w=majority&appName=movies")
DATABASE_NAME = "MovieDB"
COLLECTION_NAME = "movies"

BASE_URL = "https://api.themoviedb.org/3/movie/{movie_id}"
HEADERS = {
    "Authorization": f"Bearer {TMDB_API_KEY}",
    "Accept": "application/json"
}

# Connect to MongoDB (Asynchronous)
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

CONCURRENT_REQUESTS = 20  # How many requests to send at the same time

async def fetch_movie_details(session, movie_id):
    """Fetch basic movie details (ID, title, release year)."""
    url = BASE_URL.format(movie_id=movie_id)

    try:
        async with session.get(url, headers=HEADERS) as response:
            if response.status == 200:
                data = await response.json()
                return {
                    "id": data.get("id"),
                    "title": data.get("title"),
                    "year": data.get("release_date", "").split("-")[0] if data.get("release_date") else None
                }
            else:
                print(f"⚠️ Skipping movie ID {movie_id}: {response.status}")
                return None
    except Exception as e:
        print(f"Error fetching movie {movie_id}: {e}")
        return None

async def insert_movies_into_mongo(movies):
    """Insert movies into MongoDB using bulk write for efficiency."""
    if not movies:
        return

    operations = [
        UpdateOne({"id": movie["id"]}, {"$set": movie}, upsert=True)
        for movie in movies if movie
    ]

    if operations:
        result = await collection.bulk_write(operations)
        print(f"Inserted {result.upserted_count} new movies, updated {result.modified_count} existing movies.")

async def process_movie_batch(session, movie_ids):
    """Fetch details for a batch of movies asynchronously."""
    tasks = [fetch_movie_details(session, movie_id) for movie_id in movie_ids]
    results = await asyncio.gather(*tasks)

    # Filter out None values (failed requests)
    movies_to_store = [movie for movie in results if movie]
    
    if movies_to_store:
        await insert_movies_into_mongo(movies_to_store)

async def fetch_and_store_all_movies(start_id):
    """Fetch movies asynchronously in batches, never stopping."""
    async with aiohttp.ClientSession() as session:
        movie_id = start_id

        while True:  # Keep running indefinitely
            batch_ids = list(range(movie_id, movie_id + CONCURRENT_REQUESTS))
            await process_movie_batch(session, batch_ids)
            
            movie_id += CONCURRENT_REQUESTS  # Move to the next batch

if __name__ == "__main__":
    asyncio.run(fetch_and_store_all_movies(start_id=749960))