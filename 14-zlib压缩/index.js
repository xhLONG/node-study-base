const formatOuterChains = require('./formatOuterChains.js').default
const { COUNTRY_MAP_CDN_HOST } = require('../enum')
const { domainPostfix, domainHost, carMap, newsMap, usedCarMap } = require('../config/urlMap.js')
const xss = require('xss')

function throttle(interval, fn) {
  let timer = null
  let firstTime = true

  return function (...args) {
    if (firstTime) {
      // 第一次加载
      fn.apply(this, args)
      // eslint-disable-next-line no-return-assign
      return (firstTime = false)
    }
    if (timer) {
      // 定时器正在执行中，跳过
      return
    }
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
      fn.apply(this, args)
    }, interval)
  }
}
function sortHandleByCharCode(str1 = '', str2 = '') {
  // 注意：本函数为sort方法中作为参数传入的函数，并非sort本身，使用时传入两比较的字符串，如arr.sort((a,b)=>{return sortHandleByCharCode(a.name,b.name)})
  const maxLength = str1.length > str2.length ? str1.length : str2.length
  for (let i = 0; i < maxLength; i++) {
    const charCode1 = str1.charCodeAt(i)
    const charCode2 = str2.charCodeAt(i)
    if (isNaN(charCode1)) {
      return -1
    } else if (isNaN(charCode2)) {
      return 1
    } else if (charCode1 !== charCode2) {
      return charCode1 - charCode2
    }
  }
  return 0
}
function Traversal(obj, op, assignFlag) {
  // 接收三个参数，obj是想要遍历的对象，op是想要对对象每个键做的操作（函数）,assignFlag是op的返回值是否赋值给当前键
  for (const i in obj) {
    assignFlag ? (obj[i] = op(obj[i])) : op(obj[i])

    if (typeof obj[i] == 'object') {
      Traversal(obj[i], op, assignFlag)
    }
  }
}
/**
 *
 * @param {*} url 原图url
 * @param {*} width 宽度
 * @param {*} height 高度
 * @param {*} size 大小
 * @param {*} needStatus 是否需要同时返回判断状态（即是否为carnetwork.s3下的图片）
 * @param {*} argLang 语言，若无则去process.env的lang，再无则默认en
 */
function handleImg(url, width, height, size, needStatus, argLang) {
  if (!url || url === 'https://carnetwork.s3-ap-southeast-1.amazonaws.com/public/motor_default2x.png') { // 图片不存在或者为摩托车默认图时，不做处理
    return url
  }
  const lang = argLang || process.env.LANG || 'my-en'
  const imageMap = {
    'my-en': 'https://images.wapcar.my/file1',
    'id-id': 'https://images.autofun.co.id/file1',
    'th-th': 'https://images.autofun.co.th/file1',
    'ph-en': 'https://images.autofun.ph/file1',
    'vn-vi': 'https://images.autofun.vn/file1'
  }
  const fileType = url.substring(url.lastIndexOf('.'))
  const oldDomain = url.substring(0, url.indexOf('/file') + 5) // +5是算"/file"这一字符串的长度
  const newDomain = imageMap[lang] // 正式
  const limitStr = `_${width}${height === null ? '' : 'x' + height}${size ? '_' + size : ''
    }`
  /* --- 这段逻辑是为了匹配接口中的图片已经是格式化后的数据，如成功匹配，则只需要将原url的file改为file1并且加上宽高和size等数据 --- */
  const sourceImageMap = {
    'my-en': 'https://images.wapcar.my/file/',
    'id-id': 'https://images.autofun.co.id/file/',
    'th-th': 'https://images.autofun.co.th/file/',
    'ph-en': 'https://images.autofun.ph/file/',
    'vn-vi': 'https://images.autofun.vn/file/'
  }
  const sourceMatch = url.match(sourceImageMap[lang])
  if (sourceMatch && sourceMatch.length > 0) {
    return url
      .replace(oldDomain, oldDomain + '1')
      .replace(fileType, `${limitStr}${fileType}`)
  }
  /* ------ */
  const match = url.match(
    'https://carnetwork.s3.ap-southeast-1.amazonaws.com/'
  ) // 正式
  // const match = url.match(
  //   'https://test-carnetwork.s3.ap-southeast-1.amazonaws.com/'
  // ) // 测试
  // let match = url.match(/https:\/\/(carnetwork|test-carnetwork).s3.ap-southeast-1.amazonaws.com\//)//测试
  if (!match || match.length < 1) {
    return needStatus ? { url, status: false } : url
  }
  // let limitStr = `_${width}${height===null?'':('x'+height)}${size?'_'+size:''}`;
  // let fileType = url.substring(url.lastIndexOf('.'));
  // let oldDomain = url.substring(0,url.indexOf('/file')+5);//+5是算"/file"这一字符串的长度
  // let newDomain = imageMap[lang];//正式
  // let newDomain = "http://test-carnetwork.s3-website-ap-southeast-1.amazonaws.com/file1";//测试
  const result = url
    .replace(fileType, limitStr + fileType)
    .replace(oldDomain, newDomain)
  return needStatus ? { url: result, status: true } : result
}

function handleContentCollectImg(url, width) {
  const otherSiteDomain = 'https://i.pinimg.com/'
  if (url.indexOf(otherSiteDomain) !== -1) {
    const paramsUrl = url.split(otherSiteDomain)[1].split('/')
    paramsUrl.shift()
    const afterUrl = paramsUrl.join('/')
    return `${otherSiteDomain}${width}x/${afterUrl}`
  }
}

/**
 * s3 链接转化为 images.* 域名链接
 * @param {*} url
 */
function handleImgSource(url) {
  // url:原图url
  const lang = process.env.LANG || 'my-en'
  const imageMap = {
    // en: 'https://images.wapcar.my/file',
    'my-en': 'https://images.wapcar.my/file',
    'id-id': 'https://images.autofun.co.id/file',
    'th-th': 'https://images.autofun.co.th/file',
    'ph-en': 'https://images.autofun.ph/file',
    'vn-vi': 'https://images.autofun.vn/file'
  }
  const match = url.match(
    'https://carnetwork.s3.ap-southeast-1.amazonaws.com/'
  ) // 正式
  // let match = url.match(/https:\/\/(carnetwork|test-carnetwork).s3.ap-southeast-1.amazonaws.com\//)//测试
  if (!match || match.length < 1) {
    return url
  }
  const oldDomain = url.substring(0, url.indexOf('/file') + 5) // +5是算"/file"这一字符串的长度
  const newDomain = imageMap[lang] // 正式
  const result = url.replace(oldDomain, newDomain)
  return result
}

function replaceDoubleQuotes(arg) {
  if (typeof arg === 'string') {
    return arg.replace(/\"/g, '')
  } else {
    return arg
  }
}

// 手机端判断各个平台浏览器及操作系统平台
function checkPlatform() {
  if (/android/i.test(navigator.userAgent)) {
    return 'Android' // Android平台下浏览器
  }
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return 'iOS' // 是iOS平台下浏览器
  }
  if (/Linux/i.test(navigator.userAgent)) {
    return 'Linux' // Linux平台下浏览器
  }
  if (/MicroMessenger/i.test(navigator.userAgent)) {
    return 'MicroMessenger' // 微信平台下浏览器
  }
}

// 获取浏览器
function getBrowserInfo(needVersion = false) {
  var userAgent = navigator.userAgent
  var version
  const getVersion = function(userAgent, reg) {
    var reBrowser = new RegExp(reg)
    reBrowser.test(userAgent)
    return parseFloat(RegExp.$1)
  }
  if (/opera/i.test(userAgent) || /OPR/i.test(userAgent)) {
    version = getVersion(userAgent, 'OPR/(\\d+\\.+\\d+)')
    return needVersion ? 'Opera' + version : 'Opera'
  } else if (/compatible/i.test(userAgent) && /MSIE/i.test(userAgent)) {
    version = getVersion(userAgent, 'MSIE (\\d+\\.+\\d+)')
    return needVersion ? 'IE' + version : 'IE'
  } else if (/Edge/i.test(userAgent)) {
    version = getVersion(userAgent, 'Edge/(\\d+\\.+\\d+)')
    return needVersion ? 'Edge' + version : 'Edge'
  } else if (/Firefox/i.test(userAgent)) {
    version = getVersion(userAgent, 'Firefox/(\\d+\\.+\\d+)')
    return needVersion ? 'Firefox' + version : 'Firefox'
  } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    version = getVersion(userAgent, 'Safari/(\\d+\\.+\\d+)')
    return needVersion ? 'Safari' + version : 'Safari'
  } else if (/Chrome/i.test(userAgent) && /Safari/i.test(userAgent)) {
    version = getVersion(userAgent, 'Chrome/(\\d+\\.+\\d+)')
    return needVersion ? 'Chrome' + version : 'Chrome'
  } else if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    version = 11
    return needVersion ? 'IE' + version : 'IE'
  }
}

/**
 * 对 html 进行 xss 过滤处理
 * @param {*} htmlContent
 */
function xssFilter(htmlContent = '') {
  if (!htmlContent) {
    return ''
  }
  const html = xss(htmlContent, {
    whiteList: {
      div: ['style', 'id', 'class', 'contenteditable'],
      img: ['style', 'id', 'class', 'src', 'width', 'height'],
      span: ['style', 'id', 'class'],
      br: []
    },
    safeAttrValue: function (tag, name, value) {
      // 设置 attr
      const isWhileListAttr =
        name === 'style' ||
        name === 'class' ||
        name === 'id' ||
        name === 'src' ||
        name === 'width' ||
        name === 'height' ||
        name === 'contenteditable'
      if (isWhileListAttr) {
        return value
      }
    },
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
      // 设置 data-set
      if (name.substr(0, 5) === 'data-') {
        // 通过内置的 escapeAttrValue 函数来对属性值进行转义
        return `${name}="${xss.escapeAttrValue(value)}"`
      }
    }
  })
  return html
}

const replaceAllImg = (title, content) => {
  let imgAltNum = 0
  content = content.replace(/ckeditorscript/g, 'script')
  const imageRxp = new RegExp(/(\<img alt=")([^"]*")([^>]*)(src=")([^"]*")([^>]*)(\>)/, 'g')
  const hrefRxp = new RegExp(/(\<a [^>]*href=")([^"]*")([^>]*\>)/, 'g')
  const tableRxp = new RegExp(/<table.*?>[\s\S]*?<\/table>/, 'g')
  function padNum(num) {
    return num < 10 ? `0${num}` : num
  }
  return content
    .replace(imageRxp, function (match, p1, p2, p3, p4, p5, p6, p7) {
      imgAltNum++
      const p2Val = p2 === '"' ? `${title} ${padNum(imgAltNum)}${p2}` : p2
      const p5value = p5.slice(0, p5.length - 1)
      const p5Tail = p5.slice(p5.length - 1)
      const p5Formate = handleImg(p5value, 800, null) + p5Tail
      return `<p class="post-img-container">${p1}${p2Val}${p3}data-src="${p5Formate}${p6} class="post-article-img"${p7}</p>`
    })
    .replace(hrefRxp, (match, p1, p2, p3) => {
      const href = formatOuterChains({ type: 'a', data: match })
      return href
    })
    .replace(tableRxp, function (match, p1) {
      return `<div class="post-table-container">${match}</div>`
    })
}

// 获取滚动距离
function getScrollTop() {
  let scrollPos = null
  if (window.pageYOffset) {
    scrollPos = window.pageYOffset
  } else if (document.compatMode && document.compatMode != 'BackCompat') {
    scrollPos = document.documentElement.scrollTop
  } else if (document.body) {
    scrollPos = document.body.scrollTop
  }
  return scrollPos
}
// 传入键名从location.search中获取对应键名的值
function getQueryVariable(variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] == variable) {
      return decodeURI(pair[1])// decodeURI防止空格等特殊字符被转义成20%之类的数据
    }
  }
  return ''
}

const didWidthType = {
  get did() {
    return window.$local.isLogin ? window.$local.user.id : window.$local.uuid
  },
  get didType() {
    return window.$local.isLogin ? 2 : 3
  }
}

/**
 * 根据对象 value 查找 对应 key
 * @param {*} obj 查询对象
 * @param {*} value 查询 value
 */
function findKey(obj, value, compare = (a, b) => a === b) {
  return Object.keys(obj).find((k) => compare(obj[k], value))
}

/**
 * 判断当前执行环境是否是服务端
 */
function getIsServer() {
  return process.env.VUE_ENV === 'server'
}

/**
 * 判断当前执行环境是否是客户端
 */
function getIsClient() {
  return process.env.VUE_ENV === 'client'
}

/**
 * 获取 cookie domain
 */
function getCookieDomain() {
  const lang = process.env.LANG || 'my-en'
  if (window.location.href.indexOf(domainPostfix[lang]) > -1) {
    return domainPostfix[lang]
  }
  return window.location.hostname
}

/**
 * 获取随机数
 * @param {Number} min
 * @param {Number} max
 */
function getRandomNum(min, max) { // 获取随机数
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成从minNum到maxNum的随机数
 * @param {*} min 最大
 * @param {*} max 最小
 */
function generateRandomNum(min, max) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * min + 1, 10)
    case 2:
      return parseInt(Math.random() * (max - min + 1) + min, 10)
    default:
      return 0
  }
}

/**
 * 获取静态资源的发布路径
 * @param {*} param0
 */
function getS3PublishPath({ lang = 'my-en' }) {
  const countryCode = lang.split('-')[0]
  return process.env.API_ENV === 'production' ? `${COUNTRY_MAP_CDN_HOST[countryCode]}/${lang}/` : `https://test-cdn-car-static.s3-ap-southeast-1.amazonaws.com/${lang}/`
}
/**
 * 获取当前月份
 * @param {*} 语言
 */
function getCurrentMonth(lang = 'my-en') {
  const enCommon = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const myMonths = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember']
  const idMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const thMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
  const monthMap = {
    'my-en': enCommon,
    'my-zh': enCommon,
    'my-my': myMonths,
    'id-id': idMonths,
    'th-th': thMonths,
    'ph-en': enCommon,
    'vn-vi': enCommon
  }
  const date = new Date()
  return monthMap[lang][parseInt(date.getMonth())]
}

/**
 * 传入键名和url获取对应键名的值
 * @param {*} href
 * @param {*} variable
 */
function getQueryVariableFromHref(href, variable) {
  const query = href
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] == variable) { return pair[1] }
  }
  return false
}

function copyToClip(content) {
  return new Promise((resolve, reject) => {
    const aux = document.createElement('input')
    aux.setAttribute('value', content)
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    document.body.removeChild(aux)
    return resolve(true)
  })
}

/**
 * 动态创建 facebook 相关的脚本
 */
function dynamicFacebookScript(initLikeSdk = true) {
  const lang = process.env.LANG || 'my-en'
  if (['my-en', 'id-id', 'th-th', 'ph-en', 'vn-vi'].includes(lang)) {
    const idMap = {
      // 旧的 fb id，之后可能还原
      // 'my-en': '1192514681135922',
      // 'id-id': '3939542179395644',
      // 'th-th': '726009924908517',
      // 'vn-vi': 2833502663620906,
      // 'ph-en': 573136844146759

      'my-en': 419662499702201,
      'id-id': 411929493879471,
      'th-th': 693543828377601,
      'ph-en': 1014624662517194,
      'vn-vi': 317905567175708
    }
    const reportId = idMap[lang]
    // fb 上报 noscript
    const noscriptTag = document.createElement('noscript')
    const noReportInfoTag = document.createElement('img')
    noReportInfoTag.setAttribute('height', '1')
    noReportInfoTag.setAttribute('width', '1')
    noReportInfoTag.setAttribute('style', 'display:none')
    noReportInfoTag.setAttribute('src', `https://www.facebook.com/tr?id=${reportId}&ev=PageView&noscript=1`)
    noscriptTag.appendChild(noReportInfoTag)
    document.body.appendChild(noscriptTag)
    // fb 上报 script
    const reportScriptTag = document.createElement('script')
    const reportInfo = document.createTextNode(`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', ${reportId});
                fbq('track', 'Lead', {value: 1.00,currency: 'USD'});
                fbq('track', 'ViewContent', {value: 1.00,currency: 'USD'});
                fbq('track', 'PageView',{value:1.00,currency: 'USD'});
            `)
    reportScriptTag.appendChild(reportInfo)
    document.body.appendChild(reportScriptTag)
  }

  if (initLikeSdk) {
    // fb 点赞相关sdk
    const FB_SDK_LANG_MAP = {
      'in-en': 'en_US',
      'my-en': 'en_US',
      'id-id': 'id_ID',
      'th-th': 'th_TH',
      'vn-vi': 'vi_VN',
      'ph-en': 'en_PH'
    }
    const scriptTag = document.createElement('script')
    scriptTag.setAttribute('src', `https://connect.facebook.net/${FB_SDK_LANG_MAP[lang] || 'en_US'}/sdk.js#xfbml=1&version=v13.0&appId=414128199206423&autoLogAppEvents=1`)
    scriptTag.setAttribute('crossorigin', 'anonymous')
    document.body.appendChild(scriptTag)
  }
}

/**
 * 计算动画 keyFrames
 * @param {*} ratings
 */
function calcKeyframes(ratings = []) {
  console.log('ratings', ratings)
  if (!Array.isArray(ratings)) {
    return ''
  }
  const aniKeyframes = ratings.reduce((str, cur, index) => {
    return (
      str + `@keyframes rating-keyframe-${index + 1} {0% {width: 0px;}100% {width: ${(cur.score / 5) * 0.9}rem;}}`
    )
  }, '<style>')

  return aniKeyframes + '</style>'
}

// 计算经销商个数
function calculateCityList(data, brandCode) {
  const sateMap = {}
  data.map((value, index) => {
    const state = value.state || 'Kuala Lumpur'
    if (sateMap[state]) {
      sateMap[state].dealerNum++
      sateMap[state].list.push(value)
    } else {
      sateMap[state] = {
        state,
        brandCode,
        dealerNum: 1,
        list: [value]
      }
    }
  })
  const cityList = []
  for (const key in sateMap) {
    cityList.push(sateMap[key])
  }
  const sortedList = cityList.sort((a, b) => {
    return b.dealerNum - a.dealerNum
  })
  return sortedList
}
function replaceTextSpecialChar(text) {
  return text.replace(/<\/?[^>]+>/g, '').replace(/\r|\n|\t|\s+|\u00A0|&ensp;|&#39;|&idquo;|&emsp;/g, ' ').replace(/&quot;|"/g, `'`)
}

const differentContryMonths = {
  'my-en': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  'id-id': ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
  'th-th': ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
}
const firstUpperCase = ([first, ...rest]) => first && first.toUpperCase() + rest.join('')

const handleTabs = (str) => str.replace(/[\r\n\t]/g, '')

function randomNum(num = 4) {
  return Math.floor(Math.random() * num)
}

/**
 * 取富文本编辑器返回的HTML字符串中的内容content
 * @param {*} htmlStr
 */
function transformHtmlStrToStr(htmlStr) {
  let result = htmlStr.replace(/<[^>]+>/gim, ' ')
  result = result.replace(/[\r\n]/g, '')
  return result
}

/**
 * 深复制
 * @param {*} target
 * @returns
 */
function deepCopy(target) {
  const result =
    Object.prototype.toString.call(target) === '[object Object]' ? {} : []
  for (const key in target) {
    // eslint-disable-next-line no-prototype-builtins
    const value = target[key]
    if (Object.prototype.toString.call(value) === '[object Object]') {
      result[key] = deepCopy(value)
    } else {
      result[key] = value
    }
  }
  return result
}

/**
 * @description: 判断a标签的域名是否属于白名单，不是的话加rel="nofollow" target="_blank"属性
 * @param {*}
 * @return {*}
 */
// 匹配a标签跳转的网址是否是白名单网址
function isWhiteListDomain(href, domainWhiteList = []) {
  const hrefDomain = href.match(
    /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*/g
  )
  return hrefDomain ? domainWhiteList.includes(hrefDomain[0]) : true // 没带网址的一般是站内路由
}

function handleEditorBreadCrumbList({ layoutData = [] }) {
  // 配置中的面包屑内容获取和处理，通过 Layout 组件显示
  const breadCrumbData = layoutData.find((item) => item.type === 'BreadCrumb')
  if (breadCrumbData && breadCrumbData.data && breadCrumbData.data.content) {
    const configContent = breadCrumbData.data.content || ''
    const tempList = configContent.split('----')
    return tempList.reduce((prev, cur) => {
      const listItem = cur.match(/\{[\s\S]+?\}/gi)
      let [name = '', href = ''] = listItem
      name && (name = name.replace('{', '').replace('}', ''))
      href && (href = href.replace('{', '').replace('}', ''))
      name && prev.push({ name, href })
      return prev
    }, [])
  }
  return []
}
const rssTagInfo = {
  'my-en': {
    contentLang: 'en-US',
    siteName: 'WapCar News',
    linkTitle: 'WapCar News RSS Feed',
    carSection: 'Cars',
    carRssLink: 'https://www.wapcar.my/sitemap/rss.xml'
  },
  'my-my': {
    contentLang: 'ms-MY',
    siteName: 'WapCar News',
    linkTitle: 'WapCar News RSS Feed',
    carSection: 'Cars',
    carRssLink: 'https://www.wapcar.my/sitemap/rss-ms.xml'
  },
  'my-zh': {
    contentLang: 'zh-CN',
    siteName: 'WapCar News',
    linkTitle: 'WapCar News RSS Feed',
    carSection: 'Cars',
    carRssLink: 'https://www.wapcar.my/sitemap/rss-zh.xml'
  },
  'id-id': {
    contentLang: 'id-ID',
    siteName: 'Berita Mobil AutoFuns',
    motorSiteName: 'Berita Motor AutoFun',
    linkTitle: 'Umpan RSS Berita AutoFun',
    carSection: 'Cars',
    motorSection: 'Motorcycles',
    carRssLink: 'https://www.autofun.co.id/sitemap/rss.xml',
    motorRssLink: 'https://www.autofun.co.id/sitemap/motor-rss.xml'
  },
  'th-th': {
    contentLang: 'th-Th',
    siteName: 'ข่าวสารรถยนต์  AutoFun',
    motorSiteName: 'ข่าวสารรถมอเตอร์ไซค์ AutoFun',
    linkTitle: 'Rss feed จากข่าว AutoFun ในประเทศไทย',
    carSection: 'Cars',
    motorSection: 'Motorcycles',
    carRssLink: 'https://www.autofun.co.th/sitemap/rss.xml',
    motorRssLink: 'https://www.autofun.co.th/sitemap/motor-rss.xml'
  },
  'ph-en': {
    contentLang: 'en-PH',
    siteName: 'AutoFun Automotive News',
    motorSiteName: 'AutoFun Motorcycle News',
    linkTitle: 'Rss feed from AutoFun News in Philippines',
    carSection: 'Cars',
    motorSection: 'Motorcycles',
    carRssLink: 'https://www.autofun.ph/sitemap/rss.xml',
    motorRssLink: 'https://www.autofun.ph/sitemap/motor-rss.xml'
  },
  'vn-vi': {
    contentLang: 'vi-VN',
    siteName: 'Tin tức ô tô AutoFun',
    motorSiteName: 'Tin tức xe máy AutoFun',
    linkTitle: 'Rss feed từ AutoFun tin tức',
    carSection: 'Cars',
    motorSection: 'Motorcycles',
    carRssLink: 'https://www.autofun.vn/sitemap/rss.xml',
    motorRssLink: 'https://www.autofun.vn/sitemap/motor-rss.xml'
  }
}
function getRssTags({ releaseTime, updateTime, isMotor = false, lang }) {
  const publishedTimeISO = (new Date(releaseTime)).toISOString()
  const updateTimeISO = releaseTime < updateTime ? (new Date(updateTime)).toISOString() : publishedTimeISO
  return `
  <meta property="og:locale" content="${rssTagInfo[lang].contentLang}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${isMotor ? rssTagInfo[lang].motorSiteName : rssTagInfo[lang].siteName}" />
  <meta property="article:section" content="${isMotor ? rssTagInfo[lang].motorSection : rssTagInfo[lang].carSection}" />
  <meta property="article:published_time" content="${publishedTimeISO}" />
  <meta property="article:modified_time" content="${updateTimeISO}" />
  <meta property="og:updated_time" content="${updateTimeISO}" />
  <link rel="alternate" type="application/rss+xml" title="${rssTagInfo[lang].linkTitle}" href="${isMotor ? rssTagInfo[lang].motorRssLink : rssTagInfo[lang].carRssLink}">
  `
}

function getWd(isAmp) {
  const wdMaps = {
    'www-autofun-co-th.cdn.ampproject.org': 'www.autofun.co.th',
    'www-autofun-co-id.cdn.ampproject.org': 'www.autofun.co.id',
    'www-autofun-ph.cdn.ampproject.org': 'www.autofun.ph',
    'www-autofun-vn.cdn.ampproject.org': 'www.autofun.vn',
    'www-wapcar-my.cdn.ampproject.org': 'www.wapcar.my',
    'forum-wapcar-my.cdn.ampproject.org': 'www.wapcar.my',
    'forum.wapcar.my': 'www.wapcar.my',
    'test-forum.wapcar.my': 'test.wapcar.my'
  }
  let hostVal = ''
  if (isAmp) {
    hostVal = '$' + '{ampdocHostname}'
    let result = ''
    const equalCode = '$EQUALS(${' + 'val},value)'
    const ifCode = '$IF(${' + 'var},value1,value2)'
    const wdMapKeys = Object.keys(wdMaps)
    const codeStrs = wdMapKeys.map((key, idx) => {
      // $EQUALS(${ampdocHostname}, www-autofun-co-th.cdn.ampproject.org) => true/false
      const caseCode = equalCode.replace(/\${val}/, hostVal).replace('value', key)
      let res = ifCode.replace(/\${var}/, caseCode).replace('value1', wdMaps[key])
      if (idx === wdMapKeys.length - 1) res = res.replace('value2', hostVal)
      return res
    }).reverse()
    codeStrs.forEach((code, idx) => {
      result = idx === 0 ? code : result
      const nextCode = codeStrs[idx + 1]
      if (nextCode) {
        result = nextCode.replace('value2', result)
      }
    })
    return result
  } else {
    hostVal = location.host
    return wdMaps[hostVal] || hostVal
  }
}

function isFocusCorePage(curLang) {
  const host = domainHost[curLang]
  let href = document.location.href
  href = href
    .replace('http://', '')
    .replace('https://', '')
    .replace(document.location.host, '') // 去除host部分
    .replace(host, '')
  const firstPath = href.split('/')[1] // 各级地址
  return [
    carMap[curLang],
    newsMap[curLang],
    usedCarMap[curLang]
  ].includes(firstPath)
}

module.exports = {
  throttle,
  sortHandleByCharCode,
  Traversal,
  handleImg,
  replaceDoubleQuotes,
  checkPlatform,
  xssFilter,
  replaceAllImg,
  checkPlatform,
  getBrowserInfo,
  getScrollTop,
  getQueryVariable,
  handleImgSource,
  didWidthType,
  findKey,
  getIsServer,
  getIsClient,
  getCookieDomain,
  getRandomNum,
  getS3PublishPath,
  generateRandomNum,
  getCurrentMonth,
  getQueryVariableFromHref,
  copyToClip,
  dynamicFacebookScript,
  calcKeyframes,
  calculateCityList,
  calcKeyframes,
  replaceTextSpecialChar,
  differentContryMonths,
  firstUpperCase,
  handleTabs,
  randomNum,
  transformHtmlStrToStr,
  deepCopy,
  handleContentCollectImg,
  isWhiteListDomain,
  handleEditorBreadCrumbList,
  getRssTags,
  getWd,
  isFocusCorePage
}
