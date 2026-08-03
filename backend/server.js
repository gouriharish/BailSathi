const express = require('express');
const cors = require('cors');
const dlsaDirectory = require('./data/dlsa-directory.json');
const { checkEligibility, EligibilityInputError } = require('./src/eligibility');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.post('/api/check-eligibility', (req, res) => {
  const { offenceType, arrestDate, chargesheetFiled } = req.body;
  try {
    const result = checkEligibility({ offenceType, arrestDate, chargesheetFiled });
    res.json(result);
  } catch (err) {
    if (err instanceof EligibilityInputError) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
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