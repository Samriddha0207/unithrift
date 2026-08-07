// ======================================
// THEME TOGGLE (synced with marketplace/profile/sell via the shared "theme" key)
// ======================================
const navbarThemeToggle = document.getElementById("navbarThemeToggle");
const savedTheme = localStorage.getItem("theme") || "dark-theme";
document.body.classList.remove("dark-theme", "light-theme");
document.body.classList.add(savedTheme);

if (navbarThemeToggle) {
    navbarThemeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-theme");
        const next = isDark ? "light-theme" : "dark-theme";
        document.body.classList.remove("dark-theme", "light-theme");
        document.body.classList.add(next);
        localStorage.setItem("theme", next);
    });
}

// ======================================
// PRODUCT ID FROM URL
// ======================================
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// ======================================
// HTML ELEMENTS
// ======================================
const mainImage = document.getElementById("mainImage");
if (mainImage) mainImage.onerror = () => { mainImage.src = 'https://placehold.co/600x600?text=UniThrift'; };
const thumbnailContainer = document.getElementById("thumbnailContainer");
const productTitle = document.getElementById("productTitle");
const productPrice = document.getElementById("productPrice");
const productCondition = document.getElementById("productCondition");
const deliveryDate = document.getElementById("deliveryDate");
const paymentMethods = document.getElementById("paymentMethods");
const productDescription = document.getElementById("productDescription");
const sellerInfo = document.getElementById("sellerInfo");
const aiInsights = document.getElementById("aiInsights");
const reviewsContainer = document.getElementById("reviewsContainer");
const reviewForm = document.getElementById("reviewForm");

const actionButtonsWrapper = document.querySelector('.action-buttons');

const contactSellerBtn = document.getElementById("contactSellerBtn");
const contactModal = document.getElementById("contactModal");
const closeModal = document.getElementById("closeModal");
const modalSellerDetails = document.getElementById("modalSellerDetails");

const chatWithSellerBtn = document.getElementById("chatWithSellerBtn");
const chatPopup = document.getElementById("chatPopup");
const closeChatBtn = document.getElementById("closeChatBtn");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chatSellerName = document.getElementById("chatSellerName");
const chatSellerAvatar = document.getElementById("chatSellerAvatar");
const chatOnlineIndicator = document.getElementById("chatOnlineIndicator");
const chatVerifiedBadge = document.getElementById("chatVerifiedBadge");
const chatProductCard = document.getElementById("chatProductCard");
const chatProductImage = document.getElementById("chatProductImage");
const chatProductTitle = document.getElementById("chatProductTitle");
const chatProductPrice = document.getElementById("chatProductPrice");

const wishlistBtn = document.getElementById("wishlistBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const listedAgo = document.getElementById("listedAgo");

const zoomBtn = document.getElementById("zoomBtn");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const pickupPointRow = document.getElementById("pickupPointRow");
const pickupPointText = document.getElementById("pickupPointText");
const togglePickupMapBtn = document.getElementById("togglePickupMapBtn");
const pickupMapWrap = document.getElementById("pickupMapWrap");
const pickupMapFrame = document.getElementById("pickupMapFrame");

const makeOfferBtn = document.getElementById("makeOfferBtn");
const offerModal = document.getElementById("offerModal");
const closeOfferModal = document.getElementById("closeOfferModal");
const offerForm = document.getElementById("offerForm");
const offerProductImage = document.getElementById("offerProductImage");
const offerProductTitle = document.getElementById("offerProductTitle");
const offerAskingPrice = document.getElementById("offerAskingPrice");
const offerAmount = document.getElementById("offerAmount");
const offerMessage = document.getElementById("offerMessage");
const offerMessageCount = document.getElementById("offerMessageCount");
const offerSavingsHint = document.getElementById("offerSavingsHint");
const offerQuickChips = document.getElementById("offerQuickChips");
const offerPreview = document.getElementById("offerPreview");
const offerPreviewText = document.getElementById("offerPreviewText");

const proposePickupBtn = document.getElementById("proposePickupBtn");
const pickupModal = document.getElementById("pickupModal");
const closePickupModal = document.getElementById("closePickupModal");
const pickupForm = document.getElementById("pickupForm");
const pickupProductImage = document.getElementById("pickupProductImage");
const pickupProductTitle = document.getElementById("pickupProductTitle");
const pickupProductLocation = document.getElementById("pickupProductLocation");
const pickupDate = document.getElementById("pickupDate");
const pickupSlot = document.getElementById("pickupSlot");
const pickupNote = document.getElementById("pickupNote");
const pickupDateChips = document.getElementById("pickupDateChips");
const pickupSlotChips = document.getElementById("pickupSlotChips");
const pickupPreview = document.getElementById("pickupPreview");
const pickupPreviewText = document.getElementById("pickupPreviewText");

const reportListingBtn = document.getElementById("reportListingBtn");
const reportModal = document.getElementById("reportModal");
const closeReportModal = document.getElementById("closeReportModal");
const reportForm = document.getElementById("reportForm");

const relatedSection = document.getElementById("relatedSection");
const relatedStrip = document.getElementById("relatedStrip");
const moreFromSellerBlock = document.getElementById("moreFromSellerBlock");
const moreFromSellerStrip = document.getElementById("moreFromSellerStrip");
const recentlyViewedSection = document.getElementById("recentlyViewedSection");
const recentlyViewedStrip = document.getElementById("recentlyViewedStrip");

const reviewsSummary = document.getElementById("reviewsSummary");
const chatResponseBadge = document.getElementById("chatResponseBadge");

const mobileActionBar = document.getElementById("mobileActionBar");
const mobileActionPrice = document.getElementById("mobileActionPrice");
const mobileAddCartBtn = document.getElementById("mobileAddCartBtn");

let currentProduct = null;
let currentSeller = null;
let currentUserId = null;
let currentUserName = null;
let productImageUrls = [];
let currentImageIndex = 0;
let activeRoomId = null;

// ======================================
// TOAST NOTIFICATIONS
// ======================================
const toastContainer = document.getElementById("toastContainer");

function showToast(message, type = "info", duration = 3500) {
    if (!toastContainer) return;
    const icons = { success: "fa-check", error: "fa-xmark", warning: "fa-exclamation", info: "fa-info" };

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <span class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></span>
        <span class="toast-message"></span>
        <button class="toast-close" aria-label="Dismiss"><i class="fas fa-xmark"></i></button>
    `;
    toast.querySelector(".toast-message").textContent = message;

    const remove = () => {
        if (!toast.isConnected) return;
        toast.classList.add("toast--leaving");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    };

    let timer = setTimeout(remove, duration);
    toast.addEventListener("mouseenter", () => clearTimeout(timer));
    toast.addEventListener("mouseleave", () => { timer = setTimeout(remove, 1200); });
    toast.querySelector(".toast-close").addEventListener("click", remove);

    toastContainer.appendChild(toast);
}

// ======================================
// CONFIRMATION MODAL
// ======================================
const confirmModal = document.getElementById("confirmModal");
const confirmModalTitle = document.getElementById("confirmModalTitle");
const confirmModalMessage = document.getElementById("confirmModalMessage");
const confirmModalOk = document.getElementById("confirmModalOk");
const confirmModalCancel = document.getElementById("confirmModalCancel");

function showConfirm(message, title = "Are you sure?") {
    if (!confirmModal) return Promise.resolve(window.confirm(message));

    return new Promise(resolve => {
        confirmModalTitle.textContent = title;
        confirmModalMessage.textContent = message;
        confirmModal.classList.add("open");

        const cleanup = (result) => {
            confirmModal.classList.remove("open");
            confirmModalOk.removeEventListener("click", onOk);
            confirmModalCancel.removeEventListener("click", onCancel);
            confirmModal.removeEventListener("click", onOverlay);
            document.removeEventListener("keydown", onKeydown);
            resolve(result);
        };

        const onOk = () => cleanup(true);
        const onCancel = () => cleanup(false);
        const onOverlay = (e) => { if (e.target === confirmModal) cleanup(false); };
        const onKeydown = (e) => { if (e.key === "Escape") cleanup(false); };

        confirmModalOk.addEventListener("click", onOk);
        confirmModalCancel.addEventListener("click", onCancel);
        confirmModal.addEventListener("click", onOverlay);
        document.addEventListener("keydown", onKeydown);
    });
}
// ======================================
// WISHLIST (synced with the marketplace's wishlist via the shared "wishlist" key)
// ======================================
function getWishlist() {
    try { return JSON.parse(localStorage.getItem("wishlist")) || []; }
    catch { return []; }
}

function isWishlisted(id) {
    return getWishlist().some(p => p.id == id);
}

function toggleWishlist(product) {
    let wishlist = getWishlist();
    const already = wishlist.some(p => p.id == product.id);

    if (already) {
        wishlist = wishlist.filter(p => p.id != product.id);
        showToast("Removed from wishlist", "info");
    } else {
        wishlist.push(product);
        showToast("Saved to wishlist", "success");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    if (wishlistBtn) wishlistBtn.classList.toggle("active", !already);
}

if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => {
        if (!currentProduct) return showToast("Product data is loading. Please wait a moment.", "warning");
        toggleWishlist({
            id: currentProduct.id,
            title: currentProduct.title,
            price: currentProduct.price,
            category: currentProduct.category || "",
            condition: currentProduct.condition,
            description: currentProduct.description,
            image_url: mainImage?.src || ""
        });
    });
}

// ======================================
// COPY PRODUCT LINK
// ======================================
if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", async () => {
        const link = window.location.href.split("#")[0];
        try {
            await navigator.clipboard.writeText(link);
        } catch (err) {
            const temp = document.createElement("textarea");
            temp.value = link;
            temp.style.position = "fixed";
            temp.style.opacity = "0";
            document.body.appendChild(temp);
            temp.select();
            document.execCommand("copy");
            document.body.removeChild(temp);
        }

        showToast("Product link copied!", "success");
        const origHTML = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyLinkBtn.classList.add("copied");
        setTimeout(() => {
            copyLinkBtn.innerHTML = origHTML;
            copyLinkBtn.classList.remove("copied");
        }, 2000);
    });
}

// ======================================
// AUTH HELPERS
// ======================================

async function tryRefreshToken() {
    const refreshToken = localStorage.getItem("unithrift_refresh_token");

    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh_token: refreshToken
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            return null;
        }

        localStorage.setItem(
            "unithrift_session_token",
            data.access_token
        );

        localStorage.setItem(
            "unithrift_refresh_token",
            data.refresh_token
        );

        return data.access_token;

    } catch (err) {
        console.error("Token refresh failed:", err);
        return null;
    }
}

async function authFetch(url, options = {}) {

    const token = localStorage.getItem("unithrift_session_token");
    const refreshToken = localStorage.getItem("unithrift_refresh_token");

    const buildHeaders = (accessToken) => {
        const headers = new Headers(options.headers || {});

        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }

        if (refreshToken) {
            headers.set("X-Refresh-Token", refreshToken);
        }

        return headers;
    };

    let response = await fetch(url, {
        ...options,
        headers: buildHeaders(token)
    });

    if (response.status !== 401) {
        return response;
    }

    const newToken = await tryRefreshToken();

    if (!newToken) {
        return response;
    }

    return fetch(url, {
        ...options,
        headers: buildHeaders(newToken)
    });
}

if (chatWithSellerBtn) chatWithSellerBtn.style.display = 'none';
if (contactSellerBtn) contactSellerBtn.style.display = 'none';

// ======================================
// SELLER EXCLUSIVE LAYOUT ROUTINE
// ======================================
function renderSellerLayout(token) {
  if (!actionButtonsWrapper) return;

  if (chatWithSellerBtn) {
    chatWithSellerBtn.style.display = 'inline-flex';
    chatWithSellerBtn.textContent = '💬 View Buyer Chats';
    chatWithSellerBtn.disabled = false;
  }
  if (contactSellerBtn) {
    contactSellerBtn.style.display = 'none';
  }
  // These are buyer actions — don't make sense on your own listing.
  if (makeOfferBtn) makeOfferBtn.style.display = 'none';
  if (proposePickupBtn) proposePickupBtn.style.display = 'none';
  if (reportListingBtn) reportListingBtn.style.display = 'none';
  if (mobileActionBar) mobileActionBar.style.display = 'none';
  
  const dashboardBadge = document.createElement('div');
  dashboardBadge.style.cssText = "width:100%; text-align:center; padding: 10px; background: var(--input-bg); color: var(--secondary); font-weight: 600; border-radius: 12px; margin-bottom: 8px; font-size: 0.9rem; border: 1px solid var(--border);";
  dashboardBadge.textContent = "🔒 You are managing this listing";
  actionButtonsWrapper.appendChild(dashboardBadge);

  if (!document.getElementById('markSoldBtnGenerated')) {
    const markSoldBtn = document.createElement('button');
    markSoldBtn.id = 'markSoldBtnGenerated';
    markSoldBtn.textContent = 'Mark as Sold';
    markSoldBtn.style.cssText = "width:100%; padding:13px; border:none; border-radius:12px; background:var(--warning); color:white; font-weight:700; font-size:1rem; cursor:pointer; transition:.2s;";
    
    markSoldBtn.addEventListener('click', async () => {
      const confirmed = await showConfirm("Mark this listing as sold? This cannot be undone.", "Mark as Sold?");
      if (!confirmed) return;
      markSoldBtn.textContent = "Marking...";
      markSoldBtn.disabled = true;
      try {
        const res = await fetch(`/api/products/${productId}/sold`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        showToast("Listing marked as sold", "success");
        setTimeout(() => window.location.reload(), 600);
      } catch (err) {
        showToast("Failed: " + err.message, "error");
        markSoldBtn.textContent = "Mark as Sold";
        markSoldBtn.disabled = false;
      }
    });
    
    actionButtonsWrapper.appendChild(markSoldBtn);
  }

  if (!document.getElementById('deleteBtnGenerated')) {
    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'deleteBtnGenerated';
    deleteBtn.textContent = 'Delete Item';
    deleteBtn.style.cssText = "width:100%; padding:13px; border:none; border-radius:12px; background:var(--danger); color:white; font-weight:700; font-size:1rem; cursor:pointer; transition:.2s; margin-top: 8px;";
    
    deleteBtn.addEventListener('click', async () => {
      const confirmed = await showConfirm("Are you sure you want to delete this listing? This action cannot be undone.", "Delete Listing?");
      if (!confirmed) return;
      deleteBtn.textContent = "Deleting...";
      deleteBtn.disabled = true;
      try {
        const res = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        showToast("Product deleted successfully!", "success");
        setTimeout(() => { window.location.href = "/marketplace"; }, 600);
      } catch (err) {
        showToast("Failed: " + err.message, "error");
        deleteBtn.textContent = "Delete Item";
        deleteBtn.disabled = false;
      }
    });
    
    actionButtonsWrapper.appendChild(deleteBtn);
  }
}

// ======================================
// BUYER/CLIENT EXCLUSIVE LAYOUT ROUTINE
// ======================================
async function renderBuyerLayout(token) {
  if (chatWithSellerBtn) {
    chatWithSellerBtn.style.display = 'inline-flex';
    chatWithSellerBtn.disabled = false;
  }
  if (contactSellerBtn) {
    contactSellerBtn.style.display = 'inline-flex';
    contactSellerBtn.disabled = false;
  }

  if (token) {
    await syncChatRoomHistory(token);
  }
}

// ======================================
// LOAD PRODUCT & DATA
// ======================================
async function loadProduct() {
  try {
    const response = await fetch(`/api/products/${productId}`);
    const result = await response.json();
    if (!result.success) throw new Error("Product not found");

    currentProduct = result.product;
    if (wishlistBtn) wishlistBtn.classList.toggle("active", isWishlisted(currentProduct.id));

    [productTitle, productPrice].forEach(el => el && el.classList.remove("skeleton"));

    productTitle.textContent = currentProduct.title;
    productPrice.textContent = `₹${Number(currentProduct.price).toLocaleString('en-IN')}`;
    productCondition.textContent = `Condition: ${currentProduct.condition}`;
    deliveryDate.textContent = currentProduct.delivery_date || "Not specified";
    paymentMethods.textContent = currentProduct.payment_methods || "UPI";
    productDescription.textContent = currentProduct.description;

    if (mobileActionPrice) mobileActionPrice.textContent = `₹${Number(currentProduct.price).toLocaleString('en-IN')}`;

    renderListedAgo(currentProduct.created_at);
    renderPickupPoint(currentProduct.collection_point);

    const targetedSellerId = currentProduct.seller_id || currentProduct.user_id;

    if (currentProduct.is_sold) {
      const soldBanner = document.createElement('div');
      soldBanner.style.cssText = "background:var(--danger);color:white;text-align:center;padding:12px;font-weight:700;font-size:1.1rem;letter-spacing:2px;margin-bottom:16px;border-radius:10px;";
      soldBanner.textContent = "⚠️ THIS ITEM HAS BEEN SOLD";
      
      const detailsSection = document.querySelector('.details-section');
      if (detailsSection) detailsSection.prepend(soldBanner);
      
      const cartBtn = document.getElementById('addCartBtn');
      if (cartBtn) {
        cartBtn.disabled = true;
        cartBtn.style.opacity = '0.4';
        cartBtn.style.cursor = 'not-allowed';
      }
      if (mobileAddCartBtn) {
        mobileAddCartBtn.disabled = true;
        mobileAddCartBtn.style.opacity = '0.4';
        mobileAddCartBtn.style.cursor = 'not-allowed';
      }
    }

    await Promise.all([
      loadSeller(targetedSellerId),
      loadImages(currentProduct.id),
      loadReviews(currentProduct.id),
      loadAIInsights(currentProduct.id)
    ]);

    const token = localStorage.getItem("unithrift_session_token");

if (token) {
  try {
    const r = await authFetch('/api/profile');
    const d = await r.json();

    if (d.success) {
      currentUserId = d.profile?.id;
      currentUserName =
        d.profile?.full_name ||
        d.profile?.username ||
        "User";
    }

  } catch (err) {
    console.error("Profile initialization context failure:", err);
  }
}

if (currentUserId && String(currentUserId) === String(targetedSellerId)) {
  renderSellerLayout(token);
} else {
  await renderBuyerLayout(token);
}

if (params.get("openChat") === "1" && chatWithSellerBtn && chatWithSellerBtn.style.display !== "none") {
  chatWithSellerBtn.click();
}

addToRecentlyViewed(currentProduct, mainImage?.src);
loadRelatedListings(currentProduct.category, currentProduct.id);
loadMoreFromSeller(targetedSellerId, currentProduct.id);
renderRecentlyViewed(currentProduct.id);

  } catch (err) {
    console.error(err);
    if (productTitle) productTitle.textContent = "Product Not Found";
  }
}

// ======================================
// LISTED-AGO / PICKUP-POINT HELPERS
// ======================================
function renderListedAgo(createdAt) {
  if (!listedAgo || !createdAt) return;
  const then = new Date(createdAt).getTime();
  if (Number.isNaN(then)) return;

  const diffMs = Date.now() - then;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let text;
  if (days <= 0) {
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    text = hours <= 0 ? "Listed just now" : `Listed ${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (days === 1) {
    text = "Listed yesterday";
  } else if (days < 30) {
    text = `Listed ${days} days ago`;
  } else {
    const months = Math.floor(days / 30);
    text = `Listed ${months} month${months === 1 ? "" : "s"} ago`;
  }

  listedAgo.querySelector("span").textContent = text;
  listedAgo.style.display = "inline-flex";
}

function renderPickupPoint(collectionPoint) {
  if (!pickupPointRow || !collectionPoint) return;
  pickupPointText.textContent = collectionPoint;
  pickupPointRow.style.display = "block";

  if (togglePickupMapBtn) {
    togglePickupMapBtn.addEventListener("click", () => {
      const isHidden = pickupMapWrap.style.display === "none";
      if (isHidden && !pickupMapFrame.src) {
        // Assumes the seller's collection point text is descriptive enough to
        // geocode on its own (e.g. "Hostel 2 Lounge, XYZ College") — no lat/lng
        // is stored for listings, so this uses Google's query-based map embed
        // rather than a precise pin.
        const query = encodeURIComponent(collectionPoint);
        pickupMapFrame.src = `https://www.google.com/maps?q=${query}&output=embed`;
      }
      pickupMapWrap.style.display = isHidden ? "block" : "none";
      togglePickupMapBtn.innerHTML = isHidden
        ? '<i class="fas fa-map-location-dot"></i> Hide map'
        : '<i class="fas fa-map-location-dot"></i> View on map';
    });
  }
}

// ======================================
// LOAD SELLER
// ======================================
async function loadSeller(sellerId) {
  if (!sellerId) return;
  try {
    const response = await fetch(`/api/user/${sellerId}`);
    const { success, seller } = await response.json();
    if (!success) return;

    currentSeller = seller;
    if (sellerInfo) {
      sellerInfo.innerHTML = `
        <h3>${seller.username || seller.full_name || "Unknown Seller"}</h3>
        <p>College: ${seller.college_name || seller.college || "Not Added"}</p>
        <p>Location: ${seller.location_name || seller.location || "Not Added"}</p>
        <p>Verified Student: ${seller.student_verified ? "✅" : "❌"}</p>
        <p>Verified Seller: ${seller.seller_verified ? "✅" : "❌"}</p>
      `;
    }
  } catch (err) {
    console.error(err);
  }
}

// ======================================
// LOAD IMAGES
// ======================================
async function loadImages(id) {
  try {
    const response = await fetch(`/api/products/${id}/images`);
    const { images } = await response.json();

    if (images && images.length > 0) {
      productImageUrls = images.map(img => img.image_url);

      if (mainImage) {
        mainImage.src = images[0].image_url;
        mainImage.classList.remove("skeleton");
      }
      if (thumbnailContainer) {
        thumbnailContainer.innerHTML = "";
        images.forEach((img, index) => {
          const wrap = document.createElement("div");
          wrap.className = "thumb-wrap";

          const thumb = document.createElement("img");
          thumb.src = img.image_url;
          thumb.classList.add("thumb");
          if (index === 0) thumb.classList.add("active");
          thumb.addEventListener("click", () => {
            if (mainImage) mainImage.src = img.image_url;
            thumbnailContainer.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
            thumb.classList.add("active");
            currentImageIndex = index;
          });
          wrap.appendChild(thumb);

          // Per-photo captions: inert until the backend adds a caption field
          // on product_images — renders automatically once img.caption exists.
          if (img.caption) {
            const caption = document.createElement("span");
            caption.className = "thumb-caption";
            caption.textContent = img.caption;
            wrap.appendChild(caption);
          }

          thumbnailContainer.appendChild(wrap);
        });
      }
    } else if (mainImage) {
      mainImage.classList.remove("skeleton");
    }
  } catch (err) {
    console.error(err);
    if (mainImage) mainImage.classList.remove("skeleton");
  }
}

// ======================================
// LOAD REVIEWS
// ======================================
async function loadReviews(id) {
  try {
    const response = await fetch(`/api/products/${id}/reviews`);
    const { reviews } = await response.json();
    if (!reviewsContainer) return;
    reviewsContainer.innerHTML = "";

    if (!reviews || reviews.length === 0) {
      if (reviewsSummary) reviewsSummary.style.display = "none";
      reviewsContainer.innerHTML = `<div class="review-card">No reviews yet.</div>`;
      return;
    }

    renderReviewsSummary(reviews);

    // Sort by helpful votes (highest first) so the most useful reviews float
    // to the top once there's more than a couple.
    const votes = getHelpfulVotes();
    const sorted = [...reviews].sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0));

    sorted.forEach(review => {
      const verifiedTag = review.verified_purchase
        ? `<span class="verified-purchase-tag"><i class="fas fa-circle-check"></i> Verified Buyer</span>`
        : "";
      const helpfulCount = votes[review.id] || 0;
      const voted = hasVotedHelpful(review.id);

      reviewsContainer.innerHTML += `
        <div class="review-card">
          <div class="review-card-head">
            <h4>${"⭐".repeat(review.rating)}</h4>
            ${verifiedTag}
          </div>
          <p>${escapeHtml(review.review_text)}</p>
          <div class="review-card-footer">
            <button class="helpful-btn${voted ? " voted" : ""}" data-review-id="${review.id}">
              <i class="fas fa-thumbs-up"></i> Helpful${helpfulCount > 0 ? ` (${helpfulCount})` : ""}
            </button>
          </div>
        </div>
      `;
    });

    reviewsContainer.querySelectorAll(".helpful-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleHelpfulVote(btn.dataset.reviewId);
        loadReviews(id);
      });
    });
  } catch (err) {
    console.error(err);
  }
}

function renderReviewsSummary(reviews) {
  if (!reviewsSummary) return;
  const count = reviews.length;
  const avg = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / count;
  const roundedStars = Math.round(avg);

  reviewsSummary.innerHTML = `
    <div class="reviews-summary-score">${avg.toFixed(1)}</div>
    <div>
      <div class="reviews-summary-stars">${"★".repeat(roundedStars)}${"☆".repeat(5 - roundedStars)}</div>
      <div class="reviews-summary-count">Based on ${count} review${count === 1 ? "" : "s"}</div>
    </div>
  `;
  reviewsSummary.style.display = "flex";
}

// Helpful-vote counts are tracked per-browser via localStorage, not on the
// server — there's no votes table/endpoint for this yet, so counts won't be
// shared across different visitors. Good enough to demo the sort-by-helpful
// behavior; wire up a real backend table to make counts global.
function getHelpfulVotes() {
  try { return JSON.parse(localStorage.getItem("review_helpful_votes")) || {}; }
  catch { return {}; }
}

function hasVotedHelpful(reviewId) {
  try {
    const voted = JSON.parse(localStorage.getItem("review_helpful_voted_ids")) || [];
    return voted.includes(String(reviewId));
  } catch { return false; }
}

function toggleHelpfulVote(reviewId) {
  const votes = getHelpfulVotes();
  const votedIds = new Set(JSON.parse(localStorage.getItem("review_helpful_voted_ids") || "[]"));
  const key = String(reviewId);

  if (votedIds.has(key)) {
    votedIds.delete(key);
    votes[key] = Math.max(0, (votes[key] || 1) - 1);
  } else {
    votedIds.add(key);
    votes[key] = (votes[key] || 0) + 1;
  }

  localStorage.setItem("review_helpful_votes", JSON.stringify(votes));
  localStorage.setItem("review_helpful_voted_ids", JSON.stringify([...votedIds]));
}

// ======================================
// LOAD AI INSIGHTS
// ======================================
async function loadAIInsights(id) {
  if (!aiInsights) return;

  aiInsights.innerHTML = `
    <div class="ai-loading">
      <div class="spinner"></div>
      <h3>Generating AI Summary...</h3>
      <p>UniThrift AI is analysing this product and customer reviews.</p>
    </div>
  `;

  try {
    const response = await fetch(`/api/products/${id}/ai-insights`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);

    renderAIInsights(result.insights);
  } catch (err) {
    console.error(err);
    aiInsights.innerHTML = `
      <div class="ai-error">
        <h3>⚠ AI Summary Unavailable</h3>
        <p>We couldn't generate an AI summary for this listing.</p>
      </div>
    `;
  }
}

// ======================================
// RENDER AI INSIGHTS
// ======================================
function renderAIInsights(data) {
  if (!aiInsights || !data) return;
  const recommendation = data.recommendation || "Neutral";
  let badgeClass = "neutral";

  if (recommendation === "Positive") badgeClass = "positive";
  if (recommendation === "Caution") badgeClass = "caution";

  const keyPoints = (data.key_points || [])
    .map(point => `<li>✔ ${point}</li>`)
    .join("");

  aiInsights.innerHTML = `
    <div class="ai-summary-card">
      <div class="ai-recommendation ${badgeClass}">${recommendation}</div>
      <div class="ai-section">
        <h3>📦 Product Assessment</h3>
        <p>${data.product_summary || "No summary available."}</p>
      </div>
      <div class="ai-section">
        <h3>⭐ Review Analysis</h3>
        <p>${data.review_summary || "No review summary available."}</p>
      </div>
      <div class="ai-section">
        <h3>📌 Key Points</h3>
        <ul>${keyPoints}</ul>
      </div>
      <div class="ai-footer">Generated using UniThrift AI. AI may occasionally make mistakes.</div>
    </div>
  `;
}

// ======================================
// SUBMIT REVIEW
// ======================================
if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("unithrift_session_token");
    if (!token) return showToast("Please login first.", "warning");

    const rating = Number(document.getElementById("rating").value);
    const review_text = document.getElementById("reviewText").value.trim();

    if (!rating) return showToast("Please select a rating.", "warning");
    if (!review_text) return showToast("Please write a review.", "warning");

    const submitBtn = reviewForm.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, review_text })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to post");

      showToast("Review submitted successfully!", "success");
      reviewForm.reset();
      
      await loadReviews(productId);
      await loadAIInsights(productId);
    } catch (err) {
      console.error("Submission Error:", err);
      showToast(`Failed to submit review: ${err.message}`, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Review";
      }
    }
  });
}

// ======================================
// CONTACT SELLER MODAL
// ======================================
if (contactSellerBtn) {
  contactSellerBtn.addEventListener("click", () => {
    if (!currentProduct) return showToast("Product data is loading. Please wait a moment.", "warning");
    const sellerData = currentSeller?.seller || currentSeller;
    if (!sellerData) return showToast("Seller details are unavailable right now.", "error");

    const sellerName = sellerData.full_name || sellerData.username || "Registered Student";
    const sellerCollege = sellerData.college_name || "UniThrift Verified College";
    const contactNumber = currentProduct.contact_no || currentProduct.phone_number || "Provided upon request";
    const collectionPoint = currentProduct.collection_point || currentProduct.location_name || sellerData.location_name || "Campus Main Gate";

    if (modalSellerDetails) {
      modalSellerDetails.innerHTML = `
        <div class="modal-item"><strong>Name:</strong> ${sellerName}</div>
        <div class="modal-item"><strong>College:</strong> ${sellerCollege}</div>
        <div class="modal-item"><strong>Contact No:</strong> ${contactNumber}</div>
        <div class="modal-item"><strong>Collection Point:</strong> ${collectionPoint}</div>
      `;
    }
    if (contactModal) contactModal.style.display = "flex";
  });
}

if (closeModal) {
  closeModal.addEventListener("click", () => { if (contactModal) contactModal.style.display = "none"; });
}

window.addEventListener("click", (e) => {
  if (e.target === contactModal) contactModal.style.display = "none";
});

// ======================================
// ENHANCED CHAT COMPONENT ENGINE
// ======================================
let loadedMessageIds = new Set();
let chatPollInterval = null;

function formatMessageTime(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit"
  });
}

function appendMessageToUI(text, direction, timestamp) {
  if (!chatMessages) return;
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", direction);

  const textSpan = document.createElement("span");
  textSpan.className = "message-text";
  textSpan.textContent = text;
  msgDiv.appendChild(textSpan);

  if (direction !== "system-msg") {
    const timeSpan = document.createElement("span");
    timeSpan.className = "message-time";
    timeSpan.textContent = formatMessageTime(timestamp);
    msgDiv.appendChild(timeSpan);
  }

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function populateChatHeader() {
  const sellerData = currentSeller?.seller || currentSeller;

  if (chatSellerAvatar) {
    const fallbackName = encodeURIComponent(sellerData?.full_name || sellerData?.username || "U");
    chatSellerAvatar.src =
      sellerData?.avatar_url ||
      sellerData?.profile_picture ||
      `https://ui-avatars.com/api/?name=${fallbackName}&background=1f2937&color=fff`;
  }

  if (chatVerifiedBadge) {
    const isVerified = !!(sellerData?.seller_verified || sellerData?.student_verified);
    chatVerifiedBadge.style.display = isVerified ? "inline" : "none";
  }

  if (chatOnlineIndicator) chatOnlineIndicator.style.background = "#10b981";

  // Only renders if the backend actually provides a response-time metric —
  // there's no such field in the current API responses, so this stays
  // hidden until a real value (e.g. seller.avg_response_minutes) is wired up
  // server-side. Left in place rather than faking a number.
  if (chatResponseBadge) {
    const minutes = sellerData?.avg_response_minutes;
    if (typeof minutes === "number" && minutes > 0) {
      const label = minutes < 60
        ? `~${Math.round(minutes)} min`
        : `~${Math.round(minutes / 60)} hr`;
      chatResponseBadge.innerHTML = `<i class="fas fa-bolt"></i> Usually replies within ${label}`;
      chatResponseBadge.style.display = "inline-flex";
    } else {
      chatResponseBadge.style.display = "none";
    }
  }

  if (currentProduct) {
    if (chatProductImage) chatProductImage.src = mainImage?.src || "";
    if (chatProductTitle) chatProductTitle.textContent = currentProduct.title || "Product";
    if (chatProductPrice) {
      chatProductPrice.textContent = `₹${Number(currentProduct.price).toLocaleString('en-IN')}`;
    }
    if (chatProductCard) chatProductCard.href = `/product.html?id=${productId}`;
  }
}

async function fetchMessages() {
  if (!activeRoomId) return;
  const token = localStorage.getItem("unithrift_session_token");
  if (!token) return;

  try {
    const response = await authFetch(`/api/chat/rooms/${activeRoomId}/messages`);
    const msgResult = await response.json();
    
    if (msgResult.success && msgResult.messages) {
      let addedNew = false;
      msgResult.messages.forEach(msg => {
        if (!loadedMessageIds.has(msg.id)) {
          loadedMessageIds.add(msg.id);
          const direction = (String(msg.sender_id) === String(currentUserId)) ? "sent" : "received";
          const timestamp = msg.created_at || msg.inserted_at || msg.timestamp;
          appendMessageToUI(msg.message_text, direction, timestamp);
          addedNew = true;
        }
      });
      if (addedNew && chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }
  } catch (err) {
    console.error("Error fetching messages during poll:", err);
  }
}

function startPolling() {
  stopPolling();
  fetchMessages();
  chatPollInterval = setInterval(fetchMessages, 2500);
}

function stopPolling() {
  if (chatPollInterval) {
    clearInterval(chatPollInterval);
    chatPollInterval = null;
  }
}

async function syncChatRoomHistory() {
  const sendChatBtn = document.getElementById("sendChatBtn");

  // Reset input to enabled at the start of every attempt; the MULTIPLE_BUYERS
  // branch below re-disables it since there's no single room to send into.
  if (chatInput) chatInput.disabled = false;
  if (sendChatBtn) sendChatBtn.disabled = false;

  try {
    const roomResponse = await authFetch('/api/chat/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId
      })
    });

    const roomResult = await roomResponse.json();

    if (!roomResult.success) {
      const err = new Error(roomResult.message || "No active chats found for this product yet.");
      err.code = roomResult.code;
      throw err;
    }

    activeRoomId = roomResult.room_id;

    loadedMessageIds.clear();

    if (chatMessages) {
      chatMessages.innerHTML =
        '<div class="message system-msg">Welcome to campus chat! Protect your data.</div>';
    }

    startPolling();

  } catch (err) {
    console.error("Failed to restore chat room history:", err);
    stopPolling();
    activeRoomId = null;

    // The seller has more than one interested buyer for this listing — there's
    // no single room to open here, so point them to the full inbox instead of
    // showing a plain error.
    if (err.code === "MULTIPLE_BUYERS") {
      if (chatInput) chatInput.disabled = true;
      if (sendChatBtn) sendChatBtn.disabled = true;

      if (chatMessages) {
        chatMessages.innerHTML = `
          <div class="empty-state-block">
            <i class="fas fa-comments"></i>
            <p>Multiple buyers are interested in this listing.</p>
            <p style="margin-top:6px;font-size:0.85rem;">Manage each conversation from your inbox.</p>
            <a href="/chat" target="_blank" rel="noopener"
               style="display:inline-block;margin-top:14px;padding:10px 20px;border-radius:10px;background:var(--accent);color:#fff;text-decoration:none;font-weight:600;font-size:0.85rem;">
              Open Inbox →
            </a>
          </div>`;
      }
      return;
    }

    if (chatMessages) {
      chatMessages.innerHTML = `
        <div class="message system-msg"
             style="background:#e11d48;color:white;border-radius:8px;padding:10px;margin:10px;">
          ⚠️ Chat unavailable: ${err.message || "Please wait for a buyer to start a chat."}
        </div>`;
    }
  }
}

if (chatWithSellerBtn) {
  chatWithSellerBtn.addEventListener("click", async () => {

    if (!localStorage.getItem("unithrift_session_token")) {
      return showToast("Please login to chat with the seller.", "warning");
    }

    if (!currentProduct) {
      return showToast("Product data is loading. Please wait a moment.", "warning");
    }

    const sellerData = currentSeller?.seller || currentSeller;
    const sellerName =
      sellerData?.full_name ||
      sellerData?.username ||
      "Seller";

    const isSeller =
      currentUserId &&
      String(currentUserId) ===
      String(currentProduct.seller_id || currentProduct.user_id);

    if (chatSellerName) {
      chatSellerName.textContent = isSeller
        ? "Buyer Chat"
        : sellerName;
    }

    populateChatHeader();

    if (chatPopup) chatPopup.classList.add("open");
    if (chatInput) chatInput.focus();

    await syncChatRoomHistory();
  });
}

if (closeChatBtn) {
  closeChatBtn.addEventListener("click", () => {
    if (chatPopup) chatPopup.classList.remove("open");
    stopPolling();
  });
}

if (chatForm) {
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = chatInput.value.trim();
    if (!text) return;

    if (!activeRoomId) {
      showToast("Chat room is not ready yet. Please wait.", "warning");
      return;
    }

    if (!localStorage.getItem("unithrift_session_token")) {
      return showToast("Session expired. Please log in again.", "error");
    }

    if (chatInput) chatInput.value = "";

    try {
      const response = await authFetch(
        `/api/chat/rooms/${activeRoomId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message_text: text
          })
        }
      );

      const result = await response.json();

      if (result.success || response.ok) {
        await fetchMessages();
      } else {
        console.error("Failed to send message:", result.message);
      }

    } catch (err) {
      console.error("Transmission execution system pipeline error:", err);
    }
  });
}

console.log("[UniThrift] Offer/Pickup elements found on page load:", {
  makeOfferBtn: !!makeOfferBtn,
  offerModal: !!offerModal,
  proposePickupBtn: !!proposePickupBtn,
  pickupModal: !!pickupModal
});

// ======================================
// IMAGE LIGHTBOX
// ======================================
function openLightbox(index) {
  if (!lightbox || productImageUrls.length === 0) return;
  currentImageIndex = index;
  lightboxImage.src = productImageUrls[currentImageIndex];
  lightbox.classList.add("open");
}

function showLightboxImage(index) {
  if (productImageUrls.length === 0) return;
  currentImageIndex = (index + productImageUrls.length) % productImageUrls.length;
  lightboxImage.src = productImageUrls[currentImageIndex];
}

if (zoomBtn) {
  zoomBtn.addEventListener("click", () => openLightbox(currentImageIndex));
}
if (mainImage) {
  mainImage.style.cursor = "zoom-in";
  mainImage.addEventListener("click", () => openLightbox(currentImageIndex));
}
if (closeLightbox) closeLightbox.addEventListener("click", () => lightbox.classList.remove("open"));
if (lightboxPrev) lightboxPrev.addEventListener("click", () => showLightboxImage(currentImageIndex - 1));
if (lightboxNext) lightboxNext.addEventListener("click", () => showLightboxImage(currentImageIndex + 1));
if (lightbox) {
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
}
document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("open")) return;
  if (e.key === "Escape") lightbox.classList.remove("open");
  if (e.key === "ArrowLeft") showLightboxImage(currentImageIndex - 1);
  if (e.key === "ArrowRight") showLightboxImage(currentImageIndex + 1);
});

// ======================================
// SEND A MESSAGE THROUGH THE EXISTING CHAT PIPELINE
// Reused by "Make an Offer" and "Propose a Pickup Time" so both features
// ride on the chat/room infrastructure already built, instead of needing
// new backend endpoints of their own.
// ======================================
async function sendChatMessage(text) {
  if (!localStorage.getItem("unithrift_session_token")) {
    showToast("Please login to message the seller.", "warning");
    return false;
  }
  if (!currentProduct) {
    showToast("Product data is loading. Please wait a moment.", "warning");
    return false;
  }

  if (!chatPopup.classList.contains("open") && chatWithSellerBtn) {
    chatWithSellerBtn.click();
  }

  let attempts = 0;
  while (!activeRoomId && attempts < 30) {
    await new Promise(r => setTimeout(r, 150));
    attempts++;
  }

  if (!activeRoomId) {
    showToast("Chat isn't ready yet — try again in a moment.", "warning");
    return false;
  }

  if (chatInput) chatInput.value = text;
  if (chatForm) {
    chatForm.dispatchEvent(new Event("submit", { cancelable: true }));
  }
  return true;
}

// ======================================
// MAKE AN OFFER
// ======================================
function buildOfferMessage() {
  const amount = Number(offerAmount.value) || 0;
  const note = offerMessage.value.trim();
  let text = `💰 I'd like to offer ₹${amount.toLocaleString('en-IN')} for "${currentProduct?.title || 'this item'}".`;
  if (note) text += ` ${note}`;
  return text;
}

function updateOfferPreview() {
  const amount = Number(offerAmount.value);

  if (amount > 0) {
    offerPreview.style.display = "block";
    offerPreviewText.textContent = buildOfferMessage();
  } else {
    offerPreview.style.display = "none";
  }

  if (amount > 0 && currentProduct?.price) {
    const askingPrice = Number(currentProduct.price);
    const diff = askingPrice - amount;
    const pct = Math.round((diff / askingPrice) * 100);

    if (diff > 0) {
      offerSavingsHint.textContent = `That's ₹${diff.toLocaleString('en-IN')} (${pct}%) below the asking price.`;
      offerSavingsHint.classList.remove("offer-savings-hint--over");
    } else if (diff < 0) {
      offerSavingsHint.textContent = `That's above the ₹${askingPrice.toLocaleString('en-IN')} asking price — you could also just Add to Cart.`;
      offerSavingsHint.classList.add("offer-savings-hint--over");
    } else {
      offerSavingsHint.textContent = "That matches the asking price exactly.";
      offerSavingsHint.classList.remove("offer-savings-hint--over");
    }
    offerSavingsHint.style.display = "block";
  } else {
    offerSavingsHint.style.display = "none";
  }
}

if (makeOfferBtn) {
  makeOfferBtn.addEventListener("click", () => {
    try {
      console.log("[UniThrift] Make an Offer clicked", {
        loggedIn: !!localStorage.getItem("unithrift_session_token"),
        currentProduct
      });

      if (!localStorage.getItem("unithrift_session_token")) {
        return showToast("Please login to make an offer.", "warning");
      }
      if (!currentProduct) {
        return showToast("Product data is loading. Please wait a moment.", "warning");
      }

      offerProductImage.src = mainImage?.src || "";
      offerProductTitle.textContent = currentProduct.title;
      offerAskingPrice.textContent = `₹${Number(currentProduct.price).toLocaleString('en-IN')}`;
      offerQuickChips.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
      updateOfferPreview();

      offerModal.style.display = "flex";
      offerAmount.focus();
    } catch (err) {
      console.error("[UniThrift] Make an Offer failed:", err);
      showToast("Something went wrong opening this — check the console.", "error");
    }
  });
}
if (closeOfferModal) closeOfferModal.addEventListener("click", () => offerModal.style.display = "none");
if (offerModal) offerModal.addEventListener("click", (e) => { if (e.target === offerModal) offerModal.style.display = "none"; });

if (offerQuickChips) {
  offerQuickChips.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      if (!currentProduct?.price) return;
      const pct = Number(chip.dataset.pct);
      offerAmount.value = Math.round(Number(currentProduct.price) * pct);
      offerQuickChips.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      updateOfferPreview();
    });
  });
}

if (offerAmount) {
  offerAmount.addEventListener("input", () => {
    offerQuickChips.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
    updateOfferPreview();
  });
}

if (offerMessage) {
  offerMessage.addEventListener("input", () => {
    offerMessageCount.textContent = `${offerMessage.value.length}/300`;
    updateOfferPreview();
  });
}

if (offerForm) {
  offerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = offerForm.querySelector("button[type='submit']");
    const text = buildOfferMessage();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    const sent = await sendChatMessage(text);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Offer';

    if (sent) {
      showToast("Offer sent to the seller!", "success");
      offerModal.style.display = "none";
      offerForm.reset();
      offerMessageCount.textContent = "0/300";
      offerPreview.style.display = "none";
      offerSavingsHint.style.display = "none";
    }
  });
}

// ======================================
// PROPOSE A PICKUP TIME
// ======================================
function buildPickupMessage() {
  const date = pickupDate.value;
  const slot = pickupSlot.value;
  const note = pickupNote.value.trim();

  const dateLabel = date
    ? new Date(date + "T00:00:00").toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    : "a date to be confirmed";

  let text = `📅 Could we do pickup on ${dateLabel}, ${slot || "a time to be confirmed"}? Let me know if that works for you.`;
  if (note) text += ` ${note}`;
  return text;
}

function updatePickupPreview() {
  if (pickupDate.value && pickupSlot.value) {
    pickupPreview.style.display = "block";
    pickupPreviewText.textContent = buildPickupMessage();
  } else {
    pickupPreview.style.display = "none";
  }
}

function formatDateInput(d) {
  return d.toISOString().split("T")[0];
}

if (proposePickupBtn) {
  proposePickupBtn.addEventListener("click", () => {
    try {
      console.log("[UniThrift] Propose Pickup clicked", {
        loggedIn: !!localStorage.getItem("unithrift_session_token"),
        currentProduct
      });

      if (!localStorage.getItem("unithrift_session_token")) {
        return showToast("Please login to propose a pickup time.", "warning");
      }
      if (!currentProduct) {
        return showToast("Product data is loading. Please wait a moment.", "warning");
      }

      pickupProductImage.src = mainImage?.src || "";
      pickupProductTitle.textContent = currentProduct.title;

      if (currentProduct.collection_point) {
        pickupProductLocation.querySelector("span").textContent = currentProduct.collection_point;
        pickupProductLocation.style.display = "flex";
      } else {
        pickupProductLocation.style.display = "none";
      }

      pickupDateChips.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
      pickupSlotChips.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
      pickupDate.min = formatDateInput(new Date());
      updatePickupPreview();

      pickupModal.style.display = "flex";
    } catch (err) {
      console.error("[UniThrift] Propose Pickup failed:", err);
      showToast("Something went wrong opening this — check the console.", "error");
    }
  });
}
if (closePickupModal) closePickupModal.addEventListener("click", () => pickupModal.style.display = "none");
if (pickupModal) pickupModal.addEventListener("click", (e) => { if (e.target === pickupModal) pickupModal.style.display = "none"; });

if (pickupDateChips) {
  pickupDateChips.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const days = Number(chip.dataset.days);
      const target = new Date();
      target.setDate(target.getDate() + days);
      pickupDate.value = formatDateInput(target);
      pickupDateChips.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      updatePickupPreview();
    });
  });
}

if (pickupSlotChips) {
  pickupSlotChips.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      pickupSlot.value = chip.dataset.slot;
      pickupSlotChips.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      updatePickupPreview();
    });
  });
}

if (pickupDate) pickupDate.addEventListener("change", () => {
  pickupDateChips.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
  updatePickupPreview();
});
if (pickupNote) pickupNote.addEventListener("input", updatePickupPreview);

if (pickupForm) {
  pickupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = pickupForm.querySelector("button[type='submit']");
    const text = buildPickupMessage();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    const sent = await sendChatMessage(text);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Proposal';

    if (sent) {
      showToast("Pickup proposal sent!", "success");
      pickupModal.style.display = "none";
      pickupForm.reset();
      pickupPreview.style.display = "none";
      pickupDateChips.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
      pickupSlotChips.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
    }
  });
}

// ======================================
// REPORT LISTING
// Assumes a POST /api/products/:id/report endpoint. If your backend doesn't
// have this route yet, this will fail gracefully with an error toast rather
// than falsely claiming success — add the route to make it fully functional.
// ======================================
if (reportListingBtn) {
  reportListingBtn.addEventListener("click", () => {
    if (!localStorage.getItem("unithrift_session_token")) {
      return showToast("Please login to report a listing.", "warning");
    }
    reportModal.style.display = "flex";
  });
}
if (closeReportModal) closeReportModal.addEventListener("click", () => reportModal.style.display = "none");
if (reportForm) {
  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const reason = document.getElementById("reportReason").value;
    const details = document.getElementById("reportDetails").value.trim();
    const submitBtn = reportForm.querySelector("button[type='submit']");

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    try {
      const res = await authFetch(`/api/products/${productId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, details })
      });
      const result = await res.json().catch(() => ({ success: false }));

      if (result.success) {
        showToast("Report submitted. Thank you for keeping campus trading safe.", "success");
        reportModal.style.display = "none";
        reportForm.reset();
      } else {
        showToast(result.message || "Couldn't submit the report. Please try again.", "error");
      }
    } catch (err) {
      console.error("Report submission failed:", err);
      showToast("Couldn't submit the report. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Report';
    }
  });
}

// ======================================
// STICKY MOBILE ACTION BAR
// ======================================
if (mobileAddCartBtn) {
  mobileAddCartBtn.addEventListener("click", () => {
    const cartBtn = document.getElementById("addCartBtn");
    if (cartBtn && !cartBtn.disabled) cartBtn.click();
  });
}

// ======================================
// RELATED LISTINGS / MORE FROM THIS SELLER
// Both reuse GET /api/products (the same full listing the marketplace page
// uses) and filter client-side, rather than assuming dedicated
// category/seller-filtered endpoints exist.
// ======================================
function renderProductStrip(container, products, emptyParentBlock) {
  if (!container) return;
  if (!products || products.length === 0) {
    if (emptyParentBlock) emptyParentBlock.style.display = "none";
    return;
  }

  container.innerHTML = products.map(p => `
    <a class="related-card" href="/product.html?id=${p.id}">
      <img src="${p.image_url || 'https://placehold.co/300x200?text=UniThrift'}" alt="${escapeHtml(p.title)}">
      <div class="related-card-body">
        <div class="related-card-title">${escapeHtml(p.title)}</div>
        <div class="related-card-price">₹${Number(p.price).toLocaleString('en-IN')}</div>
      </div>
    </a>
  `).join("");

  if (emptyParentBlock) emptyParentBlock.style.display = "block";
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadRelatedListings(category, excludeId) {
  if (!category || !relatedSection || !relatedStrip) return;
  try {
    const response = await fetch('/api/products');
    const result = await response.json();
    if (!result.success) return;

    const related = (result.products || [])
      .filter(p => p.category === category && String(p.id) !== String(excludeId) && !p.is_sold)
      .slice(0, 6);

    if (related.length > 0) {
      renderProductStrip(relatedStrip, related);
      relatedSection.style.display = "block";
    }
  } catch (err) {
    console.error("Failed to load related listings:", err);
  }
}

async function loadMoreFromSeller(sellerId, excludeId) {
  if (!sellerId || !moreFromSellerBlock || !moreFromSellerStrip) return;
  try {
    const response = await fetch('/api/products');
    const result = await response.json();
    if (!result.success) return;

    const sellerListings = (result.products || [])
      .filter(p => String(p.seller_id || p.user_id) === String(sellerId) && String(p.id) !== String(excludeId) && !p.is_sold)
      .slice(0, 6);

    renderProductStrip(moreFromSellerStrip, sellerListings, moreFromSellerBlock);
  } catch (err) {
    console.error("Failed to load more listings from seller:", err);
  }
}

// ======================================
// RECENTLY VIEWED (client-side only, via localStorage)
// ======================================
function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem("recently_viewed")) || []; }
  catch { return []; }
}

function addToRecentlyViewed(product, imageUrl) {
  if (!product) return;
  let list = getRecentlyViewed().filter(p => String(p.id) !== String(product.id));
  list.unshift({
    id: product.id,
    title: product.title,
    price: product.price,
    image_url: imageUrl || ""
  });
  list = list.slice(0, 10);
  localStorage.setItem("recently_viewed", JSON.stringify(list));
}

function renderRecentlyViewed(excludeId) {
  if (!recentlyViewedSection || !recentlyViewedStrip) return;
  const list = getRecentlyViewed().filter(p => String(p.id) !== String(excludeId)).slice(0, 8);
  if (list.length === 0) return;

  renderProductStrip(recentlyViewedStrip, list);
  recentlyViewedSection.style.display = "block";
}

if (typeof productId !== 'undefined' && productId) {
  loadProduct();
} else if (productTitle) {
  productTitle.textContent = "Invalid Product ID";
}