document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const form = document.getElementById('sinistroForm');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    const modalContent = document.getElementById('modalContent');
    const themeToggle = document.getElementById('themeToggle');
    const cpfInput = document.getElementById('cpfCondutor');
    const protocolBoxes = document.querySelectorAll('.protocol-box');

    // Controle do tema claro/escuro
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        // Salva a preferência do tema no localStorage
        localStorage.setItem('theme', newTheme);
    });

    // Carrega o tema salvo anteriormente
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    // Formatação automática do CPF
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
        
        // Formata como XXX.XXX.XXX-XX
        if (value.length > 0) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        
        e.target.value = value;
    });

    // Função para formatar datas no padrão brasileiro
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Manipulação do envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coleta os dados do formulário
        const formData = {
            dataInformada: document.getElementById('dataInformada').value,
            dataOcorrencia: document.getElementById('dataOcorrencia').value,
            evento: document.getElementById('evento').value,
            localOcorrido: document.getElementById('localOcorrido').value,
            origemViagem: document.getElementById('origemViagem').value,
            destinoViagem: document.getElementById('destinoViagem').value,
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

        // Cria o conteúdo do modal
        const content = `
            <div class="report-details">
                <p><strong>Sinistro Protocolo:</strong> </p>
                <p><strong>Data e Hora que o motorista informou:</strong> ${formatDate(formData.dataInformada)}</p>
                <p><strong>Data e Hora em que ocorreu:</strong> ${formatDate(formData.dataOcorrencia)}</p>
                <p><strong>Evento:</strong> ${formData.evento}</p>
                <p><strong>Local do Ocorrido:</strong> ${formData.localOcorrido}</p>
                <p><strong>Origem da Viagem:</strong> ${formData.origemViagem}</p>
                <p><strong>Destino da viagem:</strong> ${formData.destinoViagem}</p>
                <p><strong>Placa do Cavalo:</strong> ${formData.placaCavalo}</p>
                <p><strong>Placa da Carreta:</strong> ${formData.placaCarreta}</p>
                <p><strong>CPF do Condutor:</strong> ${formData.cpfCondutor}</p>
                <p><strong>Nome do Condutor:</strong> ${formData.nomeCondutor}</p>
                <p><strong>Transportadora:</strong> ${formData.transportadora}</p>
                <p><strong>Tecnologia do Rastreador:</strong> ${formData.tecnologia}</p>
                <p><strong>Mercadoria:</strong> ${formData.mercadoria}</p>
                <p><strong>Nota Fiscal:</strong> ${formData.notaFiscal}</p>
                <p><strong>Valor:</strong> R$ ${formData.valor}</p>
                <p><strong>Explicação:</strong> ${formData.explicacao}</p>
            </div>
            <div class="copy-feedback" id="copyFeedback">Copiado com sucesso!</div>
            <button id="copyButton" class="copy-btn">Copiar Dados</button>
        `;

        modalContent.innerHTML = content;
        modal.style.display = 'block';

        // Funcionalidade de copiar para área de transferência
        const copyButton = document.getElementById('copyButton');
        copyButton.addEventListener('click', function() {
            const reportText = `Sinistro Protocolo: ${new Date().getTime()}\n` + 
                Object.entries(formData)
                .map(([key, value]) => {
                    let formattedValue = value;
                    if (key === 'dataInformada' || key === 'dataOcorrencia') {
                        formattedValue = formatDate(value);
                    }
                    if (key === 'valor') {
                        formattedValue = `R$ ${value}`;
                    }
                    return `${getFieldLabel(key)}: ${formattedValue}`;
                })
                .join('\n');

            navigator.clipboard.writeText(reportText)
                .then(() => {
                    const feedback = document.getElementById('copyFeedback');
                    feedback.classList.add('show');
                    copyButton.textContent = 'Copiado!';
                    setTimeout(() => {
                        feedback.classList.remove('show');
                        copyButton.textContent = 'Copiar Dados';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erro ao copiar:', err);
                    copyButton.textContent = 'Erro ao copiar';
                });
        });
    });

    // Função auxiliar para obter labels dos campos
    function getFieldLabel(key) {
        const labels = {
            dataInformada: 'Data e Hora que o motorista informou',
            dataOcorrencia: 'Data e Hora em que ocorreu',
            evento: 'Evento',
            localOcorrido: 'Local do Ocorrido',
            origemViagem: 'Origem da Viagem',
            destinoViagem: 'Destino da viagem',
            placaCavalo: 'Placa do Cavalo',
            placaCarreta: 'Placa da Carreta',
            cpfCondutor: 'CPF do Condutor',
            nomeCondutor: 'Nome do Condutor',
            transportadora: 'Transportadora',
            tecnologia: 'Tecnologia do Rastreador',
            mercadoria: 'Mercadoria',
            notaFiscal: 'Nota Fiscal',
            valor: 'Valor',
            explicacao: 'Explicação'
        };
        return labels[key] || key;
    }

    // Controles do modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Funcionalidade de limpar formulário
    const cleanButton = document.getElementById('cleanForm');
    cleanButton.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja limpar o formulário?')) {
            form.reset();
        }
    });

    // Controle de expansão dos protocolos
    protocolBoxes.forEach(box => {
        const header = box.querySelector('.protocol-header');
        header.addEventListener('click', () => {
            // Fecha outras caixas abertas
            protocolBoxes.forEach(otherBox => {
                if (otherBox !== box && otherBox.classList.contains('expanded')) {
                    otherBox.classList.remove('expanded');
                }
            });
            // Alterna o estado da caixa atual
            box.classList.toggle('expanded');
        });
    });

    // Controle da sidebar em mobile
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');

    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        // Alterna o ícone do botão
        toggleSidebarBtn.textContent = sidebar.classList.contains('show') ? '✖' : '📋';
    });

    // Fecha a sidebar ao clicar fora dela em mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && e.target !== toggleSidebarBtn) {
                sidebar.classList.remove('show');
                toggleSidebarBtn.textContent = '📋';
            }
        }
    });
});