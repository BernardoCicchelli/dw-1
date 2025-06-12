document.addEventListener('DOMContentLoaded', () => {

    const tabelaBody = document.getElementById('cotacoes-tabela');
    const refreshButton = document.getElementById('refresh-button');

    // Para customizar a tabela, edite os códigos de moeda nesta lista.
    const moedasDeInteresse = ['USD', 'EUR', 'BTC', 'ETH', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];

    const fetchAllQuotes = async () => {
        tabelaBody.innerHTML = '<tr><td colspan="5">Carregando cotações...</td></tr>';

        try {
            const response = await fetch('https://economia.awesomeapi.com.br/json/all');
            if (!response.ok) throw new Error('Falha ao buscar dados da API.');
            
            const quotes = await response.json();
            populateTable(quotes);

        } catch (error) {
            console.error(error);
            tabelaBody.innerHTML = '<tr><td colspan="5">Não foi possível carregar os dados. Tente novamente.</td></tr>';
        }
    };

    const populateTable = (quotes) => {
        tabelaBody.innerHTML = ''; 

        moedasDeInteresse.forEach(codigo => {
            const quote = quotes[codigo];
            if (quote) {
                const tr = document.createElement('tr');

                // Adiciona cor e ícone para a variação da moeda.
                const variacao = parseFloat(quote.pctChange);
                let variacaoHTML = '';
                if (variacao > 0) {
                    variacaoHTML = `<span class="variacao-alta"><i class="fas fa-arrow-up"></i> ${variacao.toFixed(2)}%</span>`;
                } else if (variacao < 0) {
                     variacaoHTML = `<span class="variacao-baixa"><i class="fas fa-arrow-down"></i> ${variacao.toFixed(2)}%</span>`;
                } else {
                    variacaoHTML = `<span>${variacao.toFixed(2)}%</span>`;
                }

                tr.innerHTML = `
                    <td>${quote.code}</td>
                    <td>${quote.name.split('/')[0]}</td>
                    <td>R$ ${parseFloat(quote.bid).toFixed(2)}</td>
                    <td>${variacaoHTML}</td>
                    <td>${new Date(quote.create_date).toLocaleTimeString('pt-BR')}</td>
                `;
                tabelaBody.appendChild(tr);
            }
        });
    };

    refreshButton.addEventListener('click', fetchAllQuotes);
    fetchAllQuotes();
});