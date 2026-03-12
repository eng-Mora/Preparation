// =============================================================
// script.js — النسخة النهائية — كل الفيديوهات من Firebase
// =============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const app = initializeApp({
    apiKey: "AIzaSyBXsX0v_7p8CHDFiTUm4XkQsoZIqGueAOk",
    authDomain: "the-process-5d196.firebaseapp.com",
    databaseURL: "https://the-process-5d196-default-rtdb.firebaseio.com",
    projectId: "the-process-5d196",
    storageBucket: "the-process-5d196.firebasestorage.app",
    messagingSenderId: "96415822332",
    appId: "1:96415822332:web:2be476bee2e474383d8279"
});
const db = getDatabase(app);

// Chapter names per CODE
const CHAPTER_NAMES = {
    CODE1:  {1:'الفصل الأول',2:'الفصل الثاني',3:'الفصل الثالث',4:'الفصل الرابع',5:'الفصل الخامس',6:'الفصل السادس'},
    CODE2:  {1:'Chapter 1', 2:'Chapter 2',   3:'Chapter 3',   4:'Chapter 4',   5:'Chapter 5',   6:'Chapter 6'},
    CODE3:  {1:'مراجعة الفصل الأول'},
    CODE4:  {1:'Chapter 1 Revision'},
    CODE5:  {1:'Homework'},
    CODE6:  {1:'مراجعة الفصل الثاني'},
    CODE7:  {1:'Chapter 2'},
    CODE8:  {1:'الفصل الثالث'},
    CODE9:  {1:'Chapter 3'},
    CODE10: {1:'Final Revision'},
    CODE11: {1:'مراجعة نصف السنة'},
    CODE12: {1:'Mid-Year Review'},
    CODE13: {1:'Homework'},
};

// Branch titles for CODE1/CODE2 chapter groups
const BRANCH_CHAPTERS = {
    CODE1: { electric:[1,2,3,4], modern:[5,6] },
    CODE2: { electric:[1,2,3,4], modern:[5,6] },
};

document.addEventListener('DOMContentLoaded', async function () {

    const loginContainer = document.getElementById('loginContainer');
    const mainContent    = document.getElementById('main');
    const videoContainer = document.getElementById('videos');
    const sidebar        = document.getElementById('sidebar');
    const sidebarToggle  = document.getElementById('sidebarToggle');

    // ── Stars ─────────────────────────────────────────────────
    function createStars() {
        const c = document.getElementById('ramadanStars');
        if (!c) return;
        c.innerHTML = '';
        const n = window.innerWidth < 768 ? 30 : 50;
        for (let i = 0; i < n; i++) {
            const s = document.createElement('div');
            s.className = 'star';
            s.style.left           = Math.random() * 100 + '%';
            s.style.top            = Math.random() * 100 + '%';
            s.style.animationDelay = Math.random() * 3 + 's';
            s.style.width          = (Math.random() * 5 + 2) + 'px';
            s.style.height         = s.style.width;
            c.appendChild(s);
        }
    }
    createStars();
    window.addEventListener('resize', createStars);

    // ── Sidebar ───────────────────────────────────────────────
    sidebarToggle?.addEventListener('click', e => { e.stopPropagation(); sidebar.classList.toggle('active'); });
    document.getElementById('sidebarLoginToggle')?.addEventListener('click', e => { e.stopPropagation(); sidebar.classList.toggle('active'); });
    document.addEventListener('click', e => { if (!sidebar.contains(e.target) && e.target !== sidebarToggle) sidebar.classList.remove('active'); });
    sidebar.addEventListener('click', e => e.stopPropagation());

    document.getElementById('homeLink')?.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.reload();
    });

    document.getElementById('ramadanLink')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('messageModal').style.display = 'block';
        document.getElementById('messageOverlay').style.display = 'block';
        document.body.style.overflow = 'hidden';
        sidebar.classList.remove('active');
    });

    // ── Auth helpers ──────────────────────────────────────────
    const showLogin = () => { loginContainer.style.display = 'flex';  mainContent.style.display = 'none'; };
    const showMain  = () => { loginContainer.style.display = 'none';  mainContent.style.display = 'block'; };

    window.logout = function () {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.reload();
    };

    async function getStudent(username) {
        try {
            const snap = await get(ref(db, 'students/' + username));
            return snap.exists() ? snap.val() : null;
        } catch { return null; }
    }

    // ── Check login on load ───────────────────────────────────
    async function checkLoginState() {
        const loggedIn = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');
        if (loggedIn === 'true' && username) {
            const student = await getStudent(username);
            if (student && student.videoCode) {
                await loadVideoContent(student.videoCode, username, student);
                showMain();
            } else { showLogin(); }
        } else { showLogin(); }
    }

    // ── Login ─────────────────────────────────────────────────
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const errEl    = document.getElementById('errorMessage');
        errEl.style.color   = '#888';
        errEl.textContent   = '⏳ جاري التحقق...';

        const student = await getStudent(username);
        if (student && student.videoCode) {
            errEl.textContent = '';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            await loadVideoContent(student.videoCode, username, student);
            showMain();
            videoContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            errEl.style.color = '#dc3545';
            errEl.textContent = 'Invalid access code, please try again';
        }
    });

    // ── Build video card HTML ─────────────────────────────────
    function buildVideoCard(v, idPrefix) {
        const urls = [];
        for (let i = 1; i <= 9; i++) {
            if (v['url' + i]) urls.push(v['url' + i]);
            else break;
        }
        if (!urls.length) return '';

        const labels = urls.length > 1
            ? ['الجزء الأول','الجزء الثاني','الجزء الثالث','الجزء الرابع','الجزء الخامس']
            : [v.title];

        let html = `<div class="video" id="${idPrefix}" style="display:none;">`;
        html += `<h3 class="video-title">${v.title}</h3>`;
        urls.forEach((url, i) => {
            if (urls.length > 1) html += `<h3 class="video-title">${labels[i] || 'جزء '+(i+1)}</h3>`;
            html += `<iframe src="${url}" width="100%" height="480" allow="autoplay" allowfullscreen></iframe>`;
        });
        html += '</div>';
        return html;
    }

    // ── Build chapter HTML ────────────────────────────────────
    function buildChapter(chNum, chName, videos, code) {
        const sorted = Object.entries(videos).sort((a,b) => (a[1].order||0)-(b[1].order||0));
        if (!sorted.length) return '';

        const isActive = chNum === 1 ? 'active' : '';
        let html = `<div id="chapter-${chNum}" class="chapter-content ${isActive}">`;
        html += `<h2 class="chapter-title">${chName}</h2>`;
        html += '<div class="video-menu"><select class="video-selector" onchange="window._showVideo(this.value)">';
        html += `<option value="">${code.startsWith('CODE1') || code === 'CODE8' || code === 'CODE11' ? 'اختر الفيديو...' : 'Select video...'}</option>`;
        sorted.forEach(([vid, v]) => {
            html += `<option value="v_${chNum}_${vid}">${v.title}</option>`;
        });
        html += '</select></div>';
        sorted.forEach(([vid, v]) => {
            html += buildVideoCard(v, `v_${chNum}_${vid}`);
        });
        html += '</div>';
        return html;
    }

    // ── showVideo ─────────────────────────────────────────────
    window._showVideo = function(id) {
        if (!id) return;
        const chNum = id.split('_')[1];
        // hide all videos in same chapter
        const chEl = document.getElementById('chapter-' + chNum);
        if (chEl) chEl.querySelectorAll('.video').forEach(v => v.style.display = 'none');
        const t = document.getElementById(id);
        if (t) {
            t.style.display = 'block';
            if (window.innerWidth <= 768) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    window.switchChapter = function(num) {
        // find active branch or videoContainer
        const scope = document.querySelector('.branch-content[style*="display: block"]')
                   || document.querySelector('.branch-content[style*="display:block"]')
                   || videoContainer;
        scope.querySelectorAll('.chapter-content').forEach(c => c.classList.remove('active'));
        scope.querySelectorAll('.chapter-btn').forEach(b => b.classList.remove('active'));
        const chEl = scope.querySelector('#chapter-' + num);
        if (chEl) chEl.classList.add('active');
        const btns = scope.querySelectorAll('.chapter-btn');
        // find btn by index matching num
        btns.forEach(b => { if (b.getAttribute('onclick') === `switchChapter(${num})`) b.classList.add('active'); });
    };

    // ── loadVideoContent ──────────────────────────────────────
    async function loadVideoContent(code, username, student) {

        // 1. Fetch all chapters for this CODE from Firebase
        let chapData = {};
        try {
            const snap = await get(ref(db, 'videos/' + code));
            if (snap.exists()) chapData = snap.val();
        } catch(e) { console.warn('videos fetch:', e); }

        const chapterNames = CHAPTER_NAMES[code] || {1: 'Videos'};

        // 2. Welcome banner
        let html = '';
        if (student) {
            html += `
        <div class="welcome-banner">
            <div class="welcome-text">
                <h3>🌙 يا 100 أهلاً يا ${student.name}</h3>
                <p>${student.welcomeMessage || '☝🏽شد حيلك يا باشا… دي آخر محطة قبل الحلم الكبير'}</p>
                <p style="margin-top:10px;font-size:1rem;">رمضان كريم وكل سنة وانت طيب</p>
            </div>
            <div class="profile-img-container">
                <img src="${student.image || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + username}"
                     alt="صورة البروفايل"
                     onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${username}'">
                <div class="show-details">اظهار التفاصيل</div>
                <div class="profile-info" id="profileInfo">
                    <p><strong>الاسم:</strong> ${student.name}</p>
                    <p><strong>رقم التليفون:</strong> ${student.phone || '-'}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${student.email || '-'}</p>
                    <p><strong>لغة الدراسة:</strong> ${student.language || '-'}</p>
                </div>
            </div>
        </div>`;
        }

        // 3. Build content
        const branches = BRANCH_CHAPTERS[code];

        if (branches) {
            // CODE1 / CODE2 — two branches with chapters nav each
            html += `
            <div class="branch-selection">
                <h3>Select a physics branch --- اختر فرع الفيزياء :</h3>
                <select class="branch-selector" id="branchSelector">
                    <option value="">اختر الفرع → Select a branch</option>
                    <option value="electric">الفيزياء الكهربية → Electricity Physics</option>
                    <option value="modern">الفيزياء الحديثة → Modern Physics</option>
                </select>
            </div>`;

            // Electric branch
            html += '<div id="electric-physics" class="branch-content" style="display:none;">';
            html += '<div class="chapters-nav">';
            branches.electric.forEach((chNum, i) => {
                html += `<button class="chapter-btn ${i===0?'active':''}" onclick="switchChapter(${chNum})">${chapterNames[chNum]||'Ch '+chNum}</button>`;
            });
            html += '</div>';
            branches.electric.forEach(chNum => {
                const vids = chapData['ch'+chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum]||'Ch '+chNum, vids, code);
            });
            html += '</div>';

            // Modern branch
            html += '<div id="modern-physics" class="branch-content" style="display:none;">';
            html += '<div class="chapters-nav">';
            branches.modern.forEach((chNum, i) => {
                html += `<button class="chapter-btn ${i===0?'active':''}" onclick="switchChapter(${chNum})">${chapterNames[chNum]||'Ch '+chNum}</button>`;
            });
            html += '</div>';
            branches.modern.forEach(chNum => {
                const vids = chapData['ch'+chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum]||'Ch '+chNum, vids, code);
            });
            html += '</div>';

        } else {
            // All other CODEs — single chapter or multiple without branches
            const chNums = Object.keys(chapterNames).map(Number).sort((a,b)=>a-b);

            if (chNums.length > 1) {
                html += '<div class="chapters-nav">';
                chNums.forEach((chNum, i) => {
                    html += `<button class="chapter-btn ${i===0?'active':''}" onclick="switchChapter(${chNum})">${chapterNames[chNum]}</button>`;
                });
                html += '</div>';
            }

            chNums.forEach(chNum => {
                const vids = chapData['ch'+chNum] || {};
                html += buildChapter(chNum, chapterNames[chNum]||'Videos', vids, code);
            });
        }

        // 4. Logout
        html += `
        <div class="logout-container">
            <button onclick="window.logout()" class="logout-btn">تسجيل الخروج</button>
        </div>`;

        videoContainer.innerHTML = html;

        // 5. Branch selector events
        document.getElementById('branchSelector')?.addEventListener('change', function () {
            document.querySelectorAll('.branch-content').forEach(b => b.style.display = 'none');
            if (this.value) {
                const t = document.getElementById(this.value + '-physics');
                if (t) t.style.display = 'block';
            }
        });

        // 6. Profile toggle
        document.querySelector('.profile-img-container')?.addEventListener('click', e => {
            e.stopPropagation();
            document.getElementById('profileInfo')?.classList.toggle('active');
        });
        document.addEventListener('click', () => document.getElementById('profileInfo')?.classList.remove('active'));

        // 7. Ramadan badge
        if (code === 'CODE1' || code === 'CODE2') {
            const wb = videoContainer.querySelector('.welcome-banner');
            if (wb) wb.insertAdjacentHTML('afterend', `
                <div class="video-message-indicator">
                    <div class="message-badge" id="messageBadge">
                        <i class="fas fa-envelope"></i> Ramadan Kareem Message
                    </div>
                </div>`);
            const mm = document.getElementById('messageModal');
            const mo = document.getElementById('messageOverlay');
            const cm = document.getElementById('closeModal');
            document.getElementById('messageBadge')?.addEventListener('click', () => { mm.style.display='block'; mo.style.display='block'; document.body.style.overflow='hidden'; });
            cm?.addEventListener('click',  () => { mm.style.display='none'; mo.style.display='none'; document.body.style.overflow='auto'; });
            mo?.addEventListener('click',  () => { mm.style.display='none'; mo.style.display='none'; document.body.style.overflow='auto'; });
        }
    }

    // ── Init ──────────────────────────────────────────────────
    checkLoginState();
});
