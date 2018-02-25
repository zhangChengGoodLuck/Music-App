import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    pagesize: 100,
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagenum: 1,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    loginUin: 0
  })

  return jsonp(url, data, options)
}
