/* ══════════════════════════════════════════════════════════════
   script.js  –  Facebook-style interactive features
   ══════════════════════════════════════════════════════════════ */

// ── Feed data ─────────────────────────────────────────────────
const postsData = [
    {
        id: 1,
        user: 'User One',
        time: '2 hours ago',
        text: 'Enjoying the beautiful weather today! ☀️ #Nature #Weekend',
        image: 'https://picsum.photos/600/300?random=1',
        likes: 24,
        comments: [
            { user: 'Priya', text: 'Looks amazing! 😍' },
            { user: 'Raj', text: 'Enjoy! 🌿' }
        ]
    },
    {
        id: 2,
        user: 'User Two',
        time: '5 hours ago',
        text: 'Web programming is fun! Learning Bootstrap layouts today. 💻',
        image: null,
        likes: 12,
        comments: [{ user: 'Alex', text: 'Keep it up! 🚀' }]
    },
    {
        id: 3,
        user: 'User Three',
        time: '1 day ago',
        text: 'Just finished a great book 📚 — highly recommend "Atomic Habits"!',
        image: 'https://picsum.photos/600/300?random=5',
        likes: 47,
        comments: []
    }
];

const likedPosts = new Set();

// ── Load saved profile from localStorage ──────────────────────
function loadSavedProfile() {
    const saved = localStorage.getItem('fbProfile');
    if (!saved) return;
    const p = JSON.parse(saved);
    applyProfileToPage(p.name, p.location, p.bio);
    document.getElementById('userNameInput').value = p.name;
    document.getElementById('userLocationInput').value = p.location;
    document.getElementById('userBioInput').value = p.bio;
}

function applyProfileToPage(name, location, bio) {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const sidebarName = document.getElementById('sidebar-user-name');
    if (sidebarName) sidebarName.innerText = name;

    const postInput = document.getElementById('post-placeholder-input');
    if (postInput) postInput.placeholder = `What's on your mind, ${name}?`;

    const postArea = document.getElementById('postTextArea');
    if (postArea) postArea.placeholder = `What's on your mind, ${name}?`;

    const locEl = document.getElementById('sidebar-user-location');
    if (locEl) locEl.innerHTML = `<i class="fas fa-map-marker-alt me-1"></i>${location || 'Location not set'}`;

    const bioEl = document.getElementById('sidebar-user-bio');
    if (bioEl) bioEl.innerText = bio || '';

    ['navbar-user-img', 'sidebar-user-img', 'post-user-img', 'story-user-img'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.src = avatarUrl;
    });
}

// ── Render Feed ───────────────────────────────────────────────
function renderFeed(posts) {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    posts.forEach(post => feed.insertAdjacentHTML('beforeend', buildPostCard(post)));
}

function buildPostCard(post) {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user)}&background=random`;
    const imgHtml = post.image ? `<img src="${post.image}" class="img-fluid w-100" alt="post image">` : '';
    const commentsHtml = post.comments.map(c =>
        `<div class="comment-bubble"><strong>${c.user}:</strong> ${c.text}</div>`
    ).join('');

    return `
    <div class="card shadow-sm mb-3 border-0 rounded-3" id="post-${post.id}">
        <div class="card-header bg-white border-0 d-flex align-items-center">
            <img src="${avatarUrl}" class="rounded-circle me-2" width="40" height="40" alt="${post.user}">
            <div>
                <h6 class="mb-0 fw-bold">${post.user}</h6>
                <small class="text-muted">${post.time} <i class="fas fa-globe-americas"></i></small>
            </div>
            <i class="fas fa-ellipsis-h ms-auto text-muted post-options-btn"
               onclick="showToast('Options for this post', 'info')"></i>
        </div>
        <div class="card-body p-0">
            <p class="px-3 pt-3">${post.text}</p>
            ${imgHtml}
        </div>
        <div class="card-footer bg-white border-0">
            <div class="d-flex justify-content-between align-items-center mb-2 px-1">
                <div class="d-flex align-items-center reaction-summary" onclick="toggleLike(${post.id})">
                    <i class="fas fa-thumbs-up text-primary me-1"></i>
                    <span id="like-count-${post.id}">${post.likes}</span>
                </div>
                <div class="text-muted small comment-summary" onclick="toggleComments(${post.id})">
                    ${post.comments.length} Comment${post.comments.length !== 1 ? 's' : ''}
                </div>
            </div>
            <hr class="my-1">
            <div class="d-flex justify-content-between">
                <button class="btn btn-light flex-grow-1 like-btn" id="like-btn-${post.id}"
                        onclick="toggleLike(${post.id})">
                    <i class="far fa-thumbs-up"></i> Like
                </button>
                <button class="btn btn-light flex-grow-1" onclick="toggleComments(${post.id})">
                    <i class="far fa-comment-alt"></i> Comment
                </button>
                <button class="btn btn-light flex-grow-1" onclick="showToast('Link copied!', 'success')">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
            <div class="comment-section" id="comments-${post.id}">
                <div id="comments-list-${post.id}">${commentsHtml}</div>
                <div class="comment-input-wrap mt-2">
                    <img src="https://ui-avatars.com/api/?name=sriyans&background=random"
                         class="rounded-circle comment-avatar" width="32" height="32"
                         id="comment-avatar-${post.id}" alt="you">
                    <input type="text" class="form-control" placeholder="Write a comment…"
                           id="comment-input-${post.id}"
                           onkeydown="submitComment(event, ${post.id})">
                    <i class="fas fa-paper-plane text-primary send-btn"
                       onclick="submitComment({key:'Enter'}, ${post.id})"></i>
                </div>
            </div>
        </div>
    </div>`;
}

// ── Like Toggle ───────────────────────────────────────────────
function toggleLike(postId) {
    const btn = document.getElementById(`like-btn-${postId}`);
    const count = document.getElementById(`like-count-${postId}`);
    let n = parseInt(count.textContent);
    if (likedPosts.has(postId)) {
        likedPosts.delete(postId);
        btn.classList.remove('liked');
        btn.innerHTML = '<i class="far fa-thumbs-up"></i> Like';
        count.textContent = n - 1;
    } else {
        likedPosts.add(postId);
        btn.classList.add('liked');
        btn.innerHTML = '<i class="fas fa-thumbs-up text-primary"></i> Liked';
        count.textContent = n + 1;
        showToast('You liked this post!', 'success');
    }
}

// ── Comment Toggle ────────────────────────────────────────────
function toggleComments(postId) {
    const section = document.getElementById(`comments-${postId}`);
    section.classList.toggle('open');
    if (section.classList.contains('open'))
        document.getElementById(`comment-input-${postId}`).focus();
}

function submitComment(e, postId) {
    if (e.key !== 'Enter') return;
    const input = document.getElementById(`comment-input-${postId}`);
    const text = input.value.trim();
    if (!text) return;
    const saved = localStorage.getItem('fbProfile');
    const userName = saved ? JSON.parse(saved).name : 'You';
    document.getElementById(`comments-list-${postId}`).insertAdjacentHTML('beforeend',
        `<div class="comment-bubble"><strong>${userName}:</strong> ${text}</div>`
    );
    input.value = '';
    showToast('Comment posted!', 'success');
}

// ── Create Post Compose ───────────────────────────────────────
function openPostCompose() {
    document.getElementById('postComposeArea').classList.add('open');
    document.getElementById('postTextArea').focus();
}

function closePostCompose() {
    document.getElementById('postComposeArea').classList.remove('open');
    document.getElementById('postTextArea').value = '';
    document.getElementById('charCount').textContent = '0';
}

function updateCharCount(textarea) {
    if (textarea.value.length > 300) textarea.value = textarea.value.substring(0, 300);
    document.getElementById('charCount').textContent = textarea.value.length;
}

function submitPost() {
    const text = document.getElementById('postTextArea').value.trim();
    if (!text) { showToast('Please write something first!', 'info'); return; }
    const saved = localStorage.getItem('fbProfile');
    const userName = saved ? JSON.parse(saved).name : 'You';
    postsData.unshift({ id: Date.now(), user: userName, time: 'Just now', text, image: null, likes: 0, comments: [] });
    renderFeed(postsData);
    closePostCompose();
    showToast('Post shared successfully!', 'success');
}

// ── Dark Mode ─────────────────────────────────────────────────
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#darkModeToggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        showToast('Dark mode on 🌙', 'info');
    } else {
        icon.className = 'fas fa-moon';
        showToast('Light mode on ☀️', 'info');
    }
}

// ── Toast Notification ────────────────────────────────────────
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `fb-toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// ── Update Profile ────────────────────────────────────────────
function updateProfile() {
    const newName = document.getElementById('userNameInput').value.trim();
    const newLocation = document.getElementById('userLocationInput').value.trim();
    const newBio = document.getElementById('userBioInput').value.trim();

    if (!newName) { showToast('Name cannot be empty!', 'info'); return; }

    // ── Save to localStorage so profile.html reads it ─────────
    localStorage.setItem('fbProfile', JSON.stringify({ name: newName, location: newLocation, bio: newBio }));

    applyProfileToPage(newName, newLocation, newBio);

    // Update comment avatars in feed
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random`;
    document.querySelectorAll('.comment-avatar').forEach(el => { el.src = avatarUrl; });

    bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
    showToast(`Profile updated! Welcome, ${newName} 👋`, 'success');
}

// ── Search handler ────────────────────────────────────────────
function handleSearch(query) {
    const q = query.toLowerCase().trim();
    renderFeed(q ? postsData.filter(p =>
        p.text.toLowerCase().includes(q) || p.user.toLowerCase().includes(q)
    ) : postsData);
}

// ── Render Contacts ───────────────────────────────────────────
const contactsData = [
    { name: 'Alex', online: true },
    { name: 'Priya', online: true },
    { name: 'Raj', online: false },
    { name: 'Sara', online: true },
    { name: 'Meera', online: false },
    { name: 'Dev', online: true },
    { name: 'Tanya', online: false },
];

function renderContacts() {
    const el = document.getElementById('contactList');
    if (!el) return;
    el.innerHTML = contactsData.map(c => `
        <a href="messages.html" class="list-group-item list-group-item-action border-0 d-flex align-items-center px-0 py-1 rounded-3" title="Message ${c.name}">
            <div class="position-relative me-2">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random"
                     class="rounded-circle" width="34" height="34" alt="${c.name}">
                <span class="position-absolute bottom-0 end-0 p-1 border border-2 border-white rounded-circle
                      ${c.online ? 'bg-success' : 'bg-secondary'}" style="width:12px;height:12px;"></span>
            </div>
            <span style="font-size:0.9rem;">${c.name}</span>
            ${c.online ? '' : '<small class="text-muted ms-auto" style="font-size:0.75rem;">1h</small>'}
        </a>
    `).join('');
}

// ── Trending Topics Widget ────────────────────────────────────
const trending = [
    { tag: '#WebDevelopment', posts: '12.4K posts' },
    { tag: '#AIrevolution', posts: '8.1K posts' },
    { tag: '#TechNews', posts: '5.6K posts' },
    { tag: '#Cricket2024', posts: '23.8K posts' },
    { tag: '#Photography', posts: '4.2K posts' },
];
function renderTrending() {
    const el = document.getElementById('trendingList');
    if (!el) return;
    el.innerHTML = trending.map(t => `
        <div onclick="showToast('Searching for ${t.tag}…','info')"
             style="padding:6px 8px;border-radius:8px;cursor:pointer;transition:background 0.15s;"
             onmouseover="this.style.background='#f0f2f5'" onmouseout="this.style.background='transparent'">
            <div style="font-weight:700;font-size:0.88rem;color:#1877f2;">${t.tag}</div>
            <div style="font-size:0.78rem;color:#65676b;">${t.posts}</div>
        </div>`).join('');
}

// ── Story Viewer ──────────────────────────────────────────────
const stories = [
    { name: 'Alex', img: 'https://picsum.photos/380/680?random=1' },
    { name: 'Priya', img: 'https://picsum.photos/380/680?random=2' },
    { name: 'Raj', img: 'https://picsum.photos/380/680?random=3' },
    { name: 'Sara', img: 'https://picsum.photos/380/680?random=4' },
    { name: 'Meera', img: 'https://picsum.photos/380/680?random=5' },
];
let storyIndex = 0;
let storyTimer = null;
let storyProgress = 0;
let storyAnimFrame = null;

function openStory(idx) {
    storyIndex = idx;
    const overlay = document.getElementById('storyOverlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    showStory();
}

function showStory() {
    const s = stories[storyIndex];
    document.getElementById('storyImage').src = s.img;
    document.getElementById('storyAuthorName').textContent = s.name;
    document.getElementById('storyAuthorAvatar').src =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`;

    // Progress bars
    const bars = document.getElementById('storyProgressBars');
    bars.innerHTML = stories.map((_, i) => `
        <div style="flex:1;height:3px;background:rgba(255,255,255,0.35);border-radius:2px;overflow:hidden;">
            <div id="pb-${i}" style="height:100%;background:white;width:${i < storyIndex ? '100%' : '0%'};transition:none;"></div>
        </div>`).join('');

    // Animate current bar
    storyProgress = 0;
    clearTimeout(storyTimer);
    cancelAnimationFrame(storyAnimFrame);
    const start = performance.now();
    const duration = 5000;
    function animate(now) {
        const pct = Math.min(100, ((now - start) / duration) * 100);
        const pb = document.getElementById(`pb-${storyIndex}`);
        if (pb) pb.style.width = pct + '%';
        if (pct < 100) {
            storyAnimFrame = requestAnimationFrame(animate);
        } else {
            nextStory();
        }
    }
    storyAnimFrame = requestAnimationFrame(animate);
}

function nextStory() {
    cancelAnimationFrame(storyAnimFrame);
    if (storyIndex < stories.length - 1) {
        storyIndex++;
        showStory();
    } else {
        closeStory();
    }
}

function prevStory() {
    cancelAnimationFrame(storyAnimFrame);
    if (storyIndex > 0) {
        storyIndex--;
        showStory();
    }
}

function closeStory() {
    cancelAnimationFrame(storyAnimFrame);
    document.getElementById('storyOverlay').style.display = 'none';
    document.body.style.overflow = '';
}

// Close story on overlay click (not on buttons/img)
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeStory(); });

// ── Emoji Reaction Picker on Posts ────────────────────────────
// Injected into each post's like button area via renderFeed
// We patch buildPostHTML to add a reaction picker
const REACTIONS = [
    { emoji: '👍', label: 'Like', color: '#1877f2' },
    { emoji: '❤️', label: 'Love', color: '#e0245e' },
    { emoji: '😂', label: 'Haha', color: '#f59e0b' },
    { emoji: '😮', label: 'Wow', color: '#f59e0b' },
    { emoji: '😢', label: 'Sad', color: '#f59e0b' },
    { emoji: '😡', label: 'Angry', color: '#e05820' },
];

function applyReaction(postId, emoji, label, color) {
    const btn = document.getElementById(`like-btn-${postId}`);
    if (!btn) return;
    btn.innerHTML = `<span style="color:${color};font-weight:700;">${emoji} ${label}</span>`;
    btn.style.color = color;
    showToast(`You reacted ${emoji} to this post!`, 'success');
    // hide picker
    const picker = document.getElementById(`rp-${postId}`);
    if (picker) picker.style.display = 'none';
}

function showReactionPicker(postId) {
    const picker = document.getElementById(`rp-${postId}`);
    if (!picker) return;
    picker.style.display = picker.style.display === 'flex' ? 'none' : 'flex';
}

// ── Mini-Chat Panel ───────────────────────────────────────────
let miniChatOpen = false;

function toggleMiniChat() {
    miniChatOpen = !miniChatOpen;
    const panel = document.getElementById('miniChatPanel');
    const badge = document.getElementById('miniChatBadge');
    if (!panel) return;
    panel.style.display = miniChatOpen ? 'block' : 'none';
    if (miniChatOpen) {
        badge.style.display = 'none'; // clear badge when opened
        renderMiniChatList();
    }
}

function renderMiniChatList() {
    const el = document.getElementById('miniChatList');
    if (!el) return;
    el.innerHTML = contactsData.map(c => `
        <a href="messages.html" style="display:flex;align-items:center;gap:10px;padding:10px 14px;text-decoration:none;color:inherit;transition:background 0.15s;"
           onmouseover="this.style.background='#f0f2f5'" onmouseout="this.style.background='transparent'" title="Chat with ${c.name}">
            <div style="position:relative;flex-shrink:0;">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random"
                     style="width:38px;height:38px;border-radius:50%;" alt="${c.name}">
                <span style="position:absolute;bottom:1px;right:1px;width:11px;height:11px;border-radius:50%;border:2px solid white;
                      background:${c.online ? '#42b72a' : '#ccc'};"></span>
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:600;font-size:0.88rem;">${c.name}</div>
                <div style="font-size:0.78rem;color:#65676b;">${c.online ? 'Active now' : 'Offline'}</div>
            </div>
        </a>`).join('');
}

// ── CSS keyframe injection for mini-chat slide-up ─────────────
(function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUpChat {
            from { opacity:0; transform:translateY(10px); }
            to   { opacity:1; transform:translateY(0);    }
        }
        .reaction-picker {
            position:absolute; bottom:38px; left:0;
            display:none; gap:4px; flex-direction:row;
            background:white; border-radius:30px;
            padding:6px 10px;
            box-shadow:0 4px 16px rgba(0,0,0,0.18);
            z-index:100; animation:fadeUpReact 0.2s ease;
        }
        .reaction-picker.dark { background:#3a3b3c; }
        @keyframes fadeUpReact {
            from{opacity:0;transform:translateY(6px)}
            to  {opacity:1;transform:translateY(0)}
        }
        .reaction-emoji {
            font-size:1.5rem; cursor:pointer; padding:2px 4px;
            border-radius:50%; transition:transform 0.15s, background 0.15s;
            position:relative;
        }
        .reaction-emoji:hover { transform:scale(1.4) translateY(-4px); }
        .reaction-emoji .reaction-label {
            position:absolute; bottom:-18px; left:50%; transform:translateX(-50%);
            font-size:0.6rem; white-space:nowrap; color:#555; font-weight:600;
            opacity:0; transition:opacity 0.15s;
        }
        .reaction-emoji:hover .reaction-label { opacity:1; }
    `;
    document.head.appendChild(style);
})();

// ── Patch renderFeed to add reaction pickers on every post ────
const _originalRenderFeed = renderFeed;
// We override buildPostCard logic inside renderFeed instead
// Reaction pickers are appended post-render
function addReactionPickers() {
    document.querySelectorAll('[id^="like-btn-"]').forEach(btn => {
        const postId = btn.id.replace('like-btn-', '');
        const wrap = btn.parentElement;
        if (!wrap || document.getElementById(`rp-${postId}`)) return;
        wrap.style.position = 'relative';
        const picker = document.createElement('div');
        picker.id = `rp-${postId}`;
        picker.className = 'reaction-picker';
        picker.innerHTML = REACTIONS.map(r =>
            `<span class="reaction-emoji" title="${r.label}"
                onclick="applyReaction('${postId}','${r.emoji}','${r.label}','${r.color}')">${r.emoji}<span class="reaction-label">${r.label}</span></span>`
        ).join('');
        wrap.appendChild(picker);

        // Long-press / hover to show picker
        btn.addEventListener('mouseenter', () => { picker.style.display = 'flex'; });
        wrap.addEventListener('mouseleave', () => { picker.style.display = 'none'; });
    });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadSavedProfile();
    renderFeed(postsData);
    renderContacts();
    renderTrending();
    // Add reaction pickers after feed renders
    setTimeout(addReactionPickers, 100);
});

