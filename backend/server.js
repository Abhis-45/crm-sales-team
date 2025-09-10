require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
const oppsRoutes = require('./routes/opps');

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/opps', oppsRoutes);

app.get('/', (req, res) => res.send('CRM backend running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));