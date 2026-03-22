import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, BookOpen, Star, Loader2, AlertCircle, User } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_BASE_URL ;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

const Home = () => {
    const [bookList, setBookList] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch the list of books for the dropdown on load
    useEffect(() => {
        const fetchInitialData = async () => {
            setInitialLoading(true);
            try {
                const response = await api.get('/book_list');
                setBookList(response.data.books);

                // Optional: Fetch some default "popular" books for the initial grid
                // const trendingRes = await api.get('/trending_books');
                // setRecommendations(trendingRes.data.trending);
            } catch (err) {
                console.error("Fetch Error:", err.message);
                setError("Failed to load book list.");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleRecommend = async () => {
        if (!selectedBook) return;

        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/recommend', {
                params: { book_name: selectedBook }
            });
            setRecommendations(response.data.recommendations);
        } catch (err) {
            const msg = err.response?.data?.detail || "Recommendation engine is offline.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 bg-transparent">
                <header className="text-center mb-16">
                    <h1 className="text-6xl font-black mb-4 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Book Recommender
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg italic">Discover your next favorite read</p>
                </header>

                {/* Search Box */}
                <div className="w-full  mx-auto mb-16 bg-transparent">
                    <div className="flex flex-col gap-2 p-2 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-md focus-within:border-indigo-500/50 transition-all text-center justify-center items-center w-full ">
                        <select
                            value={selectedBook}
                            onChange={(e) => setSelectedBook(e.target.value)}
                            className="w-full bg-transparent px-4 py-2 text-sm outline-none text-slate-200 cursor-pointer border border-slate-700 rounded-lg"
                        >
                            <option value="" className="bg-slate-900 max-w-xl">Select a book you liked...</option>
                            {bookList.map((book, i) => (
                                <option key={i} value={book} className="bg-slate-900 max-w-xl">{book}</option>
                            ))}
                        </select>
                        <div className="flex justify-center items-center ">
                        <button
                            onClick={handleRecommend}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 mt-2.5"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            Find Recommended books
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="mt-4 flex items-center gap-2 text-red-400 text-sm justify-center">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {selectedBook ? (
                            <>Books similar to <span className="text-indigo-400">{selectedBook}</span></>
                        ) : (
                            <>📚 Recommended Collection</>
                        )}
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {initialLoading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                            <p className="text-slate-400">Loading Library...</p>
                        </div>
                    ) : (
                        recommendations.map((book, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedBook(book[0]); // Update the selected book title
                                      // Update the text in the search input
                                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional: Scroll up to the search bar
                                }}
                                className="group flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]"
                            >
                                <div className="relative aspect-[2/3] overflow-hidden">
                                    <img
                                        src={book[2]} // Image-URL-M
                                        alt={book[0]}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover' }}
                                    />
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-lg text-white leading-tight line-clamp-2 group-hover:text-indigo-400 transition-colors mb-2">
                                        {book[0]} {/* Book-Title */}
                                    </h3>

                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                                        <User className="w-4 h-4 text-indigo-500" />
                                        <span className="truncate">{book[1]}</span> {/* Author */}
                                    </div>

                                    <div className="mt-auto">
                                        <button
                                            onClick={() => window.open(`https://www.google.com/search?tbo=p&tbm=bks&q=${encodeURIComponent(book[0])}`, "_blank")}
                                            className="w-full py-2 text-xs font-semibold text-indigo-400 bg-indigo-500/5 rounded-lg border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <BookOpen className="w-3 h-3" />
                                            Book Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;