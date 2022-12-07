const request = require("request");
const iconv = require("iconv-lite");
const jsdom = require("jsdom").JSDOM;
const fs = require("fs");
// const BS_URL = "https://www.menworld.org";
const BS_URL = "https://www.wapcar.my";

request(
  {
    url: `${BS_URL}/cars`, //请求路径
    method: "GET", //请求方式，默认为get
    headers: {
      //设置请求头
      "content-type": "application/json",
    },
    encoding: null,
    // body: JSON.stringify(requestData) //post参数字符串
  },
  function (error, response, body) {
    console.log("response.statusCode", response.statusCode);
    if (error) {
      console.log("出错", error);
    }
    if (!error && response.statusCode == 200) {
      // fs.mkdir("./img", (err) => console.log(err));
      let buf = iconv.decode(body, "gb2312").toString(); //解码gb2312
      let dom = new jsdom(buf);

      let $imgs = dom.window.document.getElementsByTagName("img");
      console.log('$imgs',$imgs)
      for (let j = 0; j < $imgs.length; j++) {
        let img = $imgs[j].src;
        if (img.includes('https')) {
          request(img).pipe(fs.createWriteStream(`./img/${j}.jpg`));
        }
      }

      // for (let i = 0; i < box.length; i++) {
      //   let href = box[i].getElementsByTagName("a")[0].href;
      //   console.log("href-->", href);

      //   request(
      //     {
      //       url: `${BS_URL + href}`,
      //       encoding: null,
      //     },
      //     (err, res, body) => {
      //       if (!error && response.statusCode == 200) {
      //         let buf = iconv.decode(body, "gb2312").toString(); //解码gb2312
      //         let dom = new jsdom(buf);

      //         let box = dom.window.document.getElementsByClassName("article");

      //         for (let j = 0; j < box.length; j++) {
      //           let img = box[j].getElementsByTagName("img")[0].src;
      //           request(img).pipe(fs.createWriteStream(`./img/${i}.jpg`));
      //         }
      //       }
      //     }
      //   );
      // }
    }
  }
);
