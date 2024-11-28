document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chamado-form');
    const diretories = {
        'TI': document.getElementById('chamados-TI'),
        'Manutenção': document.getElementById('chamados-Manutencao'),
        'RH': document.getElementById('chamados-RH'),
    };
    let chamados = [];

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const categoria = form.categoria.value;
        const titulo = form.titulo.value;
        const descricao = form.descricao.value;
        const novoChamado = { categoria, titulo, descricao, id: Date.now() };

        chamados.push(novoChamado);
        form.reset();
        renderChamados();
    });

    function renderChamados() {
        for (let key in diretories) {
            diretories[key].innerHTML = '';
        }
        chamados.forEach(chamado => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>Título:</strong> ${chamado.titulo} <br> <strong>Descrição:</strong> ${chamado.descricao}`;
            diretories[chamado.categoria].appendChild(li);
        });
    }
});
