const got = require('got')

module.exports = async (POCKET_CONSUMER_KEY, POCKET_ACCESS_TOKEN) => {
  const headers = { 'Content-Type': 'application/json', 'X-Accept': 'application/json' }

  const { body: items } = await got.post('https://getpocket.com/v3/get', {
    headers,
    body: JSON.stringify({
      consumer_key: POCKET_CONSUMER_KEY,
      access_token: POCKET_ACCESS_TOKEN,
      // count: 100,
      state: 'all',
      detailType: 'complete'
    })
  })

  const list = JSON.parse(items).list
  const normalizedItems = Object.keys(list).map(k => list[k]).filter(i => i.resolved_title && i.resolved_url)

  const mappedItems = normalizedItems
    .map(item => ({
      id: item.item_id,
      title: item.resolved_title,
      url: item.resolved_url,
      date: new Date(+item.time_added * 1000).toISOString().substring(0, 10)
    }))

  return mappedItems
}
