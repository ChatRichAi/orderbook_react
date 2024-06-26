import React from 'react';
import TradeDataForm from './components/TradeDataForm';
import useTradeData from './components/useTradeData';

function App() {
    const {
        trades,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        symbol,
        setSymbol,
        marketType,
        setMarketType,
        isRealTime,
        setIsRealTime,
        fetchTrades,
        exportTrades,
        loading,
        dataType,
        setDataType
    } = useTradeData();

    return (
        <div className="App">
            <TradeDataForm
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                symbol={symbol}
                setSymbol={setSymbol}
                marketType={marketType}
                setMarketType={setMarketType}
                isRealTime={isRealTime}
                setIsRealTime={setIsRealTime}
                fetchTrades={fetchTrades}
                exportTrades={exportTrades}
                trades={trades}
                loading={loading}
                dataType={dataType}
                setDataType={setDataType}
            />
        </div>
    );
}

export default App;