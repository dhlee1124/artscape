const express = require('express');
const db = require('./db');  
const path = require('path');
const cors = require('cors');
const matchRouter = require('./routes/match');
const authRoutes = require('./routes/auth');
const planRouter = require('./routes/mlt_plan');



require('dotenv').config();

const app = express();
 
app.use(express.json());
app.use(cors());

const { swaggerUi, specs } = require("./swagger/swagger")

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/match', matchRouter);
app.use('/auth', authRoutes);
app.use('/mltplan', planRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
