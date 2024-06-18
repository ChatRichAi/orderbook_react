import React, { useState } from 'react';
import axios from 'axios';

const OrderBookQuery = ({ setTrades }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [symbol, setSymbol] = useState('btcusdt');
    const [marketType, setMarketType] = useState('spot');

    const fetchTrades = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5003/get-orderbook', {
                params: {
                    start_time: startTime,
                    end_time: endTime,
                    symbol: symbol,
                    market_type: marketType
                }
            });
            console.log('Fetched trades:', response.data);
            const filteredTrades = response.data.filter(trade => trade.quantity > 0.5);
            setTrades(filteredTrades.slice(0, 100));
        } catch (error) {
            console.error('Error fetching trades:', error);
        }
    };

    const exportTrades = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5003/export-orderbook', {
                params: {
                    start_time: startTime,
                    end_time: endTime,
                    symbol: symbol,
                    market_type: marketType
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'orderbook.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error exporting trades:', error);
        }
    };

    return (
        <div>
            <label>
                Start Time:
                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </label>
            <label>
                End Time:
                <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </label>
            <label>
                Symbol:
                <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                    <option value="btcusdt">BTCUSDT</option>
                    <option value="btcusdt_perp">BTCUSDT_PERP</option>
                </select>
            </label>
            <label>
                Market Type:
                <select value={marketType} onChange={(e) => setMarketType(e.target.value)}>
                    <option value="spot">Spot</option>
                    <option value="perp">Perpetual</option>
                </select>
            </label>
            <button onClick={fetchTrades}>Fetch Order Book</button>
            <button onClick={exportTrades}>Export Order Book</button>
        </div>
    );
};

export default OrderBookQuery;