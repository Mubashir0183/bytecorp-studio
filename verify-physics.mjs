import fs from 'node:fs'

const port = process.argv[2] || '9225'
const pages = await (await fetch(`http://localhost:${port}/json`)).json()
const page = pages.find((item) => item.type === 'page' && item.url.includes('localhost:3000'))
const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
let nextId = 1
const pending = new Map()
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  if (!message.id || !pending.has(message.id)) return
  pending.get(message.id)(message)
  pending.delete(message.id)
})
function call(method, params = {}) {
  const id = nextId++
  return new Promise((resolve) => {
    pending.set(id, resolve)
    socket.send(JSON.stringify({ id, method, params }))
  })
}
async function read() {
  const response = await call('Runtime.evaluate', {
    expression: `(() => {
      const panel = document.querySelector('.feature-panel').getBoundingClientRect();
      const items = [...document.querySelectorAll('.falling-shape')].map((el) => {
        const match = el.style.transform.match(/translate3d\\(([-\\d.e]+)px, ([-\\d.e]+)px, 0(?:px)?\\) rotate\\(([-\\d.e]+)rad\\)/);
        if (!match) return null;
        return { x: +match[1] + parseFloat(el.style.width) / 2, y: +match[2] + parseFloat(el.style.height) / 2,
          w: parseFloat(el.style.width), h: parseFloat(el.style.height), a: +match[3] };
      }).filter(Boolean);
      const axes = (o) => [[Math.cos(o.a), Math.sin(o.a)],[-Math.sin(o.a), Math.cos(o.a)]];
      const overlap = (a,b) => {
        for (const [x,y] of [...axes(a),...axes(b)]) {
          const center = Math.abs((a.x-b.x)*x+(a.y-b.y)*y);
          const ra = Math.abs(x*Math.cos(a.a)+y*Math.sin(a.a))*a.w/2 + Math.abs(-x*Math.sin(a.a)+y*Math.cos(a.a))*a.h/2;
          const rb = Math.abs(x*Math.cos(b.a)+y*Math.sin(b.a))*b.w/2 + Math.abs(-x*Math.sin(b.a)+y*Math.cos(b.a))*b.h/2;
          if (center >= ra+rb-0.5) return false;
        }
        return true;
      };
      let overlaps=0, visibleOverlaps=0;
      for(let i=0;i<items.length;i++) for(let j=i+1;j<items.length;j++) if(overlap(items[i],items[j])) {
        overlaps++;
        if (items[i].y > 0 && items[j].y > 0) visibleOverlaps++;
      }
      return { panel: panel.toJSON(), count: items.length, overlaps, visibleOverlaps, items,
        visible: items.filter(o=>o.y>=0 && o.y<=panel.height).length,
        minY: Math.min(...items.map(o=>o.y)), maxY: Math.max(...items.map(o=>o.y)) };
    })()`,
    returnByValue: true,
  })
  return response.result.result.value
}

if (port === '9226') await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
if (process.argv[3] !== 'now') {
  await call('Page.reload', { ignoreCache: true })
  await new Promise((resolve) => setTimeout(resolve, 16000))
}
const first = await read()
if (process.argv[4] === 'pointer') {
  const y = first.panel.y + first.panel.height - 90
  for (let x = first.panel.x + 100; x < first.panel.x + 750; x += 25) {
    await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
    await new Promise((resolve) => setTimeout(resolve, 24))
  }
}
await new Promise((resolve) => setTimeout(resolve, 2000))
const second = await read()
const movement = first.items.map((item, index) => Math.abs(item.x - second.items[index]?.x || 0))
console.log(JSON.stringify({ panel: second.panel, count: second.count, overlaps: second.overlaps, visibleOverlaps: second.visibleOverlaps,
  visible: second.visible, minY: second.minY, maxY: second.maxY,
  maxHorizontalMovement: Math.max(...movement), averageHorizontalMovement: movement.reduce((a,b)=>a+b,0)/movement.length }, null, 2))
const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
fs.writeFileSync('quantity-check.png', Buffer.from(shot.result.data, 'base64'))
socket.close()
