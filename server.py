import os
import requests
import json
import numpy as np
import pandas as pd
from bs4 import BeautifulSoup
from datetime import datetime

import feedparser
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})
all_products = []


@app.route('/')
def is_on():
    return "API is ON"


@app.route('/hello')
def hello():
    return 'Hello, World!'


@app.route('/newsticker')
def get_news():
    res = feedparser.parse("https://cointelegraph.com/rss")
    articles = res['entries']
    return_feed = []
    for article in articles:
        return_feed.append({
            'title': article['title'],
            'timestamp': article['published'],
            'link': article['link']
        })
    return jsonify(return_feed)


@app.route('/rates')
def get_rates():

    if len(all_products) == 0:
        try:
        # """"""""""""""""""""""""
        #           11111
        #             111
        #             111
        #             111
        #             111
        #             111
        #           1111111
        # """"""""""""""""""""""""
        # locked staking rates from binance
        
            t = requests.get(
                'https://www.binance.com/bapi/earn/v1/friendly/pos/union').json()
            print(t['total'])
            total = t['total']
            loops = int(np.ceil(total/15))

            for i in range(loops):
                ix = i+1
                res = requests.get(
                    f'https://www.binance.com/bapi/earn/v1/friendly/pos/union?pageSize=15&pageIndex={ix}&status=SUBSCRIBABLE').json()
                for i in res['data']:
                    if float(i['annualInterestRate']) > 0:
                        all_products.append({
                            'key': i['projects'][0]['id'],
                            'bonusRate': 'n/a',
                            'bonusAsset': 'n/a',
                            'asset': i['asset'],
                            'apy': round(float(i['annualInterestRate']), 2),
                            'lockTerm': i['projects'][0]['duration'],
                            'src': 'binanceLockedStaking',
                            'refer': 'https://www.binance.com/en/pos',
                            'lock': 1,
                            'source': 'Binance',
                            'type': 'deposit',
                            'icon': 'lock',
                            'url': 'https://cryptofonts.com/img/icons/{}.svg'.format(i["asset"].lower())

                        })
            print('binance staking done')
        # """"""""""""""""""""""""
        #            222
        #          22   22
        #                22
        #                22
        #               22
        #              22
        #            22
        #           22222222
        # """"""""""""""""""""""""
            # binance flex rates
            total = requests.get(
                f'https://www.binance.com/bapi/earn/v1/friendly/lending/daily/product/list?').json()['total']
            loops = int(np.ceil(total/15))

            for i in range(loops):
                ix = i+1
                res = requests.get(
                    f'https://www.binance.com/bapi/earn/v1/friendly/lending/daily/product/list?pageSize=15&pageIndex={ix}&status=ALL').json()

                for i in res['data']:
                    all_products.append({
                        'key': i['id'],
                        'bonusRate': 'n/a',
                        'bonusAsset': 'n/a',
                        'asset': i['name'],
                        'apy': float(i['avgAnnualInterestRate']),
                        'lockTerm': 0,
                        'src': 'binanceLockedStaking',
                        'refer': 'https://www.binance.com/en/savings#lending-fixeddeposits',
                        'lock': 0,
                        'source': 'Binance',
                        'type': 'deposit',
                        'icon': 'lock_open',
                        'url': 'https://cryptofonts.com/img/icons/{}.svg'.format(i["asset"].lower())
                    })
            print('binance flex done')
                    
        # """"""""""""""""""""""""
        #            333
        #          33   33
        #                33
        #              33
        #              33
        #                33
        #          33   33
        #            333
        # """"""""""""""""""""""""
    # Binance locked Savings
            res = requests.get(
                f'https://www.binance.com/bapi/earn/v1/friendly/lending/project/customizedFixedProject/list?pageSize=15&pageIndex=1&status=ALL').json()
            for i in res['data']:
                for j in i['list']:
                    all_products.append({
                        'key': j['projectId'],
                        'bonusRate': 'n/a',
                        'bonusAsset': 'n/a',
                        'asset': i['asset'],
                        'apy': round(float(j['interestRate']), 2),
                        'lockTerm': j['duration'],
                        'src': 'binanceSavings',
                        'refer': 'https://www.binance.com/en/savings#lending-fixeddeposits',
                        'lock': 1,
                        'source': 'Binance',
                        'type': 'deposit',
                        'icon': 'lock',
                        'url': 'https://cryptofonts.com/img/icons/{}.svg'.format(i["asset"].lower())
                    })
            print('binance locked savings done')

            # """"""""""""""""""""""""
            #       44    44
            #       44    44
            #       44    44
            #       44444444
            #             44
            #             44
            #             44
            # """"""""""""""""""""""""
            # all huobi products

            h_limit = requests.get(
                'https://www.huobi.com/-/x/hbg/v1/saving/mining/index/limitTime/list?isAllow=false&r=rrjnam&x-b3-traceid=82f1704bae9b4a1827f78107811e1e27').json()['data']
            h_flex = requests.get(
                'https://www.huobi.com/-/x/hbg/v1/saving/mining/index/active/list?isAllow=false&r=4zjk1&x-b3-traceid=0e0d725230cdd53887996706d9d09c1a').json()['data']
            h_fix = requests.get(
                'https://www.huobi.com/-/x/hbg/v1/saving/mining/index/fixed/list?isAllow=false&r=lop9g&x-b3-traceid=9804330f1af1a0652560f2e2c5675e8d').json()['data']
            h_all = h_limit + h_flex + h_fix

            for i in h_all:
                data = []
                if i['projectStatus'] == 1:
                    if i['shelfType'] == 0:
                        rate = i['day7YearRate']
                        lock = 0
                        icon = 'lock_open'
                        lockTerm = '0'
                        dType = 'deposit'
                    else:
                        rate = i['viewYearRate']
                        lock = 1
                        lockTerm = i['term']
                        dType = 'deposit'
                    all_products.append({
                        'key': f'h{i["projectId"]}',
                        'asset': i['currency'],
                        'bonusRate': 'n/a',
                        'bonusAsset': 'n/a',
                        'apy': rate,
                        'lock': lock,
                        'icon': icon,
                        'refer': 'https://www.huobi.com/en-us/financial/earnings',
                        'src': 'huobi',
                        'source': 'Huobi',
                        'lockTerm': lockTerm,
                        'type': dType,
                        'url': 'https://cryptofonts.com/img/icons/{}.svg'.format(i["currency"].lower())
                    })
            print('huobi done')

            # """"""""""""""""""""""""
            #       555555
            #       55
            #       55
            #       55555
            #           55
            #            55
            #       55555
            # """"""""""""""""""""""""
            # Binance US

            busa = requests.get(
                'https://www.binance.us/gateway-api/v1/friendly/staking/list?pageNum=1&pageSize=100').json()['data']
            for i in busa:
                all_products.append({
                    'key': f'busa{i["holdCoin"]}',
                    'asset': i['holdCoin'],
                    'bonusRate': 'n/a',
                    'bonusAsset': 'n/a',
                    'apy': float(i['lastEarningRate'])*100,
                    'lock': 0,
                    'icon': 'lock_open',
                    'refer': 'https://www.binance.us/en/staking',
                    'src': 'binUS',
                    'source': 'Binance US',
                    'lockTerm': 0,
                    'type': 'deposit',
                    'url': 'https://cryptofonts.com/img/icons/{}.svg'.format(i["holdCoin"].lower())
                })
            print('binance usa done')

            # """"""""""""""""""""""""
            #        66666
            #       66
            #       66
            #       66666
            #       66  66
            #       66   66
            #        6666
            # """"""""""""""""""""""""
            # Crypto.com rates
            res = requests.get('https://crypto.com/earn')
            soup = BeautifulSoup(res.text, 'lxml')
            tabs = soup.find_all('div', {'class': 'css-11bys66'})
            for tab in tabs:
                coin_data = tab.find_all('p')
                key = coin_data[0].text + \
                    coin_data[1].text
                
                asset = coin_data[0].text
                rate = round(float(coin_data[1].text.split(
                    ',')[0].replace('%', ''))/100, 2)
                url_raw = tab.find_all("div", {'class': "css-1aca62p"})
                url = "https://crypto.com" + url_raw[0].find_all('img')[0]['src']

                all_products.append({
                'key': key,
                    'asset': asset,
                    'bonusRate': 'n/a',
                    'bonusAsset': 'n/a',
                    'apy': rate,
                    'lock': 0,
                    'icon': 'lock_open',
                    'refer': 'https://crypto.com/earn',
                    'src': 'crypto.com',
                    'source': 'Crypto.com',
                    'lockTerm': 0,
                    'type': 'deposit',
                    'url': url
                            })
            print('crypto.com done')

            # """"""""""""""""""""""""
            #     77777777777
            #              77
            #             77
            #         7777777
            #         77
            #       77
            #      77
            # """"""""""""""""""""""""
            # Nexo.io rates


            res = requests.get('https://nexo.io/earn-crypto')
            soup = BeautifulSoup(res.text, 'lxml')
            nexo = soup.find_all('div',{'class':"-mb-32"})
            rates = [float(i.text)/100 for i in nexo[1].find_all('span',{'class':'value'})]
            urls = [i['src'] for i in nexo[1].find_all('img')]
            assets = [i.text.strip().split(' ')[0] for i in nexo[1].find_all('small')]
            for i in range(len(rates)):
                print(i)
                product = {
                    'key': urls[i],
                        'asset': assets[i],
                        'bonusRate': 'n/a',
                        'bonusAsset': 'n/a',
                        'apy': rates[i],
                        'lock': 0,
                        'icon': 'lock_open',
                        'refer': 'https://nexo.io',
                        'src': 'nexo',
                        'source': 'Nexo.io',
                        'lockTerm': 0,
                        'type': 'deposit',
                        'url': urls[i]
                                }
                
                all_products.append(product)

            print('nexo done')

            # print(all_products)

            return jsonify(all_products)
        except Exception as e:
            print(e)
            return jsonify(all_products)
    else: return jsonify(all_products)

@app.route('/funding')

def get_funding_data():
    res = requests.get("https://dapi.binance.com/dapi/v1/premiumIndex").json()
    bases = [
        "ADAUSD_PERP",
        "BCHUSD_PERP",
        "BNBUSD_PERP",
        "BTCUSD_PERP",
        "DOTUSD_PERP",
        "ETHUSD_PERP",
        "LINKUSD_PERP",
        "LTCUSD_PERP",
        "XRPUSD_PERP",
      ]
    rates = {}
    for re in res:
        if re['symbol'] in bases:
            print(re)
            print(rates)
            rates[re['symbol'].replace('USD_PERP', '')] = float(re['lastFundingRate'])
        else:
            pass
        print(rates)
    try:
        return jsonify(rates)
    except Exception as e:
        print(e)
        return [rates]

@app.route('/fundingHistory')

def get_historical_funding():
     data = pd.read_csv('src/assets/funding_history7-25-21.csv')
     data = data.to_json()
     return jsonify(data)    
        

if __name__ == '__main__':
    app.run()
