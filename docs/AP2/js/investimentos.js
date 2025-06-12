document.addEventListener('DOMContentLoaded', () => {

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

    const fetchRendaVariavel = async () => {
        const acoesTableBody = document.getElementById('acoes-table-body');
        const fiisTableBody = document.getElementById('fiis-table-body');
        
        const seuTokenDaBrapi = 'mB5RM3jVcghFsNGwiVH8dT'; 
        
        // Separamos os tickers para buscar os dados fundamentalistas apenas das ações
        const tickersAcoes = 'IBOV,PETR4,VALE3,ITUB4';
        const tickersFiis = 'IFIX,MXRF11,HGLG11';
        
        // URL para Ações com dados fundamentalistas
        const urlAcoes = `https://brapi.dev/api/quote/${tickersAcoes}?fundamental=true`;
        // URL para FIIs (chamada simples, sem 'fundamental')
        const urlFiis = `https://brapi.dev/api/quote/${tickersFiis}`;

        try {
            // --- BUSCA DADOS DAS AÇÕES ---
            const responseAcoes = await fetch(urlAcoes, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${seuTokenDaBrapi}` }
            });
            if (!responseAcoes.ok) throw new Error('Falha ao buscar dados de ações.');
            const dataAcoes = await responseAcoes.json();
            
            acoesTableBody.innerHTML = ''; // Limpa a tabela de ações
            dataAcoes.results.forEach(quote => {
                const variacaoHTML = getVariacaoHTML(quote.regularMarketChangePercent);
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
            });

            // BUSCA DADOS DOS FIIs
            const responseFiis = await fetch(urlFiis, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${seuTokenDaBrapi}` }
            });
            if (!responseFiis.ok) throw new Error('Falha ao buscar dados de FIIs.');
            const dataFiis = await responseFiis.json();

            fiisTableBody.innerHTML = ''; // Limpa a tabela de FIIs
            dataFiis.results.forEach(quote => {
                 const variacaoHTML = getVariacaoHTML(quote.regularMarketChangePercent);
                 const row = `
                    <tr>
                        <td>${quote.symbol}</td>
                        <td>R$ ${quote.regularMarketPrice.toFixed(2)}</td>
                        <td>${variacaoHTML}</td>
                    </tr>
                `;
                fiisTableBody.innerHTML += row;
            });

        } catch(error) {
            console.error("Erro na Renda Variável:", error);
            const errorMessage = `Erro: ${error.message}.`;
            acoesTableBody.innerHTML = `<tr><td colspan="5">${errorMessage}</td></tr>`;
            fiisTableBody.innerHTML = `<tr><td colspan="3">${errorMessage}</td></tr>`;
        }
    };
    
    // Função auxiliar para criar o HTML da variação
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

    fetchTaxasRendaFixa();
    fetchRendaVariavel();
});