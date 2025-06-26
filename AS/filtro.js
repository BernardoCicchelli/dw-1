const tabela = document.querySelector("#tabela-investimentos tbody");
const campoFiltro = document.getElementById("filtro-investimentos");

const dadosInvestimentos = [
  { nome: "Tesouro Selic", tipo: "Renda Fixa", rentabilidade: "9.15%" }
];

atualizarTabela(dadosInvestimentos);

campoFiltro.addEventListener("input", () => {
  const termo = campoFiltro.value.toLowerCase();

  const resultados = dadosInvestimentos.filter(item =>
    item.nome.toLowerCase().includes(termo)
  );

  atualizarTabela(resultados);
});

function atualizarTabela(lista) {
  tabela.innerHTML = "";

  if (lista.length === 0) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    celula.colSpan = 3;
    celula.textContent = "Nenhum resultado encontrado.";
    celula.style.textAlign = "center";
    linha.appendChild(celula);
    tabela.appendChild(linha);
    return;
  }

  lista.forEach(item => {
    const linha = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = item.nome;

    const tdTipo = document.createElement("td");
    tdTipo.textContent = item.tipo;

    const tdRent = document.createElement("td");
    tdRent.textContent = item.rentabilidade;

    linha.appendChild(tdNome);
    linha.appendChild(tdTipo);
    linha.appendChild(tdRent);

    tabela.appendChild(linha);
  });
}