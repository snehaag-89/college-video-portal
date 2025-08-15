import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} College Video Portal. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#333",
    color: "#fff",
    textAlign: "center",
    padding: "10px",
    marginTop: "20px"
  }
};

export default Footer;
