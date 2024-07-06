document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('arbitrage-form');
  const resultsDiv = document.getElementById('results');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const buyPrice = parseFloat(document.getElementById('buyPrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const transactionAmount = parseFloat(document.getElementById('transactionAmount').value);
    const exchangeAFee = parseFloat(document.getElementById('exchangeAFee').value) || 0;
    const exchangeBFee = parseFloat(document.getElementById('exchangeBFee').value) || 0;

    if (isNaN(buyPrice) || isNaN(sellPrice) || isNaN(transactionAmount)) {
      resultsDiv.innerHTML = '<p>Please enter valid numbers for all fields.</p>';
      return;
    }

    // Calculate net profit/loss
    const totalBuyCost = buyPrice * transactionAmount;
    const totalSellValue = sellPrice * transactionAmount;
    const netProfit = (totalSellValue - totalBuyCost) * (1 - (exchangeAFee / 100)) * (1 - (exchangeBFee / 100));
    const percentageProfit = ((netProfit / totalBuyCost) * 100).toFixed(2);

    // Display results
    resultsDiv.innerHTML = `
      <p>Total Buy Cost: ${totalBuyCost.toFixed(2)}</p>
      <p>Total Sell Value: ${totalSellValue.toFixed(2)}</p>
      <p>Net Profit: ${netProfit.toFixed(2)}</p>
      <p>Percentage Profit: ${percentageProfit}%</p>
    `;
  });
});
