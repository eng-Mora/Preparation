// =============================================================
// script.js — النسخة الجديدة بالكامل مع Firebase
// لا يوجد أسماء أو أكواد hardcoded — كل التحقق من Firebase
// =============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBXsX0v_7p8CHDFiTUm4XkQsoZIqGueAOk",
    authDomain: "the-process-5d196.firebaseapp.com",
    databaseURL: "https://the-process-5d196-default-rtdb.firebaseio.com",
    projectId: "the-process-5d196",
    storageBucket: "the-process-5d196.firebasestorage.app",
    messagingSenderId: "96415822332",
    appId: "1:96415822332:web:2be476bee2e474383d8279"
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// =============================================================
// DOMContentLoaded
// =============================================================
document.addEventListener('DOMContentLoaded', async function () {

    const loginContainer = document.getElementById('loginContainer');
    const mainContent    = document.getElementById('main');
    const videoContainer = document.getElementById('videos');
    const homeLink       = document.getElementById('homeLink');
    const sidebar        = document.getElementById('sidebar');
    const sidebarToggle  = document.getElementById('sidebarToggle');

    // ── Stars ────────────────────────────────────────────────
    function createStars() {
        const c = document.getElementById('ramadanStars');
        if (!c) return;
        c.innerHTML = '';
        const n = window.innerWidth < 768 ? 30 : 50;
        for (let i = 0; i < n; i++) {
            const s = document.createElement('div');
            s.className = 'star';
            s.style.left             = Math.random() * 100 + '%';
            s.style.top              = Math.random() * 100 + '%';
            s.style.animationDelay   = Math.random() * 3 + 's';
            s.style.width            = (Math.random() * 5 + 2) + 'px';
            s.style.height           = s.style.width;
            c.appendChild(s);
        }
    }
    createStars();
    window.addEventListener('resize', createStars);

    // ── Sidebar ───────────────────────────────────────────────
    sidebarToggle?.addEventListener('click', e => { e.stopPropagation(); sidebar.classList.toggle('active'); });
    document.getElementById('sidebarLoginToggle')?.addEventListener('click', e => { e.stopPropagation(); sidebar.classList.toggle('active'); });
    document.addEventListener('click', e => {
        if (!sidebar.contains(e.target) && e.target !== sidebarToggle) sidebar.classList.remove('active');
    });
    sidebar.addEventListener('click', e => e.stopPropagation());

    homeLink?.addEventListener('click', e => { e.preventDefault(); localStorage.removeItem('isLoggedIn'); localStorage.removeItem('username'); window.location.reload(); });

    // Ramadan modal
    document.getElementById('ramadanLink')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('messageModal').style.display = 'block';
        document.getElementById('messageOverlay').style.display = 'block';
        document.body.style.overflow = 'hidden';
        sidebar.classList.remove('active');
    });

    // ── Auth helpers ──────────────────────────────────────────
    const showLogin = () => { loginContainer.style.display = 'flex'; mainContent.style.display = 'none'; };
    const showMain  = () => { loginContainer.style.display = 'none'; mainContent.style.display = 'block'; };

    function saveLoginState(u) { localStorage.setItem('isLoggedIn', 'true'); localStorage.setItem('username', u); }

    window.logout = function () { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('username'); window.location.reload(); };

    // ── Firebase lookup ───────────────────────────────────────
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
                loadVideoContent(student.videoCode, username, student);
                showMain();
            } else {
                showLogin();
            }
        } else {
            showLogin();
        }
    }

    // ── Login form ────────────────────────────────────────────
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const errEl    = document.getElementById('errorMessage');

        errEl.style.color   = '#888';
        errEl.textContent   = '⏳ جاري التحقق...';

        const student = await getStudent(username);

        if (student && student.videoCode) {
            errEl.textContent = '';
            saveLoginState(username);
            loadVideoContent(student.videoCode, username, student);
            showMain();
            document.getElementById('videos').scrollIntoView({ behavior: 'smooth' });
        } else {
            errEl.style.color = '#dc3545';
            errEl.textContent = 'Invalid access code, please try again';
        }
    });

    // ── Lazy load iframes ─────────────────────────────────────
    function loadIframes(container) {
        container.querySelectorAll('iframe[data-src]').forEach(f => {
            if (!f.src || f.src === 'about:blank') f.src = f.getAttribute('data-src');
        });
    }

    // ── switchChapter / showVideo ─────────────────────────────
    window.switchChapter = function (num) {
        const activeBranch = document.querySelector('.branch-content[style*="display: block"], .branch-content[style*="display:block"]') 
                          || document.querySelector('.chapter-content')?.closest('.branch-content')
                          || videoContainer;
        activeBranch.querySelectorAll('.chapter-content').forEach(c => c.classList.remove('active'));
        activeBranch.querySelector('#chapter-' + num)?.classList.add('active');
        activeBranch.querySelectorAll('.chapter-btn').forEach(b => b.classList.remove('active'));
        const btn = activeBranch.querySelectorAll('.chapter-btn')[num - 1];
        if (btn) btn.classList.add('active');
    };

    window.showVideo = function (videoId) {
        if (!videoId) return;
        const activeBranch = document.querySelector('.branch-content[style*="display: block"], .branch-content[style*="display:block"]')
                          || videoContainer;
        activeBranch.querySelectorAll('.video, .video-player').forEach(v => v.style.display = 'none');
        const target = document.getElementById(videoId);
        if (target) {
            target.style.display = 'block';
            loadIframes(target);
            if (window.innerWidth <= 768) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // ── loadVideoContent ──────────────────────────────────────
    async function loadVideoContent(code, username, student) {

        // Welcome banner
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

        // Branch selector for CODE1 & CODE2
        if (code === 'CODE1' || code === 'CODE2') {
            html += `
            <div class="branch-selection">
                <h3>  Select a physics branch --- اختر فرع الفيزياء :</h3>
                <select class="branch-selector" id="branchSelector">
                    <option value=""> اختر الفرع → Select a branch  </option>
                    <option value="electric">الفيزياء الكهربية → Electricity Physics</option>
                    <option value="modern">الفيزياء الحديثة → Modern Physics</option>
                </select>
            </div>`;
        }

        // Video content per CODE
        if (code === 'CODE1') { html += `            <!-- قسم الفيزياء الكهربية -->
            <div id="electric-physics" class="branch-content" style="display:none;">
                <div class="chapters-nav">
                    <button class="chapter-btn active" onclick="switchChapter(1)">الفصل الأول</button>
                    <button class="chapter-btn" onclick="switchChapter(2)">الفصل الثاني</button>
                    <button class="chapter-btn" onclick="switchChapter(3)">الفصل الثالث</button>
                    <button class="chapter-btn" onclick="switchChapter(4)">الفصل الرابع</button>
                </div>
                
                <!-- الفصل الأول -->
                <div id="chapter-1" class="chapter-content active">
                    <h2 class="chapter-title">الفصل الاول: التيار الكهربي و قانون اوم و قانونا كيرشوف</h2>
                    
                    <div class="video-menu">
                        <h3>قائمة الفيديوهات:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">اختر الفيديو...</option>
                            <option value="video2">حل واجب حصة 1</option>
                            <option value="video3">حل واجب حصة 2</option>
                            <option value="video4">حل واجب حصة 3</option>
                            
                            <option value="video6">حل واجب حصة 4</option>
                            <option value="video7">حل واجب حصة 5</option>
                        </select>
                    </div>

                    <div class="video-player" id="video2" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1k03hdmxGtL6Vfd9O-cxuywaVrINwdJJp/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1G3Oq-lDSpLcnaCRyLgd7x0CcamC-rjBY/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>

                    <div class="video-player" id="video3" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Y0s1hTTgV-8drqiN_05yVOM6NiKvb2x2/preview" allowfullscreen></iframe>
                        <h3 class="video-title">باقي حل اسئلة الحصة 2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Awo0t3OaoAwpESJCJG56MED6dZEXrsZ7/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1HdGZJTZ4SDURmuIaEZyMLqLrzNuvpqPP/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>

                    <div class="video-player" id="video4" style="display:none;">
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/12bMN-bgiBlK9uMKfHmqa8tDE8jKgo0E_/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1x9PSxhLsS4nuh7VyiwAU9O5F-vtHz9Pe/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1IQginzp4eLmf-vZStHctMx4qoR9cVwSt/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>

                    

                    <div class="video-player" id="video6" style="display:none;">
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Sypz3MCjVIdFTSaG9-0zXTPRNwREZ2cN/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Z-5eAdOYtZEz-g3u2k81Wf68AZFqCbLD/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/1tNf7NtlcBJUkk7bF8U3asxfzWmwZGwUt/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/13bAtoKJj-2I6BiLz13gAupFPk5hlYqd7/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>

                    <div class="video-player" id="video7" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 5</h3>
                        <iframe data-src="https://drive.google.com/file/d/122NLtPEJMa1YCiUa-Y89Ro-W8AwwF6k_/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1xzD3Ruv20pJw8zJ9ah75Ryg9EjpwPq0e/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                </div>

                <!-- الفصل الثاني -->
                <div id="chapter-2" class="chapter-content">
                    <h2 class="chapter-title">الفصل الثاني: التأثير المغناطيسي للتيار الكهربي</h2>
                    
                    <div class="video-menu">
                        <h3>قائمة الفيديوهات:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">اختر الفيديو...</option>
                            <option value="video8">حل واجب حصة 6</option>
                            <option value="video9">حل واجب حصة 7</option>
                            <option value="video10">حل واجب حصة 8</option>
                            <option value="video11">حل واجب حصة 9</option>
                            <option value="video12">حل واجب حصة 10</option>
                            <option value="video13">حل واجب حصة 11</option>
                            <option value="video14">حل واجب حصة 12</option>
                        </select>
                    </div>
                    <div class="video" id="video8" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 6</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1oB4cYVmLvZwYT1kzkHWp4B1IgWh4Lw3Q/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Cg7qYRF0weN2lGt1g4646I1a5kYvOheT/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/1-RTnIp68sHw7U5m1TiAXviWh_1nOfgMf/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1hg11yXNrmuVlkg3yBKqj4MftUQffBQqS/preview" width="640" height="480" allow="autoplay"></iframe> 
                    </div>
                    
                    <div class="video" id="video9" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 7</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1fdjCqGTXWbeY1i9Bdu9qsipZC6jn22jX/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1kQZrgRazZbjfc1Avn7252Xj_ftoIlsPi/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1AybPqTYHCz_KkaZtQrz0ggvLUiLv9zx2/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                    
                    <div class="video" id="video10" style="display:none;">
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1_HrbQ1CJDyy5cn3TGRVCEP9oqWxkAGMT/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1YMmcl1NqIdJBvxVacbJsmLt-sYTiAPU3/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/1lNSmM5bKHzRqpvCD69i7YJR8a5mBszyp/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1P0avXQpoAZxMtSIn_OmxyMAUj6RfS3Di/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                    
                    <div class="video" id="video11" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 9</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1R_DTAyxvhT32iXqgzDJFHQvhTVLum9xE/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1dQavkTyXAUAd3YSVJDm57AV_9iyn5TNh/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1dViunIRkzBj6muMwDSXFFa9OaleE0Rhm/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                    
                    <div class="video" id="video12" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 10</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1NdOZGwMEhd6EjhJZTd-NL0Upl413333o/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1MWaJdpHWnkPQLSyoRB82N2TDXSrxJg8J/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1m6UiJEUFayb4isIx-Gpx21kqV2frBUoe/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                    
                    <div class="video" id="video13" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 11</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1akDAjOT_IVE2FC9RsHe9KxpXpl1bMzln/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1itxxX0LU8-wpk3DO98xwfyjpN0VkgBK-/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1OAwwqU4w-4sP5el529mIno_R7JyIcWvD/preview" allowfullscreen></iframe>
                    </div>
                    
                    <div class="video" id="video14" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 12</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1r91rnCm-4EZi8mRd2JOAVVyEAv_99bC7/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1MKYgXDJOUhBP1clU20frZRjduEefZt98/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/15NnMk6KQQd-4G_JaeUt_QDfIIhNColjo/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1dAHdV5eZ6jM1VvM8J5QveD_XpTtkTTUk/preview" allowfullscreen></iframe>
                    </div>
                </div>

                <!-- الفصل الثالث -->
                <div id="chapter-3" class="chapter-content">
                    <h2 class="chapter-title">الفصل الثالث: الحث الكهرومغناطيسي</h2>

                    <div class="video-menu">
                        <h3>قائمة الفيديوهات:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">اختر الفيديو...</option>
                            <option value="video15">حل واجب حصة 13</option>
                            <option value="video16">حل واجب حصة 14</option>
                            <option value="video17">حل واجب حصة 15</option>
                            <option value="video18">حل واجب حصة 16</option>
                        </select>
                    </div>
                    
                    <div class="video" id="video15" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 13</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1umAMbU-GSo6qyvqOk0JvZY5Ho_eTLE_1/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1ffAWr3B3mTmtQbsprpEWM44tQ9lUBTiu/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/10As7xHmneiJEITnHNUyiWNr5I_d_ztqz/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1iyw44cdtPbSrld5dS329R6DBKA6hNwhS/preview" allowfullscreen></iframe>
                    </div>
                    
                    <div class="video" id="video16" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 14</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1HzQXE6RtazQaxiMnIu-Kby9r10ytj5Bf/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1OpANgn-pKk0Z7K1gHH1m28onWrY-02Zt/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/1YurR_f9Fz4OTtaJeFiEhjkIYI04HNoiA/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.4</h3>
                        <iframe data-src="https://drive.google.com/file/d/1H2HHLa0pMPYUbu4SJ6_jRftkvmIT8jaz/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1NlPdEITv_0YnPs4cQz3SgTIexWxEb2cj/preview" allowfullscreen></iframe>
                    </div>

                    <div class="video" id="video17" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 15</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1V8O1w0s2I-SX__CSz2vG7qDcnyw4a-_V/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1rIzHS_51qoA_kNFl5Fh1cOTD0kaGnOsW/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1KOXV0vjrYS9xwVTv119SmXM5Zv1PTA_c/preview" allowfullscreen></iframe>
                    </div>

                    <div class="video" id="video18" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 16</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1quc3ahr8vYC2iReBJStzVAAlBWZlHpxY/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1nNOTctCJykdM0eaW1KcGExeTo464O5oY/preview" allowfullscreen></iframe>
                        <h3 class="video-title">الاجابات</h3>
                        <iframe data-src="https://drive.google.com/file/d/1cU4ar66rqcj3UWUYf35nYvAbADCe_0Bi/preview" allowfullscreen></iframe>
                    </div>
                </div>
                
                <!-- الفصل الرابع -->
                <div id="chapter-4" class="chapter-content">
                    <h2 class="chapter-title">الفصل الرابع: دوائر التيار المتردد</h2>
                    <div class="video-menu">
                        <h3>قائمة الفيديوهات:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">اختر الفيديو...</option>
                            <option value="video19">حل واجب حصة 17</option>
                            <option value="video20">حل واجب حصة 18</option>
                            <option value="video21">حل واجب حصة 19</option>
                        </select>
                    </div>

                    <div class="video" id="video19" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 17</h3>
                        <iframe data-src="https://drive.google.com/file/d/1snikfKm0vHDTfG0-TYDtApZLYgBDYwg3/preview" allowfullscreen></iframe>
                    </div>

                    <div class="video" id="video20" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 18</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1cQMhfn44YfSiUytC9r2T_ZGNDXECHKwr/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1fQchZHx7sPY9rGydjwJeQve20hSsvvwO/preview" allowfullscreen></iframe>
                    </div>
                    <div class="video" id="video21" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 19</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1UzqK4eGRZbQ_oPgiKNGK-nTFOA3mncTR/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1BOxdynWVGK4hCNxzxjSn4L-Mn5-FKa-v/preview" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
            
            <!-- قسم الفيزياء الحديثة -->
            <div id="modern-physics" class="branch-content" style="display:none;">
                <div class="chapters-nav">
                    <button class="chapter-btn active" onclick="switchChapter(5)">الفصل الخامس</button>
                    <button class="chapter-btn" onclick="switchChapter(6)">الفصل السادس</button>
                </div>
                
                <!-- الفصل الخامس -->
                <div id="chapter-5" class="chapter-content active">
                    <h2 class="chapter-title">الفصل الخامس: ازدواجيه الموجة و الجسيم</h2>
                    <div class="video-menu">
                        <h3>قائمة الفيديوهات:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">اختر الفيديو...</option>
                            <option value="video22">حل واجب حصة 20</option>
                            <option value="video23">حل واجب حصة 21</option>
                            <option value="video24">حل واجب حصة 22</option>

                        </select>
                    </div>
                    <div class="video" id="video22" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 20</h3>
                        <iframe data-src="https://drive.google.com/file/d/1I1eJOjGBd2e_mumLpNfXJUXEQVFMumqa/preview" allowfullscreen></iframe>
                    </div>
                    <div class="video" id="video23" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 21</h3>
           <iframe data-src="https://drive.google.com/file/d/1d5_8WoLu0SLMfsLcu8Cf6dtUK4y90N5-/preview" allowfullscreen></iframe>
                    </div>
                    <div class="video" id="video24" style="display:none;">
                        <h3 class="video-title">حل واجب حصة 22</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe 
                       src="https://drive.google.com/file/d/1VouOXWQp4etyDz-5W3qLmvx-Xn8zoVMS/preview" 
                       width="100%" 
                       height="480" 
                       allow="autoplay"
                       allowfullscreen>
                       </iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe 
                        src="https://drive.google.com/file/d/1tZLoTLKRlof5F5XovL-jKrabbqksXXJL/preview" 
                        width="100%" 
                        height="480" 
                        allow="autoplay"
                        allowfullscreen>
                        </iframe>
                                                 <h3 class="video-title">الاجابات</h3>
                         <iframe src="https://drive.google.com/file/d/1uAdhXmiQBvV_77Htvc2oZGEoFh6s8QPg/preview" allowfullscreen></iframe>
                                         </div>


                </div>
                
                <!-- الفصل السادس -->
                <div id="chapter-6" class="chapter-content">
                    <h2 class="chapter-title">الفصل السادس: الاطياف الذرية</h2>
                    <div class="video-menu">
                        <h3>قائمة الفيديوهات:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">اختر الفيديو...</option>
                            <option value="video25">واجب حصة 23</option>
                        </select>
                    </div>
                    <div class="video" id="video25" style="display:none;">
                        <h3 class="video-title">واجب حصة 23</h3>
                        <iframe data-src="https://drive.google.com/file/d/1kZYwE8XsaM6WmrgTAcRpHgz-qekCWBgD/preview" allowfullscreen></iframe>
                    </div>
                </div>
            </div>`; }
        if (code === 'CODE2') { html += `            <!-- قسم الفيزياء الكهربية -->
            <div id="electric-physics" class="branch-content" style="display:none;">
                <div class="chapters-nav">
                    <button class="chapter-btn active" onclick="switchChapter(1)">Chapter 1</button>
                    <button class="chapter-btn" onclick="switchChapter(2)">Chapter 2</button>
                    <button class="chapter-btn" onclick="switchChapter(3)">Chapter 3</button>
                    <button class="chapter-btn" onclick="switchChapter(4)">Chapter 4</button>
                </div>
                
                <!-- Chapter 1 -->
                <div id="chapter-1" class="chapter-content active">
                    <h2 class="chapter-title">Chapter 1: Electric Current, Ohm's Law, and Kirchhoff's Laws</h2>
                    
                    <div class="video-menu">
                        <h3>Video List:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">Select video...</option>
                            <option value="video1">Homework 1</option>
                            <option value="video2">Homework 2</option>
                            <option value="video3">Homework 3</option>
                            <option value="video4">Homework 4</option>
                            <option value="video5">Homework 5</option>
                        </select>
                    </div>

                    <div class="video" id="video1" style="display:none;">
                        <h3 class="video-title">Homework 1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1iiNJqMrDUKkTptUQVymPbMqEyf0UowBB/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1L5UPraDEgW_Kmh32eOaOU5uYK8UqER4V/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>

                    <div class="video" id="video2" style="display:none;">
                        <h3 class="video-title">Homework 2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1kv5eqpNmC_X2ByBbfoLcXn6WUnA0eYVB/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Qb7N0TRJ8Cj4gkZ2nK9ZhSgAp7NC6636/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>

                    <div class="video" id="video3" style="display:none;">
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Tf4neobTgDj7nXd9WoUXwNYMLJC-7FJE/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1nHPcJfPX1cuC_Quy52RqciSkQZ1UWBdx/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/13xgvtm1WuqO5FdtAp9kE7QaOPKQ5BXAA/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>

                    <div class="video" id="video4" style="display:none;">
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1E_gyIwo2S8t_T5_4Q1XcTvekpPGlXQwg/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1JAJoaikg02O7DkbDu3317lMkbjEB_b9I/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1B9mwnM9Zl_k6l_qgUsLc2A16IoaBe4yz/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>

                    <div class="video" id="video5" style="display:none;">
                        <h3 class="video-title">Homework 5</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/16TMFaBOfkIB6F14NACeqYGnNmQPrFkOh/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1VWTzWJ8il2QNceP29XdzYdTEXDL8wYUj/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1JjdpQ3-YY9JcR4PIFD6qFRCiE7skqFKQ/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                </div>

                <!-- Chapter 2 -->
                <div id="chapter-2" class="chapter-content">
                    <h2 class="chapter-title">Chapter 2: The Magnetic Effect of Electric Current</h2>
                    <div class="video-menu">
                        <h3>Video List:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">Select video...</option>
                            <option value="video6">Homework 6</option>
                            <option value="video7">Homework 7</option>
                            <option value="video8">Homework 8</option>
                            <option value="video9">Homework 9</option>
                            <option value="video10">Homework 10</option>
                            <option value="video11">Homework 11</option>
                            <option value="video12">Homework 12</option>
                        </select>
                    </div>
                    
                    <div class="video" id="video6" style="display:none;">
                        <h3 class="video-title">Homework 6</h3>
                        <iframe data-src="https://drive.google.com/file/d/1V34aIAOPGhUdRksC7kgEQ8l0s8u1NLhK/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1bN0w4hN1q92ukBL2N0_4RluI5As7aBiW/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                    
                    <div class="video" id="video7" style="display:none;">
                        <h3 class="video-title">Homework 7</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/14YFJTqTwknrrSuBAJKzWgI4k3d63omkK/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1abKZL-6MOzBIhGAso84HrkwWTgFNPDd-/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/16b6LqFdMhUW4JtC_JmXpzgk-_0SFt80y/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1sjiK-D-vn9evR84D9cJ7CMoBaU-nzz2z/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                    
                    <div class="video" id="video8" style="display:none;">
                        <h3 class="video-title">Homework 8</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/165_d1qEaXzl_128dgX4f5Z8PzLNC3I0N/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1WJ-WTJ39JMBCsqpqaZpC1zM7TIVXA4Fz/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1SSYWj0_0sMPXp0brrPFoIQ7NWlwdRJba/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                    
                    <div class="video" id="video9" style="display:none;">
                        <h3 class="video-title">Homework 9</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1dy9Ze_jxwiPP1NfFo8n2HqPQqzqMrHWj/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/12gBF4QqYN6Fie-9Nc8Z4SHkODm4zU2cn/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1OyhK-zJZ4BGafDeZzrE3AOB-qHGaitYn/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                    
                    <div class="video" id="video10" style="display:none;">
                        <h3 class="video-title">Homework 10</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1TCtZ7qxH-mOzrFLkCrI8peKhF6SPnk9d/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1E8yhjJ-b0D2wm-0IR6v54GPxQfYHrbGQ/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1nugUrE7M23qVk3y_sp4eNvAyzmLVUgjH/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                    
                    <div class="video" id="video11" style="display:none;">
                        <h3 class="video-title">Homework 11</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Rb-r7OXwGlfM8kUTwu_eoyUBIAYKF8rq/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Zrk4bfFucA3nwa77cSjYEdK-NEAPDO_W/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/1DqwIeC3-J1zOyLF_LzDOh9rCMQIlLmBS/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1ISxN0O1eIpt-WckUFLr7IOBsRykMERUk/preview" allowfullscreen></iframe>
                    </div>
                    
                    <div class="video" id="video12" style="display:none;">
                        <h3 class="video-title">Homework 12</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1P8QDspeIW6rc5ciD5GXSNu2hErRsz55L/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1q9eGKbtTZGuzqPGeLwgRZZtWGTkNEAjr/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1rGc_5pkLjnaDM3CCZwXR-Pzgsb0JFcZ2/preview" allowfullscreen></iframe>
                    </div>
                </div>

                <!-- Chapter 3 -->
                <div id="chapter-3" class="chapter-content">
                    <h2 class="chapter-title">Chapter 3: Electromagnetic Induction</h2>

                    <div class="video-menu">
                        <h3>Video List:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">Select video...</option>
                            <option value="video13">Homework 13</option>
                            <option value="video14">Homework 14</option>
                            <option value="video15">Homework 15</option>
                            <option value="video16">Homework 16</option>
                        </select>
                    </div>
                    
                    <div class="video" id="video13" style="display:none;">
                        <h3 class="video-title">Homework 13</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Do8m1xQ-tEn7U4_5xAtKNjZ2VOHiw5xU/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1JQV3sNeHpJswUg0ebNniRR9CcwO3VTWC/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/1FRCVhqYZlRqCLw9XLiEpaPCSlKc22Kzn/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1ebTxM-9y3VwunIf2Kd7TyojxUEaiKWv4/preview" allowfullscreen></iframe>
                    </div>

                    <div class="video" id="video14" style="display:none;">
                        <h3 class="video-title">Homework 14</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1zgNhFXQY7pO6fbNFBVh_ClAfG5P12J0O/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1EEKW1SvwYJDpFfWzfay2hCushhiXUP1v/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/1NUJF2103h1BTxWlhtVUuhZsUwraul30M/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Fo2A56VlE0SuhmVKQxWoG1LJzjRRIKZA/preview" allowfullscreen></iframe>
                    </div>

                    <div class="video" id="video15" style="display:none;">
                        <h3 class="video-title">Homework 15</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1okTYOXI6vh2za5NDNZyOQHxshAODWqmU/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1PgYZv__rwa_sYhJFrT4K2JQaKS4qWRwT/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1Zk1zi9uj3edaCsU_J7o5Yb73NZgXbksC/preview" allowfullscreen></iframe>
                    </div>

                    <div class="video" id="video16" style="display:none;">
                        <h3 class="video-title">Homework 16</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1_LEoc0bVmKS0Zi-D6t7rJ7lJcvivsezI/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/19QeFa6xHPPIfQ1O8WJ3jpxeQi84hUD_J/preview" allowfullscreen></iframe>
                        <h3 class="video-title">answers</h3>
                        <iframe data-src="https://drive.google.com/file/d/1FFTo3auvao_OL0Yb6l9iquZHaE0OKQ_6/preview" allowfullscreen></iframe>
                    </div>
                </div>

                <!-- Chapter 4 -->
                <div id="chapter-4" class="chapter-content">
                    <h2 class="chapter-title">Chapter 4: AC circuits</h2>
                    <div class="video-menu">
                        <h3>Video List:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">Select video...</option>
                            <option value="video17">Homework 17</option>
                            <option value="video18">Homework 18</option>
                            <option value="video19">Homework 19</option>
                        </select>
                    </div>
                    
                    <div class="video" id="video17" style="display:none;">
                        <h3 class="video-title">Homework 17</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1IpxleKUMyBld3Dov8aiIi5L4JKL9pi0d/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/15Zz9Rh_lSXMdokdjd8TXiRoZwtMfjlKE/preview" allowfullscreen></iframe>
                    </div>

                    <div class="video" id="video18" style="display:none;">
                        <h3 class="video-title">Homework 18</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1wplWd-9Cr2iUvp58crEOeacfJP0_MwOU/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/1i3zeDxYobjSnpcKnRFoi5siSkQNP1F7Q/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/1T2hII3z2hiL8Kj9ExOfOnW3TYuyUIhXo/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.4</h3>
                        <iframe data-src="https://drive.google.com/file/d/1kppwYNBgInZxl3dgEQjDauODzSSbK8cB/preview" allowfullscreen></iframe>
                    </div>
                    <div class="video" id="video19" style="display:none;">
                        <h3 class="video-title">Homework 19</h3>
                        <h3 class="video-title">part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1ML0Ozo7x3NYXXhnZbRV6itHm7hGUOrbN/preview" allowfullscreen></iframe>
                        <h3 class="video-title">part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/175p9bR3nWoe1Cy_2geVOe0V_txYlD9bF/preview" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
            
            <!-- قسم الفيزياء الحديثة -->
            <div id="modern-physics" class="branch-content" style="display:none;">
                <div class="chapters-nav">
                    <button class="chapter-btn active" onclick="switchChapter(5)">Chapter 5</button>
                    <button class="chapter-btn" onclick="switchChapter(6)">Chapter 6</button>
                </div>
                
                <!-- Chapter 5 -->
                <div id="chapter-5" class="chapter-content active">
                    <h2 class="chapter-title">Chapter 5: Wave–Particle Duality</h2>
                    <div class="video-menu">
                        <h3>Video List:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">Select video...</option>
                            <option value="video20">Homework 20</option>
                            <option value="video21">Homework 21</option>
                            <option value="video22">Homework 22</option>

                        </select>
                    </div>
                    <div class="video" id="video20" style="display:none;">
                        <h3 class="video-title">Homework 20</h3>
                        <iframe data-src="https://drive.google.com/file/d/1szxRjQtJkL_zgbrRzo0x7ApD44mqIWt1/preview" allowfullscreen></iframe>
                    </div>
                    <div class="video" id="video21" style="display:none;">
                        <h3 class="video-title">Homework 21</h3>
                        <h3 class="video-title">Part.1</h3>
                        <iframe data-src="https://drive.google.com/file/d/1dPPVHDKJS7B6hKNymmCtmqHftbB32UT7/preview" allowfullscreen></iframe>
                        <h3 class="video-title">Part.2</h3>
                        <iframe data-src="https://drive.google.com/file/d/13ohVOQYs6khXOS2w-Rd-qWiMjqSRZ7No/preview" allowfullscreen></iframe>
                        <h3 class="video-title">Part.3</h3>
                        <iframe data-src="https://drive.google.com/file/d/1v_fUd5-zus9a8j8IpRbxJqjiOxgvfyAD/preview" allowfullscreen></iframe>
                    </div>
                     <div class="video" id="video22" style="display:none;">
                        <h3 class="video-title">Homework 22</h3>
                        <h3 class="video-title">Part.1</h3>
                    <iframe src="https://drive.google.com/file/d/1Uvtqj0Qv3UKnCIgYSrlEGH7_ZM2l4sVC/preview" width="100%" height="480" allow="autoplay" allowfullscreen></iframe>
                        <h3 class="video-title">Part.2</h3>
                   <iframe src="https://drive.google.com/file/d/13o9xyLPZaqS1leGeAO48RK1M7wqOMRcX/preview" width="100%" height="480" allow="autoplay" allowfullscreen></iframe>

                                   </div>



                </div>
                
                <!-- Chapter 6 -->
                <div id="chapter-6" class="chapter-content">
                    <h2 class="chapter-title">Chapter Six: Atomic Spectra</h2>
                    <div class="video-menu">
                        <h3>Video List:</h3>
                        <select class="video-selector" onchange="showVideo(this.value)">
                            <option value="">Select video...</option>
                            <option value="video23">Homework 23</option>
                        </select>
                    </div>
                    <div class="video" id="video23" style="display:none;">
                        <h3 class="video-title">Homework 23</h3>
            <iframe src="https://drive.google.com/file/d/1fsut8kMN9dvUqiPm1Hq1GQemCfvcFtH9/preview" allowfullscreen></iframe>
                    </div>
                </div>
            </div>`; }
        if (code === 'CODE3') { html += `            <h2>مراجعة الفصل الاول</h2>
            <select id="videoSelector" class="form-select" onchange="showVideo(this.value)">
                <option value="">اختر الفيديو...</option>
                <option value="video1">شرح الفصل الاول</option>
                <option value="video2">حل تدريبات الدرس الاول</option>
                <option value="video3">حل تدريبات الدرس الثاني</option>
                <option value="video4">حل تدريبات الدرس الثالث</option>
                <option value="video5">حل تدريبات الدرس الرابع</option>
            </select>
            
            <div class="video" id="video1" style="display:none;">
                <h3 class="video-title">Part.1</h3>
                <iframe data-src="https://drive.google.com/file/d/16UzX2Nfb4HGPDUWFTiG_p__RTfMTuXQR/preview" allowfullscreen></iframe>
                <h3 class="video-title">Part.2</h3>
                <iframe data-src="https://drive.google.com/file/d/1rYDFBKZPf4la00IzGtWR4f9Nu7sdqVRD/preview" allowfullscreen></iframe>
                <h3 class="video-title">Part.3</h3>
                <iframe data-src="https://drive.google.com/file/d/1xyBmw7CqQ1XuvjzvjT-srDO0E0xGQG6E/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video2" style="display:none;">
                <h3 class="video-title">Part.1</h3>
                <iframe data-src="https://drive.google.com/file/d/16t3A4UF-VpZVnrw9ddR8M-unHtgY7Vb2/preview" allowfullscreen></iframe>
                <h3 class="video-title">Part.2</h3>
                <iframe data-src="https://drive.google.com/file/d/12ZoKSUMdDLrRzH9TqJwWG6do7vWIxwA5/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video3" style="display:none;">
                <h3 class="video-title">حل تدريبات الدرس الثاني</h3>
                <iframe data-src="https://drive.google.com/file/d/13K5pRTKJurRmXFpcD18-wbZLGNSLdZor/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video4" style="display:none;">
                <h3 class="video-title">حل تدريبات الدرس الثالث</h3>
                <iframe data-src="https://drive.google.com/file/d/1-RNGfZ0kxFiwSlTBcC6Kl6AFD_tNegoM/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video5" style="display:none;">
                <h3 class="video-title">Part.1</h3>
                <iframe data-src="https://drive.google.com/file/d/1RDXJMFgrU5jgTyHr5s6KRrCQJ1rgA99r/preview" allowfullscreen></iframe>
                <h3 class="video-title">Part.2</h3>
                <iframe data-src="https://drive.google.com/file/d/1myy8xQ2gSvSoBreZK1DfpmzDQGqXVF-i/preview" allowfullscreen></iframe>
            </div>`; }
        if (code === 'CODE4') { html += `            <h2>Revision of Chapter 1</h2>
            <select id="videoSelector" class="form-select" onchange="showVideo(this.value)">
                <option value="">Select video...</option>
                <option value="video1">Explanation of Chapter 1</option>
                <option value="video2">lecture 1 exercises</option>
                <option value="video3">lecture 2 exercises</option>
                <option value="video4">lecture 3 exercises</option>
                <option value="video5">lecture 4 exercises</option>
            </select>
            
            <div class="video" id="video1" style="display:none;">
                <h3 class="video-title">part.1</h3>
                <iframe data-src="https://drive.google.com/file/d/1QQJBGgQNp-glB5wdLCOGVkFzgk2WFQbX/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2</h3>
                <iframe data-src="https://drive.google.com/file/d/1QSOLviOMwU31qGRWo3MaEDddElsr6CMz/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.3</h3>
                <iframe data-src="https://drive.google.com/file/d/1QU1WOgR8EknGyZjKeyOA9rAl3tqGVs2L/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video2" style="display:none;">
                <h3 class="video-title">lecture 1 exercises</h3>
                <iframe data-src="https://drive.google.com/file/d/1MGm9pT1T2Wme-MO9iMe-b7sKpYvcj3Gw/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video3" style="display:none;">
                <h3 class="video-title">part.1</h3>
                <iframe data-src="https://drive.google.com/file/d/13L0ifCf-T6YGnpCwavxXPB-RVbVHmg8P/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2</h3>
                <iframe data-src="https://drive.google.com/file/d/1PSEE0hTo8j8sKnyiA7n7L5th61yxb7yj/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.3</h3>
                <iframe data-src="https://drive.google.com/file/d/1dKYEF4dDpvMqNJ_mCLGpPDSholq7R5Rm/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video4" style="display:none;">
                <h3 class="video-title">lecture 2 exercises</h3>
                <iframe data-src="https://drive.google.com/file/d/1_hfwKKYNdY6J3wgDQS9vJqbYpQ_g6n45/preview" allowfullscreen></iframe>
            </div>
            
            <div class="video" id="video5" style="display:none;">
                <h3 class="video-title">part.1</h3>
                <iframe data-src="https://drive.google.com/file/d/1hqTGYDwSqnWtFqKUfZVr4mLWXVAtMzCy/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2</h3>
                <iframe data-src="https://drive.google.com/file/d/1ccLtf7KaafkEQTxzgIYIBfMn7Jhwyb3d/preview" allowfullscreen></iframe>
            </div>`; }
        if (code === 'CODE5') { html += `            <h2>Homework</h2>
            <select id="videoSelector" class="form-select" onchange="showVideo(this.value)">
                <option value="">Select video...</option>
                <option value="video1">Homework.2</option>
                <option value="video2">Homework.3</option>
                <option value="video3">Homework.4</option>
                <option value="video4">Homework.5</option>
                <option value="video5">Homework.7</option>
                <option value="video6">Homework.8</option>
                <option value="video7">Homework.9</option>
                <option value="video8">Homework.11</option>
            </select>
            
            <div class="video" id="video1" style="display:none;">
                <h3 class="video-title">Homework.2</h3>
                <iframe data-src="https://drive.google.com/file/d/1r6PxgT71wzqj9M_IX8xDp-pyMojeT202/preview" allowfullscreen></iframe>
            </div>
            <div class="video" id="video2" style="display:none;">
                <h3 class="video-title">Homework.3</h3>
                <iframe data-src="https://drive.google.com/file/d/1VEiSRzoQ209TO-pCJp6yXRDRulstM_H4/preview" allowfullscreen></iframe>
            </div>
            <div class="video" id="video3" style="display:none;">
                <h3 class="video-title">Homework.4</h3>
                <iframe data-src="https://drive.google.com/file/d/1fDXYuXsHyiJrgn6aXZ1oKt8GUFUOd8mo/preview" allowfullscreen></iframe>
                <h3 class="video-title">Quiz 3</h3>
                <iframe data-src="https://drive.google.com/file/d/1uzwOJJRa2hA4o_wbTiMoSc_kouYXkT6n/preview" allowfullscreen></iframe>
            </div>
            <div class="video" id="video4" style="display:none;">
                <h3 class="video-title">Homework.5</h3>
                <h3 class="video-title">part.1</h3>
                <iframe data-src="https://drive.google.com/file/d/1WK21GMXEDNF1-Qo8wRckNkDfhb2mdSKD/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2</h3>
                <iframe data-src="https://drive.google.com/file/d/1sjvByK6t0xGu3fTOMcoj3xAd4fhAlXKe/preview" allowfullscreen></iframe>
            </div>
            <div class="video" id="video5" style="display:none;">
                <h3 class="video-title">Homework.7</h3>
                <iframe data-src="https://drive.google.com/file/d/1RpoT2kK-45fCyhfK-r06VQVJcvW-o7UE/preview" allowfullscreen></iframe>
            </div>
            <div class="video" id="video6" style="display:none;">
                <h3 class="video-title">Homework.8</h3>
                <iframe data-src="https://drive.google.com/file/d/1A3n8rdVMRKgvbJR4tK3rfrBQcEOiaFup/preview" allowfullscreen></iframe>
            </div>

            <div class="video" id="video7" style="display:none;">
                <h3 class="video-title">Homework.9</h3>
                <iframe data-src="https://drive.google.com/file/d/14ddUsRiVBoWM921WLNFmSDOWhGZTp3bJ/preview" allowfullscreen></iframe>
            </div>

            <div class="video" id="video8" style="display:none;">
                <h3 class="video-title">Homework.11</h3>
                <h3 class="video-title">part.1</h3>
                <iframe data-src="https://drive.google.com/file/d/1r1Ej2vEjHQqho9iAIWJL5Qji-Pjkqdpv/preview" allowfullscreen></iframe>
                <h3 class="video-title">part.2</h3>
                <iframe data-src="https://drive.google.com/file/d/10B-vQm7OWjW9FF0SgYhwqR6RrlvQ_7Ah/preview" allowfullscreen></iframe>
            </div>`; }
        if (code === 'CODE6') { html += `            <h2>مراجعة الفصل الثاني</h2>
            <select id="videoSelector" class="form-select" onchange="showVideo(this.value)">
                <option value="">اختر الفيديو...</option>
                <option value="video1">شرح الفصل الثاني (الجزء الأول)</option>
                <option value="video2">شرح الفصل الثاني (الجزء الثاني)</option>
                <option value="video3">شرح الفصل الثاني (الجزء الثالث)</option>
                <option value="video4">تدريبات الدرس الأول</option>
                <option value="video5">تدريبات الدرس الثاني</option>
                <option value="video6">تدريبات الدرس الثالث</option>
                <option value="video7">تدريبات الدرس الرابع</option>
            </select>

            <div class="video" id="video1" style="display:none;">
                <h3 class="video-title">شرح الفصل الثاني (الجزء الأول)</h3>
                <iframe data-src="https://drive.google.com/file/d/1JsbhZ8UWhqh9p2RlecTBrCa5L_8vgJCR/preview" allowfullscreen></iframe>
            </div>

            <div class="video" id="video2" style="display:none;">
                <h3 class="video-title">شرح الفصل الثاني (الجزء الثاني)</h3>
                <iframe data-src="https://drive.google.com/file/d/1fOeP-_8VgSYQkiR5BeMhL0Xt422Wv7Vc/preview" allowfullscreen></iframe>
            </div>

            <div class="video" id="video3" style="display:none;">
                <h3 class="video-title">شرح الفصل الثاني (الجزء الثالث)</h3>
                <iframe data-src="https://drive.google.com/file/d/17dQEtszqYpmPmpU3GKYfsiyjGmwCHKhq/preview" allowfullscreen></iframe>
            </div>

            <div class="video" id="video4" style="display:none;">
                <h3 class="video-title">تدريبات الدرس الأول</h3>
                <h3 class="video-title">الجزء الأول</h3>
                <iframe data-src="https://drive.google.com/file/d/1Xafno2FXrklMu3N5udbsb_FAPQwQI0Na/preview" allowfullscreen></iframe>
                <h3 class="video-title">الجزء الثاني</h3>
                <iframe data-src="https://drive.google.com/file/d/1Uqmcfk2Ujoq2X_u8-6K3MTIA7B9NQ-RY/preview" allowfullscreen></iframe>
                <h3 class="video-title">الجزء الثالث</h3>
                <iframe data-src="https://drive.google.com/file/d/1b4NmhBy8VpzKk4wl0ktq9CvVDU5RVhgJ/preview" allowfullscreen></iframe>
                <h3 class="video-title">الجزء الرابع</h3>
                <iframe data-src="https://drive.google.com/file/d/1oYsLZZQhUABeYI9aH2Ac1_eewUfYOC1D/preview" allowfullscreen></iframe>
            </div>

            <div class="video" id="video5" style="display:none;">
                <h3 class="video-title">تدريبات الدرس الثاني</h3>
                <h3 class="video-title">الجزء الأول</h3>
                <iframe data-src="https://drive.google.com/file/d/1n8VJZWh6MZLM5EJZoydah6GQzsvpx_pN/preview" allowfullscreen></iframe>
                <h3 class="video-title">الجزء الثاني</h3>
                <iframe data-src="https://drive.google.com/file/d/1XcTlpD_pOpFchYzye_OzLf54RoxlfVWl/preview" allowfullscreen></iframe>
            </div>

            <div class="video" id="video6" style="display:none;">
                <h3 class="video-title">تدريبات الدرس الثالث</h3>
                <h3 class="video-title">الجزء الأول</h3>
                <iframe data-src="https://drive.google.com/file/d/1FSiqPd1aI2N6ObTw1IqskrkkT5A3wDeV/preview" allowfullscreen></iframe>
                <h3 class="video-title">الجزء الثاني</h3>
                <iframe data-src="https://drive.google.com/file/d/18uhR-4gz7w9Npu9Ronztyu-IMukHurld/preview" allowfullscreen></iframe>
                <h3 class="video-title">الجزء الثالث</h3>
                <iframe data-src="https://drive.google.com/file/d/1B0R8m9BavCxYEtXOz1qMHiQMEHqCebAA/preview" allowfullscreen></iframe>
            </div>

            <div class="video" id="video7" style="display:none;">
                <h3 class="video-title">تدريبات الدرس الرابع</h3>
                <h3 class="video-title">الجزء الأول</h3>
                <iframe data-src="https://drive.google.com/file/d/11MiD_5E587CPRDIRi4j6nMth61_8YbiW/preview" allowfullscreen></iframe>
                <h3 class="video-title">الجزء الثاني</h3>
                <iframe data-src="https://drive.google.com/file/d/1hSEX0DJvQTrggrkmtIm0NxyoEFvd_RN4/preview" allowfullscreen></iframe>
                <h3 class="video-title">الجزء الثالث</h3>
                <iframe data-src="https://drive.google.com/file/d/17czArTr3Mms54nFtW00TIeA8PHAS-vpc/preview" allowfullscreen></iframe>
            </div>`; }
        if (code === 'CODE13') { html += `    <div class="video-menu">
        <h3>Homework List:</h3>
        <select id="videoSelector" class="video-selector" onchange="showVideo(this.value)">
            <option value="">Select video...</option>
            <option value="video1">Homework.1</option>
            <option value="video2">Homework.2</option>
            <option value="video3">Homework.3</option>
            <option value="video4">Homework.4</option>

        </select>
    </div>
    
    <div class="video" id="video1" style="display:none;">
        <h3 class="video-title">Homework.1</h3>
        <iframe data-src="https://drive.google.com/file/d/1eadZrzlURnIxThenLm5is7m8BwaqnIoF/preview" allowfullscreen></iframe>
    </div>
    <div class="video" id="video2" style="display:none;">
        <h3 class="video-title">Homework.2</h3>
        <iframe data-src="https://drive.google.com/file/d/1MxaLtz8hIU53EEDjLujYoPRPX0LXyiL-/preview" allowfullscreen></iframe>
    </div>
    <div class="video" id="video3" style="display:none;">
        <h3 class="video-title">Homework.3</h3>
        <iframe data-src="https://drive.google.com/file/d/1oVzt9CO3CmLj3GsffJJ9NOHNKUEKi5hp/preview" allowfullscreen></iframe>
    </div>
    <div class="video" id="video4" style="display:none;">
        <h3 class="video-title">Homework.4</h3>
    <iframe src="https://drive.google.com/file/d/1AFlWKur2RWtQA07lClgsTPId_klqN3vv/preview" allowfullscreen></iframe>
    </div>`; }
        if (code === 'CODE7') { html += `    <div class="chapters-nav">
        <button class="chapter-btn active" onclick="switchChapter(1)">Chapter 2</button>
    </div>
    
    <!-- Chapter 2 -->
    <div id="chapter-1" class="chapter-content active">
        <h2 class="chapter-title">Chapter 2: The Magnetic Effect of Electric Current</h2>
        
        <div class="video-menu">
            <h3>Video List:</h3>
            <select class="video-selector" onchange="showVideo(this.value)">
                <option value="">Select video...</option>
                <option value="video1">Magnetic flux</option>
                <option value="video2">Flux density due to current passing in straight wire</option>
                <option value="video3">Total flux density</option>
                <option value="video4">Circular coil</option>
                <option value="video5">Solenoid</option>
                <option value="video6">Magnetic force</option>
                <option value="video7">Torque</option>
                <option value="video8">Galvanometer</option>
                <option value="video9">Ammeter</option>
                <option value="video10">Voltmeter</option>
                <option value="video11">Ohmmeter</option>
                <option value="video12">Important on devices</option>
                <option value="video13">Lecture 1 exercises</option>
                <option value="video14">Lecture 2 exercises</option>
                <option value="video15">Lecture 3 exercises</option>
                <option value="video16">Lecture 4 exercises</option>
            </select>
        </div>

        <div class="video" id="video1" style="display:none;">
            <h3 class="video-title">Magnetic flux</h3>
            <iframe data-src="https://drive.google.com/file/d/15KaT0AVNz1WNIaT2sSkWzxNlFdnrKiNi/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video2" style="display:none;">
            <h3 class="video-title">Flux density due to current passing in straight wire</h3>
            <iframe data-src="https://drive.google.com/file/d/1A8putuPbjHw5CeNHCl_SYby-HdvRN5xH/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video3" style="display:none;">
            <h3 class="video-title">Total flux density</h3>
            <iframe data-src="https://drive.google.com/file/d/1wLttY10Q-iQ8yXjLIhb8WJPBqwiq6uKo/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video4" style="display:none;">
            <h3 class="video-title">Circular coil</h3>
            <iframe data-src="https://drive.google.com/file/d/1dDMF-1y_g20K5iec815xjTQesF7ORQdk/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video5" style="display:none;">
            <h3 class="video-title">Solenoid</h3>
            <iframe data-src="https://drive.google.com/file/d/1KN8YLcwh5csP5MSqC-y5cNOh8saC1kz7/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video6" style="display:none;">
            <h3 class="video-title">Magnetic force</h3>
            <iframe data-src="https://drive.google.com/file/d/10dHYNaaRFkvAuoW7lKZLIWWi9so-5HKR/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video7" style="display:none;">
            <h3 class="video-title">Torque</h3>
            <iframe data-src="https://drive.google.com/file/d/1WcTWRaxKrMaE6-sA1hDeOVModv_zos7R/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video8" style="display:none;">
            <h3 class="video-title">Galvanometer</h3>
            <iframe data-src="https://drive.google.com/file/d/1GBm6oLaP1vQSSijqk7_tiK-a_UOK2N2x/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video9" style="display:none;">
            <h3 class="video-title">Ammeter</h3>
            <iframe data-src="https://drive.google.com/file/d/1CGdm_XWQNu_T9LuuVqtoaJwWOvQa1B9K/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video10" style="display:none;">
            <h3 class="video-title">Voltmeter</h3>
            <iframe data-src="https://drive.google.com/file/d/1M-5z44sdEw1oP2u3p4WSYEe6gaCarnmB/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video11" style="display:none;">
            <h3 class="video-title">Ohmmeter</h3>
            <iframe data-src="https://drive.google.com/file/d/1B2bPG2Jd3mxGfYwPxvjxVGD4TRKkTH3d/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video12" style="display:none;">
            <h3 class="video-title">Important on devices</h3>
            <iframe data-src="https://drive.google.com/file/d/19uTpb0KheuAWuR3vyDylR0ge0EWY-8aW/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video13" style="display:none;">
            <h3 class="video-title">Lecture 1 exercises</h3>
            <h3 class="video-title">part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/1CSKT46MhUNa5Hd1J3dFyTfFKKncZ9cw-/preview" allowfullscreen></iframe>
            <h3 class="video-title">part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/1D1fuPu2GXxOf7FiYKc9CsyPtzlLIr-X6/preview" allowfullscreen></iframe>
            <h3 class="video-title">part 3</h3>
            <iframe data-src="https://drive.google.com/file/d/11SJIHFp3YvNoOKvOcd_Y4ZVil5NkZj2y/preview" allowfullscreen></iframe>
            <h3 class="video-title">part 4</h3>
            <iframe data-src="https://drive.google.com/file/d/1kH-Fy4ZQIVwUb-9aymh9JZOHyF9P8wTO/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video14" style="display:none;">
            <h3 class="video-title">Lecture 2 exercises</h3>
            <iframe data-src="https://drive.google.com/file/d/1oBoK9l4K7tbDUWb-xhq7qv5-_QgeweZG/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video15" style="display:none;">
            <h3 class="video-title">Lecture 3 exercises</h3>
            <iframe data-src="https://drive.google.com/file/d/1E4v_fKT0zmliw0KM1is4Attl3Pr4sZOo/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video16" style="display:none;">
            <h3 class="video-title">Lecture 4 exercises</h3>
            <h3 class="video-title">part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/1ezGOIbNqI314sf209HQgS1zifixZWPlP/preview" allowfullscreen></iframe>
            <h3 class="video-title">part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/1R0ZQXkYbajlfrynBhmcxcVt7HcP_21bs/preview" allowfullscreen></iframe>
            <h3 class="video-title">part 3</h3>
            <iframe data-src="https://drive.google.com/file/d/1kBFmbFj0zV4BBXqvHbVo3Xe4S2X7TzMs/preview" allowfullscreen></iframe>
        </div>
    </div>`; }
        if (code === 'CODE8') { html += `    <div class="chapters-nav">
        <button class="chapter-btn active" onclick="switchChapter(1)">الفصل الثالث</button>
    </div>
    
    <!-- الفصل الثالث -->
    <div id="chapter-1" class="chapter-content active">
        <h2 class="chapter-title">الفصل الثالث: الحث الكهرومغناطيسي</h2>
        
        <div class="video-menu">
            <h3>قائمة الفيديوهات:</h3>
            <select class="video-selector" onchange="showVideo(this.value)">
                <option value="">اختر الفيديو...</option>
                <option value="video1">شرح الفصل الثالث (Part 1)</option>
                <option value="video2">شرح الفصل الثالث (Part 2)</option>
                <option value="video3">تدريبات الدرس الأول</option>
                <option value="video4">تدريبات الدرس الثاني</option>
                <option value="video5">تدريبات الدرس الثالث</option>
                <option value="video6">تدريبات الدرس الرابع</option>
            </select>
        </div>

        <div class="video" id="video1" style="display:none;">
            <h3 class="video-title">شرح الفصل الثالث (Part 1)</h3>
            <iframe data-src="https://drive.google.com/file/d/13hf2rREv3bIV-aiuAj94sZcLDxj8qKu0/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video2" style="display:none;">
            <h3 class="video-title">شرح الفصل الثالث (Part 2)</h3>
            <iframe data-src="https://drive.google.com/file/d/1FnyiymnXUG2yIy1f_6NVodCAfcpQ0059/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video3" style="display:none;">
            <h3 class="video-title">تدريبات الدرس الأول</h3>
            <h3 class="video-title">Part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/1CqnOF1m6Ce_pfI13c8vJc5ViLy6bWHeW/preview" allowfullscreen></iframe>
            <h3 class="video-title">Part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/1OJ2uBI8RfdQeWVQBK1QXjvfvDli18_Yo/preview" allowfullscreen></iframe>
            <h3 class="video-title">Part 3</h3>
            <iframe data-src="https://drive.google.com/file/d/15RTu4Y3nbUEA18OgfKlMZC6F4VPS3USI/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video4" style="display:none;">
            <h3 class="video-title">تدريبات الدرس الثاني</h3>
            <h3 class="video-title">Part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/1W_7GGE6DBv-IKeoYckUhSDyHz93zO41Y/preview" allowfullscreen></iframe>
            <h3 class="video-title">Part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/1q5NttcIKMYaK-YTClB6Jv8jcVHWJNLB_/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video5" style="display:none;">
            <h3 class="video-title">تدريبات الدرس الثالث</h3>
            <h3 class="video-title">Part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/1otMVRc-NX9dZAiod0wag4-FsYMIM_IkV/preview" allowfullscreen></iframe>
            <h3 class="video-title">Part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/1DiGwZVOBSwrcKmLdpIO8pOkKstMTmQpV/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video6" style="display:none;">
            <h3 class="video-title">تدريبات الدرس الرابع</h3>
            <iframe data-src="https://drive.google.com/file/d/19D6HIpfepV8N2lfD5_we8NjCjYy-Q6Wd/preview" allowfullscreen></iframe>
        </div>
    </div>`; }
        if (code === 'CODE9') { html += `    <div class="chapters-nav">
        <button class="chapter-btn active" onclick="switchChapter(1)">Chapter 3</button>
    </div>
    
    <!-- Chapter 3 -->
    <div id="chapter-1" class="chapter-content active">
        <h2 class="chapter-title">Chapter 3: Electromagnetic Induction</h2>
        
        <div class="video-menu">
            <h3>Video List:</h3>
            <select class="video-selector" onchange="showVideo(this.value)">
                <option value="">Select video...</option>
                <option value="video1">Faraday rule and lenz</option>
                <option value="video2">Induced emf in straight wire</option>
                <option value="video3">Mutual Induction</option>
                <option value="video4">Self induction</option>
                <option value="video5">Dynamo</option>
                <option value="video6">Transformer</option>
                <option value="video7">Motor</option>
                <option value="video8">Lecture 1 exercises</option>
                <option value="video9">Lecture 2 exercises</option>
                <option value="video10">Lecture 3 exercises</option>
                <option value="video11">Lecture 4 exercises</option>
            </select>
        </div>

        <div class="video" id="video1" style="display:none;">
            <h3 class="video-title">Faraday rule and lenz</h3>
            <iframe data-src="https://drive.google.com/file/d/1CO-KACGNBJN_B5XQjG4hymadfe2qQCuK/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video2" style="display:none;">
            <h3 class="video-title">Induced emf in straight wire</h3>
            <iframe data-src="https://drive.google.com/file/d/1IgK0AzHmdPveba0dS6G-w3oB9KzIwtAz/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video3" style="display:none;">
            <h3 class="video-title">Mutual Induction</h3>
            <iframe data-src="https://drive.google.com/file/d/1ZOkxgRwNktqEU01ArtPCdGPtI0_DTfhf/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video4" style="display:none;">
            <h3 class="video-title">Self induction</h3>
            <iframe data-src="https://drive.google.com/file/d/1JBvRufHVy54Fdti4Qebfxk8FxeUEJuXd/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video5" style="display:none;">
            <h3 class="video-title">Dynamo</h3>
            <iframe data-src="https://drive.google.com/file/d/1bNTVPDdRFlbivMj4w5Bme--D-1hmDDZB/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video6" style="display:none;">
            <h3 class="video-title">Transformer</h3>
            <iframe data-src="https://drive.google.com/file/d/10TxqnXvRF9liW7nXWVZ9E6Jt8hlC1A1h/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video7" style="display:none;">
            <h3 class="video-title">Motor</h3>
            <iframe data-src="https://drive.google.com/file/d/1bcCGuVSG-FFeqRpxtdbAruL3e7kUUBPY/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video8" style="display:none;">
            <h3 class="video-title">Lecture 1 exercises</h3>
            <h3 class="video-title">part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/1BLVKeHRyPq8fDLbcKJi0bakUYSjlJWY9/preview" allowfullscreen></iframe>
            <h3 class="video-title">part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/1Xn6LxprOv8HdTgjeSPmvndy7KFOgK_pB/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video9" style="display:none;">
            <h3 class="video-title">Lecture 2 exercises</h3>
            <iframe data-src="https://drive.google.com/file/d/1lPQUGCqKjVid1Cphn_TVEy9cBvehHCEm/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video10" style="display:none;">
            <h3 class="video-title">Lecture 3 exercises</h3>
            <h3 class="video-title">part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/1oE4TZc0kejYkzQV_MLB7qentyafUeQ7-/preview" allowfullscreen></iframe>
            <h3 class="video-title">part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/1-Vu8Pq-tr_u86f5VzVJkcQfAXSAP6SZw/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video11" style="display:none;">
            <h3 class="video-title">Lecture 4 exercises</h3>
            <iframe data-src="https://drive.google.com/file/d/1HG7iTWDu2r6681Q1akj0qNzCm12k8g1X/preview" allowfullscreen></iframe>
        </div>
    </div>`; }
        if (code === 'CODE10') { html += `    <div class="chapters-nav">
        <button class="chapter-btn active" onclick="switchChapter(1)">Final Revision</button>
    </div>
    
    <!-- Final Revision -->
    <div id="chapter-1" class="chapter-content active">
        <h2 class="chapter-title">Final Revision ☝🏽</h2>
        
        <div class="video-menu">
            <h3>Video List:</h3>
            <select class="video-selector" onchange="showVideo(this.value)">
                <option value="">Select video...</option>
                <option value="video1">1. ALL RULES REVISION</option>
                <option value="video2">2. Vernier Calliper Reading</option>
                <option value="video3">3. Quick Revision On (Density-Pressure-Ushaped tube)</option>
                <option value="video4">4. Quick Revision On (Barometer-Manometer-Pascal-Gases Laws)</option>
                <option value="video5">5. Solving First Experimental Exam 2026</option>
                <option value="video6">6. Solving Second Experimental Exam 2026</option>
                <option value="video7">7. Solving Experimental Exam 2025</option>
            </select>
        </div>

        <div class="video" id="video1" style="display:none;">
            <h3 class="video-title">ALL RULES REVISION</h3>
            <iframe data-src="https://drive.google.com/file/d/19HBrq70naPQM24uqs15N86i1hWJe6Gr7/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video2" style="display:none;">
            <h3 class="video-title">Vernier Calliper Reading</h3>
            <iframe data-src="https://drive.google.com/file/d/1IfJUIlJFwT7v4MsQOtyLhoKvy90Hb-z-/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video3" style="display:none;">
            <h3 class="video-title">Quick Revision On (Density-Pressure-Ushaped tube)</h3>
            <iframe data-src="https://drive.google.com/file/d/10U97LOl6JQVWcD5qMICP80NDm0e-ZN90/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video4" style="display:none;">
            <h3 class="video-title">Quick Revision On (Barometer-Manometer-Pascal-Gases Laws)</h3>
            <iframe data-src="https://drive.google.com/file/d/1fg5bcInh0HNIGST3dccrMDehNCuksMOZ/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video5" style="display:none;">
            <h3 class="video-title">Solving First Experimental Exam 2026</h3>
            <iframe data-src="https://drive.google.com/file/d/1_G5iXUfjsY1eP_AqsgX8ZmkTKOUgHUud/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video6" style="display:none;">
            <h3 class="video-title">Solving Second Experimental Exam 2026</h3>
            <iframe data-src="https://drive.google.com/file/d/1oxWrYCxe-IE-Om8f6lRwPe7FLM-x28TV/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video7" style="display:none;">
            <h3 class="video-title">Solving Experimental Exam 2025</h3>
            <iframe data-src="https://drive.google.com/file/d/1HacAMY7J5Ad5Zr_34a7rb0yQxVM5HyIv/preview" allowfullscreen></iframe>
        </div>
    </div>`; }
        if (code === 'CODE11') { html += `    <div class="chapters-nav">
        <button class="chapter-btn active" onclick="switchChapter(1)">مراجعة نصف السنة</button>
    </div>
    
    <!-- مراجعة نصف السنة -->
    <div id="chapter-1" class="chapter-content active">
        <h2 class="chapter-title">مراجعة نصف السنة</h2>
        
        <div class="video-menu">
            <h3>قائمة الفيديوهات:</h3>
            <select class="video-selector" onchange="showVideo(this.value)">
                <option value="">اختر الفيديو...</option>
                <option value="video1">شرح الفصل الرابع (Part 1)</option>
                <option value="video2">شرح الفصل الرابع (Part 2)</option>
                <option value="video3">شرح الفصل الرابع (Part 3)</option>
                <option value="video4">تدريبات الفصل الاول</option>
                <option value="video5">تدريبات الفصل الثاني</option>
                <option value="video6">تدريبات الفصل الثالث</option>
                <option value="video7">تدريبات الفصل الرابع</option>
            </select>
        </div>

        <div class="video" id="video1" style="display:none;">
            <h3 class="video-title">شرح الفصل الرابع (Part 1)</h3>
            <iframe data-src="https://drive.google.com/file/d/1TTlJWmBOe5KrDzch5-azinqcpt92TeM8/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video2" style="display:none;">
            <h3 class="video-title">شرح الفصل الرابع (Part 2)</h3>
            <iframe data-src="https://drive.google.com/file/d/1zOFLEM1CNFqyllYeg7fm312Oi0vDca4o/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video3" style="display:none;">
            <h3 class="video-title">شرح الفصل الرابع (Part 3)</h3>
            <iframe data-src="https://drive.google.com/file/d/1Q5TCeS5Cdt04svAEtJ52OrVQFgE21X0e/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video4" style="display:none;">
            <h3 class="video-title">تدريبات الفصل الاول</h3>
            <h3 class="video-title">Part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/1un-8-NjBdwYGhJF4t1vxvFc07na-KiJL/preview" allowfullscreen></iframe>
            <h3 class="video-title">Part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/1P1vUgpk7NWmvMkHDT3CoMPzLKynP5bZf/preview" allowfullscreen></iframe>
            <h3 class="video-title">Part 3</h3>
            <iframe data-src="https://drive.google.com/file/d/1lPxniWhIklJwzkg1s4zghxblZAgVizrb/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video5" style="display:none;">
            <h3 class="video-title">تدريبات الفصل الثاني</h3>
            <h3 class="video-title">Part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/1HwWrfRx0YTNBkBBRRzCmwdmYCryhkvJF/preview" allowfullscreen></iframe>
            <h3 class="video-title">Part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/1B28GGn5O-YVse6VtQzk0aHVsES-4zbKa/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video6" style="display:none;">
            <h3 class="video-title">تدريبات الفصل الثالث</h3>
            <h3 class="video-title">Part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/1_pSdMvY0UKJ23Vv-aye9-aAyr3aYV0BX/preview" allowfullscreen></iframe>
            <h3 class="video-title">Part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/19vgZBaNM1gkjHCRwKVHiRX3us9IphDy-/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video7" style="display:none;">
            <h3 class="video-title">تدريبات الفصل الرابع</h3>
            <h3 class="video-title">Part 1</h3>
            <iframe data-src="https://drive.google.com/file/d/14o9Y0DRinHZe0AJ-QOr0ACtQcTuDDM1_/preview" allowfullscreen></iframe>
            <h3 class="video-title">Part 2</h3>
            <iframe data-src="https://drive.google.com/file/d/1lXffint_g9wgofI4gc5nO7ID0u4dEvNp/preview" allowfullscreen></iframe>
        </div>
    </div>`; }
        if (code === 'CODE12') { html += `    <div class="chapters-nav">
        <button class="chapter-btn active" onclick="switchChapter(1)">Mid-Year Review</button>
    </div>
    
    <!-- Mid-Year Review -->
    <div id="chapter-1" class="chapter-content active">
        <h2 class="chapter-title">Mid-Year Review</h2>
        
        <div class="video-menu">
            <h3>Video List:</h3>
            <select class="video-selector" onchange="showVideo(this.value)">
                <option value="">Select video...</option>
                <option value="video1">Ac circuits and hot wire ammeter</option>
                <option value="video2">R-Circuit & L-Circuit</option>
                <option value="video3">Capacitor with DC and C-Circuit</option>
                <option value="video4">RL-Circuit & RC-Circuit & RLC-Circuit</option>
                <option value="video5">Resonance</option>
                <option value="video6">chapter 1 exercises</option>
                <option value="video7">chapter 2 exercises</option>
                <option value="video8">chapter 3 exercises</option>
                <option value="video9">chapter 4 exercises</option>
            </select>
        </div>

        <div class="video" id="video1" style="display:none;">
            <h3 class="video-title">Ac circuits and hot wire ammeter</h3>
            <iframe data-src="https://drive.google.com/file/d/1kZWVO3VpIxGA8o3DLboFfOp4G5bhk8hV/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video2" style="display:none;">
            <h3 class="video-title">R-Circuit & L-Circuit</h3>
            <iframe data-src="https://drive.google.com/file/d/1I36i38fDMn7RGNEGc6MeZUNmaAno1DJb/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video3" style="display:none;">
            <h3 class="video-title">Capacitor with DC and C-Circuit</h3>
            <iframe data-src="https://drive.google.com/file/d/1fDzXl307Vnl8K9Oy9oVDlg8JJj0id-az/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video4" style="display:none;">
            <h3 class="video-title">RL-Circuit & RC-Circuit & RLC-Circuit</h3>
            <iframe data-src="https://drive.google.com/file/d/1IX7bL_MCQziOEmEnOPJAsD3J-H6ZhHCK/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video5" style="display:none;">
            <h3 class="video-title">Resonance</h3>
            <iframe data-src="https://drive.google.com/file/d/1WETnTpCniFzIjR-RVTwqY2OcjJYUOyXF/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video6" style="display:none;">
            <h3 class="video-title">chapter 1 exercises</h3>
            <h3 class="video-title">part.1</h3>
            <iframe data-src="https://drive.google.com/file/d/1wbOMR2BlUdBxKhfiJVhSjh6dNoIy0EHn/preview" allowfullscreen></iframe>
            <h3 class="video-title">part.2</h3>
            <iframe data-src="https://drive.google.com/file/d/1t48dWfEsA5M3y3g-5Z1Xck6-NqzK3Uzu/preview" allowfullscreen></iframe>
            <h3 class="video-title">part.3</h3>
            <iframe data-src="https://drive.google.com/file/d/1h_P1VZmz7xT7kBmIUbJLlF-xYndAMT6c/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video7" style="display:none;">
            <h3 class="video-title">chapter 2 exercises</h3>
            <h3 class="video-title">part.1</h3>
            <iframe data-src="https://drive.google.com/file/d/1xGk3-sYF_Mt3FkIoRd8ZDaIOTAFAmzlc/preview" allowfullscreen></iframe>
            <h3 class="video-title">part.2</h3>
            <iframe data-src="https://drive.google.com/file/d/14pEEKr84OvYUlJHCkVPzFCab3kcrRcno/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video8" style="display:none;">
            <h3 class="video-title">chapter 3 exercises</h3>
            <h3 class="video-title">part.1</h3>
            <iframe data-src="https://drive.google.com/file/d/1vqVOpiShRU6yyRWB10iQ79yUzIww-Hta/preview" allowfullscreen></iframe>
            <h3 class="video-title">part.2</h3>
            <iframe data-src="https://drive.google.com/file/d/1o0lVv9qIupDqFt90zgTFZRH-ijki5CMO/preview" allowfullscreen></iframe>
            <h3 class="video-title">part.3</h3>
            <iframe data-src="https://drive.google.com/file/d/1nsj2vEIktEJUWO1uqwu4aLnXPyAwx_uV/preview" allowfullscreen></iframe>
        </div>

        <div class="video" id="video9" style="display:none;">
            <h3 class="video-title">chapter 4 exercises</h3>
            <h3 class="video-title">part.1</h3>
            <iframe data-src="https://drive.google.com/file/d/1jhY5V9jRHGLiv0o3-gFR0AW2lkTK7YTr/preview" allowfullscreen></iframe>
            <h3 class="video-title">part.2</h3>
            <iframe data-src="https://drive.google.com/file/d/1pa2lk25sEXv-alDMXsoZl7iQ9KnI_1Qp/preview" allowfullscreen></iframe>
        </div>
    </div>
    \`;
        }`; }

        // Logout button
        html += `
        <div class="logout-container">
            <button onclick="window.logout()" class="logout-btn"> تسجيل الخروج</button>
        </div>`;

        videoContainer.innerHTML = html;

        // ── Load dynamic videos from Firebase ──────────────────
        try {
            const snap = await get(ref(db, 'videos/' + code));
            if (snap.exists()) {
                const vids = snap.val();
                const sorted = Object.values(vids).sort((a,b) => (a.order||0)-(b.order||0));
                if (sorted.length > 0) {
                    // Build dynamic video section HTML
                    let dynHtml = '<div class="dynamic-videos-section">';
                    dynHtml += '<h3 class="dynamic-videos-title">📹 الفيديوهات الجديدة</h3>';
                    dynHtml += '<select class="video-selector" id="dynamicVideoSelector" onchange="window.showDynamicVideo(this.value)">';
                    dynHtml += '<option value="">اختر الفيديو...</option>';
                    sorted.forEach((v, i) => {
                        dynHtml += `<option value="dv_${i}">${v.title}</option>`;
                    });
                    dynHtml += '</select>';
                    sorted.forEach((v, i) => {
                        dynHtml += `<div class="video" id="dv_${i}" style="display:none;">`;
                        dynHtml += `<h3 class="video-title">${v.title}</h3>`;
                        if (v.url2) {
                            dynHtml += `<h3 class="video-title">الجزء الأول</h3>`;
                        }
                        dynHtml += `<iframe src="${v.url1}" width="100%" height="480" allow="autoplay" allowfullscreen></iframe>`;
                        if (v.url2) {
                            dynHtml += `<h3 class="video-title">الجزء الثاني</h3>`;
                            dynHtml += `<iframe src="${v.url2}" width="100%" height="480" allow="autoplay" allowfullscreen></iframe>`;
                        }
                        dynHtml += '</div>';
                    });
                    dynHtml += '</div>';

                    // Insert before logout button
                    const logoutDiv = videoContainer.querySelector('.logout-container');
                    if (logoutDiv) {
                        logoutDiv.insertAdjacentHTML('beforebegin', dynHtml);
                    } else {
                        videoContainer.insertAdjacentHTML('beforeend', dynHtml);
                    }

                    // Attach change handler
                    window.showDynamicVideo = function(id) {
                        if (!id) return;
                        videoContainer.querySelectorAll('[id^="dv_"]').forEach(v => v.style.display = 'none');
                        const t = document.getElementById(id);
                        if (t) {
                            t.style.display = 'block';
                            if (window.innerWidth <= 768) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    };
                }
            }
        } catch(e) { console.warn('Dynamic videos:', e); }

        // Branch selector events (CODE1 & CODE2)
        document.getElementById('branchSelector')?.addEventListener('change', function () {
            document.querySelectorAll('.branch-content').forEach(b => b.style.display = 'none');
            if (this.value) {
                const t = document.getElementById(this.value + '-physics');
                if (t) t.style.display = 'block';
            }
        });

        // Profile info toggle
        document.querySelector('.profile-img-container')?.addEventListener('click', e => {
            e.stopPropagation();
            document.getElementById('profileInfo')?.classList.toggle('active');
        });
        document.addEventListener('click', () => document.getElementById('profileInfo')?.classList.remove('active'));

        // Ramadan message badge
        if (code === 'CODE1' || code === 'CODE2') {
            const wb = videoContainer.querySelector('.welcome-banner');
            if (wb) wb.insertAdjacentHTML('afterend', `
                <div class="video-message-indicator">
                    <div class="message-badge" id="messageBadge">
                        <i class="fas fa-envelope"></i> Ramadan Kareem Message
                    </div>
                </div>`);

            const mm  = document.getElementById('messageModal');
            const mo  = document.getElementById('messageOverlay');
            const cm  = document.getElementById('closeModal');
            document.getElementById('messageBadge')?.addEventListener('click', () => { mm.style.display='block'; mo.style.display='block'; document.body.style.overflow='hidden'; });
            cm?.addEventListener('click',  () => { mm.style.display='none';  mo.style.display='none';  document.body.style.overflow='auto'; });
            mo?.addEventListener('click',  () => { mm.style.display='none';  mo.style.display='none';  document.body.style.overflow='auto'; });
        }

        // Non-branch video selector (CODE3+)
        document.getElementById('videoSelector')?.addEventListener('change', function () {
            const id = this.value;
            videoContainer.querySelectorAll('.video').forEach(v => v.style.display = 'none');
            if (id) {
                const t = document.getElementById(id);
                if (t) { t.style.display = 'block'; loadIframes(t); if (window.innerWidth <= 768) t.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            }
        });
    }


    // Inject dynamic video styles
    if (!document.getElementById('dvStyles')) {
        const s = document.createElement('style');
        s.id = 'dvStyles';
        s.textContent = `
            .dynamic-videos-section {
                background: linear-gradient(135deg, rgba(128,0,0,0.05), rgba(212,175,55,0.05));
                border: 2px solid rgba(212,175,55,0.3);
                border-radius: 16px;
                padding: 1.5rem;
                margin: 1.5rem 0;
            }
            .dynamic-videos-title {
                color: #800000;
                margin-bottom: 1rem;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .dynamic-videos-title::after {
                content: '';
                flex: 1;
                height: 2px;
                background: linear-gradient(90deg, rgba(212,175,55,0.5), transparent);
            }
        `;
        document.head.appendChild(s);
    }

    // ── Init ──────────────────────────────────────────────────
    checkLoginState();
});
