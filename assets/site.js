// 공식 홈페이지 공용 스크립트: 출시 전환, 복사 버튼, 공지 불러오기. 외부 서버와 통신하지 않고, 쿠키·분석 도구를 쓰지 않는다.
(function () {
  'use strict'

  // 출시 버튼: config.js 의 launched 가 true 면 Google Play 링크 버튼으로 바꾼다
  var cfg = window.OMG || {}
  var ctas = document.querySelectorAll('[data-cta]')
  if (cfg.launched && /^https:\/\/play\.google\.com\//.test(cfg.playUrl || '')) {
    Array.prototype.forEach.call(ctas, function (cta) {
      var a = document.createElement('a')
      a.className = 'btn'
      if (cta.id) a.id = cta.id
      a.setAttribute('data-cta', '')
      a.href = cfg.playUrl
      a.rel = 'noopener'
      a.textContent = 'Google Play에서 받기'
      cta.replaceWith(a)
    })
  }

  // 우측 상단 메뉴: 바깥을 누르거나 Esc 를 누르거나 항목을 고르면 닫는다
  var menu = document.getElementById('menu')
  if (menu) {
    document.addEventListener('click', function (e) {
      if (!menu.open) return
      if (!menu.contains(e.target) || (e.target.closest && e.target.closest('.menu-panel a'))) menu.open = false
    })
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.open) { menu.open = false; var sm = menu.querySelector('summary'); if (sm) sm.focus() } })
  }

  // 주소의 #앵커가 가리키는 토글(고객문의)은 열어서 보여 준다
  function openHash() {
    var el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (el && el.tagName === 'DETAILS') { el.open = true; el.scrollIntoView() }
  }
  openHash(); window.addEventListener('hashchange', openHash)

  // 복사 버튼 (환불 신청 메일 양식)
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.cp') : null
    if (!b) return
    var el = document.getElementById(b.getAttribute('data-cp'))
    if (!el) return
    var text = el.innerText || el.textContent
    var old = b.textContent
    function done() { b.textContent = '복사됨 ✓'; setTimeout(function () { b.textContent = old }, 1500) }
    function fallback() {
      try {
        var r = document.createRange(); r.selectNodeContents(el)
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r)
        if (document.execCommand('copy')) done(); else b.textContent = '길게 눌러 직접 복사'
      } catch (x) { b.textContent = '길게 눌러 직접 복사' }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback()
  })

  // 공지: 앱이 읽는 것과 같은 파일(/omg-policy/notice.json)을 읽어 보여 준다. 기간(from~until, 한국 날짜) 안의 공지만.
  var lists = [document.getElementById('home-notices'), document.getElementById('notice-list')].filter(Boolean)
  if (lists.length) {
    var today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10)
    fetch('/omg-policy/notice.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json() })
      .then(function (data) {
        var items = (data && Array.isArray(data.notices) ? data.notices : []).filter(function (n) {
          return n && n.title && (n.title.ko || n.title.en) && (!n.from || n.from <= today) && (!n.until || n.until >= today)
        }).sort(function (x, y) { return String(y.from || '').localeCompare(String(x.from || '')) })
        lists.forEach(function (ul) { render(ul, items) })
      })
      .catch(function () {
        lists.forEach(function (ul) { ul.textContent = ''; var li = document.createElement('li'); li.className = 'muted'; li.textContent = '공지를 불러오지 못했어요. 잠시 뒤에 다시 열어 주세요.'; ul.appendChild(li) })
      })
  }
  function render(ul, items) {
    var limit = parseInt(ul.getAttribute('data-limit') || '0', 10)
    var shown = limit > 0 ? items.slice(0, limit) : items
    ul.textContent = ''
    if (!shown.length) { var e = document.createElement('li'); e.className = 'muted'; e.textContent = '지금 새로 알려 드릴 공지는 없어요.'; ul.appendChild(e); return }
    shown.forEach(function (n) {
      var li = document.createElement('li')
      var h = document.createElement('h3'); h.textContent = (n.title.ko || n.title.en)
      li.appendChild(h)
      if (n.from) { var t = document.createElement('time'); t.setAttribute('datetime', n.from); t.textContent = n.from; li.appendChild(t) }
      var body = n.body && (n.body.ko || n.body.en)
      if (body) { var p = document.createElement('p'); p.textContent = body; li.appendChild(p) }
      ul.appendChild(li)
    })
  }
})()
