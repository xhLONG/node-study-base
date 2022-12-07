const request = require('request')
const fs = require('fs')
const iconv = require("iconv-lite");
const jsdom = require("jsdom").JSDOM;


/**
 * 从文档html中获取结构化数据
 * @param {*} docContext
 * @returns 结构化数据字符串，包含<script>标签
 */
function parseStructuredData(docContext) {
  const reg = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  const regRes = docContext.match(reg)
  return regRes
}

const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'

const pcUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'


request({
  url: `https://www.wapcar.my/cars`, //请求路径
  method: "GET", //请求方式，默认为get
  headers: {
    // 不设置user-agent为移动端，则获取不到结构化数据
    'User-Agent': mobileUserAgent
  },
  encoding: null,
}, function (err, response, body) {
  console.log('response.statusCode', response.statusCode)
  if (err) {
    console.log('err', err)
    return
  }
  if (response.statusCode == 200) {
    let buf = iconv.decode(body, "utf-8").toString(); //解码gb2312
    let dom = new jsdom(buf);

    fs.writeFile('cars-mobile.html', buf, (err) => {
      console.log(err)
    })
    let docDescription = parseStructuredData(buf)
    console.log('docDescription', docDescription)

    const structorTags = dom.window.document.querySelectorAll("script")
    const aTags = dom.window.document.querySelectorAll("a")
    // console.log(structorTags.length)
    // for (let i = 0; i < aTags.length; i++){
    //   console.log(aTags[i].href)
    // }
  }
})