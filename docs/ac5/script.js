function adicionar() {
  const input = document.getElementById("tarefa");
  const valor = input.value.trim();

  if (valor !== "") {
    const ul = document.getElementById("lista");
    const li = document.createElement("li");

    li.innerHTML = `
      ${valor}
      <button onclick="remover(this)">X</button>
    `;

    ul.appendChild(li);
    input.value = "";
  }
}

function remover(botao) {
  const li = botao.parentElement;
  li.remove();
}
