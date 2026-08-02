const express = require('express');
const cors = require('cors');
const dlsaDirectory = require('./data/dlsa-directory.json');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.get('/api/dlsa/:district', (req, res) => {
  const match = dlsaDirectory.find(
    (d) => d.district.toLowerCase() === req.params.district.toLowerCase()
  );
  if (!match) {
    return res.status(404).json({ error: 'No DLSA office found for this district' });
  }
  res.json(match);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Bail Saathi backend running on http://localhost:${PORT}`);
});