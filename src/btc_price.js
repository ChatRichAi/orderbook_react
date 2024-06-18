import json
import websocket
from flask import Flask, jsonify, request, send_file
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import pandas as pd
import pymysql
import sys
import os

app = Flask(__name__)

# 启用CORS，允许跨域请求
from flask_cors import CORS
CORS(app)

# 配置数据库连接
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://yishen:yishen0428@localhost/binance'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 定义数据库模型，用于保存盘口数据
class OrderBook(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    is_bid = db.Column(db.Boolean, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# 创建数据库表
with app.app_context():
    db.create_all()

# 处理WebSocket消息的回调函数
def on_message(ws, message):
    data = json.loads(message)
    symbol = data['s']
    timestamp = datetime.fromtimestamp(data['E'] / 1000.0)
    
    # 处理买单
    for bid in data['b']:
        price = float(bid[0])
        quantity = float(bid[1])
        order = OrderBook(symbol=symbol, price=price, quantity=quantity, is_bid=True, timestamp=timestamp)
        db.session.add(order)
    
    # 处理卖单
    for ask in data['a']:
        price = float(ask[0])
        quantity = float(ask[1])
        order = OrderBook(symbol=symbol, price=price, quantity=quantity, is_bid=False, timestamp=timestamp)
        db.session.add(order)
    
    db.session.commit()
    print(f"Order book updated for {symbol} at {timestamp}")

# 处理WebSocket错误的回调函数
def on_error(ws, error):
    print(f"WebSocket error: {error}")

# 处理WebSocket关闭的回调函数
def on_close(ws, close_status_code, close_msg):
    print("WebSocket closed")

# 处理WebSocket打开的回调函数
def on_open(ws):
    print("WebSocket connected")
    # 订阅BTCUSDT现货和BTC PERP合约的深度信息
    subscribe_message = {
        "method": "SUBSCRIBE",
        "params": [
            "btcusdt@depth",  # BTC现货
            "btcusdt_perp@depth"  # BTC PERP合约
        ],
        "id": 1
    }
    ws.send(json.dumps(subscribe_message))

# 启动WebSocket连接
def start_websocket():
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://fstream.binance.com/ws",
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()

# 提供API接口来根据时间区间调取数据
@app.route('/get-orderbook', methods=['GET'])
def get_orderbook():
    try:
        start_time = request.args.get('start_time')
        end_time = request.args.get('end_time')
        symbol = request.args.get('symbol')  # 获取交易对
        print(f"Received request with start_time: {start_time}, end_time: {end_time}, symbol: {symbol}")
        start_time = datetime.strptime(start_time, '%Y-%m-%dT%H:%M')  # 修改时间格式
        end_time = datetime.strptime(end_time, '%Y-%m-%dT%H:%M')  # 修改时间格式
        orders = OrderBook.query.filter(OrderBook.timestamp >= start_time, OrderBook.timestamp <= end_time, OrderBook.symbol == symbol).all()
        print(f"Query result: {orders}")
        result = [{'symbol': order.symbol, 'price': order.price, 'quantity': order.quantity, 'is_bid': order.is_bid, 'timestamp': order.timestamp} for order in orders]
        print(f"Returning result: {result}")
        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

# 提供API接口来导出数据为CSV
@app.route('/export-orderbook', methods=['GET'])
def export_orderbook():
    try:
        start_time = request.args.get('start_time')
        end_time = request.args.get('end_time')
        symbol = request.args.get('symbol')  # 获取交易对
        print(f"Received request with start_time: {start_time}, end_time: {end_time}, symbol: {symbol}")
        start_time = datetime.strptime(start_time, '%Y-%m-%dT%H:%M')  # 修改时间格式
        end_time = datetime.strptime(end_time, '%Y-%m-%dT%H:%M')  # 修改时间格式
        orders = OrderBook.query.filter(OrderBook.timestamp >= start_time, OrderBook.timestamp <= end_time, OrderBook.symbol == symbol).all()
        print(f"Query result: {orders}")
        
        # 将查询结果转换为DataFrame
        df = pd.DataFrame([{
            'symbol': order.symbol,
            'price': order.price,
            'quantity': order.quantity,
            'is_bid': order.is_bid,
            'timestamp': order.timestamp
        } for order in orders])
        
        # 导出为CSV文件
        csv_file = 'orderbook.csv'
        df.to_csv(csv_file, index=False)
        
        # 发送CSV文件
        return send_file(csv_file, as_attachment=True)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

# 启动Flask应用程序
if __name__ == '__main__':
    # 启动WebSocket连接
    from threading import Thread
    websocket_thread = Thread(target=start_websocket)
    websocket_thread.start()
    
    # 启动Flask应用
    app.run(debug=True, port=5001)