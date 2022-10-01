//namespace object
const app = {};

app.$select = $('select');
app.$resultsStocks = $('.results-stocks');
app.$loadingOverlay = $('.loading-overlay');

app.getSelectedValue = () => {
    app.$select.on('change', ()=> {
        const selection = $('option:selected').val();
        app.getTrendingStocks(selection);
    });
}

app.yahooBaseUrl = 'https://yfapi.net'
app.key = 'doGL3Edpe5aWoffvXtFAz4KYzujPfzGZ6eyoPVqy';

app.getTrendingStocks = (selection) => {
    $.ajax({
        url: `${app.yahooBaseUrl}/v1/finance/trending/${selection}`,
        method: 'GET',
        dataType: 'json',
        headers: {
            'x-api-key': app.key
        }
    }).then((res) => {
        app.$resultsStocks.empty();
        app.displayTrendingStocks(res);
    }).catch((res) => {
        app.$resultsStocks.empty();
        app.displayErrorMessage();
    });
};

app.displayErrorMessage = () => {
    const errorMsg = `
    <p>We're very sorry. Please try again later. API Limit of 100 daily calls has been reached. ✋</p>
    `;
    app.$resultsStocks.html(errorMsg);
}

app.displayTrendingStocks = (region) => {
    const trendingStocks = region.finance.result[0].quotes; 
    const stockCount = region.finance.result[0].count;
    let symbolDisplay = '';
    trendingStocks.forEach(({ symbol }) => {
        symbolDisplay += `<li>${symbol}</li>`;
    });
    const trendingStocksHtml = `
        <h3>Symbols (${stockCount} Stocks):</h3>
        <ul>${symbolDisplay}</ul>
    `;
    app.$resultsStocks.html(trendingStocksHtml);
}

app.init = () => {
    app.getSelectedValue();

    $(document) 
        .ajaxSend(() => {
            $('.loading-overlay').fadeIn(300);
        }) //load state start
        .ajaxStop(() => {
            setTimeout(() => {
                $('.loading-overlay').fadeOut(300);
            }, 500);
        }); //load state end
};

$(() => app.init());