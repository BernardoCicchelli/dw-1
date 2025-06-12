document.addEventListener('DOMContentLoaded', () => {

    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    let myChart = null;
    const progressBar = document.getElementById('progressBar');

    // Textos para o relatório final.
    const definicoesEducacionais = {
        'Tesouro Selic': 'É o investimento mais seguro do país. Seu rendimento acompanha a taxa básica de juros (Selic), sendo ideal para reserva de emergência.',
        'CDB 100% CDI': 'Um tipo de empréstimo para bancos com segurança similar à poupança, mas rendimento maior, atrelado à taxa CDI (próxima da Selic).',
        'Renda Fixa': 'Categoria de investimentos com regras de remuneração definidas no momento da aplicação. É o porto seguro da carteira.',
        'Fundos Imobiliários': 'Permitem investir em grandes imóveis (shoppings, prédios comerciais) com pouco dinheiro e receber "aluguéis" mensais (dividendos).',
        'Ações Nacionais': 'Comprar uma ação é como se tornar um pequeno sócio de grandes empresas brasileiras. Têm maior potencial de lucro e maior risco.',
        'Ações Internacionais': 'Investir em empresas globais (como Apple, Google) através da bolsa brasileira (via BDRs ou ETFs). Ajuda a diversificar o patrimônio.',
        'Criptomoedas': 'Ativos digitais descentralizados, como o Bitcoin. São extremamente voláteis, com altíssimo risco e potencial de retorno.'
    };
    
    // Paleta de cores para o gráfico (customizável).
    const chartColors = ['#9d4edd', '#2dceb1', '#ff6b6b', '#feca57'];

    const updateProgressBar = () => {
        if (!progressBar) return;
        const totalSteps = slides.length - 1;
        const progressPercentage = (currentSlide / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    };

    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        currentSlide = index;
        updateProgressBar();
    };
    
    window.startQuiz = () => showSlide(1);
    window.prevSlide = () => { if (currentSlide > 0) showSlide(currentSlide - 1); };
    window.restartQuiz = () => {
        showSlide(0);
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    };

    window.nextSlide = () => {
        const currentInputs = slides[currentSlide].querySelectorAll('input[type="radio"]');
        if (currentInputs.length > 0) {
            const isChecked = Array.from(currentInputs).some(input => input.checked);
            if (!isChecked) {
                alert('Por favor, selecione uma opção para continuar.');
                return;
            }
        }
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    };

    const renderChart = (data) => {
        const ctx = document.getElementById('investmentChart').getContext('2d');
        // Importante: destrói o gráfico anterior antes de desenhar um novo para evitar sobreposição.
        if (myChart) myChart.destroy();
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: chartColors,
                    borderColor: '#161625',
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: { legend: { display: false } }
            }
        });
    };

    const generateReport = (answers) => {
        const relatorioTexto = document.getElementById('relatorio-texto');
        let perfilTexto = '';
        let chartData = { labels: [], values: [] };

        // Sistema de pontos simples para definir o perfil.
        let score = 0;
        if (answers.horizonte === 'longo') score += 2;
        if (answers.horizonte === 'medio') score += 1;
        if (answers.tolerancia === 'alta') score += 2;
        if (answers.tolerancia === 'media') score += 1;
        if (answers.conhecimento === 'avancado') score += 2;
        if (answers.conhecimento === 'intermediario') score += 1;

        // Define a carteira recomendada com base na pontuação.
        if (score <= 2) {
            perfilTexto = `<p>Com base em suas respostas, seu perfil é <strong>Conservador</strong>. A prioridade é a segurança e previsibilidade.</p>`;
            chartData = { labels: ['Tesouro Selic', 'CDB 100% CDI'], values: [70, 30] };
        } else if (score <= 4) {
             perfilTexto = `<p>Com base em suas respostas, seu perfil é <strong>Moderado</strong>. Você busca um bom equilíbrio entre risco e retorno.</p>`;
            chartData = { labels: ['Renda Fixa', 'Fundos Imobiliários', 'Ações Nacionais'], values: [50, 30, 20] };
        } else {
             perfilTexto = `<p>Com base em suas respostas, seu perfil é <strong>Arrojado</strong>. Você busca maior rentabilidade, aceitando mais riscos.</p>`;
            chartData = { labels: ['Ações Nacionais', 'Ações Internacionais', 'Fundos Imobiliários', 'Renda Fixa'], values: [40, 30, 20, 10] };
        }

        // Monta a legenda personalizada com as explicações.
        let explicacoesHTML = '<h4>Entenda sua Carteira:</h4><ul>';
        chartData.labels.forEach((label, index) => {
            if (definicoesEducacionais[label]) {
                const color = chartColors[index % chartColors.length];
                explicacoesHTML += `<li><span class="legend-swatch" style="background-color:${color};"></span><div><strong>${label}:</strong> ${definicoesEducacionais[label]}</div></li>`;
            }
        });
        explicacoesHTML += '</ul>';
        
        relatorioTexto.innerHTML = perfilTexto + explicacoesHTML;
        renderChart(chartData);
    };
    
    window.showResults = () => {
        const answers = {
            valor_inicial: document.querySelector('input[name="valor_inicial"]:checked')?.value,
            aporte_mensal: document.querySelector('input[name="aporte_mensal"]:checked')?.value,
            horizonte: document.querySelector('input[name="horizonte"]:checked')?.value,
            conhecimento: document.querySelector('input[name="conhecimento"]:checked')?.value,
            tolerancia: document.querySelector('input[name="tolerancia"]:checked')?.value,
            objetivo: document.querySelector('input[name="objetivo"]:checked')?.value,
        };

        // Garante que todas as perguntas foram respondidas.
        if (Object.values(answers).some(answer => !answer)) {
            alert('Parece que uma pergunta ficou sem resposta. Por favor, verifique.');
            for(let i = 1; i < slides.length - 1; i++) {
                const radios = slides[i].querySelectorAll('input[type="radio"]');
                const isAnswered = Array.from(radios).some(r => r.checked);
                if (!isAnswered) {
                    showSlide(i);
                    break;
                }
            }
            return;
        }

        generateReport(answers);
        showSlide(slides.length - 1);
    };

    // Garante que o script só rode na página do simulador.
    if (document.querySelector('.slides-container')) {
        showSlide(0);
    }
});