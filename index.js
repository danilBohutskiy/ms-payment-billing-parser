const CURRENCY_TURK_RATE = 1.38;
const CURRENCY_ARGENTINA_RATE = 0.11;

var calcPayment = () => {
    var elements = $('body').find('[id*="order-details-drawer"] span[id*="drawer"]');
    var prices = [];
    var totalAmount = 0;

    elements.each(function() {
        let parent = $(this).closest('div[id]').parent().closest('div[id]');
        var games = $(parent).find('a[data-bi-id][rel]');
        var gameTextArray = games.map(function() {
            return $(this).text().trim();
        }).get();

        if (gameTextArray.includes('EA Play') || gameTextArray.includes('Xbox Game Pass Ultimate')) {
            return;
        }

        var text = $(this).text()
            .replace(/USD/g, '')
            .replace(/\./g, '')
            .replace(/\,/g, '.');

        var matches = text.match(/([\d\.]+)|(\$|\₺|USD)/gi);

        if (matches && matches.length >= 2) {
            var original_price = parseFloat(matches[1]);
            var currency = matches[0];
            var price = 0;

            if (currency === '₺') {
                currency = 'TRY';
                price = original_price * CURRENCY_TURK_RATE;
            } else if (currency === '$') {
                currency = 'ARS';
                price = original_price * CURRENCY_ARGENTINA_RATE;
            }

            totalAmount += price;

            prices.push({ games: gameTextArray, price_currency: original_price, price: price.toFixed(2), currency: currency });
        }
    });

    return {
        total_sum: totalAmount.toFixed(2),
        items: prices,
    };
};

var result = calcPayment();

console.log(JSON.stringify(result)); 
