const $ = s => document.querySelector(s),
    $$ = s => [...document.querySelectorAll(s)];
const secs = [...document.querySelectorAll('main section')];
const navLinks = [...document.querySelectorAll('.nav a')];

function spy() {
    const y = scrollY + 140;
    let current = secs[0];
    for (let i = 0; i < secs.length; i++) { const s = secs[i]; if (s.offsetTop - 160 <= y) current = s; }
    navLinks.forEach(a => {
        const on = a.getAttribute('href') === '#' + current.id;
        a.classList.toggle('active', on);
        a.classList.toggle('activate', on);
        a.setAttribute('aria-current', on?'page' : 'false');
    });
}

function activateByHash(hash) {
    if (!hash) return;
    navLinks.forEach(a => {
        const on = a.getAttribute('href') === hash;
        a.classList.toggle('active', on);
        a.classList.toggle('activate', on);
    });
}

let spyTick = 0;
addEventListener('scroll', () => {
    if (spyTick) return;
    spyTick = requestAnimationFrame(() => {
        spy();
        spyTick = 0;
    });
}, { passive: true });
addEventListener('hashchange', () => activateByHash(location.hash));
navLinks.forEach(a => a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        activateByHash(href);
        history.replaceState(null, '', href);
    }
}));
spy();
activateByHash(location.hash || '#home');

const sparkles = $('#sparkles'),
    icons = ['✨', '💙', '💖', '🌸', '⭐'];

function addSpark() {
    const s = document.createElement('span');
    s.textContent = icons[Math.random() * icons.length | 0];
    s.style.left = (Math.random() * 92 + 4) + '%';
    s.style.bottom = '-10px';
    s.style.animationDuration = (6 + Math.random() * 6) + 's';
    sparkles?.appendChild(s);
    setTimeout(() => s.remove(), 12000);
}
for (let i = 0; i < 18; i++) setTimeout(addSpark, i * 300);
setInterval(addSpark, 900);

const stage = $('.stage'),
    bokehEl = $('#bokeh');

function spawnBokeh(n = 14) {
    bokehEl.innerHTML = '';
    for (let i = 0; i < n; i++) {
        const s = document.createElement('span');
        const size = 60 + Math.random() * 120;
        s.style.width = s.style.height = size + 'px';
        s.style.left = (Math.random() * 92 + 2) + '%';
        s.style.bottom = (-20 - Math.random() * 40) + 'px';
        s.style.setProperty('--dur', (10 + Math.random() * 10) + 's');
        s.style.filter = 'blur(' + (1 + Math.random() * 2) + 'px)';
        bokehEl.appendChild(s);
    }
}
spawnBokeh();

const ig = $('.ig'),
    char = $('.char');
let parallaxOn = true;
stage.addEventListener('pointermove', e => {
    if (!parallaxOn) return;
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5;
    const py = (e.clientY - r.top) / r.height - .5;
    ig.style.transform = `translate3d(${px*-18}px,${py*-10}px,0) rotate(${px*3}deg)`;
    char.style.transform = `translate3d(${px*14}px,${py*10}px,0)`;
    stage.style.backgroundPosition = `${50+px*4}% ${50+py*4}%`;
});
stage.addEventListener('pointerleave', () => {
    ig.style.transform = '';
    char.style.transform = '';
    stage.style.backgroundPosition = '';
});

function confetti(x, y) {
    const n = 24,
        frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
        const d = document.createElement('i');
        d.className = 'confetti';
        d.style.left = x + 'px';
        d.style.top = y + 'px';
        d.style.setProperty('--dx', (Math.random() * 2 - 1) * 140 + 'px');
        d.style.setProperty('--dy', (60 + Math.random() * 160) + 'px');
        d.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
        d.style.background = (['#60a5fa', '#93c5fd', '#2563eb', '#a5b4fc'])[i % 4];
        frag.appendChild(d);
        setTimeout(() => d.remove(), 900);
    }
    stage.appendChild(frag);
}
$('#loveBubble').addEventListener('click', e => {
    const r = stage.getBoundingClientRect();
    confetti(e.clientX - r.left, e.clientY - r.top);
});

const likeBtn = $('#likeBtn'),
    likeCountEl = $('#likeCount'),
    likesStat = $('#likesStat'),
    igFrame = $('#igFrame');
let likes = Number(localStorage.getItem('likes') || 5000),
    liked = localStorage.getItem('liked') === '1';
const fmtNum = n => n >= 1e9?(n / 1e9).toFixed(1) + 'B' : n >= 1e6?(n / 1e6).toFixed(1) + 'M' : n >= 1e3?(n / 1e3).toFixed(1) + 'k' : String(n);

function renderLikes() {
    likeCountEl.textContent = fmtNum(likes);
    likesStat.textContent = fmtNum(likes);
    likeBtn.classList.toggle('liked', liked);
    likeBtn.setAttribute('aria-pressed', liked)
}
renderLikes();

function floatHeart(x, y) {
    const h = document.createElement('div');
    h.className = 'float-heart';
    h.style.setProperty('--x', x + 'px');
    h.style.setProperty('--y', y + 'px');
    h.textContent = '❤';
    ig.appendChild(h);
    setTimeout(() => h.remove(), 900);
}

function toggleLike(e) {
    const r = ig.getBoundingClientRect();
    if (!liked) {
        liked = true;
        likes += 1;
        floatHeart(e?e.clientX - r.left : r.width / 2, e?e.clientY - r.top : r.height / 2)
    } else {
        liked = false;
        likes = Math.max(0, likes - 1)
    }
    localStorage.setItem('likes', likes);
    localStorage.setItem('liked', liked?'1' : '0');
    renderLikes();
}
likeBtn.addEventListener('click', toggleLike);
igFrame.addEventListener('dblclick', toggleLike);

const comments = $('#comments'),
    cBtn = $('#commentBtn'),
    cInput = $('#commentInput'),
    cList = $('#commentList'),
    toast = $('#toast');

function showToast(t) {
    toast.textContent = t;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1200)
}
cBtn.addEventListener('click', () => { comments.classList.toggle('show'); if (comments.classList.contains('show')) cInput.focus() });
cInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && cInput.value.trim()) {
        const li = document.createElement('li');
        li.textContent = cInput.value.trim();
        cList.prepend(li);
        cInput.value = '';
        while (cList.children.length > 20) cList.lastChild.remove();
    }
});
$('#shareBtn').addEventListener('click', async() => {
    const url = location.href;
    try {
        if (navigator.share) { await navigator.share({ title: document.title, url }) } else {
            await navigator.clipboard.writeText(url);
            showToast('Link copied!')
        }
    } catch {}
});
$$('[data-copy]').forEach(btn => btn.addEventListener('click', async() => {
    try {
        await navigator.clipboard.writeText(btn.getAttribute('data-copy'));
        showToast('Copied: ' + btn.getAttribute('data-copy'))
    } catch {}
}));

const revealEls = document.querySelectorAll('.xp-card,.skills-card,.card-proj,.c-card,.ig,.char');
revealEls.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(18px)'
});
const io = new IntersectionObserver(es => {
    es.forEach(en => {
        if (en.isIntersecting) {
            en.target.style.opacity = 1;
            en.target.style.transform = 'none';
            en.target.style.transition = 'opacity .6s ease, transform .6s ease';
            io.unobserve(en.target);
        }
    })
}, { threshold: .18 });
revealEls.forEach(el => io.observe(el));

(function() {
    const FEED_USER = '@ruffblitz';
    const rssJson = u => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://medium.com/feed/'+u)}`;
    const rssRaw = u => `https://medium.com/feed/${u}`;
    const ao = url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const jina = url => `https://r.jina.ai/http://${url.replace(/^https?:\/\//,'')}`;
    const CANDIDATES = [rssJson(FEED_USER), rssJson(FEED_USER.replace(/^@/, '')), rssJson('@' + FEED_USER.replace(/^@/, ''))];
    const fmt = d => new Date(d).toLocaleDateString('en-US');
    const trunc = (s, n = 200) => s && s.length > n?s.slice(0, n - 1) + '…' : (s || '');
    const clean = s => s?s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
    const pickThumb = it => {
        const byField = it.thumbnail || (it.enclosure && it.enclosure.link);
        if (byField) return byField;
        const html = it.content || it.description || '';
        const m = /<img[^>]+src=["']([^"'>]+)["']/i.exec(html);
        return m?m[1] : '';
    };
    const parseXml = (xmlText) => {
        const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
        const channel = doc.querySelector('channel');
        const title = channel?.querySelector('title')?.textContent || 'Medium Feed';
        const link = channel?.querySelector('link')?.textContent || '#';
        const items = [...doc.querySelectorAll('item')].map(x => ({
            title: x.querySelector('title')?.textContent || 'Untitled',
            link: x.querySelector('link')?.textContent || '#',
            pubDate: x.querySelector('pubDate')?.textContent || '',
            description: x.querySelector('description')?.textContent || '',
            content: x.querySelector('content\\:encoded')?.textContent || ''
        }));
        return { feed: { title, link }, items };
    };
    async function load() {
        const feedEl = document.getElementById('feed');
        const headTitle = document.getElementById('feed-title');
        const headLink = document.getElementById('feed-link');
        const tpl = document.getElementById('card-tpl')?.content;
        if (!feedEl || !tpl) return;
        try {
            let data = null;
            for (const url of CANDIDATES) {
                try {
                    const r = await fetch(url);
                    if (!r.ok) continue;
                    const j = await r.json();
                    if (j && Array.isArray(j.items) && j.items.length) { data = j; break }
                } catch {}
            }
            if (!data) {
                const rawCandidates = [rssRaw(FEED_USER), rssRaw(FEED_USER.replace(/^@/, '')), rssRaw('@' + FEED_USER.replace(/^@/, ''))];
                for (const u of rawCandidates) {
                    try {
                        let xml = '';
                        try {
                            const r = await fetch(ao(u));
                            if (r.ok) {
                                const j = await r.json();
                                xml = j && j.contents?j.contents : ''
                            }
                        } catch {}
                        if (!xml) {
                            const r2 = await fetch(jina(u));
                            if (r2.ok) xml = await r2.text();
                        }
                        if (xml) {
                            const parsed = parseXml(xml);
                            if (parsed.items && parsed.items.length) {
                                data = { feed: parsed.feed, items: parsed.items.map(x => ({ title: x.title, link: x.link, pubDate: x.pubDate, description: x.description, thumbnail: pickThumb(x) })) };
                                break;
                            }
                        }
                    } catch {}
                }
            }
            if (!data) throw new Error('all attempts failed');
            headTitle.textContent = data.feed?.title || 'Medium Feed';
            if (data.feed?.link) {
                headLink.href = data.feed.link;
                headLink.style.display = 'inline'
            }
            feedEl.innerHTML = '';
            (data.items || []).slice(0, 3).forEach(it => {
                const node = tpl.cloneNode(true);
                const title = node.querySelector('.title');
                title.textContent = it.title || 'Untitled';
                title.href = it.link;
                node.querySelector('.date').textContent = fmt(it.pubDate);
                node.querySelector('.desc').textContent = trunc(clean(it.description || ''), 220);
                const a = node.querySelector('.thumb'),
                    img = node.querySelector('img');
                const thumb = it.thumbnail || pickThumb(it) || '';
                if (thumb) {
                    img.src = thumb;
                    img.alt = it.title || '';
                    a.href = it.link
                } else a.remove();
                feedEl.appendChild(node);
            });
            if (!feedEl.children.length) feedEl.innerHTML = '<div class="loading">No items</div>';
        } catch (e) { feedEl.innerHTML = '<div class="error">Fetch failed</div>' }
    }
    load();
})();