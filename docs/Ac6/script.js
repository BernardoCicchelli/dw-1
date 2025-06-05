// Captura do formulário e dos elementos
const form = document.getElementById("contactForm");
const nome = document.getElementById("name");
const email = document.getElementById("email");
const mensagem = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");
const spinner = document.getElementById("spinner");

// Função para verificar se todos os campos estão preenchidos
function verificarCampos() {
  if (nome.value && email.value && mensagem.value.length >= 100) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

// Eventos de input para ativar ou desativar botão
nome.addEventListener("input", verificarCampos);
email.addEventListener("input", verificarCampos);
mensagem.addEventListener("input", verificarCampos);

// Validação e envio
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Verificação básica
  if (!nome.value || !email.value || !mensagem.value) {
    result.innerText = "Todos os campos são obrigatórios.";
    return;
  }

  if (!email.value.includes("@") || !email.value.includes(".")) {
    result.innerText = "Email inválido.";
    return;
  }

  if (mensagem.value.length < 100) {
    result.innerText = "Mensagem precisa ter no mínimo 100 caracteres.";
    return;
  }

  // Simula envio
  spinner.style.display = "block";
  submitBtn.disabled = true;
  result.innerText = "";

  setTimeout(() => {
    spinner.style.display = "none";
    result.innerText = "Formulário enviado com sucesso!";

    // Limpa os campos
    form.reset();
    submitBtn.disabled = true;
  }, 2000);
});
