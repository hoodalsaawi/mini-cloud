const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {

  res.send(`
  <body style="
  background:#0f172a;
  color:white;
  font-family:Arial;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
  margin:0;
  ">

  <div style="
  background:#1e293b;
  padding:40px;
  border-radius:20px;
  width:400px;
  text-align:center;
  box-shadow:0 0 20px rgba(0,0,0,0.4);
  ">

  <h1>Mini Cloud 🚀</h1>

  <form action="/upload" method="POST" enctype="multipart/form-data">

  <input type="file" name="file">

  <br><br>

  <button style="
  background:#38bdf8;
  color:white;
  border:none;
  padding:10px 20px;
  border-radius:10px;
  cursor:pointer;
  ">
  Upload
  </button>

  </form>

  <br>

  <a href="/files" style="
  color:#67e8f9;
  text-decoration:none;
  font-weight:bold;
  ">
  View Files
  </a>

  </div>
  </body>
  `);

});

app.post('/upload', upload.single('file'), (req, res) => {

  res.send(`
  <body style="
  background:#0f172a;
  color:white;
  font-family:Arial;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
  ">

  <div style="
  background:#1e293b;
  padding:40px;
  border-radius:20px;
  text-align:center;
  ">

  <h2>Uploaded ✅</h2>

  <br>

  <a href="/" style="
  color:#67e8f9;
  text-decoration:none;
  font-weight:bold;
  ">
  Back Home
  </a>

  </div>
  </body>
  `);

});

app.get('/files', (req, res) => {

  const files = fs.readdirSync('uploads');

  if (files.length === 0) {

    return res.send(`
    <body style="
    background:#0f172a;
    color:white;
    font-family:Arial;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    margin:0;
    ">
    
    <h1>No files uploaded yet 📁</h1>
    
    </body>
    `);

  }

  let html = `
  <body style="
  background:#0f172a;
  color:white;
  font-family:Arial;
  padding:40px;
  ">

  <h1>Files 📁 (${files.length})</h1>
  `;

  files.forEach(file => {

    const stats = fs.statSync(`uploads/${file}`);
    const uploadDate = stats.mtime.toLocaleString();

    html += `
    <div style="
    background:#1e293b;
    padding:20px;
    border-radius:15px;
    margin-bottom:20px;
    width:250px;
    ">

    <h3>${file}</h3>

    <p style="color:gray;">
    Uploaded: ${uploadDate}
    </p>

    <img
    src="/uploads/${file}"
    width="100%"
    style="border-radius:10px"
    >

    <br><br>

    <a href="/uploads/${file}" download>
      <button style="
      background:#22c55e;
      color:white;
      border:none;
      padding:10px;
      border-radius:10px;
      cursor:pointer;
      margin-bottom:10px;
      ">
      Download
      </button>
    </a>

    <br>

    <a href="/delete/${file}">
      <button style="
      background:red;
      color:white;
      border:none;
      padding:10px;
      border-radius:10px;
      cursor:pointer;
      ">
      Delete
      </button>
    </a>

    </div>
    `;

  });

  html += `
  <br>

  <a href="/">
    <button style="
    background:#38bdf8;
    color:white;
    border:none;
    padding:12px 20px;
    border-radius:10px;
    cursor:pointer;
    ">
    Back Home
    </button>
  </a>

  </body>
  `;

  res.send(html);

});

app.get('/delete/:name', (req, res) => {

  const fileName = req.params.name;

  fs.unlinkSync(`uploads/${fileName}`);

  res.redirect('/files');

});

app.listen(3000, () => {

  console.log('Server running on http://localhost:3000');

});