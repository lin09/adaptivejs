class Adaptive {
  constructor () {
    this.options = {
      // 1rem = 16px
      rootValue: 16,
      // 设计图宽度（px）
      designWidth: 750,
      // 页面最宽放大到（px）
      maxWidth: 1024
    }

    this.meta = document.getElementsByName('viewport')[0]
    if (!this.meta) {
      // 获取不到 viewport meta 时，则创建 meta
      this.meta = document.createElement('meta')
      this.meta.name = 'viewport'
      this.meta.content = this.createViewportContent('1.0')
    } else if (!this.meta.content) {
      // 无 content 时，设置 scale 为 1
      this.meta.content = this.createViewportContent('1.0')
    }
    // 保存默认 content
    this.metaDefualtContent = this.meta.content
  }

  run () {
    // 设置 body 宽度
    this.setBodyWidth()

    // 物理像素分辨率与CSS像素分辨率的比值大于1 并且 有高宽其一小于designWidth 时 调 scale ，否则只调节hmtl的字体大小
    if (window.devicePixelRatio > 1
      && (document.documentElement.clientWidth < this.options.designWidth || document.documentElement.clientHeight < this.options.designWidth)
    ) {
      // 窗口事件
      const resize = () => {
        // 停止事件
        window.removeEventListener('resize', resize)
        // console.log('resize')
        // 设置 scale
        this.setViewportScale()
        .then(() => {
          // 设置 html 字体大小
          this.setHtmlFontSize()
          // 重启事件
          window.addEventListener('resize', resize)
        })
      }
      resize()
    } else {
      this.setHtmlFontSize()
      // 不需要修改 scale 时，只设置 html 字体大小
      window.addEventListener('resize', () => { this.setHtmlFontSize() })
    }
  }

  /**
   * 修改配置
   * @param {number|string} rootValue   - 1rem 等于多少 px，必需为有效数字，默认值为16
   * @param {number|string} designWidth - 设计图宽度（px），必需为有效数字，默认值为750
   * @param {number|string} maxWidth    - 页面最宽放大到（px），必需为有效数字，默认值为1024
   */
  config ({ rootValue, designWidth, maxWidth }) {
    this.options.rootValue   = this.options.rootValue || rootValue
    this.options.designWidth = this.options.designWidth || designWidth
    this.options.maxWidth    = this.options.maxWidth || maxWidth
    return this
  }

  // 设置 meta[viewport] scale
  setViewportScale () {
    return new Promise(resolve => {
      this.revertViewportContent().then(() => {
        let scale = document.documentElement.clientWidth / this.options.designWidth
        // 只做缩小，放大由 html font-size 处理
        if (scale >= 1) {
          scale = '1.0'
        }
        this.delayUpdate(this.metaDefualtContent.replace(/(scale=).+?(,)/g, `$1${ scale }$2`), resolve)
      })
    })
  }

  // 还原 mate.content
  revertViewportContent () {
    return new Promise(resolve => this.delayUpdate(this.metaDefualtContent, resolve))
  }

  // 设置 body 宽度
  setBodyWidth () {
    document.body.style.width = `${ this.options.designWidth / 16 }rem`
  }

  // 设置 html 字体大小
  setHtmlFontSize () {
    // 窗口宽度
    let clientWidth = document.documentElement.clientWidth
    // 最大页面宽度
    if (clientWidth > this.options.maxWidth) {
      clientWidth = this.options.maxWidth
    }

    // fontSize / pxToRemRootValue = clientWidth / designWidth
    let fontSize = clientWidth / this.options.designWidth * this.options.rootValue
    // 不小于12，如chrome不支持小于12px字体
    if (fontSize < 12) {
      fontSize = 12
    }

    document.documentElement.style.fontSize = fontSize + 'px'
  }

  /**
   * 创建 meat[viewport].content
   * @param {number|string} scale - scale <= 1 && scale > 0
   */
  createViewportContent (scale) {
    return `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no`
  }

  // 等待 document.documentElement.clientWidth 更新
  delayUpdate (mateContent, resolve) {
    // console.log(document.documentElement.clientWidth, mateContent)
    if (this.meta.content === mateContent) {
      resolve()
      return
    }

    const oldClientWidth = document.documentElement.clientWidth
    this.meta.content = mateContent

    const delay = () => {
      delay.count = delay.count + 1 || 1
      // console.log(delay.count, oldClientWidth, document.documentElement.clientWidth)
      oldClientWidth === document.documentElement.clientWidth && delay.count < 10
      ? window.setTimeout(delay, 100)
      : resolve()
    }

    delay()
  }
}

export default new Adaptive
