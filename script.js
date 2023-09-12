const biblioteca = {
    livros: [
        { titulo: "A Revolução dos Bichos", autor: "George Orwell", ISBN: "123456", status: "disponível" },
        { titulo: "1984", autor: "George Orwell", ISBN: "789012", status: "disponível" },
        { titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", ISBN: "345678", status: "disponível" },
        { titulo: "Duna", autor: "Frank Herbert", ISBN: "901234", status: "disponível" },
        { titulo: "Matadouro Cinco", autor: "Kurt Vonnegut", ISBN: "567890", status: "disponível" },
        { titulo: "Cem Anos de Solidão", autor: "Gabriel García Márquez", ISBN: "234567", status: "disponível" },
        { titulo: "Orgulho e Preconceito", autor: "Jane Austen", ISBN: "890123", status: "disponível" },
        { titulo: "Neuromancer", autor: "William Gibson", ISBN: "678901", status: "disponível" },
        { titulo: "O Nome da Rosa", autor: "Umberto Eco", ISBN: "112233", status: "disponível" },
        { titulo: "A Estrada", autor: "Cormac McCarthy", ISBN: "445566", status: "disponível" },
    ],
    leitores: []
};

const historicoGlobal = [];  // Novo array para manter o histórico global

let ultimoId = 0;

function registrarLeitor() {
    const nome = document.getElementById("registroNome").value;

    // Verifica se o leitor já está registrado
    const leitorExistente = biblioteca.leitores.find(l => l.nome === nome);

    if (nome && !leitorExistente) { // Adicionamos a condição !leitorExistente
        const novoLeitor = {
            id: ++ultimoId,
            nome: nome,
            historico: []
        };
        biblioteca.leitores.push(novoLeitor);
        alert(`Leitor ${nome} registrado com sucesso!`);
        listarLeitoresRegistrados();
        document.getElementById("registroNome").value = '';  // Limpar campo
    } else if (leitorExistente) {  // Adicionamos essa condição
        alert("Este leitor já está registrado!");
		document.getElementById("registroNome").value = '';  // Limpar campo
    } else {
        alert("Por favor, insira um nome válido.");
    }
}

function listarLivrosDisponiveis() {
    const ul = document.getElementById("livrosDisponiveis");
    ul.innerHTML = '';
    biblioteca.livros.forEach(livro => {
        if (livro.status === "disponível") {
            const li = document.createElement("li");
            li.textContent = `${livro.titulo} - ${livro.autor} (ISBN: ${livro.ISBN})`;
            ul.appendChild(li);
        }
    });
}

function listarLivrosEmprestados() {
    const ul = document.getElementById("livrosEmprestados");
    ul.innerHTML = '';
    biblioteca.livros.forEach(livro => {
        if (livro.status === "emprestado") {
            const leitor = biblioteca.leitores.find(l => 
                l.historico.some(h => h.ISBN === livro.ISBN && h.status === "emprestado")
            );
            const li = document.createElement("li");
            li.textContent = `${livro.titulo} - ${livro.autor} (ISBN: ${livro.ISBN}) - Emprestado para: ${leitor.nome}`;
            ul.appendChild(li);
        }
    });
}

function listarLeitoresRegistrados() {
    const ul = document.getElementById("leitoresRegistrados");
    ul.innerHTML = '';
    biblioteca.leitores.forEach(leitor => {
        const li = document.createElement("li");
        li.textContent = `${leitor.nome}`;
        ul.appendChild(li);
    });
}

function mostrarHistoricoGlobal() {
    const ul = document.getElementById("listaHistorico");
    ul.innerHTML = '';
    historicoGlobal.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `Status: ${item.status} - Livro: ${item.titulo} - Leitor: ${item.nomeLeitor} - Data e Hora: ${new Date(item.data).toLocaleString()}`;
        ul.appendChild(li);
    });
}

function realizarEmprestimo() {
    const nomeLeitor = document.getElementById("nomeLeitor").value;
    const ISBN = document.getElementById("ISBN").value;
    const livro = biblioteca.livros.find(l => l.ISBN === ISBN);
    const leitor = biblioteca.leitores.find(l => l.nome === nomeLeitor);

    if (livro && livro.status === "disponível" && leitor) {
        livro.status = "emprestado";
        leitor.historico.push({
            ISBN: ISBN,
            status: "emprestado",
            data: new Date().toISOString()
        });
        historicoGlobal.push({
            status: "emprestimo",
            titulo: livro.titulo,
            nomeLeitor: leitor.nome,
            data: new Date().toISOString()
        });
        alert("Livro emprestado com sucesso!");
    } else {
        alert("Livro não disponível ou leitor não registrado!");
    }

    listarLivrosDisponiveis();
    listarLivrosEmprestados();
    mostrarHistoricoGlobal();
	
	document.getElementById("nomeLeitor").value = ''; // Limpar campo
    document.getElementById("ISBN").value = '';       // Limpar campo
}

function realizarDevolucao() {
    const ISBNDevolucao = document.getElementById("ISBNDevolucao").value;
    const livro = biblioteca.livros.find(l => l.ISBN === ISBNDevolucao);
    if (livro && livro.status === "emprestado") {
        const leitor = biblioteca.leitores.find(l => 
            l.historico.some(h => h.ISBN === ISBNDevolucao && h.status === "emprestado")
        );
        if (leitor) {
            livro.status = "disponível";
            const historicoItemLeitor = leitor.historico.find(h => h.ISBN === ISBNDevolucao && h.status === "emprestado");
            historicoItemLeitor.status = "devolvido";
            historicoItemLeitor.dataDevolucao = new Date().toISOString();
            historicoGlobal.push({
                status: "devolucao",
                titulo: livro.titulo,
                nomeLeitor: leitor.nome,
                data: new Date().toISOString()
            });
            alert("Livro devolvido com sucesso!");
        }
    } else {
        alert("Livro não encontrado ou já está disponível!");
    }

    listarLivrosDisponiveis();
    listarLivrosEmprestados();
    mostrarHistoricoGlobal();
	document.getElementById("ISBNDevolucao").value = ''; // Limpar campo
}

document.addEventListener("DOMContentLoaded", function() {
    listarLivrosDisponiveis();
    listarLivrosEmprestados();
    listarLeitoresRegistrados();
    mostrarHistoricoGlobal();
});
