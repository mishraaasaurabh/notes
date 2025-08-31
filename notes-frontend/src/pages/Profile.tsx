import { useEffect, useState } from "react";
import type { User } from "../types/user";

type Note = {
    _id: string;
    title: string;
    content: string;
};

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/profile", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setUser(data.msg);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!user) return;
        fetch("http://localhost:8000/notes", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setNotes(data.msg || []))
            .catch((err) => console.error(err));
    }, [user]);

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/add-note", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            });
            const data = await res.json();
            if (res.ok) {
                setNotes([...notes, data.msg]);
                setNewTitle("");
                setNewContent("");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await fetch(`http://localhost:8000/notes/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            setNotes(notes.filter((note) => note._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="text-gray-500 text-lg animate-pulse">Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="text-gray-500 text-lg">You are not logged in.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col xl:flex-row min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">

            {/* Notes Section */}
            <div className="flex-1  p-10 lg:p-16 max-w-6xl  mx-auto lg:mx-0 ">
                <h2 className="text-4xl font-extrabold mb-10 tracking-wider text-white ">
                    Your Notes
                </h2>

                {/* Add Note Form */}
                <form
                    onSubmit={handleAddNote}
                    className="mb-10 bg-gray-850 p-8 rounded-3xl shadow-2xl border border-gray-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-300"
                >
                    <h3 className="text-2xl font-semibold mb-6 text-white tracking-wide">
                        Create New Note
                    </h3>
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full mb-4 p-4 bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white text-lg transition"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Content"
                        className="w-full mb-4 p-4 bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white text-lg resize-none h-28 transition"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold shadow-lg text-lg transition-all duration-300"
                    >
                        Add Note
                    </button>
                </form>

                {/* Notes List */}
                {notes.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
                        {notes.map((note) => (
                            <div
                                key={note._id}
                                className="p-6 bg-gray-850 rounded-3xl shadow-lg hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] transition-all flex flex-col justify-between border border-gray-700"
                            >
                                <div>
                                    <h3 className="font-bold text-white text-xl mb-2">{note.title}</h3>
                                    <p className="text-gray-300 text-base line-clamp-6">{note.content}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteNote(note._id)}
                                    className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-2xl font-semibold transition"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center mt-12 text-lg">
                        No notes yet. Start by adding one!
                    </p>
                )}
            </div>

            {/* Profile Card */}
            {/* Profile Card */}
            <div className="w-full  max-md:top-0  2xl:fixed max-xl:h-32  max-xl:-order-1 right-0 h-screen xl:w-96 bg-gray-850 shadow-2xl border-l border-gray-700 rounded-3xl p-10 flex flex-col max-xl:flex-row   justify-between">
                <div className="flex flex-col gap-4 items-center max-xl:flex-row">
                    {/* Profile Image */}
                    <div className="w-32 h-32 max-xl:h-16 bg-red-500 flex justify-center items-center max-xl:w-16 rounded-full overflow-hidden lg:mb-6 shadow-inner border-2 border-gray-700">
                        <img
                            src={user.profile_img || "/default-avatar.png"}
                            alt={user.fullName}
                            className="w-full h-full   rounded-full object-cover"
                        />
                    </div>

                    {/* User Info */}
                    <h1 className="text-xl xl:text-3xl font-extrabold text-white mb-2 text-center ">
                        {user.fullName}
                    </h1>
                    <p className="text-gray-400 max-xl:hidden text-center mb-4 line-clamp-1">
                        {user.bio || "No bio available"}
                    </p>
                    <p className="text-gray-400 text-center text-sm max-xl:hidden">{user.email}</p>
                </div>

                {/* Logout Button */}
                <button
                    className=" w-full  max-xl:w-[30%] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-3xl font-bold shadow-lg text-lg transition-all duration-300"
                    onClick={() => {
                        fetch("http://localhost:8000/logout", {
                            method: "POST",
                            credentials: "include",
                        }).then(() => {
                            setUser(null);
                            window.location.href = "/login";
                        });
                    }}
                >
                    Logout
                </button>
            </div>

        </div>
    );
};

export default Profile;
