// 홈 첫 화면의 입자 그림: 별빛 입자로 그린 금색 집게가 내려와 곰 인형을 집어 올린다.
// 색은 앱 아이콘(금색 집게, 분홍 끝, 곰 인형)에서 따왔다. 난수는 고정이라 새로 열어도 같은 모양이다.
// 화면에 안 보이거나 탭이 가려지면 멈추고, "동작 줄이기" 설정이면 움직이지 않는 한 장면만 그린다.
(function () {
  'use strict'
  var cv = document.getElementById('hero-canvas')
  if (!cv || !cv.getContext) return
  var ctx = cv.getContext('2d')
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  var W = 400, H = 560            // 그림 좌표(고정 크기). 화면 크기에 맞춰 확대·축소해서 그린다
  var PIV = { x: 200, y: -40 }    // 집게가 매달린 점(진자 중심)
  var BEAR = { x: 200, y: 462 }, BS = 1.4   // 곰 인형이 놓인 자리와 크기 배율

  var seed = 20261124
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
  function rr(a, b) { return a + rnd() * (b - a) }
  function pick(a) { return a[(rnd() * a.length) | 0] }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v }
  function lerp(a, b, t) { return a + (b - a) * t }
  function ease(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t) }

  var COL = {
    gold: ['#FFC53D', '#FFD772', '#FFB020'], pink: ['#FF8FB8', '#FF6FA8'], violet: ['#7A4DFF', '#A98BFF', '#C9B8FF'],
    white: ['#FFFFFF', '#EDE7FF'], bear: ['#E8A15C', '#F4B97A', '#C98A47'], pastel: ['#FF8FB8', '#6FE0C5', '#7CC8FF', '#C9B8FF', '#FFD772']
  }

  var P = []
  function add(kind, o) {
    o.kind = kind
    o.sx = rr(-140, W + 140); o.sy = rr(-100, H + 100)   // 처음 흩어져 있던 자리
    o.delay = rr(0, 0.8); o.dur = rr(1.1, 1.8); o.ph = rr(0, 6.28)
    o.r = o.r || rr(1.2, 2.5); o.a = o.a || rr(0.7, 1)
    P.push(o); return o
  }
  var i, k, a, s, ang, rad

  // 줄
  for (i = 0; i < 26; i++) add('rope', { u: i / 25, j: rr(-1.4, 1.4), col: pick(COL.white), a: 0.55 })
  // 머리: 타원 테두리 + 몸통
  for (i = 0; i < 34; i++) { ang = i / 34 * 6.283; add('head', { x: 200 + Math.cos(ang) * 50, y: 226 + Math.sin(ang) * 17, col: pick(COL.gold), r: rr(1.6, 2.8) }) }
  for (i = 0; i < 90; i++) add('head', { x: rr(158, 242), y: rr(218, 246), col: pick(COL.gold), r: rr(1.3, 2.4) })
  for (i = 0; i < 8; i++) add('head', { x: 200 + rr(-5, 5), y: rr(184, 212), col: pick(COL.violet), r: rr(1.4, 2.2) })
  // 팔 두 개 + 가운데 발톱
  ;[-1, 1].forEach(function (side) {
    for (i = 0; i < 70; i++) add('arm', { side: side, u: rnd(), j: rr(-3.2, 3.2), col: pick(COL.gold), r: rr(1.4, 2.7) })
    for (i = 0; i < 12; i++) add('tip', { side: side, ox: rr(-6, 6), oy: rr(-6, 6), col: pick(COL.pink), r: rr(1.8, 3.1) })
  })
  for (i = 0; i < 26; i++) add('prong', { u: rnd(), j: rr(-3, 3), col: pick(COL.violet), r: rr(1.3, 2.3) })

  // 곰 인형(곰 중심 기준 좌표)
  function disk(cx, cy, r, n, colors, rmin, rmax) {
    for (var q = 0; q < n; q++) { var t = rnd() * 6.283, d = Math.sqrt(rnd()) * r; add('bear', { x: cx + Math.cos(t) * d, y: cy + Math.sin(t) * d, col: pick(colors), r: rr(rmin || 1.4, rmax || 2.6) }) }
  }
  disk(0, 0, 50, 260, COL.bear)
  for (i = 0; i < 96; i++) { ang = i / 96 * 6.283; add('bear', { x: Math.cos(ang) * 52, y: Math.sin(ang) * 52, col: '#C98A47', r: rr(1.6, 2.6) }) }
  disk(-38, -38, 19, 60, COL.bear); disk(38, -38, 19, 60, COL.bear)
  disk(-38, -38, 9, 16, ['#FF8FB8'], 1.4, 2.2); disk(38, -38, 9, 16, ['#FF8FB8'], 1.4, 2.2)
  disk(0, 14, 20, 70, ['#FFD9A8', '#FFE8C8'])
  disk(0, 6, 5, 8, ['#5B3A24'], 1.6, 2.6)
  disk(-17, -6, 5, 8, ['#3a2418'], 1.6, 2.6); disk(17, -6, 5, 8, ['#3a2418'], 1.6, 2.6)
  disk(-31, 10, 9, 14, ['#FF8FB8'], 1.4, 2.4); disk(31, 10, 9, 14, ['#FF8FB8'], 1.4, 2.4)
  disk(0, 92, 56, 140, COL.bear)

  // 아래에 쌓인 인형 더미(파스텔 점)
  for (i = 0; i < 190; i++) { var hx = rr(0, W), top = 500 + 16 * Math.sin(hx / 38) + rr(0, 12); add('heap', { x: hx, y: rr(top, H + 8), col: pick(COL.pastel), r: rr(1.8, 3.4), a: rr(0.55, 0.9) }) }
  // 떠다니는 별빛
  for (i = 0; i < 90; i++) add('amb', { x: rr(-20, W + 20), y: rr(-10, H), col: pick(COL.pastel.concat(COL.white, COL.gold)), r: rr(0.8, 2.2), a: rr(0.25, 0.7), sp: rr(0.25, 0.7), amp: rr(4, 14), star: rnd() < 0.18 })

  // 집게 움직임: 내려오기 → 벌린 채 → 오므려 집기 → 들어올리기 → 내려놓기 → 열기 → 올라가기
  var T = 12
  function pose(t) {
    var u = ((t % T) + T) % T
    var lift = -52 * (u < 3.2 ? 0 : u < 3.9 ? ease((u - 3.2) / 0.7) : u < 7.6 ? 1 : u < 8.3 ? 1 - ease((u - 7.6) / 0.7) : 0)   // 집은 곰이 집게 안쪽으로 끌려 올라옴
    if (u < 2.2) return { off: lerp(-150, 0, ease(u / 2.2)), open: 1, carried: false, lift: 0 }
    if (u < 3.2) return { off: 0, open: lerp(1, 0.1, ease(u - 2.2)), carried: false, lift: 0 }
    if (u < 5.2) return { off: lerp(0, -120, ease((u - 3.2) / 2)), open: 0.1, carried: true, lift: lift }
    if (u < 6.4) return { off: -120, open: 0.1, carried: true, lift: lift }
    if (u < 8.2) return { off: lerp(-120, 0, ease((u - 6.4) / 1.8)), open: 0.1, carried: true, lift: lift }
    if (u < 9.2) return { off: 0, open: lerp(0.1, 1, ease(u - 8.2)), carried: false, lift: lift }
    if (u < 11) return { off: lerp(0, -150, ease((u - 9.2) / 1.8)), open: 1, carried: false, lift: 0 }
    return { off: -150, open: 1, carried: false, lift: 0 }
  }
  // 팔 곡선(3차 베지어): 오므린 모양과 벌린 모양 사이를 open(0~1)으로 섞는다. x 는 중심에서의 거리
  var CL = [[34, 238], [104, 272], [92, 346], [58, 430]], OP = [[34, 238], [136, 272], [164, 350], [126, 416]]
  function armPt(open, u) {
    var c = [], m = 1 - u, b0 = m * m * m, b1 = 3 * m * m * u, b2 = 3 * m * u * u, b3 = u * u * u, q
    for (q = 0; q < 4; q++) c.push([lerp(CL[q][0], OP[q][0], open), lerp(CL[q][1], OP[q][1], open)])
    return [b0 * c[0][0] + b1 * c[1][0] + b2 * c[2][0] + b3 * c[3][0], b0 * c[0][1] + b1 * c[1][1] + b2 * c[2][1] + b3 * c[3][1]]
  }

  var cw = 0, ch = 0, dpr = 1, sc = 1, ox = 0, oy = 0
  function resize() {
    var r = cv.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    cw = Math.max(1, Math.round(r.width)); ch = Math.max(1, Math.round(r.height))
    cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr)
    sc = Math.min(cw / W, ch / H); ox = (cw - W * sc) / 2; oy = (ch - H * sc) / 2
  }

  function frame(t) {
    var ps = pose(t), th = 0.04 * Math.sin(t * 1.3 + 0.4), cos = Math.cos(th), sin = Math.sin(th)
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height)
    ctx.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * ox, dpr * oy)
    var n = P.length, p, x, y, e, al, q, ar, nx, ny, len, tw
    for (q = 0; q < n; q++) {
      p = P[q]
      switch (p.kind) {
        case 'rope': x = 200 + p.j; y = lerp(-30, 206, p.u) + ps.off; break
        case 'head': x = p.x; y = p.y + ps.off; break
        case 'arm': ar = armPt(ps.open, p.u); len = 1; x = 200 + p.side * ar[0] + p.j * 0.7; y = ar[1] + ps.off + p.j * 0.7; break
        case 'tip': ar = armPt(ps.open, 1); x = 200 + p.side * ar[0] + p.ox; y = ar[1] + ps.off + p.oy; break
        case 'prong': x = 200 + p.j; y = 246 + p.u * (44 + (1 - ps.open) * 30) + ps.off; break
        case 'bear': x = BEAR.x + p.x * BS; y = BEAR.y + p.y * BS + (ps.carried ? ps.off : 0) + ps.lift; break
        case 'heap': x = p.x; y = p.y; break
        default: x = p.x + Math.sin(t * p.sp + p.ph) * p.amp; y = p.y + Math.cos(t * p.sp * 0.8 + p.ph) * p.amp
      }
      if (p.kind === 'rope' || p.kind === 'head' || p.kind === 'arm' || p.kind === 'tip' || p.kind === 'prong' || (p.kind === 'bear' && ps.carried)) {
        nx = PIV.x + (x - PIV.x) * cos - (y - PIV.y) * sin; ny = PIV.y + (x - PIV.x) * sin + (y - PIV.y) * cos; x = nx; y = ny
      }
      e = p.kind === 'amb' ? 1 : ease((t - p.delay) / p.dur)
      if (e < 1) { x = lerp(p.sx, x, e); y = lerp(p.sy, y, e) }
      tw = p.kind === 'amb' ? 0.6 + 0.4 * Math.sin(t * 1.7 + p.ph) : 1
      // 그림 가장자리에서는 서서히 사라지게 해서 경계가 보이지 않게 한다 (더미·별빛)
      if (p.kind === 'heap' || p.kind === 'amb') tw *= clamp(Math.min(x, W - x) / 70, 0, 1) * (p.kind === 'heap' ? clamp((H - y) / 55, 0, 1) : clamp(Math.min(y, H - y) / 40, 0, 1))
      al = p.a * e * tw
      if (al <= 0.01) continue
      ctx.globalAlpha = al; ctx.fillStyle = p.col
      if (p.star) { ctx.fillRect(x - p.r * 2.2, y - 0.5, p.r * 4.4, 1); ctx.fillRect(x - 0.5, y - p.r * 2.2, 1, p.r * 4.4) }
      else { ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.283); ctx.fill() }
    }
    ctx.globalAlpha = 1
  }

  resize()
  if (window.ResizeObserver) new ResizeObserver(function () { resize(); if (reduce) frame(2.0 + 3) }).observe(cv)
  window.addEventListener('resize', function () { resize(); if (reduce) frame(5) })

  if (reduce) { frame(2.0 + 3); return }          // 움직이지 않는 한 장면: 집게가 곰을 들어 올린 모습 (입장 연출은 끝난 뒤)
  var t0 = performance.now(), run = true, seen = true, raf = 0
  function loop(now) { raf = 0; if (!run || !seen) return; frame((now - t0) / 1000); raf = requestAnimationFrame(loop) }
  function kick() { if (!raf && run && seen) { t0 = t0 || performance.now(); raf = requestAnimationFrame(loop) } }
  document.addEventListener('visibilitychange', function () { run = document.visibilityState === 'visible'; if (run) { t0 = performance.now() - (lastT || 0) * 1000; kick() } })
  var lastT = 0
  var origFrame = frame; frame = function (t) { lastT = t; origFrame(t) }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { var was = seen; seen = en[0].isIntersecting; if (seen && !was) { t0 = performance.now() - lastT * 1000; kick() } }).observe(cv)
  kick()
})()
