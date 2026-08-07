document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("unithrift_session_token");
    if (!token) { window.location.href = '/'; return; }

    // ======================================
    // TOASTS
    // ======================================
    const toastContainer = document.getElementById("toastContainer");

    function showToast(message, type = "info", duration = 4000) {
        if (!toastContainer) return;

        const icons = {
            success: "fa-check",
            error: "fa-xmark",
            warning: "fa-exclamation",
            info: "fa-info"
        };

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
    // THEME TOGGLE (synced with marketplace/profile via the shared "theme" key)
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
    // IMAGE PREVIEW
    // ======================================
    const imageInput = document.getElementById("productImages");
    const previewContainer = document.getElementById("previewContainer");

    imageInput.addEventListener("change", () => {
        previewContainer.innerHTML = "";
        Array.from(imageInput.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.className = "preview-image";
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
        updateLivePreviewImage();
    });

    // ======================================
    // LIVE LISTING PREVIEW
    // ======================================
    const lpImage            = document.getElementById("lpImage");
    const lpImagePlaceholder = document.getElementById("lpImagePlaceholder");
    const lpTitle             = document.getElementById("lpTitle");
    const lpCategory          = document.getElementById("lpCategory");
    const lpCondition         = document.getElementById("lpCondition");
    const lpPrice             = document.getElementById("lpPrice");
    const lpDesc              = document.getElementById("lpDesc");
    const lpLocation          = document.getElementById("lpLocation")?.querySelector("span");

    const titleInput           = document.getElementById("title");
    const categoryInput        = document.getElementById("category");
    const conditionInput       = document.getElementById("condition");
    const priceInput           = document.getElementById("price");
    const descriptionInput     = document.getElementById("description");
    const collectionPointInput = document.getElementById("collectionPoint");

    function updateLivePreviewImage() {
        const file = imageInput.files[0];
        if (!file) {
            lpImage.style.display = "none";
            lpImagePlaceholder.style.display = "flex";
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            lpImage.src = e.target.result;
            lpImage.style.display = "block";
            lpImagePlaceholder.style.display = "none";
        };
        reader.readAsDataURL(file);
    }

    function updateLivePreview() {
        lpTitle.textContent    = titleInput.value.trim() || "Your item name";
        lpCategory.textContent = categoryInput.value || "Category";
        lpCondition.textContent = conditionInput.value || "Condition";
        const price = parseFloat(priceInput.value);
        lpPrice.textContent = "₹" + (Number.isFinite(price) ? price.toLocaleString('en-IN') : "0");
        lpDesc.textContent = descriptionInput.value.trim() || "Your description will appear here as you type...";
        if (lpLocation) lpLocation.textContent = collectionPointInput.value.trim() || "Pickup point not set";
    }

    [titleInput, categoryInput, conditionInput, priceInput, descriptionInput, collectionPointInput]
        .forEach(el => el && el.addEventListener("input", updateLivePreview));
    [categoryInput, conditionInput].forEach(el => el && el.addEventListener("change", updateLivePreview));

    updateLivePreview();

    // ======================================
    // FORM SUBMIT → UPLOAD IMAGES → CREATE LISTING WITH AI CHECK
    // ======================================
    const sellForm = document.getElementById("sellForm");
    const verificationStatus = document.getElementById("verificationStatus");

    function setVerificationStatus(html, state) {
        verificationStatus.className = `ver-status ver-status--${state}`;
        verificationStatus.innerHTML = html;
    }

    sellForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = sellForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI Verifying... Please wait.';
        setVerificationStatus('<i class="fas fa-spinner fa-spin"></i> <span>Analyzing files and matching product characteristics...</span>', "working");

        const title           = titleInput.value.trim();
        const category        = categoryInput.value;
        const price           = priceInput.value;
        const condition       = conditionInput.value;
        const description     = descriptionInput.value.trim();
        const collectionPoint = collectionPointInput.value.trim();
        const contactNo       = document.getElementById("contactNo").value.trim();
        const deliveryDate    = document.getElementById("deliveryDate").value;
        const paymentMethods  = document.getElementById("paymentMethods").value.trim();
        const files           = imageInput.files;

        const turnstileToken  = document.querySelector('#sellForm [name="cf-turnstile-response"]')?.value;

        if (!turnstileToken) {
            setVerificationStatus('<i class="fas fa-triangle-exclamation"></i> <span>Please complete the security check.</span>', "error");
            showToast("Please complete the security check.", "warning");
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-circle-check"></i> Publish Listing';
            return;
        }

        try {
            let image_urls = [];

            if (files.length > 0) {
                setVerificationStatus('<i class="fas fa-spinner fa-spin"></i> <span>Uploading images for model vision parsing...</span>', "working");

                const uploadPromises = Array.from(files).map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = async ev => {
                            try {
                                const res = await authFetch('/api/listings/upload-image', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        name: file.name,
                                        type: file.type,
                                        data: ev.target.result.split(',')[1]
                                    })
                                });
                                const result = await res.json();
                                if (result.success) resolve(result.url);
                                else reject(result.message);
                            } catch (err) { reject(err); }
                        };
                        reader.readAsDataURL(file);
                    });
                });

                image_urls = await Promise.all(uploadPromises);
                setVerificationStatus('<i class="fas fa-robot"></i> <span>Processing images through Gemini AI pipeline...</span>', "working");
            } else {
                throw new Error("You must upload at least one product picture for AI validation checks.");
            }

            const res = await authFetch('/api/listings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    category,
                    price,
                    condition,
                    description,
                    collection_point: collectionPoint,
                    contact_no: contactNo,
                    delivery_date: deliveryDate,
                    payment_methods: paymentMethods,
                    image_urls,
                    'cf-turnstile-response': turnstileToken
                })
            });

            const result = await res.json();
            if (!result.success) throw new Error(result.message);

            setVerificationStatus('<i class="fas fa-circle-check"></i> <span>Verified and Listed successfully!</span>', "success");
            showToast("Listing published successfully!", "success");
            setTimeout(() => { window.location.href = '/marketplace'; }, 1000);

        } catch (err) {
            console.error(err);
            if (window.turnstile) turnstile.reset();
            setVerificationStatus(`<i class="fas fa-circle-xmark"></i> <span>Failed: ${err.message}</span>`, "error");
            showToast("Error: " + err.message, "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-circle-check"></i> Publish Listing';
        }
    });
});