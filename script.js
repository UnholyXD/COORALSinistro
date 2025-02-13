const meuFormulario = document.getElementById('meuFormulario');
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName('close')[0];
const modalContent = document.getElementById('modalContent');
const copyButton = document.getElementById('copyButton');


meuFormulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const dados = {};

    for (let i = 1; i <= 16; i++) {
        const label = document.querySelector(`label[for="campo${i}"]`).textContent;
        const input = document.getElementById(`campo${i}`);
        dados[label] = input.value;
    }

    // Create formatted content for modal
    let conteudo = '';
    for (const campo in dados) {
        conteudo += `${campo} ${dados[campo]}\n`;
    }

    // Display content in modal
    modalContent.textContent = conteudo;
    modal.style.display = 'block';
});

copyButton.addEventListener('click', async () => {
  try {
      await navigator.clipboard.writeText(modalContent.textContent);
      const originalText = copyButton.textContent;
      copyButton.textContent = 'Copiado!';
      
      // Reset button text after 2 seconds
      setTimeout(() => {
          copyButton.textContent = originalText;
      }, 2000);
  } catch (err) {
      console.error('Failed to copy text: ', err);
      copyButton.textContent = 'Erro ao copiar';
  }
});

// Close modal when clicking (X)
span.onclick = function() {
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}