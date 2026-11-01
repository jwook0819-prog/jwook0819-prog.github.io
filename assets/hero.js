// 홈 첫 화면: 곰·토끼·펭귄·집게 그림을 격자로 훑어, 그림의 색 그대로 입자로 바꿔서 그린다.
// 입자가 흩어져 있다가 모여 곰 모양이 되고, 집게가 내려와 곰을 집어 올렸다가 내려놓는다.
// 난수는 고정이라 새로 열어도 같은 모양이다. 화면에서 가려지면 멈추고, "동작 줄이기" 설정이면 곰을 든 한 장면만 그린다.
(function () {
  'use strict'
  var cv = document.getElementById('hero-canvas')
  if (!cv || !cv.getContext) return
  var ctx = cv.getContext('2d')
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  var W = 400, H = 620, T = 10
  var NS = 'http://www.w3.org/2000/svg'
  var DEFS = "<radialGradient id=\"fur\" cx=\".38\" cy=\".3\" r=\".8\"><stop offset=\"0\" stop-color=\"#F9CB92\"/><stop offset=\".55\" stop-color=\"#E7A15C\"/><stop offset=\"1\" stop-color=\"#C47838\"/></radialGradient> <radialGradient id=\"furB\" cx=\".4\" cy=\".25\" r=\".85\"><stop offset=\"0\" stop-color=\"#F3B877\"/><stop offset=\"1\" stop-color=\"#C27535\"/></radialGradient> <radialGradient id=\"belly\" cx=\".5\" cy=\".35\" r=\".75\"><stop offset=\"0\" stop-color=\"#FFF0D6\"/><stop offset=\"1\" stop-color=\"#F3CC98\"/></radialGradient> <radialGradient id=\"cheek\" cx=\".5\" cy=\".5\" r=\".5\"><stop offset=\"0\" stop-color=\"#FF7FAF\" stop-opacity=\".85\"/><stop offset=\"1\" stop-color=\"#FF7FAF\" stop-opacity=\"0\"/></radialGradient> <radialGradient id=\"lav\" cx=\".4\" cy=\".3\" r=\".85\"><stop offset=\"0\" stop-color=\"#E2D6FF\"/><stop offset=\"1\" stop-color=\"#A88CF2\"/></radialGradient> <radialGradient id=\"glow\" cx=\".5\" cy=\".5\" r=\".5\"><stop offset=\"0\" stop-color=\"#B58CFF\" stop-opacity=\".55\"/><stop offset=\"1\" stop-color=\"#B58CFF\" stop-opacity=\"0\"/></radialGradient> <linearGradient id=\"gold\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#FFE98A\"/><stop offset=\"1\" stop-color=\"#FFB224\"/></linearGradient> <linearGradient id=\"rod\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#B9A6F5\"/><stop offset=\".5\" stop-color=\"#F1EAFF\"/><stop offset=\"1\" stop-color=\"#B9A6F5\"/></linearGradient> <radialGradient id=\"whiteB\" cx=\".5\" cy=\".35\" r=\".75\"><stop offset=\"0\" stop-color=\"#FFFFFF\"/><stop offset=\"1\" stop-color=\"#E7DEFF\"/></radialGradient> <radialGradient id=\"blk\" cx=\".4\" cy=\".25\" r=\".9\"><stop offset=\"0\" stop-color=\"#4A4170\"/><stop offset=\"1\" stop-color=\"#1B1530\"/></radialGradient> <!-- 토끼: 발 밑 중앙이 (0,0) --> <g id=\"rabbit\"> <ellipse cx=\"-17\" cy=\"-114\" rx=\"10.5\" ry=\"31\" transform=\"rotate(-9 -17 -114)\" fill=\"url(#lav)\"/><ellipse cx=\"-17\" cy=\"-112\" rx=\"5\" ry=\"21\" transform=\"rotate(-9 -17 -112)\" fill=\"#F7A9C4\"/> <ellipse cx=\"17\" cy=\"-114\" rx=\"10.5\" ry=\"31\" transform=\"rotate(9 17 -114)\" fill=\"url(#lav)\"/><ellipse cx=\"17\" cy=\"-112\" rx=\"5\" ry=\"21\" transform=\"rotate(9 17 -112)\" fill=\"#F7A9C4\"/> <ellipse cx=\"-35\" cy=\"-40\" rx=\"9\" ry=\"19\" transform=\"rotate(14 -35 -40)\" fill=\"url(#lav)\"/><ellipse cx=\"35\" cy=\"-40\" rx=\"9\" ry=\"19\" transform=\"rotate(-14 35 -40)\" fill=\"url(#lav)\"/> <ellipse cx=\"0\" cy=\"-40\" rx=\"37\" ry=\"41\" fill=\"url(#lav)\"/><ellipse cx=\"0\" cy=\"-33\" rx=\"23\" ry=\"29\" fill=\"url(#whiteB)\"/> <ellipse cx=\"-19\" cy=\"-4\" rx=\"17\" ry=\"9\" fill=\"url(#whiteB)\"/><ellipse cx=\"19\" cy=\"-4\" rx=\"17\" ry=\"9\" fill=\"url(#whiteB)\"/> <circle cx=\"0\" cy=\"-86\" r=\"35\" fill=\"url(#lav)\"/><ellipse cx=\"-4\" cy=\"-112\" rx=\"12\" ry=\"5.5\" fill=\"#FFE59A\" opacity=\".85\" transform=\"rotate(-8 -4 -112)\"/> <circle cx=\"-23\" cy=\"-76\" r=\"9\" fill=\"url(#cheek)\"/><circle cx=\"23\" cy=\"-76\" r=\"9\" fill=\"url(#cheek)\"/> <ellipse cx=\"0\" cy=\"-75\" rx=\"14\" ry=\"10\" fill=\"url(#whiteB)\"/> <ellipse cx=\"-13\" cy=\"-88\" rx=\"5\" ry=\"6.4\" fill=\"#2A170F\"/><ellipse cx=\"13\" cy=\"-88\" rx=\"5\" ry=\"6.4\" fill=\"#2A170F\"/><circle cx=\"-11.3\" cy=\"-90.4\" r=\"2\" fill=\"#fff\"/><circle cx=\"14.7\" cy=\"-90.4\" r=\"2\" fill=\"#fff\"/> <ellipse cx=\"0\" cy=\"-79\" rx=\"3.6\" ry=\"2.7\" fill=\"#F2819F\"/><path d=\"M0 -76v3M0 -73q-4 4-8 1M0 -73q4 4 8 1\" fill=\"none\" stroke=\"#7A4A5A\" stroke-width=\"1.6\" stroke-linecap=\"round\"/> </g> <!-- 펭귄 --> <g id=\"penguin\"> <ellipse cx=\"-17\" cy=\"-3\" rx=\"15\" ry=\"7\" fill=\"#FFB224\"/><ellipse cx=\"17\" cy=\"-3\" rx=\"15\" ry=\"7\" fill=\"#FFB224\"/> <ellipse cx=\"-40\" cy=\"-52\" rx=\"9\" ry=\"26\" transform=\"rotate(18 -40 -52)\" fill=\"url(#blk)\"/><ellipse cx=\"40\" cy=\"-52\" rx=\"9\" ry=\"26\" transform=\"rotate(-18 40 -52)\" fill=\"url(#blk)\"/> <ellipse cx=\"0\" cy=\"-48\" rx=\"38\" ry=\"46\" fill=\"url(#blk)\"/><ellipse cx=\"0\" cy=\"-40\" rx=\"26\" ry=\"35\" fill=\"url(#whiteB)\"/> <circle cx=\"0\" cy=\"-92\" r=\"30\" fill=\"url(#blk)\"/> <circle cx=\"-14\" cy=\"-95\" r=\"9\" fill=\"#fff\"/><circle cx=\"14\" cy=\"-95\" r=\"9\" fill=\"#fff\"/><circle cx=\"-13\" cy=\"-95\" r=\"4.6\" fill=\"#120D20\"/><circle cx=\"15\" cy=\"-95\" r=\"4.6\" fill=\"#120D20\"/><circle cx=\"-11.5\" cy=\"-97.5\" r=\"1.8\" fill=\"#fff\"/><circle cx=\"16.5\" cy=\"-97.5\" r=\"1.8\" fill=\"#fff\"/> <circle cx=\"-25\" cy=\"-82\" r=\"7\" fill=\"url(#cheek)\"/><circle cx=\"25\" cy=\"-82\" r=\"7\" fill=\"url(#cheek)\"/> <path d=\"M-7 -85q7-3 14 0q-3 9-7 9q-4 0-7-9z\" fill=\"#FFB224\"/> </g>"
  var ART = { bear: "<circle cx=\"146\" cy=\"322\" r=\"27\" fill=\"url(#furB)\"/><circle cx=\"146\" cy=\"324\" r=\"14\" fill=\"#F59BB8\"/><circle cx=\"143\" cy=\"320\" r=\"7\" fill=\"#FFC1D3\" opacity=\".7\"/> <circle cx=\"254\" cy=\"322\" r=\"27\" fill=\"url(#furB)\"/><circle cx=\"254\" cy=\"324\" r=\"14\" fill=\"#F59BB8\"/><circle cx=\"251\" cy=\"320\" r=\"7\" fill=\"#FFC1D3\" opacity=\".7\"/> <ellipse cx=\"124\" cy=\"448\" rx=\"24\" ry=\"42\" transform=\"rotate(24 124 448)\" fill=\"url(#furB)\"/> <ellipse cx=\"276\" cy=\"448\" rx=\"24\" ry=\"42\" transform=\"rotate(-24 276 448)\" fill=\"url(#furB)\"/> <ellipse cx=\"200\" cy=\"452\" rx=\"80\" ry=\"84\" fill=\"url(#fur)\"/> <ellipse cx=\"200\" cy=\"466\" rx=\"52\" ry=\"60\" fill=\"url(#belly)\"/> <ellipse cx=\"156\" cy=\"528\" rx=\"32\" ry=\"21\" fill=\"url(#furB)\"/><ellipse cx=\"244\" cy=\"528\" rx=\"32\" ry=\"21\" fill=\"url(#furB)\"/> <ellipse cx=\"156\" cy=\"531\" rx=\"17\" ry=\"11\" fill=\"#FFE9C9\"/><ellipse cx=\"244\" cy=\"531\" rx=\"17\" ry=\"11\" fill=\"#FFE9C9\"/> <circle cx=\"200\" cy=\"360\" r=\"68\" fill=\"url(#fur)\"/> <ellipse cx=\"176\" cy=\"320\" rx=\"30\" ry=\"13\" fill=\"#fff\" opacity=\".2\" transform=\"rotate(-18 176 320)\"/> <ellipse cx=\"200\" cy=\"388\" rx=\"29\" ry=\"22\" fill=\"#FFE9C9\"/> <circle cx=\"150\" cy=\"384\" r=\"16\" fill=\"url(#cheek)\"/><circle cx=\"250\" cy=\"384\" r=\"16\" fill=\"url(#cheek)\"/> <g class=\"blink\"><ellipse cx=\"170\" cy=\"352\" rx=\"9.5\" ry=\"12\" fill=\"#2A170F\"/><ellipse cx=\"230\" cy=\"352\" rx=\"9.5\" ry=\"12\" fill=\"#2A170F\"/> <circle cx=\"173.5\" cy=\"347\" r=\"3.8\" fill=\"#fff\"/><circle cx=\"233.5\" cy=\"347\" r=\"3.8\" fill=\"#fff\"/><circle cx=\"167\" cy=\"357.5\" r=\"1.9\" fill=\"#fff\" opacity=\".8\"/><circle cx=\"227\" cy=\"357.5\" r=\"1.9\" fill=\"#fff\" opacity=\".8\"/></g> <ellipse cx=\"200\" cy=\"376\" rx=\"9.5\" ry=\"7\" fill=\"#4A2A1A\"/><ellipse cx=\"197\" cy=\"374\" rx=\"3.2\" ry=\"1.9\" fill=\"#fff\" opacity=\".6\"/> <path d=\"M200 383v6M200 389q-7 8-15 2M200 389q7 8 15 2\" fill=\"none\" stroke=\"#4A2A1A\" stroke-width=\"2.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>", back: "<g class=\"bob b1\"><use href=\"#rabbit\" transform=\"translate(58 538) scale(.82)\"/></g> <g class=\"bob b2\"><use href=\"#penguin\" transform=\"translate(344 536) scale(.82)\"/></g>", front: "<ellipse cx=\"200\" cy=\"574\" rx=\"210\" ry=\"30\" fill=\"#0B0720\" opacity=\".55\"/> <g class=\"bob b3\"><use href=\"#rabbit\" transform=\"translate(112 584)\"/></g> <g class=\"bob b2\"><use href=\"#penguin\" transform=\"translate(300 586)\"/></g> <g class=\"bob b1\"><use href=\"#rabbit\" transform=\"translate(212 606) scale(.7)\"/></g> <g class=\"bob b3\"><use href=\"#rabbit\" transform=\"translate(372 590) scale(.62)\"/></g> <g class=\"bob b1\"><use href=\"#penguin\" transform=\"translate(28 590) scale(.62)\"/></g>" }

  var seed = 20261124
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
  function rr(a, b) { return a + rnd() * (b - a) }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v }
  function lerp(a, b, t) { return a + (b - a) * t }
  function ease(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t) }
  // 키프레임 [[초, 값], ...] 사이를 부드럽게 잇는다
  function kf(t, k) {
    var u = ((t % T) + T) % T, i = 0
    while (i < k.length - 2 && u > k[i + 1][0]) i++
    return lerp(k[i][1], k[i + 1][1], ease((u - k[i][0]) / (k[i + 1][0] - k[i][0])))
  }
  var K_DROP = [[0, 0], [1.4, 150], [2.6, 150], [5, 20], [6.4, 20], [7.6, 150], [8.2, 150], [10, 0]]
  var K_LIFT = [[0, 0], [2.6, 0], [5, -130], [6.4, -130], [7.6, 0], [10, 0]]
  var K_ARM = [[0, -3], [1.4, -3], [2.5, 17], [7.6, 17], [8.5, -3], [10, -3]]
  var K_SWAY = [[0, 0], [2.6, 0], [3.6, -3.5], [4.6, 3], [5.6, -2], [6.6, 0], [10, 0]]
  var K_SWING = [[0, 0], [0.4, 2.2], [0.9, -1.6], [1.3, 0], [7, 0], [8, 1.6], [9, -1.2], [10, 0]]
  var K_SPARK = [[0, 0], [4.9, 0], [5.4, 1.25], [6.2, 1], [7, 0], [10, 0]]

  var COLS = ['#FF8FB8', '#6FE0C5', '#7CC8FF', '#C9B8FF', '#FFD772', '#FFFFFF']
  var P = { bear: [], back: [], front: [], arm: [], hub: [], rod: [], amb: [] }
  var ready = 0

  // 그림(SVG 글)을 캔버스에 그린 뒤, 격자 칸마다 색을 읽어 입자로 만든다
  function sample(svgInner, vb, step, out, ox, oy, opt) {
    var w = vb[2], h = vb[3]
    var svg = '<svg xmlns="' + NS + '" width="' + w + '" height="' + h + '" viewBox="' + vb.join(' ') + '"><defs>' + DEFS + '</defs>' + svgInner + '</svg>'
    var img = new Image()
    img.onload = function () {
      var c = document.createElement('canvas'); c.width = w; c.height = h
      var g = c.getContext('2d'); g.drawImage(img, 0, 0)
      var data = g.getImageData(0, 0, w, h).data
      for (var y = step / 2; y < h; y += step) for (var x = step / 2; x < w; x += step) {
        var jx = x + rr(-step * 0.25, step * 0.25), jy = y + rr(-step * 0.25, step * 0.25)
        var ix = clamp(Math.round(jx), 0, w - 1), iy = clamp(Math.round(jy), 0, h - 1), o = (iy * w + ix) * 4
        if (data[o + 3] < 110) continue
        out.push({ x: jx + vb[0] + (ox || 0), y: jy + vb[1] + (oy || 0), col: 'rgb(' + data[o] + ',' + data[o + 1] + ',' + data[o + 2] + ')', r: step * rr(0.5, 0.64), a: rr(0.82, 1), sx: rr(-140, W + 140), sy: rr(-100, H + 100), delay: rr(0, 0.9), dur: rr(1.1, 1.8), ph: rr(0, 6.28) })
      }
      ready++
    }
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  }
  var ARM = '<g fill="none" stroke-linecap="round"><path d="M7 0C66-8 102 28 98 84" stroke="#8A4F00" stroke-width="17"/><path d="M7 0C66-8 102 28 98 84" stroke="#FFC53D" stroke-width="12"/><path d="M9-2C64-9 98 26 94 80" stroke="#FFF3B8" stroke-width="3.2" opacity=".85"/></g><circle cx="98" cy="86" r="11" fill="#FF6FA8" stroke="#8A2F55" stroke-width="2.5"/><circle cx="94.5" cy="82.5" r="3.4" fill="#fff" opacity=".8"/>'
  var HUB = '<rect x="172" y="84" width="56" height="38" rx="12" fill="#8A4F00"/><rect x="174" y="84" width="52" height="34" rx="11" fill="url(#gold)"/><rect x="180" y="88" width="40" height="7" rx="3.5" fill="#fff" opacity=".45"/><circle cx="200" cy="104" r="5.5" fill="#B36B00"/>'
  sample(ART.bear, [0, 0, W, H], 3.4, P.bear)
  sample(ART.back, [0, 0, W, H], 4.4, P.back)
  sample(ART.front, [0, 0, W, H], 4.4, P.front)
  sample(ARM, [-14, -22, 130, 140], 2.9, P.arm)       // 오른팔(집게 축이 (0,0)). 왼팔은 좌우를 뒤집어 쓴다
  sample(HUB, [166, 78, 68, 50], 2.9, P.hub)
  var i
  for (i = 0; i < 80; i++) P.rod.push({ x: 200 + rr(-3.2, 3.2), y: -60 + i * 4, col: i % 3 ? '#E2D8FF' : '#B9A6F5', r: 2.2, a: 0.95, sx: rr(-140, W + 140), sy: rr(-100, H + 100), delay: rr(0, 0.9), dur: rr(1.1, 1.8), ph: 0 })
  for (i = 0; i < 80; i++) P.amb.push({ x: rr(-20, W + 20), y: rr(-10, H - 120), col: COLS[(rnd() * COLS.length) | 0], r: rr(0.8, 2.1), a: rr(0.25, 0.7), sp: rr(0.25, 0.7), amp: rr(4, 14), ph: rr(0, 6.28), star: rnd() < 0.2 })

  var cw = 0, ch = 0, dpr = 1, sc = 1, ox = 0, oy = 0
  function resize() {
    var r = cv.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    cw = Math.max(1, Math.round(r.width)); ch = Math.max(1, Math.round(r.height))
    cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr)
    sc = Math.min(cw / W, ch / H); ox = (cw - W * sc) / 2; oy = (ch - H * sc) / 2
  }

  function dot(p, x, y, t, grow) {
    var e = ease((t - p.delay) / p.dur)
    if (e < 1) { x = lerp(p.sx, x, e); y = lerp(p.sy, y, e) }
    var tw = 1 + 0.12 * Math.sin(t * 2.1 + p.ph)
    ctx.globalAlpha = p.a * e
    ctx.fillStyle = p.col
    ctx.beginPath(); ctx.arc(x, y, p.r * tw * (grow || 1), 0, 6.283); ctx.fill()
  }
  function layer(arr, t, dx, dy) { for (var q = 0; q < arr.length; q++) dot(arr[q], arr[q].x + dx, arr[q].y + dy, t) }
  function star(x, y, s, col) {
    ctx.fillStyle = col; ctx.beginPath()
    ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.28, y - s * 0.28); ctx.lineTo(x + s, y); ctx.lineTo(x + s * 0.28, y + s * 0.28)
    ctx.lineTo(x, y + s); ctx.lineTo(x - s * 0.28, y + s * 0.28); ctx.lineTo(x - s, y); ctx.lineTo(x - s * 0.28, y - s * 0.28); ctx.closePath(); ctx.fill()
  }

  function frame(t) {
    var D = kf(t, K_DROP), B = kf(t, K_LIFT), A = kf(t, K_ARM) * Math.PI / 180, SW = kf(t, K_SWAY) * Math.PI / 180, SG = kf(t, K_SWING) * Math.PI / 180
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height)
    ctx.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * ox, dpr * oy)
    var q, p, x, y, s, c

    // 떠다니는 별빛
    for (q = 0; q < P.amb.length; q++) {
      p = P.amb[q]; x = p.x + Math.sin(t * p.sp + p.ph) * p.amp; y = p.y + Math.cos(t * p.sp * 0.8 + p.ph) * p.amp
      ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(t * 1.7 + p.ph)); ctx.fillStyle = p.col
      if (p.star) { ctx.fillRect(x - p.r * 2.2, y - 0.5, p.r * 4.4, 1); ctx.fillRect(x - 0.5, y - p.r * 2.2, 1, p.r * 4.4) } else { ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.283); ctx.fill() }
    }

    layer(P.back, t, 0, 0)

    // 곰: 집게에 매달려 올라가며 흔들린다 (머리 쪽을 축으로)
    s = Math.sin(SW); c = Math.cos(SW)
    var py = 300 + B
    for (q = 0; q < P.bear.length; q++) {
      p = P.bear[q]
      var rx = p.x - 200, ry = p.y - 300
      dot(p, 200 + rx * c - ry * s, py + rx * s + ry * c, t)
    }

    layer(P.front, t, 0, 0)

    // 집게: 줄 → 팔 두 개 → 몸통. 전체가 줄 끝을 축으로 살짝 흔들린다
    var sg = Math.sin(SG), cg = Math.cos(SG)
    function claw(px, py2) { var rx = px - 200, ry = py2 + 60; return [200 + rx * cg - ry * sg, -60 + rx * sg + ry * cg] }
    var pv = 104 + D, a, b
    for (q = 0; q < P.rod.length; q++) { p = P.rod[q]; if (p.y > pv - 6) break; a = claw(p.x, p.y); dot(p, a[0], a[1], t) }
    var ca = Math.cos(A), sa = Math.sin(A)
    for (q = 0; q < P.arm.length; q++) {
      p = P.arm[q]
      var ax = p.x * ca - p.y * sa, ay = p.x * sa + p.y * ca
      a = claw(200 + ax, pv + ay); dot(p, a[0], a[1], t)
      b = claw(200 - ax, pv + ay); dot(p, b[0], b[1], t)
    }
    for (q = 0; q < P.hub.length; q++) { p = P.hub[q]; a = claw(p.x, p.y + D); dot(p, a[0], a[1], t) }

    // 곰을 든 순간 터지는 반짝이
    var k = kf(t, K_SPARK)
    if (k > 0.02) {
      var SP = [[96, 262, 13, '#FFE27A'], [312, 236, 17, '#FFE27A'], [70, 360, 9, '#FF8FB8'], [338, 330, 10, '#9FE8D4'], [208, 214, 11, '#fff']]
      ctx.globalAlpha = 1
      for (q = 0; q < SP.length; q++) star(SP[q][0], SP[q][1], SP[q][2] * k, SP[q][3])
    }
    ctx.globalAlpha = 1
  }
  resize()
  function still() { if (ready >= 5) frame(5.8) }
  if (window.ResizeObserver) new ResizeObserver(function () { resize(); if (reduce) still() }).observe(cv)
  window.addEventListener('resize', function () { resize(); if (reduce) still() })

  var t0 = 0, run = true, seen = true, raf = 0, lastT = 0
  function loop(now) { raf = 0; if (!run || !seen) return; if (ready >= 5) { if (!t0) t0 = now; lastT = (now - t0) / 1000; frame(lastT) } raf = requestAnimationFrame(loop) }
  function kick() { if (!raf && run && seen) raf = requestAnimationFrame(loop) }
  if (reduce) {
    var wait = setInterval(function () { if (ready >= 5) { clearInterval(wait); still() } }, 100)
    return
  }
  document.addEventListener('visibilitychange', function () { run = document.visibilityState === 'visible'; if (run) { t0 = 0; kick() } })
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { var was = seen; seen = en[0].isIntersecting; if (seen && !was) kick() }).observe(cv)
  kick()
})()
