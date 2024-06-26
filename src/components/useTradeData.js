import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useTradeData = () => {
    const [trades, setTrades] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [symbol, setSymbol] = useState('btcusdt');
    const [marketType, setMarketType] = useState('spot');
    const [isRealTime, setIsRealTime] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataType, setDataType] = useState('trades'); // 默认值为 'trades'

    const filterTrades = useCallback((data) => {
        return data.filter(trade => trade.quantity > 0.5).slice(0, 100);
    }, []);

    const fetchTrades = useCallback(async (isRealTime, dataType) => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:5003/get-data', {
                params: {
                    start_time: startTime,
                    end_time: endTime,
                    symbol: symbol,
                    market_type: marketType,
                    data_type: dataType
                }
            });
            console.log('Fetched trades:', response.data);
            setTrades(filterTrades(response.data));
        } catch (error) {
            console.error('Error fetching trades:', error);
            alert('获取数据时出错，请稍后再试。');
        } finally {
            setLoading(false);
        }
    }, [startTime, endTime, symbol, marketType, filterTrades]);

    const fetchLatestTrades = useCallback(async (dataType) => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:5003/get-latest-orderbook', {
                params: {
                    market_type: marketType,
                    data_type: dataType
                }
            });
            console.log('Latest trades:', response.data);
            setTrades(prevTrades => {
                const updatedTrades = [...filterTrades(response.data), ...prevTrades].slice(0, 100);
                return updatedTrades;
            });
        } catch (error) {
            console.error('Error fetching latest trades:', error);
            alert('获取最新数据时出错，请稍后再试。');
        } finally {
            setLoading(false);
        }
    }, [marketType, filterTrades]);

    const exportTrades = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5003/export-data', {
                params: {
                    start_time: startTime,
                    end_time: endTime,
                    symbol: symbol,
                    market_type: marketType,
                    data_type: dataType
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
            alert('导出数据时出错，请稍后再试。');
        }
    };

    useEffect(() => {
        if (isRealTime) {
            const interval = setInterval(() => fetchLatestTrades(dataType), 5000);
            return () => clearInterval(interval);
        } else {
            setTrades([]);
        }
    }, [isRealTime, marketType, fetchLatestTrades, dataType]);

    useEffect(() => {
        if (!isRealTime && startTime && endTime) {
            fetchTrades(false, dataType);
        }
    }, [startTime, endTime, symbol, marketType, isRealTime, fetchTrades, dataType]);

    return {
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
    };
};

export default useTradeData;