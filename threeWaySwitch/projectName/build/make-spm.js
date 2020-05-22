require('shelljs/global')
const ora = require('ora')

const { getProdcutKey, getSpmB, needSpma, insertSpmInfo } = require('./make-method.js')

class setSpm {
  constructor() {
    this.run()
  }
  async run() {
    // 判断是否已经埋点
    const spmaStatus = await needSpma()
    if (spmaStatus) {
      const PK = await getProdcutKey() // 校验是否有 PK
      const spmb = await getSpmB(PK) // 获取spmb
      
      // 注入埋点
      spmb && insertSpmInfo(spmb)
    }

    const spinner = ora('正在打包项目，请稍等...')
    spinner.start()
    
    exec('node build/build.js')

    spinner.stop()
  }
}

new setSpm()