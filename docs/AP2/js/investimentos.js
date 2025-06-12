document.addEventListener('DOMContentLoaded', () => {

    // SEÇÃO DE RENDA FIXA (continua buscando da API real)
    const fetchTaxasRendaFixa = async () => {
        try {
            const response = await fetch('https://brasilapi.com.br/api/taxas/v1');
            if (!response.ok) throw new Error('Erro ao buscar taxas.');
            
            const taxas = await response.json();
            
            const selic = taxas.find(taxa => taxa.nome === 'Selic');
            const cdi = taxas.find(taxa => taxa.nome === 'CDI');
            const ipca = taxas.find(taxa => taxa.nome === 'IPCA');

            if (selic) document.getElementById('selic-rate').textContent = selic.valor.toFixed(2);
            if (cdi) document.getElementById('cdi-rate').textContent = cdi.valor.toFixed(2);
            if (ipca) document.getElementById('ipca-rate').textContent = ipca.valor.toFixed(2);

        } catch (error) {
            console.error("Erro na Renda Fixa:", error);
        }
    };

    // SEÇÃO DE RENDA VARIÁVEL (agora com dados de simulação)

    // Função que preenche as tabelas de Ações e FIIs com dados fixos.
    const populateRendaVariavelComMockData = () => {
        const acoesTableBody = document.getElementById('acoes-table-body');
        const fiisTableBody = document.getElementById('fiis-table-body');
        
        // DADOS DE SIMULAÇÃO (MOCK DATA)
        // Como a API da Brapi agora exige chave, usaremos estes dados fixos como exemplo.
        // Você pode alterar os valores aqui para testar.
        const mockData = {
            results: [
                { symbol: 'IBOV', regularMarketPrice: 121570.00, regularMarketChangePercent: 0.80, priceEarnings: null, dividendYield: null },
                { symbol: 'PETR4', regularMarketPrice: 37.50, regularMarketChangePercent: -1.25, priceEarnings: 4.5, dividendYield: 15.2 },
                { symbol: 'VALE3', regularMarketPrice: 61.30, regularMarketChangePercent: 2.10, priceEarnings: 6.1, dividendYield: 8.5 },
                { symbol: 'ITUB4', regularMarketPrice: 32.15, regularMarketChangePercent: 0.55, priceEarnings: 8.9, dividendYield: 5.8 },
                { symbol: 'IFIX', regularMarketPrice: 3360.50, regularMarketChangePercent: -0.15 },
                { symbol: 'MXRF11', regularMarketPrice: 10.25, regularMarketChangePercent: 0.49 },
                { symbol: 'HGLG11', regularMarketPrice: 162.80, regularMarketChangePercent: -0.60 }
            ]
        };
        
        // Limpa as tabelas
        acoesTableBody.innerHTML = '';
        fiisTableBody.innerHTML = '';

        // Itera sobre os dados de simulação para preencher as tabelas.
        mockData.results.forEach(quote => {
            const variacaoHTML = getVariacaoHTML(quote.regularMarketChangePercent);

            // Se for Ação, preenche a tabela de ações com as colunas extras.
            if (quote.priceEarnings !== undefined) {
                 const row = `
                    <tr>
                        <td>${quote.symbol}</td>
                        <td>R$ ${quote.regularMarketPrice.toFixed(2)}</td>
                        <td>${variacaoHTML}</td>
                        <td>${quote.priceEarnings?.toFixed(2) || '--'}</td>
                        <td>${quote.dividendYield?.toFixed(2) || '--'}%</td>
                    </tr>
                `;
                acoesTableBody.innerHTML += row;
            } 
            // Se for FII, preenche a tabela de FIIs.
            else {
                const row = `
                    <tr>
                        <td>${quote.symbol}</td>
                        <td>R$ ${quote.regularMarketPrice.toFixed(2)}</td>
                        <td>${variacaoHTML}</td>
                    </tr>
                `;
                fiisTableBody.innerHTML += row;
            }
        });
    };
    
    // Função auxiliar para criar o HTML da variação (reutilizada).
    function getVariacaoHTML(variacao) {
        const variacaoNum = parseFloat(variacao) || 0;
        if (variacaoNum > 0) {
            return `<span class="variacao-alta"><i class="fas fa-arrow-up"></i> ${variacaoNum.toFixed(2)}%</span>`;
        } else if (variacaoNum < 0) {
            return `<span class="variacao-baixa"><i class="fas fa-arrow-down"></i> ${variacaoNum.toFixed(2)}%</span>`;
        } else {
            return `<span>${variacaoNum.toFixed(2)}%</span>`;
        }
    }

    // Chama as funções para carregar a página
    fetchTaxasRendaFixa();
    populateRendaVariavelComMockData(); // Chamamos a nossa nova função com dados fixos
});