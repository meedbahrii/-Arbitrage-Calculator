const fetchPrices = async () => {
  try {
    const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price');
    const binanceData = await binanceResponse.json();
    console.log('Binance Data:', binanceData);
    
    const krakenResponse = await fetch('https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD');
    const krakenData = await krakenResponse.json();
    console.log('Kraken Data:', krakenData);
    
    const coinbaseResponse = await fetch('https://api.pro.coinbase.com/products/BTC-USD/ticker');
    const coinbaseData = await coinbaseResponse.json();
    console.log('Coinbase Data:', coinbaseData);
    
    const prices = {
      binance: binanceData.filter(ticker => ticker.symbol === 'BTCUSDT')[0].price,
      kraken: krakenData.result.XXBTZUSD.c[0],
      coinbase: coinbaseData.price
    };
    
    console.log('Prices:', prices);
    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return null;
  }
};

const calculateArbitrage = (prices) => {
  if (!prices) return [];
  
  const opportunities = [];
  const exchanges = Object.keys(prices);
  
  for (let i = 0; i < exchanges.length; i++) {
    for (let j = i + 1; j < exchanges.length; j++) {
      const exchangeA = exchanges[i];
      const exchangeB = exchanges[j];
      const priceA = parseFloat(prices[exchangeA]);
      const priceB = parseFloat(prices[exchangeB]);
      
      if (priceA < priceB) {
        opportunities.push({
          buy: exchangeA,
          sell: exchangeB,
          profit: ((priceB - priceA) / priceA * 100).toFixed(2)
        });
      } else {
        opportunities.push({
          buy: exchangeB,
          sell: exchangeA,
          profit: ((priceA - priceB) / priceB * 100).toFixed(2)
        });
      }
    }
  }
  
  console.log('Opportunities:', opportunities);
  return opportunities;
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('fetchPrices', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(async () => {
  const prices = await fetchPrices();
  const opportunities = calculateArbitrage(prices);
  
  chrome.storage.local.set({ opportunities });
});
