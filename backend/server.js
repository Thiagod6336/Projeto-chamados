const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chamadosRoutes = require('./routes/chamados');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/chamados', chamadosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});