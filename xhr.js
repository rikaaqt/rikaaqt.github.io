!function (d, ss) {
    'use strict'
    d.getElementById('papercontrols')
        .addEventListener('click', function (n) {
            if (n.target.tagName === 'INPUT') {
                n.preventDefault()
            }
        }, true)
    var di = d.getElementById('diary')
        , m = d.querySelector('audio')
        , c = d.getElementById('controls2')
        , st = d.getElementById('statusText')
        , prev = d.getElementById('prev')
        , next = d.getElementById('next'),
        time = d.getElementById('time'),
        title = d.getElementById('titlething')
    function toggle() {
        m.dataset.pressed = String(!m.paused)
    }
    m.addEventListener('play', toggle)
    m.addEventListener('pause', toggle)
    var a = d.querySelector('.textbox')
    a.onclick = function () {
        m.paused ? m.play() : m.pause()
    }
    m.addEventListener('mouseover', function () {
        var n = d.createElement('link')
        n.rel = 'preconnect'
        n.href = 'https://www.dropbox.com'
        d.head.appendChild(n)
    }, { once: true })
    var share = { text: 'Check out my page!', url: location.href, /*:return `title: "${title}"`*/ }
    if (navigator.canShare && navigator.canShare(share)) d.getElementById('wifibutton')
        .onclick = function () {
            navigator.share(share)
        }
    var abt = d.getElementById('about').style
    setTimeout(function () {
        abt.willChange = ''
    }, 1500)
    abt.willChange = 'background-position'
    var index = 0
    , length = -1
    , entries = null
    , shadow = null
    , lastTime
    function toggleButtons() {
        next.toggleAttribute('disabled', !entries[index + 1])
        prev.toggleAttribute('disabled', !entries[index - 1])
    }
    var svt = d.startViewTransition ? d.startViewTransition.bind(d) : setTimeout.bind(window)
    function updateStatus() {
        st.textContent = (length - index) + ' of ' + length
        var t = entries[index]
        time.setAttribute('datetime', lastTime.toISOString().slice(0, 10))
        time.textContent = lastTime.toLocaleDateString() + ' ' + lastTime.toLocaleTimeString()
        toggleButtons()
        title.textContent = t.name
        di.ariaPosInSet = index + 1
    }
    next.addEventListener('click', function () {
        index += 1
        try {
            di.setAttribute('data-VTDIR', 'f')
        }
        catch (e) {
            console.error(e)
        }
        putEntry()
    })
    prev.addEventListener('click', function () {
        index -= 1
        di.setAttribute('data-VTDIR', 'r')
        putEntry(true)
    })
    var frame
    function doDiaryStuffs() {
        try {
            shadow = (di.attachShadow || di.createShadowRoot).call(di, { mode: 'open' })
        }
        catch (e) {
            if (e.name !== 'TypeError') throw e
            frame = d.createElement('iframe')
            di.style.overflow = 'hidden'
            di.appendChild(frame)
        }
        var xhr = new XMLHttpRequest
        xhr.open("GET", 'https://doc-entries.addsoupbase1.workers.dev/docs', true)
        xhr.responseType = 'json'
        xhr.onload = function () {
            entries = xhr.response
            if (typeof entries === 'string') entries = (typeof JSON === 'object' ? JSON.parse : eval)((entries))
            length = entries.length
            putEntry(false)
        }
        xhr.send()
    }
    var url = 'https://doc-entries.addsoupbase1.workers.dev/doc?id='
    function putEntry(prev) {
        var s = url + entries[index].id
        // if (shadow) {
        var xhr = new XMLHttpRequest
        xhr.open("GET", s, true)
        // xhr.responseType = 'document'
        xhr.onload = function () {
            var doc = new DOMParser().parseFromString(xhr.responseText, 'text/html')
            lastTime = new Date(xhr.getResponseHeader('Last-Modified'))
            // var style = doc.head.querySelector('style')
            // style.textContent = '@scope {' + style.textContent + '}'
            // di.replaceChildren.apply(di, doc.body.childNodes)
            // di.appendChild(style)
            var style = doc.body.style
            style.padding = '10px'
            style.paddingInline = '20px'
            doc.documentElement.style.height = '97%'
            style.minHeight = '90%'
            style.fontSize = '.9em'
            style.backgroundColor = 'transparent'
            var p = entries[index + 1]
            if (prev === 2 && p) {
                var pre = d.createElement('link')
                pre.rel = 'prefetch'
                pre.href = url + p.id
                doc.head.appendChild(pre)
            }
            if (shadow) {
                var go = function () {
                    shadow.replaceChildren(doc.documentElement)
                }
                prev === false ? go() : svt(go, 5)
            }
            else {
                frame.src = s
            }
            updateStatus()
        }
        xhr.send()
        // }
        // else {
        //     frame.src = s
        //     updateStatus()
        // }
    }
    addEventListener('load', function () {
        d.querySelector('header')
            .oncontentvisibilityautostatechange = function (e) {
                if (e.skipped) {
                    d.head.appendChild(d.createRange().createContextualFragment('<link rel="preconnect" href="https://doc-entries.addsoupbase1.workers.dev"><link rel="preload" as="fetch" href="https://doc-entries.addsoupbase1.workers.dev/docs" type="application/json" crossorigin="anonymous">'))
                    this.oncontentvisibilityautostatechange = null
                    this.style.contentVisibility = ''
                }
            }
        if (typeof IntersectionObserver === 'function') {
            var ie = new IntersectionObserver(function (n) {
                if (n[0].isIntersecting) {
                    doDiaryStuffs()
                    ie = ie.disconnect()
                }
            })
            ie.observe(di, { threshold: [0, Number.MIN_VALUE] })
        }
        else doDiaryStuffs()
    }, { once: true })
    ss.removeItem('m')
    d.getElementById('sendmessage').onsubmit = function () {
        var e = this.elements,
            name = e.name,
            message = e.message
        ss.setItem('m', JSON.stringify([message.value, name.value]))
    }
}(document, sessionStorage)

