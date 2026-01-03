// --- Yutuqlar (achievements) ---
function getAchievements() {
  const questions = parseInt(localStorage.getItem('animeai_profile_questions') || '0', 10);
  const animeCounts = JSON.parse(localStorage.getItem('animeai_stats_anime') || '{}');
  const uniqueAnime = Object.keys(animeCounts).length;
  const achievements = [];
  if (questions >= 1) achievements.push('🎉 Birinchi savol!');
  if (questions >= 10) achievements.push('🔟 10 ta savol yubordi');
  if (questions >= 50) achievements.push('🏅 50+ savol yubordi');
  if (uniqueAnime >= 5) achievements.push('🌟 5+ turli anime haqida so‘radi');
  if (uniqueAnime >= 10) achievements.push('🌠 10+ turli anime haqida so‘radi');
  // Yana yutuqlar qo‘shish mumkin
  return achievements;
}

function updateAchievementsUI() {
  const list = document.getElementById('profile-achievements-list');
  if (!list) return;
  const achs = getAchievements();
  list.innerHTML = '';
  if (achs.length === 0) {
    list.innerHTML = '<li>Hali yutuq yo‘q</li>';
  } else {
    achs.forEach(a => {
      const li = document.createElement('li');
      li.textContent = a;
      list.appendChild(li);
    });
  }
}

function updateProfileModalAll() {
  updateProfileModal();
  updateProfileStats && updateProfileStats();
  updateAchievementsUI();
}
// Profilni tozalash yoki qayta tiklash
function resetProfile() {
  localStorage.removeItem('animeai_profile_name');
  localStorage.removeItem('animeai_profile_avatar');
  localStorage.removeItem('animeai_profile_questions');
  localStorage.removeItem('animeai_stats_anime');
  localStorage.removeItem('animeai_stats_genre');
  localStorage.removeItem('animeai_last_active');
  loadProfile();
  updateProfileStats && updateProfileStats();
  updateProfileModal && updateProfileModal();
  updateProfileModalAll && updateProfileModalAll();
}

document.addEventListener('DOMContentLoaded', function() {
  const resetBtn = document.getElementById('profile-reset-btn');
  if (resetBtn) {
    resetBtn.onclick = function() {
      if (confirm('Barcha profil va statistika maʼlumotlari o‘chiriladi. Davom etasizmi?')) {
        resetProfile();
      }
    };
  }
});
// Avatarni o'zgartirish (fayl yoki URL)
function setProfileAvatar(url) {
  localStorage.setItem('animeai_profile_avatar', url);
  // Barcha avatarlarni yangilash
  const avatarEls = [
    document.getElementById('profile-fab-img'),
    document.getElementById('profile-modal-avatar'),
    document.getElementById('profile-avatar-img')
  ];
  avatarEls.forEach(el => { if (el) el.src = url; });
}

document.addEventListener('DOMContentLoaded', function() {
  // Avatarni URL orqali o'zgartirish
  const editAvatarUrlBtn = document.getElementById('edit-avatar-url');
  if (editAvatarUrlBtn) {
    editAvatarUrlBtn.onclick = function() {
      const url = prompt("Avatar uchun rasm URL kiriting:", "");
      if (url && url.startsWith('http')) {
        setProfileAvatar(url);
      }
    };
  }
  // Avatarni fayl orqali o'zgartirish
  const editAvatarFile = document.getElementById('edit-avatar-file');
  if (editAvatarFile) {
    editAvatarFile.onchange = function(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          setProfileAvatar(ev.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  }
});
// Profil floating button va modal logikasi
function updateProfileModal() {
  const name = localStorage.getItem('animeai_profile_name') || 'Foydalanuvchi';
  const avatar = localStorage.getItem('animeai_profile_avatar') || AVATAR_USER;
  const questions = parseInt(localStorage.getItem('animeai_profile_questions') || '0', 10);
  const nameEl = document.getElementById('profile-modal-name');
  const avatarEl = document.getElementById('profile-modal-avatar');
  const questionsEl = document.getElementById('profile-modal-questions');
  if (nameEl) nameEl.textContent = name;
  if (avatarEl) avatarEl.src = avatar;
  if (questionsEl) questionsEl.textContent = questions;
}

document.addEventListener('DOMContentLoaded', function() {
  // Floating button modal ochish
  const fab = document.getElementById('profile-fab');
  const modal = document.getElementById('profile-modal');
  const closeBtn = document.getElementById('profile-modal-close');
  if (fab && modal) {
    fab.onclick = function() {
      updateProfileModal();
      modal.style.display = 'flex';
    };
  }
  if (closeBtn && modal) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  // Modalda ismni o'zgartirish
  const editModalBtn = document.getElementById('edit-profile-modal-name');
  if (editModalBtn) {
    editModalBtn.onclick = function() {
      const nameEl = document.getElementById('profile-modal-name');
      const newName = prompt("Ismingizni kiriting:", nameEl ? nameEl.textContent : '');
      if (newName && newName.trim().length > 0) {
        localStorage.setItem('animeai_profile_name', newName.trim());
        updateProfileModal();
        loadProfile();
      }
    };
  }
  // Modal ochiq paytda tashqariga bosilsa yopiladi
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
  // Profil avatarini ham yangilash (agar kerak bo'lsa)
  const fabImg = document.getElementById('profile-fab-img');
  const avatar = localStorage.getItem('animeai_profile_avatar') || AVATAR_USER;
  if (fabImg) fabImg.src = avatar;
});
// --- Profil va statistika ---
function loadProfile() {
  const name = localStorage.getItem('animeai_profile_name') || 'Foydalanuvchi';
  const avatar = localStorage.getItem('animeai_profile_avatar') || AVATAR_USER;
  const questions = parseInt(localStorage.getItem('animeai_profile_questions') || '0', 10);
  const nameEl = document.getElementById('profile-name');
  const avatarEl = document.getElementById('profile-avatar-img');
  const questionsEl = document.getElementById('profile-questions');
  if (nameEl) nameEl.textContent = name;
  if (avatarEl) avatarEl.src = avatar;
  if (questionsEl) questionsEl.textContent = questions;
}

function saveProfileName(newName) {
  localStorage.setItem('animeai_profile_name', newName);
  loadProfile();
}

function incrementProfileQuestions() {
  let q = parseInt(localStorage.getItem('animeai_profile_questions') || '0', 10);
  q++;
  localStorage.setItem('animeai_profile_questions', q);
  loadProfile();
}

document.addEventListener('DOMContentLoaded', function() {
  loadProfile();
  const editBtn = document.getElementById('edit-profile-name');
  if (editBtn) {
    editBtn.onclick = function() {
      const nameEl = document.getElementById('profile-name');
      const newName = prompt("Ismingizni kiriting:", nameEl ? nameEl.textContent : '');
      if (newName && newName.trim().length > 0) {
        saveProfileName(newName.trim());
      }
    };
  }
});
// Burger menyu va sidebar uchun mobil funksionallik
document.addEventListener('DOMContentLoaded', function () {
  const burger = document.getElementById('burger-menu');
  const sidebar = document.getElementById('sidebar');
  if (burger && sidebar) {
    burger.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      // Burger tugmasini yashirish/ko'rsatish
      if (sidebar.classList.contains('open')) {
        burger.style.opacity = '0';
        burger.style.pointerEvents = 'none';
      } else {
        burger.style.opacity = '1';
        burger.style.pointerEvents = 'auto';
      }
    });
    // Sidebar ochiq bo'lsa, tashqariga bosilganda yopiladi
    document.addEventListener('click', function (e) {
      if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== burger
      ) {
        sidebar.classList.remove('open');
        burger.style.opacity = '1';
        burger.style.pointerEvents = 'auto';
      }
    });
  }
});
/**
 * Anime Recommendation Engine
 * @param {Object[]} animeList - Array of anime objects (from anime-data.json)
 * @param {Object} options
 *   - genre: (string) genre to filter by (optional)
 *   - lastWatched: (string) anime name for similarity (optional)
 *   - exclude: (string[]) anime names to avoid recommending (optional)
 *   - count: (number) number of recommendations (default 5)
 * @returns {Object[]} Array of recommended anime objects
 */
function getRecommendations(animeList, options = {}) {
  const {
    genre = null,
    lastWatched = null,
    exclude = [],
    count = 5
  } = options;

  // Helper: get genres for a given anime name
  function getGenresByName(name) {
    const found = animeList.find(a => a.name.toLowerCase() === name.toLowerCase());
    return found ? found.genres || found.genre || [] : [];
  }

  // Helper: scoring function
  function score(anime) {
    let s = 0;
    // Genre match
    if (genre && anime.genres.map(g => g.toLowerCase()).includes(genre.toLowerCase())) s += 5;
    // Similarity to last watched
    if (lastWatched) {
      const lastGenres = getGenresByName(lastWatched);
      const common = anime.genres.filter(g => lastGenres.includes(g));
      s += common.length * 2;
    }
    // Popularity (normalized)
    s += (anime.popularity || 0);
    // Rating (normalized, assume 0-10)
    s += (anime.rating || 0) * 2;
    return s;
  }

  // Exclude already recommended or watched anime
  const excludeSet = new Set((exclude || []).map(n => n.toLowerCase()));
  if (lastWatched) excludeSet.add(lastWatched.toLowerCase());

  // Filter and score
  let candidates = animeList.filter(a => !excludeSet.has(a.name.toLowerCase()));
  if (genre) {
    candidates = candidates.filter(a => a.genres.map(g => g.toLowerCase()).includes(genre.toLowerCase()));
    if (candidates.length === 0) candidates = animeList.filter(a => !excludeSet.has(a.name.toLowerCase()));
  }

  // Score and sort
  candidates = candidates
    .map(a => ({ anime: a, score: score(a) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(obj => obj.anime);

  return candidates;
}
// --- Anime AI Chatbot Frontend Only ---
// Author: KIwei AI
// Description: Anime expert AI chatbot (Uzbek) with localStorage memory
// Helper: get most frequent item from array
function getMostFrequent(arr) {
  if (!arr.length) return '-';
  const freq = {};
  let max = 0, result = '-';
  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
    if (freq[item] > max) {
      max = freq[item];
      result = item;
    }
  }
  return result;
}

// Update profile stats UI (including most asked anime/genre, last active)
function updateProfileStats() {
  const stats = JSON.parse(localStorage.getItem('profileStats') || '{}');
  // Umumiy savollar
  document.getElementById('profile-modal-total-questions').textContent = stats.totalQuestions || 0;
  // Eng ko'p so'ralgan anime
  document.getElementById('profile-modal-most-anime').textContent = getMostFrequent(stats.animeAsked || []);
  // Eng ko'p so'ralgan janr
  document.getElementById('profile-modal-most-genre').textContent = getMostFrequent(stats.genreAsked || []);
  // Oxirgi faol vaqt
  document.getElementById('profile-modal-last-active').textContent = stats.lastActive ? new Date(stats.lastActive).toLocaleString() : '-';
}

// Call this after every user message
function updateStatsOnUserMessage(message) {
  let stats = JSON.parse(localStorage.getItem('profileStats') || '{}');
  stats.totalQuestions = (stats.totalQuestions || 0) + 1;
  // Simple anime/janr extraction (customize as needed)
  const animeList = (window.animeData || []).map(a => (a.name || '').toLowerCase());
  // Support both 'genre' and 'genres' fields
  const genreList = (window.animeData || []).flatMap(a => (a.genre || a.genres || []).map(g => g.toLowerCase()));
  const msg = message.toLowerCase();
  if (!stats.animeAsked) stats.animeAsked = [];
  if (!stats.genreAsked) stats.genreAsked = [];
  for (const anime of animeList) {
    if (anime && msg.includes(anime)) stats.animeAsked.push(anime);
  }
  for (const genre of genreList) {
    if (genre && msg.includes(genre)) stats.genreAsked.push(genre);
  }
  stats.lastActive = Date.now();
  localStorage.setItem('profileStats', JSON.stringify(stats));
  updateProfileStats();
}

// --- Add message to chat ---
function addMessage(sender, text, save = true) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ' + sender;
  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  if (sender === 'ai') {
    avatar.src = AVATAR_AI;
  } else {
    avatar.src = localStorage.getItem('animeai_profile_avatar') || AVATAR_USER;
  }
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + sender;
  // Link, image, video aniqlash va chiqarish
  const urlRegex = /(https?:\/\/[\w\-\.\/\?#=&%]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov|avi|mkv|svg|bmp|gif|pdf|html|htm)|https?:\/\/[\w\-\.\/\?#=&%]+)/gi;
  let parts = text.split(urlRegex);
  parts = parts.map(part => {
    if (!part) return '';
    if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(part)) {
      return `<img src="${part}" alt="rasm" style="max-width:220px;max-height:160px;display:block;margin:6px 0;">`;
    } else if (/^https?:\/\/.+\.(mp4|webm|mov|avi|mkv)$/i.test(part)) {
      return `<video src="${part}" controls style="max-width:220px;max-height:160px;display:block;margin:6px 0;"></video>`;
    } else if (/^https?:\/\//i.test(part)) {
      return `<a href="${part}" target="_blank" rel="noopener">${part}</a>`;
    } else {
      // Faqat user uchun escape
      if (sender === 'ai') return part;
      return part.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  });
  bubble.innerHTML = parts.join('');
  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatArea.appendChild(msgDiv);
  if (save) {
    const history = getCurrentHistory();
    history.push({ sender, text });
    saveCurrentHistory(history);
    renderSidebarHistories();
    // Foydalanuvchi savollar sonini oshirish
    if (sender === 'user') incrementProfileQuestions();
    // Statistikani yangilash (profil statistikasi uchun)
    if (sender === 'user') updateStatsOnUserMessage(text);
  }
  scrollToBottom();
}


const chatArea = document.getElementById('chat-area');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
// Sidebar elements
const sidebar = document.getElementById('sidebar');
const historyList = document.getElementById('history-list');
const newChatBtn = document.getElementById('new-chat');
const sidebarExportBtn = document.getElementById('sidebar-export');
const sidebarImportBtn = document.getElementById('sidebar-import');
const sidebarImportFile = document.getElementById('sidebar-import-file');
const sidebarUsernameInput = document.getElementById('sidebar-username');
const sidebarSaveUsernameBtn = document.getElementById('sidebar-save-username');
// Old header elements (for backward compatibility)
const usernameInput = document.getElementById('username-input');
const saveUsernameBtn = document.getElementById('save-username');
const exportBtn = document.getElementById('export-history');
const importBtn = document.getElementById('import-history');
const importFile = document.getElementById('import-file');
const AVATAR_AI = 'https://upload.wikimedia.org/wikipedia/commons/b/b9/AI_logo_by_United_Blasters.png';
const AVATAR_USER = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Font_Awesome_5_solid_user-circle.svg/1982px-Font_Awesome_5_solid_user-circle.svg.png';
let animeData = [];

// --- Load anime data ---
fetch('anime-data.json')
  .then(res => res.json())
  .then(data => { animeData = data.anime; })
  .catch(() => { animeData = []; });


// --- Chat memory (multi-history) ---
function getAllHistories() {
  return JSON.parse(localStorage.getItem('animeai_histories') || '[]');
}
function saveAllHistories(histories) {
  localStorage.setItem('animeai_histories', JSON.stringify(histories));
}
function getCurrentHistoryIndex() {
  return parseInt(localStorage.getItem('animeai_current_history') || '0', 10);
}
function setCurrentHistoryIndex(idx) {
  localStorage.setItem('animeai_current_history', idx);
}
function getCurrentHistory() {
  const histories = getAllHistories();
  const idx = getCurrentHistoryIndex();
  return histories[idx] || [];
}
function saveCurrentHistory(history) {
  const histories = getAllHistories();
  const idx = getCurrentHistoryIndex();
  histories[idx] = history;
  saveAllHistories(histories);
}
function addNewHistory() {
  const histories = getAllHistories();
  histories.push([]);
  saveAllHistories(histories);
  setCurrentHistoryIndex(histories.length - 1);
}
function deleteHistory(idx) {
  let histories = getAllHistories();
  histories.splice(idx, 1);
  if (histories.length === 0) histories = [[]];
  saveAllHistories(histories);
  setCurrentHistoryIndex(0);
}
function saveUsername(name) {
  localStorage.setItem('animeai_username', name);
}
function loadUsername() {
  return localStorage.getItem('animeai_username') || '';
}


// --- Render chat ---
function renderChat(history) {
  chatArea.innerHTML = '';
  history.forEach(msg => addMessage(msg.sender, msg.text, false));
  scrollToBottom();
}

// --- Render sidebar histories ---
function renderSidebarHistories() {
  const histories = getAllHistories();
  const idx = getCurrentHistoryIndex();
  historyList.innerHTML = '';
  histories.forEach((h, i) => {
    const li = document.createElement('li');
    li.textContent = h.length && h[0] ? (h[0].text.slice(0, 18) + (h[0].text.length > 18 ? '...' : '')) : 'Yangi chat';
    if (i === idx) li.classList.add('active');
    li.onclick = () => {
      setCurrentHistoryIndex(i);
      renderChat(getCurrentHistory());
      renderSidebarHistories();
    };
    // Right-click to delete
    li.oncontextmenu = (e) => {
      e.preventDefault();
      if (confirm('Ushbu chat tarixini o‘chirasizmi?')) {
        deleteHistory(i);
        renderChat(getCurrentHistory());
        renderSidebarHistories();
      }
    };
    historyList.appendChild(li);
  });
}


// --- Add message to chat ---
function addMessage(sender, text, save = true) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ' + sender;
  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  if (sender === 'ai') {
    avatar.src = AVATAR_AI;
  } else {
    avatar.src = localStorage.getItem('animeai_profile_avatar') || AVATAR_USER;
  }
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + sender;
  // Link, image, video aniqlash va chiqarish
  const urlRegex = /(https?:\/\/[\w\-\.\/?#=&%]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov|avi|mkv|svg|bmp|gif|pdf|html|htm)|https?:\/\/[\w\-\.\/?#=&%]+)/gi;
  let parts = text.split(urlRegex);
  parts = parts.map(part => {
    if (!part) return '';
    if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(part)) {
      return `<img src="${part}" alt="rasm" style="max-width:220px;max-height:160px;display:block;margin:6px 0;">`;
    } else if (/^https?:\/\/.+\.(mp4|webm|mov|avi|mkv)$/i.test(part)) {
      return `<video src="${part}" controls style="max-width:220px;max-height:160px;display:block;margin:6px 0;"></video>`;
    } else if (/^https?:\/\//i.test(part)) {
      return `<a href="${part}" target="_blank" rel="noopener">${part}</a>`;
    } else {
      // Faqat user uchun escape
      if (sender === 'ai') return part;
      return part.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  });
  bubble.innerHTML = parts.join('');
  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatArea.appendChild(msgDiv);
  if (save) {
    const history = getCurrentHistory();
    history.push({ sender, text });
    saveCurrentHistory(history);
    renderSidebarHistories();
    // Foydalanuvchi savollar sonini oshirish
    if (sender === 'user') incrementProfileQuestions();
  }
  scrollToBottom();
}

function scrollToBottom() {
  setTimeout(() => {
    chatArea.scrollTop = chatArea.scrollHeight;
  }, 80);
}


// --- AI Logic ---
function aiReply(userMsg, history) {
  const msg = userMsg.trim().toLowerCase();
  const username = loadUsername();
  // So'z-javoblar bazasi
  const customAnswers = {
    "otaku": "Otaku — anime va manga ishqibozi uchun ishlatiladigan soʻz!",
    "manga nima": "Manga — Yaponiyada yaratilgan komiks va grafik romanlar. Ko‘plab animelar manga asosida yaratiladi.",
    "anime nima": "Anime — Yaponiyada yaratilgan animatsion filmlar va seriallar. Ular o‘ziga xos uslub va syujetlarga ega.",
    "seiyuu": "Seiyuu — yapon tilida ovoz aktyori, ya'ni anime va boshqa animatsion asarlarda qahramonlarga ovoz beruvchi aktyor yoki aktrisa.",
    "ova": "OVA (Original Video Animation) — to‘g‘ridan-to‘g‘ri video uchun chiqarilgan maxsus anime epizodlari yoki qisqa filmlar.",
    "shounen": "Shounen — yosh o‘g‘il bolalar uchun mo‘ljallangan anime va manga janri. Ko‘pincha sarguzasht va do‘stlik mavzulari bo‘ladi.",
    "shojo": "Shojo — yosh qizlar uchun mo‘ljallangan anime va manga janri. Ko‘proq romantika va his-tuyg‘ular aks etadi.",
    "isekai": "Isekai — boshqacha dunyoga tushib qolish haqidagi anime va manga janri. Qahramonlar real dunyodan fantastik dunyoga o‘tadi.",
   "kaklik": "Kaklik — bu anime va manga olamida ko‘pincha qo‘llaniladigan hazil yoki kulgili vaziyatlarni ifodalash uchun ishlatiladigan so‘z.",
    // Yangi so'z va javoblarni shu yerga qo'shishingiz mumkin
  };
  // Custom javoblar tekshiruvi
  for (const key in customAnswers) {
    if (msg.includes(key)) {
      return customAnswers[key];
    }
  }
  // Greetings
  if (/^(salom|assalomu|hello|hi|yo|konichiwa)/i.test(msg)) {
    return random([
      `Salom${username ? ', ' + username : ''}!Men sizning Kiwei AI do‘stingizman. Bu yerda anime faqat ko‘rilmaydi — bu yerda u his qilinadi. Qaysi anime hozir kayfiyatingizga mos keladi? Nomini yozing, birga ko‘rib chiqamiz 😉?`,
      `Assalomu alaykum${username ? ', ' + username : ''}! 🔥 Yo, siz ham anime olamiga oshiqsizmi? Demak to‘g‘ri joydasiz. Men Kiwei AI’man — qahramonlar, syujetlar, studiyalar va faktlar bilan yashayman. Hozir qaysi anime xayolingizda? Yoki tavsiya kerakmi??`,
      `Hi${username ? ', ' + username : ''}! Kiwei AI tizimi faol. Men sizga anime tanlashda, tushunishda va yangi kashfiyotlarda yordam beraman. Xohlasangiz aniq anime nomini yozing, yoki “tavsiya ber” deb yozing — suhbatni boshlaymiz.?`
    ]);
  }
  // Popular anime
  if (/eng mashhur|top|populyar|mashxur/.test(msg)) {
    const tops = animeData.slice().sort((a,b)=>b.popularity-a.popularity).slice(0,5);
    return 'Eng mashhur animelar:\n' + tops.map(a=>`• ${a.name}`).join('\n');
  }
  // Anime search by name (with images)
  const nameMatch = msg.match(/([a-zA-Z0-9' ]+) haqida( ayt| so'zlab ber|)/);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    const found = animeData.find(a => a.name.toLowerCase() === name.toLowerCase());
    const formatAnimeInfo = (anime) => {
      let info = `<b>${anime.name}</b><br>`;
      info += `<i>${anime.desc}</i><br>`;
      if (anime.genre) info += `<b>Janr:</b> ${anime.genre.join(', ')}<br>`;
      if (anime.popularity) info += `<b>Mashhurlik:</b> ${anime.popularity}/10<br>`;
      if (anime.year) info += `<b>Ishlab chiqarilgan yil:</b> ${anime.year}<br>`;
      if (anime.facts && Array.isArray(anime.facts) && anime.facts.length) {
        info += `<b>Faktlar:</b> ${anime.facts.join(' | ')}<br>`;
      }
      if (anime.images && Array.isArray(anime.images) && anime.images.length) {
        info += anime.images.slice(0,3).map(url => `<img src="${url}" alt="${anime.name}" style="max-width:120px;max-height:90px;margin:4px;border-radius:6px;">`).join('');
      }
      return info;
    };
    if (found) {
      return formatAnimeInfo(found);
    }
    // Fuzzy search
    const fuzzy = animeData.find(a => a.name.toLowerCase().includes(name.toLowerCase()));
    if (fuzzy) {
      return formatAnimeInfo(fuzzy);
    }
    return 'Kechirasiz, bu anime haqida maʼlumot topilmadi.';
  }
  // Genre recommendation
  const genreMatch = msg.match(/([a-zA-Z]+) anime tavsiya qil/);
  if (genreMatch) {
    const genre = genreMatch[1].toLowerCase();
    const found = animeData.filter(a => a.genre.some(g => g.toLowerCase().includes(genre)));
    if (found.length)
      return `${capitalize(genre)} janridagi tavsiya: \n` + found.slice(0,3).map(a=>`• ${a.name}`).join('\n');
    return 'Kechirasiz, bu janrda anime topilmadi.';
  }
  // Anime search (short)
  if (/anime (qidir|izla|top)/.test(msg)) {
    const q = msg.replace(/.*anime (qidir|izla|top)/,'').trim();
    if (!q) return 'Qaysi anime qidiryapsiz?';
    const found = animeData.filter(a => a.name.toLowerCase().includes(q));
    if (found.length)
      return 'Natijalar:\n' + found.map(a=>`• ${a.name}`).join('\n');
    return 'Hech narsa topilmadi.';
  }
  // Recommendation
  if (/anime tavsiya|rekomendatsiya|recommend/.test(msg)) {
    const recs = animeData.slice().sort(()=>0.5-Math.random()).slice(0,3);
    return 'Sizga quyidagi animelar yoqishi mumkin:\n' + recs.map(a=>`• ${a.name}`).join('\n');
  }
  // Contextual fallback (use last user message)
  if (history && history.length > 1) {
    const prev = history.filter(m=>m.sender==='user').slice(-2,-1)[0];
    if (prev) {
      if (/anime/.test(prev.text.toLowerCase()))
        return 'Anime haqida yana savolingiz bormi?';
    }
  }
  // Fallback
  return random([
    `Kechirasiz${username ? ', ' + username : ''}, bu savolga javob bera olmadim. Yana soʻrashingiz mumkin.`,
    `Aniq javob topa olmadim${username ? ', ' + username : ''}. Boshqa savol bormi?`,
    `Qiziqarli savol! Biroq, aniq javob bera olmayman${username ? ', ' + username : ''}.`
  ]);
}

function random(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// --- Handle form submit ---

function handleChatFormSubmit(e) {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  addMessage('user', text);
  userInput.value = '';
  userInput.focus();
  setTimeout(() => {
    const history = getCurrentHistory();
    const aiText = aiReply(text, history);
    addMessage('ai', aiText);
  }, 500 + Math.random()*400);
}

let chatFormSubmitAttached = false;
function attachChatFormSubmit() {
  if (!chatFormSubmitAttached) {
    chatForm.addEventListener('submit', handleChatFormSubmit);
    chatFormSubmitAttached = true;
  }
}
window.addEventListener('animeDataLoaded', function() {
  attachChatFormSubmit();
});
// Fallback: agar 2 sekundda animeData yuklanmasa ham chat ishlasin
setTimeout(() => {
  attachChatFormSubmit();
}, 2000);

// --- Username logic (header and sidebar) ---
function setUsernameInputFields(name) {
  if (usernameInput) usernameInput.value = name;
  if (sidebarUsernameInput) sidebarUsernameInput.value = name;
}
function handleUsernameSave(name) {
  saveUsername(name);
  setUsernameInputFields(name);
  addMessage('ai', name ? `Ismingiz saqlandi: ${name}` : 'Ismingiz o‘chirildi.');
}
if (saveUsernameBtn && usernameInput) {
  saveUsernameBtn.addEventListener('click', function() {
    handleUsernameSave(usernameInput.value.trim());
  });
  usernameInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') saveUsernameBtn.click();
  });
}
if (sidebarSaveUsernameBtn && sidebarUsernameInput) {
  sidebarSaveUsernameBtn.addEventListener('click', function() {
    handleUsernameSave(sidebarUsernameInput.value.trim());
  });
  sidebarUsernameInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sidebarSaveUsernameBtn.click();
  });
}

// --- Export chat history (header and sidebar) ---
function exportCurrentHistory() {
  const history = getCurrentHistory();
  const blob = new Blob([JSON.stringify(history, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'animeai_chat_history.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
if (exportBtn) exportBtn.addEventListener('click', exportCurrentHistory);
if (sidebarExportBtn) sidebarExportBtn.addEventListener('click', exportCurrentHistory);

// --- Import chat history (header and sidebar) ---
function importHistoryFromFile(fileInput) {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      if (Array.isArray(data)) {
        saveCurrentHistory(data);
        renderChat(data);
        renderSidebarHistories();
        addMessage('ai', 'Tarix muvaffaqiyatli yuklandi!');
      } else {
        addMessage('ai', 'Fayl formati noto‘g‘ri.');
      }
    } catch {
      addMessage('ai', 'Faylni o‘qishda xatolik.');
    }
  };
  reader.readAsText(file);
  fileInput.value = '';
}
if (importBtn && importFile) {
  importBtn.addEventListener('click', function() { importFile.click(); });
  importFile.addEventListener('change', function() { importHistoryFromFile(importFile); });
}
if (sidebarImportBtn && sidebarImportFile) {
  sidebarImportBtn.addEventListener('click', function() { sidebarImportFile.click(); });
  sidebarImportFile.addEventListener('change', function() { importHistoryFromFile(sidebarImportFile); });
}

// --- New chat ---
if (newChatBtn) {
  newChatBtn.addEventListener('click', function() {
    addNewHistory();
    renderChat([]);
    renderSidebarHistories();
    setTimeout(() => {
      const username = loadUsername();
      addMessage('ai', `Salom${username ? ', ' + username : ''}! Yangi chat boshlandi. Anime haqida savol bering yoki tavsiya soʻrang!`);
    }, 400);
  });
}

// --- On load: restore chat, histories, and username ---
window.addEventListener('DOMContentLoaded', () => {
  // Migrate old single history if exists
  if (!localStorage.getItem('animeai_histories')) {
    const old = localStorage.getItem('animeai_history');
    if (old) {
      saveAllHistories([JSON.parse(old)]);
      setCurrentHistoryIndex(0);
      localStorage.removeItem('animeai_history');
    } else {
      saveAllHistories([[]]);
      setCurrentHistoryIndex(0);
    }
  }
  const username = loadUsername();
  setUsernameInputFields(username);
  renderSidebarHistories();
  const history = getCurrentHistory();
  if (history.length) {
    renderChat(history);
  } else {
    setTimeout(() => {
      addMessage('ai', `Salom${username ? ', ' + username : ''}! Men Anime AI yordamchingizman. Anime haqida savol bering yoki tavsiya soʻrang!`);
    }, 400);
  }
});
