//登录步骤  
//1. 发起一个get请求
var https = require('https')
var querystring = require('querystring')
var username = '1141706980@qq.com'
username = new Buffer(username).toString('base64')

var password = 'CaoMeiJiang'
var req = https.get({
	protocal: "https:",
	hostname: "login.sina.com.cn",
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
	path: "/sso/prelogin.php" + querystring.stringify({
		entry: "sso",
		callback: "sinaSSOController.preloginCallBack",
		su: username,
		rsakt: "mod",
		client: "ssologin.js(v1.4.15)",
		_: new Date().getTime()
	})

},res=>{
	 res.on('data', (chunk) => {
	 	console.log(`${chunk}`)
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
})
req.on('error',function(err){  
    console.error(err);  
});  
req.end();  
return
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
    'Host':'login.sina.com.cn',
'Origin':'https://weibo.com',
'Referer':'https://weibo.com/login.php',
'Upgrade-Insecure-Requests':1,
'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
  }
}
options = Object.assign(options, urlObj)
var req = https.request(options, res => console.log(res))
req.on('error', e => console.log(e))
req.write(postData)
req.end()