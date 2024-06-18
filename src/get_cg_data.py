import requests
from telegram import Bot
import pandas as pd
from ta.volume import OnBalanceVolumeIndicator

# Coinglass API密钥
API_KEY = 'f643b2ee7cfe4c71b92b66ab7129ba63'  # 替换为你的Coinglass API密钥

# Telegram设置
TELEGRAM_TOKEN = 'your_telegram_token'  # 替换为你的Telegram bot的token
TELEGRAM_CHAT_ID = 'your_chat_id'  # 替换为你的Telegram chat ID

# 获取所有标的
def get_all_symbols():
    url = "https://open-api.coinglass.com/public/v2/indicator/funding_avg"
    headers = {"X-API-KEY": API_KEY}
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

# 获取标的数据
def get_symbol_data(symbol):
    url = f"https://open-api.coinglass.com/public/v2/indicator/funding_avg?symbol={symbol}"
    headers = {"X-API-KEY": API_KEY}
    response = requests.get(url, headers=headers)
    data = response.json()
    return data

# 应用Wyckoff指标
def apply_wyckoff_indicator(data):
    df = pd.DataFrame(data)
    obv = OnBalanceVolumeIndicator(df['close'], df['volume'])
    df['obv'] = obv.on_balance_volume()
    # Wyckoff指标代码
    # ...
    return df

# 发送Telegram消息
def send_telegram_message(text):
    bot = Bot(token=TELEGRAM_TOKEN)
    bot.send_message(chat_id=TELEGRAM_CHAT_ID, text=text)

# 主函数
def main():
    symbols = get_all_symbols()
    for symbol in symbols:
        data = get_symbol_data(symbol)
        df = apply_wyckoff_indicator(data)
        # 检测SOS
        if df['obv'].iloc[-1] > df['obv'].iloc[-2]:  # 这只是一个示例，你需要替换为你的SOS检测条件
            send_telegram_message(f"SOS detected for {symbol} at {df.index[-1]}")

if __name__ == "__main__":
    main()