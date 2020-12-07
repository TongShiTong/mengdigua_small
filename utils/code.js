var CryptoJS = require('./crypto/index.js');
// var codeKey ="TG03eVcwVnROT3RMejhuUA==" //开发
// var codeKey ="N1FSWHZzbm9mOHNDRkhIZg==" //测试
// var codeKey = "d3JzcFN0YUxueEJ3Q3BJZg==" //正式

//萌地瓜
var codeKey ="elQ2OUpmRjFseFNpckJHUQ==" //测试
const key = CryptoJS.enc.Latin1.parse(CryptoJS.enc.Latin1.stringify(CryptoJS.enc.Base64.parse(codeKey)));  //十六位十六进制数作为密钥


function _getRandomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

//加密方法
function Encrypt(text) {
  var iv_no_lantin = _getRandomString(16);
  var iv = CryptoJS.enc.Latin1.parse(iv_no_lantin); //16位初始向量
  var encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted.toString() + "::" + iv_no_lantin));
}
//解密方法
function Decrypt(word) {
  var _data = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(word));
  var arr = _data.split('::');
  var iv = CryptoJS.enc.Latin1.parse(arr[1]);
  var text = arr[0];
  var decrypt = CryptoJS.AES.decrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}


export  {
  Decrypt,
  Encrypt
}