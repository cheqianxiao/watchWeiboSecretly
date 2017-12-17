//登录步骤  
//1. 发起第一个get请求
var https = require('https')
var querystring = require('querystring')
var username = '1141706980@qq.com'
username = new Buffer(username).toString('base64')

var NodeRSA = require('node-rsa');

var password = 'CaoMeJiang'
var req1 = https.get({
    // protocal: "https:",
    hostname: "login.sina.com.cn",
    // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
    path: "/sso/prelogin.php?" + querystring.stringify({
        entry: "sso",
        callback: "sinaSSOController.preloginCallBack",
        su: username,
        rsakt: "mod",
        client: "ssologin.js(v1.4.15)",
        _: new Date().getTime()
    })

}, res => {
    res.on('data', (buf) => {

        let retStr = buf.toString().match(/^sinaSSOController.preloginCallBack\((.+)\)$/)[1]
        //提取所需值
        let retData = JSON.parse(retStr)
        let { servertime, nonce, pubkey, rsakv } = retData
        console.log(servertime, nonce, pubkey, rsakv)

        //准备发起第二个请求
        //密码加密  
        pubkey = parseInt(pubkey, 16)
        var key = new NodeRSA({
            b: 512,
            n: pubkey,
            e: 65537
        });
        password = key.encrypt([servertime, nonce].join("\t") + "\n" + password)
        password = password.toString('hex')
        console.log(password)
        let postData = {
                'entry': 'account',
                'gateway': '1',
                'from': '',
                'savestate': '30',
                'qrcode_flag': true,
                'userticket': '0',
                'pagerefer': 'http://my.sina.com.cn/',
                'vsnf': '1',
                'su': username,
                'service': 'sso',
                'servertime': servertime,
                'nonce': nonce,
                'pwencode': 'rsa2',
                'rsakv': rsakv,
                'sp': password,
                'sr': '1920*1080',
                'encoding': 'UTF-8',
                'cdult': 3,
                'domain': 'sina.com.cn',
                'prelt': 39,
                'returntype': 'TEXT'
            }
            postData = querystring.stringify(postData)
        let req2 = https.request({
            hostname: "login.sina.com.cn",
            method: 'POST',
            proxy:'http://192.168.31.161:8787',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            },
            path: "/sso/login.php?" + querystring.stringify({
                client: 'ssologin.js(v1.4.19)',
                _: new Date().getTime()
            })
        }, res2 => {
            console.log(res2.statusCode)
            res2.on('data', buf => {
                console.log(buf.toString())
            })
        })


        req2.on('error', function(err) {
            console.error(err);
        });
        req2.write(postData);
        req2.end();


    });

})
req1.on('error', function(err) {
    console.error(err);
});
req1.end();
return
//source code form 'http://login.sina.com.cn/js/sso/ssologin.js'
if ((me.loginType & rsa) && me.servertime && sinaSSOEncoder && sinaSSOEncoder.RSAKey) {
    //加密
    request.servertime = me.servertime;
    request.nonce = me.nonce;
    request.pwencode = "rsa2";
    request.rsakv = me.rsakv;
    var RSAKey = new sinaSSOEncoder.RSAKey();
    //生成公钥
    RSAKey.setPublic(me.rsaPubkey, "10001");
    //字符串拼接后再加密
    password = RSAKey.encrypt([me.servertime, me.nonce].join("\t") + "\n" + password)
} else {
    if ((me.loginType & wsse) && me.servertime && sinaSSOEncoder && sinaSSOEncoder.hex_sha1) {
        request.servertime = me.servertime;
        request.nonce = me.nonce;
        request.pwencode = "wsse";
        password = sinaSSOEncoder.hex_sha1("" + sinaSSOEncoder.hex_sha1(sinaSSOEncoder.hex_sha1(password)) + me.servertime + me.nonce)
    }
}
request.sp = password;

var loginUrl = "https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.19)"

var preLoginUrl = 'http://login.sina.com.cn/sso/prelogin.php?entry=weibo&callback=sinaSSOController.preloginCallBack&su=&rsakt=mod&client=ssologin.js(v1.4.18))'

var url = require('url')
var urlObj = url.parse(loginUrl)
var querystring = require('querystring')
var postData = {
    entry: 'weibo',
    gateway: 0,
    from: '',
    savestate: '7',
    qrcode_flag: false,
    useticket: 1,
    pagerefer: 'https://www.google.com.hk/',
    vsnf: 1,
    su: username,
    service: 'miniblog',
    servertime: 1512649743,
    nonce: '1K4GIQ',
    pwencode: 'rsa2',
    rsakv: 1330428213,
    sp: password,
    sr: '1280*720',
    encoding: 'UTF-8',
    prelt: 244,
    returntype: 'META',
}
postData = querystring.stringify(postData)
var options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
        'Host': 'login.sina.com.cn',
        'Origin': 'https://weibo.com',
        'Referer': 'https://weibo.com/login.php',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    }
}
options = Object.assign(options, urlObj)
var req = https.request(options, res => console.log(res))
req.on('error', e => console.log(e))
req.write(postData)
req.end()