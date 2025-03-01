// Add these functions at the beginning of the file
function setTheme(theme) {
    // Remove all theme classes first
    document.body.classList.remove('light-mode', 'rainbow-mode');
    
    // Set the appropriate theme
    switch(theme) {
        case 'light':
            document.body.classList.add('light-mode');
            break;
        case 'rainbow':
            document.body.classList.add('rainbow-mode');
            break;
        // dark theme is default, no class needed
    }
    localStorage.setItem('theme', theme);
}

// Separate toggle functions for basic and rainbow themes
function toggleBasicTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    // Only toggle between dark and light if not in rainbow mode
    if (currentTheme !== 'rainbow') {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        updateThemeButton(newTheme);
    }
}

function toggleRainbowTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'rainbow') {
        // If leaving rainbow mode, go back to dark theme
        setTheme('dark');
        updateThemeButton('dark');
    } else {
        setTheme('rainbow');
    }
}

function updateThemeButton(theme) {
    const button = document.querySelector('.theme-toggle');
    if (theme === 'light') {
        button.innerHTML = '🌙 Modo Escuro';
    } else {
        button.innerHTML = '☀️ Modo Claro';
    }
}

// Add this code to initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    updateThemeButton(savedTheme);

    // Add double-click event listener to the title for rainbow mode
    document.querySelector('h1').addEventListener('dblclick', toggleRainbowTheme);
});

document.getElementById('sinistroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Format dates
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR');
    };

    // Get all form values
    const formData = {
        dataInformada: formatDate(document.getElementById('dataInformada').value),
        dataOcorrido: formatDate(document.getElementById('dataOcorrido').value),
        evento: document.getElementById('evento').value,
        local: document.getElementById('local').value,
        origem: document.getElementById('origem').value,
        destino: document.getElementById('destino').value,
        placaCavalo: document.getElementById('placaCavalo').value,
        placaCarreta: document.getElementById('placaCarreta').value,
        cpfCondutor: document.getElementById('cpfCondutor').value,
        nomeCondutor: document.getElementById('nomeCondutor').value,
        transportadora: document.getElementById('transportadora').value,
        tecnologia: document.getElementById('tecnologia').value,
        mercadoria: document.getElementById('mercadoria').value,
        notaFiscal: document.getElementById('notaFiscal').value,
        valor: document.getElementById('valor').value,
        explicacao: document.getElementById('explicacao').value
    };

    // Create modal content
    const modalContent = `
        <div class="container">
            <p1><strong>Sinistro Processo: </strong></p1></p>
            <p><strong>Data e Hora que o motorista informou:</strong> ${formData.dataInformada}</p>
            <p><strong>Data e Hora em que ocorreu:</strong> ${formData.dataOcorrido}</p>
            <p><strong>Evento:</strong> ${formData.evento}</p>
            <p><strong>Local do Ocorrido:</strong> ${formData.local}</p>
            <p><strong>Origem da Viagem:</strong> ${formData.origem}</p>
            <p><strong>Destino da viagem:</strong> ${formData.destino}</p>
            <p><strong>Placa do Cavalo:</strong> ${formData.placaCavalo}</p>
            <p><strong>Placa da Carreta:</strong> ${formData.placaCarreta}</p>
            <p><strong>CPF do Condutor:</strong> ${formData.cpfCondutor}</p>
            <p><strong>Nome do Condutor:</strong> ${formData.nomeCondutor}</p>
            <p><strong>Transportadora:</strong> ${formData.transportadora}</p>
            <p><strong>Tecnologia do Rastreador:</strong> ${formData.tecnologia}</p>
            <p><strong>Mercadoria:</strong> ${formData.mercadoria}</p>
            <p><strong>Nota Fiscal:</strong> ${formData.notaFiscal}</p>
            <p><strong>Valor: </strong>R$ ${formData.valor}</p>
            <p><strong>Explicação:</strong> ${formData.explicacao}</p>
        </div>
    `;

    // Update modal content and show modal
    document.getElementById('modalContent').innerHTML = modalContent;
    document.getElementById('relatorioModal').classList.add('show');
});

function closeModal() {
    document.getElementById('relatorioModal').classList.remove('show');
}

// Add this new function to handle copying
function copyReport() {
    // Get the modal content
    const content = document.getElementById('modalContent').innerText;
    
    // Copy to clipboard
    navigator.clipboard.writeText(content)
        .then(() => {
            // Show feedback to user
            const copyButton = document.querySelector('.modal-footer .btn-primary');
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '✅ Copiado!';
            
            // Reset button text after 2 seconds
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 1500);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Não foi possível copiar o texto. Por favor, tente novamente.');
        });
}

// Add the clearForm function
function clearForm() {
    // Get all inputs and textareas
    const inputs = document.querySelectorAll('#sinistroForm input, #sinistroForm textarea');
    
    // Loop through each input
    inputs.forEach(input => {
        // Check if input has a default value (like COORAL and Sascar)
        if (input.id === 'transportadora') {
            input.value = 'COORAL';
        } else if (input.id === 'tecnologia') {
            input.value = 'Sascar';
        } else {
            input.value = '';
        }
    });
}

// Add this new function
function toggleInstructions(type) {
    const content = document.getElementById(`${type}-content`);
    const allContents = document.querySelectorAll('.instruction-content');
    
    // Close all other instruction boxes
    allContents.forEach(item => {
        if (item !== content && item.classList.contains('show')) {
            item.classList.remove('show');
        }
    });
    
    // Toggle the clicked instruction box
    content.classList.toggle('show');
}

// Add CPF formatting
document.getElementById('cpfCondutor').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 11) value = value.slice(0, 11);
    
    // Format CPF: 000.000.000-00
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
    }
    
    e.target.value = value;
}); 