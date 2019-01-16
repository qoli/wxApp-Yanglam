import wepy from 'wepy'

var defaults = {
    HOST: 'https://api.yanglam.cn/',
    HEADER: {
        'Authorization': 'Basic cjJxcmEzZ2dlbmQ4OldjdzZIQEdjNnc3OA==',
        'Content-Type': 'application/json; charset=utf-8'
    }
}

// 開發用地址
// defaults.HOST = 'http://qoli.asuscomm.com:7000/'

var Utils = {

    async getAccessToken() {
        // getAccessToken
        var timeStamp = Date.now()
        var accessTokenCache = this.cache('accessToken')
        if (!accessTokenCache) {
            console.log('accessTokenCache no')
            return await this.setAccessToken()
        }
        if (accessTokenCache.expiresTime <= timeStamp) {
            console.log('accessTokenCache expires ' + accessTokenCache.expiresTime + ' <= ' + timeStamp)
            return await this.setAccessToken()
        }
        console.log('accessTokenCache by Cache')
        return accessTokenCache
    },

    async setAccessToken() {
        // setAccessToken
        var timeStamp = Date.now()
        var accessToken = await this.apiSync('login/accessToken')
        var expiresTime = timeStamp + accessToken.expires_in * 1000
        var accessTokenData = {
            timeStamp: timeStamp,
            accessToken: accessToken.access_token,
            expiresIn: accessToken.expires_in,
            expiresTime: expiresTime
        }
        wepy.setStorageSync('accessToken', accessTokenData)
        return accessTokenData
    },

    async setOPENID() {
        let res = await wepy.login()
        wepy.$instance.getUserInfo()
        let resCodetosession = await this.apiSync('login/codetosession/' + res.code)
        wepy.setStorageSync('openid', resCodetosession.openid)
        return resCodetosession.openid
    },

    getHOST() {
        return defaults.HOST
    },

    goIndex() {
        wepy.$instance.syncCache()
        wx.reLaunch({
            url: '/pages/index'
        })
    },

    sleep(time) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve()
            }, time)
        })
    },

    msg(text) {
        if (typeof text === 'undefined') {
            return false
        } else if (text === '') {
            return false
        }

        wx.showToast({
            title: text,
            icon: 'none',
            duration: 1600
        })
    },

    cache(cacheId) {
        try {
            var value = wx.getStorageSync(cacheId)
            if (Object.getOwnPropertyNames(value).length !== 0) {
                if (value === '') {
                    console.log('[CACHE] ' + cacheId + '[' + Object.getOwnPropertyNames(value).length + ']', 'no cache')
                    return false
                }
                console.log('[CACHE] ' + cacheId + '[' + Object.getOwnPropertyNames(value).length + '] DATA: ', value)
                return value
            } else {
                console.log('[CACHE] ' + cacheId + '[' + Object.getOwnPropertyNames(value).length + ']', 'no cache')
                return false
            }
        } catch ( e ) {
            console.log('[CACHE] ' + cacheId + ' err' + e)
        }
    },

    api(param, method = 'GET', data = {}, callback = null) {
        let that = this

        if (arguments.length === 2) {
            this.api.call(this, arguments[0], 'GET', {}, arguments[1])
            return false
        }

        wx.request({
            header: defaults.HEADER,
            url: defaults.HOST + param,
            data: data,
            dataType: 'application/json',
            success: function(res) {
                if (callback != null) {
                    that.apiData(res, param, callback)
                }
            },
            fail: function(res) {
                console.log('api: fail' + 'code: ' + res.statusCode)
            }
        })
    },

    apiSync(param, method = 'GET', data = {}, conf = defaults) {
        if (param.indexOf('undefined') !== -1) {
            console.log(param)
            return Promise.reject(new Error('存在 undefined 在 URL 上'))
        }

        let options = {
            header: conf.HEADER,
            url: conf.HOST + param,
            data: data,
            method: method
        }

        return wepy.request(options).then((res) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                this.apiData(res, param)
                if (res.data) {
                    return res.data
                } else {
                    return Promise.reject(res)
                }
            } else {
                wx.showToast({
                    title: '通信错误 statusCode:' + res.statusCode,
                    icon: 'none',
                    duration: 800
                })
                return Promise.reject(res)
            }
        }).catch((err) => {
            console.log('[API] ' + param + ' # catch err:', err)
            if (err.errMsg === 'request:fail') {
                wx.showToast({
                    title: '服务器通信失败',
                    icon: 'none',
                    duration: 5000
                })
            } else {
                wx.showToast({
                    title: '通信错误：' + err.errMsg,
                    icon: 'none',
                    duration: 3000
                })
            }
            console.log('API options: ')
            console.log(options)
            return Promise.reject(err)
        })
    },

    apiData(res, param, cb = null) {
        console.log('[API] ' + param + ' · Code: ' + res.statusCode)
        if (res.data.errmsg) {
            console.log('[API] 找不到有效 data · errmsg: ' + res.data.errmsg)
        } else {
            console.log('[API] data', res.data)
            cb && cb(res.data)
        }
    },

    /**
     * [时间戳]
     * UTILS.now()
     */
    now() {
        return new Date().getTime()
    },

    /**
     * [随机数]
     * UTILS.random(min, max)
     */
    random(min, max) {
        if (max == null) {
            max = min
            min = 0
        }
        return min + Math.floor(Math.random() * (max - min + 1))
    },

    /**
     * 将对象解析成url字符串
     * @param  {Object} obj 参数对象
     * @param  {Boolean} unEncodeURI 不使用编码
     * @return {String} 转换之后的url参数
     */

    param(obj = {}, unEncodeURI) {
        let result = []

        for ( let name of Object.keys(obj) ) {
            let value = obj[name]
            result.push(name + '=' + (unEncodeURI ? value : encodeURIComponent(value)))
        }

        if (result.length) {
            return '?' + result.join('&')
        } else {
            return ''
        }
    },

    /**
     * 将url字符串解析成对象
     * @param  {String} str 带url参数的地址
     * @param  {Boolean} unDecodeURI 不使用解码
     * @return {Object} 转换之后的url参数
     */

    unparam(str = '', unDecodeURI) {
        let result = {}
        let query = str.split('?')[1]
        if (!query) return result

        let arr = query.split('&')

        arr.forEach((item, idx) => {
            let param = item.split('=')
            let name = param[0]
            let value = param[1] || ''

            if (name) {
                result[name] = unDecodeURI ? value : decodeURIComponent(value)
            }
        })

        return result
    },

    isEmpty(obj) {
        for (var name in obj) {
            return false
        }
        return true
    }
}

module.exports = Utils
