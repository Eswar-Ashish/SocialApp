import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [posts, setPosts] = useState([]);

  // Fetch posts on page load
  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const handleLogin = () => {
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Login failed");
      })
      .then(() => {
        setLoggedIn(true);
        setPassword(""); // Clear password after login
      })
      .catch((err) => alert(err.message));
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ " + data.message);
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("❌ Network error or server not responding.");
    }
  };

  const handleAddPost = () => {
    fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, author: username }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Post created");
        setPosts([...posts, data.post]);
        setTitle("");
        setContent("");
      });
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      fetch(`http://localhost:5000/delete-user/${username}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          setLoggedIn(false);
          setUsername("");
        })
        .catch(() => alert("Error deleting account"));
    }
  };

  return (
    <div className="app-container">
      <h1>Social Media App</h1>

      {!loggedIn ? (
        <>
          <h2>Login</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
          </form>
        </>
      ) : (
        <>
          <h2>Welcome, {username}!</h2>

          <form onSubmit={(e) => e.preventDefault()}>
            <h3>Create a Post</h3>
            <input
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Post Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
            <button onClick={handleAddPost}>Add Post</button>
          </form>

          <div className="action-buttons">
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
            <button className="delete" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </>
      )}

      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post">
            <div className="post-title">{post.title}</div>
            <div className="post-author">by {post.author}</div>
            <div className="post-content">{post.content}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
