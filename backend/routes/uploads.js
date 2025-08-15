// backend/routes/upload.js
app.post("/upload", (req, res) => {
  const { userClass } = req.body;
  // Save the file in a folder named after the class
  const folderPath = `uploads/${userClass}`;
  // Save logic here...
});
