import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={styles.header}>
      <h2 style={styles.logo}>🎬 College Video Portal</h2>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/upload" style={styles.link}>Upload</Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    background: "#333",
    color: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: { margin: 0 },
  nav: { display: "flex", gap: "15px" },
  link: { color: "#fff", textDecoration: "none" }
};

export default Header;
