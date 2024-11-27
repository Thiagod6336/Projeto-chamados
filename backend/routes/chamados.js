const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const chamadosFilePath = path.join(__dirname, '../chamados.json');

function loadChamados() {
    const data = fs.readFileSync(chamadosFilePath);
    return JSON.parse(data);
}

function saveChamados(chamados) {
    fs.writeFileSync(chamadosFilePath, JSON.stringify(chamados, null, 2));
}

router.get('/', (req, res) => {
    const chamados = loadChamados();
    res.json(chamados);
});

router.get('/categoria/:categoria', (req, res) =>{
    const { categoria } = req.params;
    const chamados = loadChamados();
    const filtrados = chamados.filter(chamado => chamado.categoria === categoria);
    res.json(filtrados);
});

router.post('/', (req, res) => {
    const novosChamados = loadChamados();
    const novoChamado = {
        id: novosChamados.length + 1,
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        categoria: req.body.categoria,
        status: 'Aberto',
        // usuario: req.body.usuario,
        // tecnico: null,
        dataCriacao: new Date().toISOString(),
        // dataAtendimento: null,
        // dataFinalizacao: null,
    };
    novosChamados.push(novoChamado);
    saveChamados(novosChamados);
    res.status(201).json(novoChamado);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const chamados = loadChamados();
    const chamado = chamados.find(ch => ch.id === parseInt(id));

    if (!chamado) {
        return res.status(404).json({ message: 'Chamado não encontrado' });
    }

    chamado.status = status;
    saveChamados(chamados);
    res.json(chamado);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status, tecnico } = req.body;

    const chamados = loadChamados();
    const chamado = chamados.find(ch => ch.id === parseInt(id));

    if (!chamado) {
        return res.status(404).json({ message: 'Chamado não encontrado '});
    }

    if (status === 'Atendido' && chamado.status === 'Aberto') {
        chamado.tecnico = tecnico;
        chamado.status = 'Atendido';
        chamado.dataAtendimento = new Date().toISOString();
    } else if (status === 'Finalizado' && chamado.status === 'Atendido') {
        chamado.status = 'Finalizado';
        chamado.dataFinalizacao = new Date().toISOString();
    } else {
        return res.status(400).json({ message: 'Status inválido' });
    }

    saveChamados(chamados);
    res.json(chamado);
});

// router.get('/tecnico/:tecnico', (req, res) => {
//     const { tecnico } = req.params;
//     const chamados = loadChamados();
//     const filtrados = chamados.filter(chamado => chamado.tecnico === tecnico);
//     res.json(filtrados);
// });

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const chamados = loadChamados();
    const chamadoIndex = chamados.findIndex(ch => ch.id === parseInt(id));

    if (chamadoIndex === -1) {
        return res.status(404).json({ message: 'Chamado não encontrado' });
    }

    // Remove o chamado da lista
    const chamadoRemovido = chamados.splice(chamadoIndex, 1)[0];
    saveChamados(chamados);

    res.json({ message: 'Chamado removido com sucesso', chamado: chamadoRemovido });
});

module.exports = router;