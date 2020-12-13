const fs = require('fs')
const https = require('https')
const path = require('path')
const imgDownLoad = require('./module/imgDownload')
const {formatjdHttpUrl} = require('./module/format')


// const url = 'https://club.jd.com/discussion/getProductPageImageCommentList.action?productId=10022878265621&isShadowSku=0&callback=jQuery4024678&page=1&pageSize=10&_=1607764724305'
// const url = 'https://club.jd.com/comment/productPageComments.action?callback=fetchJSON_comment98&productId=10022878265621&score=7&sortType=5&page=0&pageSize=10&isShadowSku=0&fold=1'
// const url = 'https://club.jd.com/discussion/getProductPageImageCommentList.action?productId=10022686089513&isShadowSku=0&callback=jQuery1724066&page=1&pageSize=10&_=1607849086940'

const url = 'https://club.jd.com/comment/productPageComments.action?callback=fetchJSON_comment98&productId=10022686089513&score=7&sortType=5&page=0&pageSize=10&isShadowSku=0&fold=1'

const iteratorPage = async (url, pageNum) =>{
 
  const req = https.request(url, (res) => {
    console.log(`url:${url}`)
    res.setEncoding('utf8');
    let sendmsg = ''
    res.on('data', (chunk) => {
      sendmsg += chunk
    })

    res.on('end', (chunk) => {

      const reg1 = /callback=(\w*)/
      url.match(reg1)

      const reg = new RegExp(`(${RegExp.$1}\\()(.*)\\)`)
      sendmsg.match(reg)
      const resJson = JSON.parse(RegExp.$2)

     // 下载视频晒单栏

     resJson.comments.forEach((item)=>{
        item.images.forEach((imgObj)=>{

          const imgObject = path.parse(imgObj.imgUrl)
          console.log(`img url: ${imgObj.imgUrl}`)
          imgDownLoad(formatjdHttpUrl(imgObj.imgUrl),`img/${imgObject.name}${imgObject.ext}`)

        })

     })

     if(resJson.maxPage > pageNum){
        iteratorPage(url.replace(/page=[0-9]+/,`page=${pageNum+1}`),pageNum+1)
      }


      // 下载晒图栏
      // resJson.imgComments.imgList.forEach((item)=>{
      //   const imgObject = path.parse(item.imageUrl)
      //   console.log(`img url: ${item.imageUrl}`)
      //   imgDownLoad(formatjdHttpUrl(item.imageUrl),`img/${imgObject.name}${imgObject.ext}`)
      // })

      //  // 递归
      // if(Math.ceil(parseInt(resJson.imgComments.imgCommentCount)/10) > pageNum){
      //   iteratorPage(url.replace(/page=[0-9]+/,`page=${pageNum+1}`),pageNum+1)
      // }

    })

  });
  req.end()

}



iteratorPage(url,1)
