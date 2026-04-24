const url = 'http://localhost:3000/acessorios';
let acessorioAtual = null;
const acessorios = [];

carregarAcessorios();

function carregarAcessorios() {
    fetch(url + '/listar')
        .then(response => response.json())
        .then(data => {
            acessorios.length = 0;
            acessorios.push(...data);
            listarCards();
        })
        .catch(e => alert('Problemas com a conexão da API'));
}

function listarCards() {
    const container = document.querySelector('main');
    container.innerHTML = '';

    if (acessorios.length === 0) {
        container.innerHTML = '<p style="color: var(--marrom-escuro)">Nenhum acessório cadastrado ainda.</p>';
        return;
    }

    acessorios.forEach(acessorio => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <h3>${acessorio.nome}</h3>
            <img src="${acessorio.imagem}" alt="${acessorio.nome}" onerror="this.src='https://via.placeholder.com/200x180?text=Sem+Imagem'">
            <p>${acessorio.marca}</p>
            <p>R$ ${acessorio.preco.toFixed(2)}</p>
        `;
        card.onclick = () => abrirAcessorio(acessorio);
        container.appendChild(card);
    });
}

function abrirAcessorio(acessorio) {
    acessorioAtual = acessorio;
    tituloAcessorio.innerHTML = acessorio.nome;
    nomeEdit.value = acessorio.nome;
    marcaEdit.value = acessorio.marca;
    categoriaEdit.value = acessorio.categoria;
    precoEdit.value = acessorio.preco;
    imgAcessorio.src = acessorio.imagem;
    imgEdit.value = acessorio.imagem;
    detalhes.classList.remove('oculto');
}

imgEdit.addEventListener("input", () => {
    imgAcessorio.src = imgEdit.value;
});

document.querySelector('#formCad').addEventListener('submit', function (e) {
    e.preventDefault();
    const novoAcessorio = {
        nome: nome.value,
        marca: marca.value,
        categoria: categoria.value,
        preco: Number(preco.value),
        imagem: imagem.value
    };

    fetch(url + '/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoAcessorio)
    })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(() => {
            alert("Acessório adicionado com sucesso!");
            cadastro.classList.add('oculto');
            formCad.reset();
            carregarAcessorios();
        })
        .catch(() => { alert("Erro ao salvar acessório :(") });
});

function salvarEdicao() {
    const acessorioEditado = {
        nome: nomeEdit.value,
        marca: marcaEdit.value,
        categoria: categoriaEdit.value,
        preco: Number(precoEdit.value),
        imagem: imgEdit.value
    };

    fetch(url + '/atualizar/' + acessorioAtual.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(acessorioEditado)
    })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(() => {
            alert("Acessório atualizado com sucesso!");
            detalhes.classList.add('oculto');
            carregarAcessorios();
        })
        .catch(() => alert("Erro ao editar acessório"));
}

function excluirAcessorioAtual() {
    if (!confirm("Deseja excluir o acessório?")) return;
    fetch(url + '/excluir/' + acessorioAtual.id, {
        method: 'DELETE'
    })
        .then(() => {
            alert("Acessório excluído com sucesso!");
            detalhes.classList.add('oculto');
            carregarAcessorios();
        })
        .catch(() => alert("Erro ao excluir o acessório"));
}