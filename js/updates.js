// =========================================================================
// UPDATES.JS — Notifications page: list rendering, tabs, mark-read,
// dismiss, date grouping, and realtime delivery (persisted DB inserts +
// instant broadcasts), with toast pop-ups for new arrivals.
// =========================================================================
(async function () {
    const token = localStorage.getItem('unithrift_session_token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // ---- Theme (unchanged behaviour from the previous inline script) ----
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    document.body.className = savedTheme;
    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
        const targetTheme = document.body.className === 'dark-theme' ? 'light-theme' : 'dark-theme';
        document.body.className = targetTheme;
        localStorage.setItem('theme', targetTheme);
    });

    let allNotifications = [];
    let currentFilter = 'all';
    const list = document.getElementById('notifList');
    const unreadBadge = document.getElementById('unreadCount');

    const toastContainer = document.getElementById('toastContainer');
    const confirmModal = document.getElementById('confirmModal');
    const confirmModalTitle = document.getElementById('confirmModalTitle');
    const confirmModalMessage = document.getElementById('confirmModalMessage');
    const confirmModalOk = document.getElementById('confirmModalOk');
    const confirmModalCancel = document.getElementById('confirmModalCancel');

    const ICONS = {
        sale: 'fas fa-tag',
        message: 'fas fa-comment',
        offer: 'fas fa-hand-holding-dollar',
        pickup: 'fas fa-calendar-check',
        system: 'fas fa-gear',
        info: 'fas fa-circle-info'
    };

    function timeAgo(dateStr) {
        const diff = (Date.now() - new Date(dateStr)) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    // Notification text can originate from another user (e.g. a chat message
    // preview), so it must always be escaped before hitting innerHTML.
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = String(str ?? '');
        return div.innerHTML;
    }

    // ======================================
    // TOASTS
    // ======================================
    function showToast(message, type = 'info', duration = 4500, onClick = null) {
        if (!toastContainer) return;
        const icons = { success: 'fa-check', error: 'fa-xmark', warning: 'fa-exclamation', info: 'fa-info' };

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <span class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></span>
            <span class="toast-message"></span>
            <button class="toast-close" aria-label="Dismiss"><i class="fas fa-xmark"></i></button>
        `;
        toast.querySelector('.toast-message').textContent = message;

        const remove = () => {
            if (!toast.isConnected) return;
            toast.classList.add('toast--leaving');
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        };

        let timer = setTimeout(remove, duration);
        toast.addEventListener('mouseenter', () => clearTimeout(timer));
        toast.addEventListener('mouseleave', () => { timer = setTimeout(remove, 1200); });
        toast.querySelector('.toast-close').addEventListener('click', (e) => { e.stopPropagation(); remove(); });

        if (onClick) {
            toast.addEventListener('click', () => { onClick(); remove(); });
        }

        toastContainer.appendChild(toast);
    }

    // ======================================
    // CONFIRMATION MODAL
    // ======================================
    function showConfirm(message, title = 'Are you sure?') {
        if (!confirmModal) return Promise.resolve(window.confirm(message));

        return new Promise(resolve => {
            confirmModalTitle.textContent = title;
            confirmModalMessage.textContent = message;
            confirmModal.classList.add('open');

            const cleanup = (result) => {
                confirmModal.classList.remove('open');
                confirmModalOk.removeEventListener('click', onOk);
                confirmModalCancel.removeEventListener('click', onCancel);
                confirmModal.removeEventListener('click', onOverlay);
                document.removeEventListener('keydown', onKeydown);
                resolve(result);
            };

            const onOk = () => cleanup(true);
            const onCancel = () => cleanup(false);
            const onOverlay = (e) => { if (e.target === confirmModal) cleanup(false); };
            const onKeydown = (e) => { if (e.key === 'Escape') cleanup(false); };

            confirmModalOk.addEventListener('click', onOk);
            confirmModalCancel.addEventListener('click', onCancel);
            confirmModal.addEventListener('click', onOverlay);
            document.addEventListener('keydown', onKeydown);
        });
    }

    // ======================================
    // DATE GROUPING
    // ======================================
    function groupLabelFor(dateStr) {
        const d = new Date(dateStr);
        const now = new Date();
        const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const dayDiff = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);

        if (dayDiff <= 0) return 'Today';
        if (dayDiff === 1) return 'Yesterday';
        if (dayDiff < 7) return 'Earlier this week';
        return 'Earlier';
    }

    function renderCard(n) {
        const type = n.type || 'info';
        const icon = ICONS[type] || ICONS.info;
        return `
        <div class="notif-card ${n.read ? 'read' : 'unread'}" data-id="${n.id}" data-type="${type}" data-ref="${n.reference_id || ''}">
            <div class="notif-icon ${type}"><i class="${icon}"></i></div>
            <div class="notif-body">
                <p>${escapeHtml(n.message)}</p>
                <span class="notif-time">${timeAgo(n.created_at)}</span>
            </div>
            ${!n.read ? '<div class="notif-unread-dot"></div>' : ''}
            <button class="notif-dismiss-btn" data-id="${n.id}" aria-label="Dismiss notification" title="Dismiss">
                <i class="fas fa-xmark"></i>
            </button>
        </div>`;
    }

    function renderList() {
        const filtered = currentFilter === 'all'
            ? allNotifications
            : allNotifications.filter(n => n.type === currentFilter);

        if (!filtered.length) {
            list.innerHTML = `<div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <p>No ${currentFilter === 'all' ? '' : currentFilter + ' '}notifications yet.</p>
            </div>`;
            return;
        }

        // Group into Today / Yesterday / Earlier this week / Earlier, in that
        // order, without reordering notifications within each group (they
        // already arrive newest-first from the API / realtime inserts).
        const groups = new Map();
        filtered.forEach(n => {
            const label = groupLabelFor(n.created_at);
            if (!groups.has(label)) groups.set(label, []);
            groups.get(label).push(n);
        });

        const order = ['Today', 'Yesterday', 'Earlier this week', 'Earlier'];
        list.innerHTML = order
            .filter(label => groups.has(label))
            .map(label => `
                <div class="notif-group-label">${label}</div>
                ${groups.get(label).map(renderCard).join('')}
            `).join('');

        list.querySelectorAll('.notif-card').forEach(card => {
            card.addEventListener('click', async () => {
                const id = card.getAttribute('data-id');
                const ref = card.getAttribute('data-ref');
                const type = card.getAttribute('data-type');

                if (card.classList.contains('unread')) {
                    if (id !== 'live-broadcast') {
                        await authFetch(`/api/notifications/${id}/read`, { method: 'POST' });
                    }
                    card.classList.remove('unread');
                    card.classList.add('read');
                    card.querySelector('.notif-unread-dot')?.remove();
                    const n = allNotifications.find(x => x.id === id);
                    if (n) n.read = true;
                    updateBadge();
                }

                // For messages — and for offers/pickup proposals, which are
                // also sent as chat messages — reference_id is the chat room id
                // (set server-side in createNotification and in the live
                // broadcast payload below), NOT the sender's user id or a
                // product id, so this always lands on the right room.
                if ((type === 'message' || type === 'offer' || type === 'pickup') && ref) window.location.href = `/chat?room=${ref}`;
                else if (type === 'sale' && ref) window.location.href = `/product?id=${ref}`;
            });
        });

        list.querySelectorAll('.notif-dismiss-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');

                const ok = await showConfirm('Remove this notification? This cannot be undone.', 'Dismiss notification?');
                if (!ok) return;

                try {
                    await authFetch(`/api/notifications/${id}`, { method: 'DELETE' });
                    allNotifications = allNotifications.filter(n => n.id !== id);
                    renderList();
                    updateBadge();
                } catch (err) {
                    showToast('Could not dismiss that notification. Please try again.', 'error');
                }
            });
        });
    }

    function updateBadge() {
        const count = allNotifications.filter(n => !n.read).length;
        if (count > 0) {
            unreadBadge.textContent = count > 99 ? '99+' : count;
            unreadBadge.style.display = 'inline-block';
        } else {
            unreadBadge.style.display = 'none';
        }
    }

    async function loadNotifications() {
        try {
            const res = await authFetch('/api/notifications');
            if (res.status === 401) {
                // auth-fetch.js has already cleared localStorage and queued a
                // redirect to the login page for us — don't fire any more
                // requests (they'd just race that redirect and show a
                // confusing "No token provided" flash from an empty token).
                return { ok: false, loggedOut: true };
            }
            const result = await res.json();
            if (!result.success) throw new Error(result.message);
            allNotifications = result.notifications || [];
            renderList();
            updateBadge();
            return { ok: true };
        } catch (err) {
            list.innerHTML = `<div class="empty-state"><i class="fas fa-triangle-exclamation"></i><p>${escapeHtml(err.message)}</p></div>`;
            return { ok: false, loggedOut: false };
        }
    }

    document.getElementById('markAllReadBtn')?.addEventListener('click', async () => {
        await authFetch('/api/notifications/read-all', { method: 'POST' });
        allNotifications.forEach(n => { n.read = true; });
        renderList();
        updateBadge();
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderList();
        });
    });

    // Validate the session with a single call before doing anything else.
    // Everything below (realtime wiring, the profile lookup) depends on this
    // session being good, so if it's dead we stop here instead of firing more
    // requests that would just race the redirect auth-fetch.js already queued.
    const initialLoad = await loadNotifications();
    if (!initialLoad.ok) return;

    // Pops a toast for a newly-arrived realtime notification, routing the
    // click the same way the card itself would.
    function announceIncoming(n) {
        const type = n.type || 'info';
        showToast(n.message, 'info', 6000, () => {
            if ((type === 'message' || type === 'offer' || type === 'pickup') && n.reference_id) {
                window.location.href = `/chat?room=${n.reference_id}`;
            } else if (type === 'sale' && n.reference_id) {
                window.location.href = `/product?id=${n.reference_id}`;
            }
        });
    }

    // ---- Realtime wiring ----
    // Two complementary channels:
    // 1. postgres_changes on `notifications` — catches every persisted
    //    notification (message previews, verification updates, etc).
    // 2. a `notifications:<userId>` broadcast channel — an instant "someone
    //    just messaged you" ping so it appears without waiting on DB replication.
    if (typeof supabase === 'undefined') return;

    const SUPABASE_URL = window.__SUPABASE_URL__ || '';
    const SUPABASE_KEY = window.__SUPABASE_ANON__ || '';
    if (!SUPABASE_URL || !SUPABASE_KEY) return;

    const { createClient } = supabase;
    // This client is only used to authorize Realtime channels — it never
    // needs to manage its own auth session or redeem refresh tokens.
    // Using auth.setSession() here would pull in GoTrue's background
    // auto-refresh cycle, which can independently (and redundantly) try
    // to redeem the same refresh token the rest of the app is already
    // managing, racing against it and logging spurious
    // "Already Used" errors. realtime.setAuth() just sets the JWT used
    // to authorize the socket/channels, with no session machinery attached.
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
    // The session was just proven valid by loadNotifications() above, so
    // read whatever token is current now (it may have just been rotated).
    sb.realtime.setAuth(localStorage.getItem('unithrift_session_token') || token);

    let userId = null;
    try {
        const profileRes = await authFetch('/api/profile');
        if (profileRes.status === 401) return; // session died between the two calls; bail
        const profileData = await profileRes.json();
        if (profileData.success) userId = profileData.profile?.id;
    } catch (err) {
        console.error('Failed to fetch session identity for realtime wiring:', err);
    }
    if (!userId) return;

    // authFetch above may have rotated the access token again — re-apply
    // whatever is now current before opening the realtime channels.
    const currentToken = localStorage.getItem('unithrift_session_token');
    if (currentToken) sb.realtime.setAuth(currentToken);

    sb.channel('notifications')
        .on('postgres_changes', {
            event: 'INSERT', schema: 'public', table: 'notifications',
            filter: `user_id=eq.${userId}`
        }, payload => {
            // Avoid double-inserting if the broadcast below already added
            // a synthetic card for the same event.
            if (allNotifications.some(n => n.id === payload.new.id)) return;
            allNotifications.unshift(payload.new);
            renderList();
            updateBadge();
            announceIncoming(payload.new);
        })
        .subscribe();

    sb.channel(`notifications:${userId}`)
        .on('broadcast', { event: 'new_msg_alert' }, (payload) => {
            const { msg, senderName, roomId } = payload.payload || {};
            const n = {
                id: `live-${Date.now()}`,
                type: 'message',
                message: `New message from ${senderName || 'a student'}: "${msg || ''}"`,
                read: false,
                reference_id: roomId || '',
                created_at: new Date().toISOString()
            };
            allNotifications.unshift(n);
            renderList();
            updateBadge();
            announceIncoming(n);
        })
        .subscribe();
})();