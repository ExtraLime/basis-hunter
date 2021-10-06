import os
import requests
import json
import numpy as np
from bs4 import BeautifulSoup

import feedparser
from flask import Flask, jsonify
from flask_cors import CORS
import datetime

"""
Python Server for BasisTrade.
This script serves as a supplemental API for the BasisTrade website.
"""

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": ['http://localhost:3000',
                                               'https://dat-fin-ass.web.app', 'https://dat-fin-ass.firebase.app']}})
all_products = []


@app.route('/')
def is_on():
    current_time = datetime.datetime.now()
    return f'API is working: { current_time} '

"""
Route: News ticker
Purpose: Request and parse newsticker data from cointelegraph
"""
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

"""
Route: rates
Purpose: Collect and parse APY information from various exchanges
"""
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

            #Call Binance earn and request staking data
            t = requests.get(
                'https://www.binance.com/bapi/earn/v1/friendly/pos/union').json()
            #Display is 15 rates per page. Get total number of results
            total = t['total']
            #divide by 15 to get number of calls to make
            loops = int(np.ceil(total/15))
            #call the appropriate number of times
            for i in range(loops):
                ix = i+1
                res = requests.get(
                    f'https://www.binance.com/bapi/earn/v1/friendly/pos/union?pageSize=15&pageIndex={ix}&status=SUBSCRIBABLE').json()
                #parse each result
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

            #huobi has a uniform response for all type of savings products. Call all and combine
            h_limit = requests.get(
                'https://www.huobi.com/-/x/hbg/v1/saving/mining/index/limitTime/list?isAllow=false&r=rrjnam&x-b3-traceid=82f1704bae9b4a1827f78107811e1e27').json()['data']
            h_flex = requests.get(
                'https://www.huobi.com/-/x/hbg/v1/saving/mining/index/active/list?isAllow=false&r=4zjk1&x-b3-traceid=0e0d725230cdd53887996706d9d09c1a').json()['data']
            h_fix = requests.get(
                'https://www.huobi.com/-/x/hbg/v1/saving/mining/index/fixed/list?isAllow=false&r=lop9g&x-b3-traceid=9804330f1af1a0652560f2e2c5675e8d').json()['data']
            h_all = h_limit + h_flex + h_fix

            #iterate, extracting desired data from each result
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
                        icon = 'lock'
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
            #Binance US only offers soft staking (holding)
            busa = requests.get(
                'https://www.binance.us/gateway-api/v1/friendly/staking/list?pageNum=1&pageSize=100').json()['data']
            for i in busa:
                all_products.append({
                    'key': f'busa{i["holdCoin"]}',
                    'asset': i['holdCoin'],
                    'bonusRate': 'n/a',
                    'bonusAsset': 'n/a',
                    'apy': float(i['lastEarningRate'])/100,
                    'lock': 0,
                    'icon': 'lock_open',
                    'refer': 'https://www.binance.us/en/staking',
                    'src': 'binUS',
                    'source': 'Binance US',
                    'lockTerm': 0,
                    'type': 'deposit',
                    'url': 'https://cryptofonts.com/img/icons/{}.svg'.format(i["holdCoin"].lower())
                })
            

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

            #Use BS to parse html response and extract data
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
                url = "https://crypto.com" + \
                    url_raw[0].find_all('img')[0]['src']

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
            nexo = soup.find_all('div', {'class': "-mb-32"})
            rates = [
                float(i.text)/100 for i in nexo[1].find_all('span', {'class': 'value'})]
            urls = [i['src'] for i in nexo[1].find_all('img')]
            assets = [i.text.strip().split(' ')[1]
                      for i in nexo[1].find_all('small')]
            print(assets)
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

            return jsonify(all_products)
        except Exception as e:
            print(e)
            return jsonify(all_products)
    else:
        return jsonify(all_products)

"""
Route: /funding
Purpose: Collect coin funding rates for Coin margined perpetual swaps
"""
@app.route('/funding')
def get_funding_data():
    #get index for all coins
    res = requests.get("https://dapi.binance.com/dapi/v1/premiumIndex").json()
    #define default base pairs
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
    #extract desired funding rates
    for re in res:
        if re['symbol'] in bases:
            rates[re['symbol'].replace('USD_PERP', '')] = float(
                re['lastFundingRate'])
        else:
            pass
    try:
        return jsonify(rates)
    except Exception as e:
        print(e)
        return [rates]

"""
Route: /ufunding
Purpose: Collect coin funding rates for usdt margined perpetual swaps
"""
@app.route('/ufunding')
def get_ufunding_data():
    res = requests.get("https://fapi.binance.com/fapi/v1/premiumIndex").json()
    bases = [
        "ADAUSDT",
        "BCHUSDT",
        "BNBUSDT",
        "BTCUSDT",
        "DOTUSDT",
        "ETHUSDT",
        "LINKUSDT",
        "LTCUSDT",
        "XRPUSDT"
    ]
    rates = {}
    for re in res:
        if re['symbol'] in bases:
            print(re)
            print(rates)
            rates[re['symbol'].replace('USDT', '')] = float(
                re['lastFundingRate'])
        else:
            pass
        print(rates)
    try:
        return jsonify(rates)
    except Exception as e:
        print(e)
        return [rates]

"""
Route: /fundingHistory
Purpose: host historical funding rates for the learn page
"""
@app.route('/fundingHistory')
def get_historical_funding():

    with open('funding.json', 'r') as f:
        usdt_data = json.load(f)
    return jsonify({'usdt': usdt_data})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
