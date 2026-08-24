/* =========================================================
   Everything here uses localStorage, so it currently saves
   in *your own browser only*. That's fine for building and
   testing the design. When you're ready to have posts and
   quotes show up for every visitor, this is the part we'll
   swap for a real backend / database — just say the word
   when we get there.
   ========================================================= */

const QUOTE_KEY = "quoteOfTheDay";
const POSTS_KEY = "blogPosts";
const DEFAULT_QUOTE =
  "The universe is not outside of you. Look inside yourself; everything that you want, you already are.";

/* ---------- helpers ---------- */
function getPosts() {
  const stored = localStorage.getItem(POSTS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fall through */ }
  }
  return [...DEFAULT_POSTS];
}
function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}
function sortedPosts() {
  return getPosts().slice().sort((a, b) => new Date(b.date) - new Date(a.date));
}
function excerpt(text, len = 110) {
  if (text.length <= len) return text;
  return text.slice(0, len).trim() + "…";
}
function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric"
  });
}
function slugify(title) {
  return title.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "post";
}

/* ---------- quote of the day (index.html) ---------- */
function initQuote() {
  const quoteText = document.getElementById("quoteText");
  const quoteInput = document.getElementById("quoteInput");
  const editBtn = document.getElementById("editQuoteBtn");
  const saveBtn = document.getElementById("saveQuoteBtn");
  if (!quoteText) return;

  const saved = localStorage.getItem(QUOTE_KEY) || DEFAULT_QUOTE;
  quoteText.textContent = saved;

  editBtn.addEventListener("click", () => {
    quoteInput.value = quoteText.textContent;
    quoteText.hidden = true;
    quoteInput.hidden = false;
    editBtn.hidden = true;
    saveBtn.hidden = false;
    quoteInput.focus();
  });

  saveBtn.addEventListener("click", () => {
    const val = quoteInput.value.trim() || DEFAULT_QUOTE;
    quoteText.textContent = val;
    localStorage.setItem(QUOTE_KEY, val);
    quoteText.hidden = false;
    quoteInput.hidden = true;
    editBtn.hidden = false;
    saveBtn.hidden = true;
  });
}

/* ---------- latest post preview (index.html) ---------- */
function initLatestPost() {
  const titleEl = document.getElementById("latestTitle");
  if (!titleEl) return;
  const posts = sortedPosts();
  const latest = posts[0];
  if (!latest) {
    titleEl.textContent = "No posts yet";
    document.getElementById("latestDate").textContent = "";
    document.getElementById("latestExcerpt").textContent =
      "Your first post will show up here as soon as you publish one.";
    document.getElementById("latestReadMore").textContent = "Go write one →";
    return;
  }
  titleEl.textContent = latest.title;
  document.getElementById("latestDate").textContent = formatDate(latest.date);
  document.getElementById("latestExcerpt").textContent = excerpt(latest.body);
  document.getElementById("latestReadMore").href = "blog.html?id=" + encodeURIComponent(latest.id);
}

/* ---------- blog page ---------- */
function initBlogPage() {
  const grid = document.getElementById("postGrid");
  if (!grid) return; // not on blog.html

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const listView = document.getElementById("postListView");
  const singleView = document.getElementById("singlePostView");

  if (id) {
    const post = getPosts().find(p => p.id === id);
    listView.hidden = true;
    singleView.hidden = false;
    if (post) {
      document.getElementById("postTitle").textContent = post.title;
      document.getElementById("postDate").textContent = formatDate(post.date);
      document.getElementById("postBody").textContent = post.body;
    } else {
      document.getElementById("postTitle").textContent = "Post not found";
      document.getElementById("postDate").textContent = "";
      document.getElementById("postBody").textContent = "";
    }
    return;
  }

  renderPostGrid();

  const publishBtn = document.getElementById("publishBtn");
  publishBtn.addEventListener("click", () => {
    const titleInput = document.getElementById("newPostTitle");
    const bodyInput = document.getElementById("newPostBody");
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    if (!title || !body) {
      alert("Give the post a title and something to say before publishing.");
      return;
    }
    const posts = getPosts();
    const today = new Date().toISOString().slice(0, 10);
    posts.push({
      id: slugify(title) + "-" + Date.now(),
      title, date: today, body
    });
    savePosts(posts);
    titleInput.value = "";
    bodyInput.value = "";
    renderPostGrid();
  });
}

function renderPostGrid() {
  const grid = document.getElementById("postGrid");
  const posts = sortedPosts();
  if (posts.length === 0) {
    grid.innerHTML = '<p class="empty-note">Nothing published yet — write your first post above.</p>';
    return;
  }
  grid.innerHTML = posts.map(p => `
    <a class="post-card" href="blog.html?id=${encodeURIComponent(p.id)}">
      <h3>${escapeHtml(p.title)}</h3>
      <p class="card-date">${formatDate(p.date)}</p>
      <p class="card-excerpt">${escapeHtml(excerpt(p.body))}</p>
    </a>
  `).join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initQuote();
  initLatestPost();
  initBlogPage();
});
