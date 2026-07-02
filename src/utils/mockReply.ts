const replies = [
  '好的，我关注一下',
  '请问具体是什么情况呢？',
  '没问题，我这边可以',
  '稍等，我先确认一下',
  '好的，收到，谢谢提醒',
  '这个我也有兴趣，能详细说说吗？',
  '已看到，稍后回复你',
  '了解，我安排一下',
  '可以的，方便的话约个时间',
  '谢谢告知，我记下了',
]

export function getMockReply(): string {
  const idx = Math.floor(Math.random() * replies.length)
  return replies[idx]!
}

export function getMockReplyAsync(): Promise<string> {
  const delay = 1000 + Math.random() * 2000
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockReply())
    }, delay)
  })
}
