const request = require('request');
const path = require('path')
const fs = require('fs')

const methods = {
  // 获取埋点 B 位
  getSpmB(PK) {
    return new Promise((resolve, reject) => {
      const url = 'https://iot.aligenie.com/getSpmConfig?parmsData={%22spmId%22:null,%22spma%22:%22a2owj%22,%22spmb%22:null,%22isRegexpUrl%22:%22N%22,%22wlPageUrl%22:'+PK+',%22is_regexp_url%22:%22ailabs-iot.aligenie.com%22,%22appFrom%22:%22ai-open-iot%22,%22pageName%22:%22PK: '+PK+'%22,%22pageDesc%22:%22pageDesc%22,%22isEdit%22:%22Y%22,%22insertUserId%22:%2279411%22,%22pageUrl%22:%22https://ailabs-iot.aligenie.com/'+PK+'/0.0.1/dist/index.html%22,%22id%22:null,%22class%22:%22com.taobao.dw.aplus.entity.spm.Spmb%22}&id=79411'
      request.get(url, function(error, response, body) {
        body = JSON.parse(body)
        if (!error && response.statusCode == 200 && body.spmb) {
          return resolve(body.spmb)
        }
        resolve()
      })
    })
  },

  // 判断是否已经埋点
  needSpma() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, '../index.html'),'utf-8', (err, data) => {
        if (err) return console.log('readFile error:', err)
        if (data.indexOf('data-spm') > -1 && data.indexOf('aplus_wap') > -1) {
          resolve(false) // 不需要埋点 因为已经埋好了
        } else {
          resolve(true)
        }
      })
    })
  },

  // 注入埋点
  insertSpmInfo(spmb) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, '../index.html'),'utf-8', (err, data) => {
        if (err) return console.log('readFile error:', err)
        const html = data.split('\n')
        let insertKey = ''
        let insertJsKey = ''
        html.map((val, key) => {
          if (val.indexOf('</head') > -1) {
            insertKey = key
          }
          if (val.indexOf('<body') > -1) {
            insertJsKey = key + 2
          }

          // 注入 spmb 到 body
          if (val.indexOf('<body') > -1) {
            html.splice(key, 1, val.replace('<body', `<body data-spm="${spmb}"`))
          }
          return val
        })
        html.splice(insertKey, 0, '    <meta content="a2owj" name="data-spm" />')
        html.splice(insertJsKey, 0, `    <script type="text/javascript" id="beacon-aplus" src="https://g.alicdn.com/alilog/mlog/aplus_wap.js"  exparams="clog=o&aplus&sidx=aplusSidx&ckx=aplusCkx"></script>`)
        
        fs.writeFile(path.resolve(__dirname, '../index.html'), html.join('\n'), 'utf-8', function (err) {});
      })
    })
  },

  // 获取PK值
  getProdcutKey() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, '../src/device-config.js'),'utf-8', (err, data) => {
        if (err) return console.log('readFile error:', err)
        const pk = methods.getDataVal(data, 'productKey')[0]
        this.prodcutKey = pk
        if (!pk) {
          console.error(`
            请先设置你开发的设备的prodcutKey(必填)：
            设置路径 /src/device-config.js -> debug.params.prodcutKey \n
            open平台地址：https://iot.aligenie.com/home  
            是open平台产品信息中的Product ID \n
          `)
          return 
        }
        resolve(pk)
      })
    })
  },

  // 获取参数的值
  getDataVal(data, key) {
    data = data.slice(data.indexOf(key))
    data = data.split('\n')[0]
    var single = data.match(/\'\w*\'/g) || [];
    var double = data.match(/\"\w*\"/g) || [];
    return [...single, ...double].map(function(element){
        return element.slice(1, -1);
    });
  }
}

module.exports = methods