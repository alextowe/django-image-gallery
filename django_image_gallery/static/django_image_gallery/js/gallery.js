const gallery = document.getElementById("image-gallery");
const galleryGrid = gallery?.querySelector(".gallery-grid");

if (galleryGrid) {
    imagesLoaded(galleryGrid, function () {
        galleryGrid.masonry = new Masonry(galleryGrid, {
            itemSelector: ".gallery-item",
            columnWidth: ".gallery-item",
            percentPosition: true,
        });
    });
}

const galleryModal = document.getElementById("image-gallery-modal");
const modalImages = galleryModal?.querySelectorAll(".gallery-modal-image");
const closeButton = galleryModal?.querySelector(".gallery-close");
const previousButton = galleryModal?.querySelector(".gallery-prev");
const nextButton = galleryModal?.querySelector(".gallery-next");

let currentIndex = 0;
let modalHideTimeout = null;

function showGalleryImage(index, direction = 1) {
    if (!modalImages?.length) {
        return;
    }

    if (index < 0) {
        index = modalImages.length - 1;
    }

    if (index >= modalImages.length) {
        index = 0;
    }

    modalImages.forEach(function (image) {
        image.hidden = true;
        image.classList.remove("gallery-slide-in-left", "gallery-slide-in-right");
    });

    const image = modalImages[index];

    image.hidden = false;

    image.classList.add(
        direction === 1
            ? "gallery-slide-in-right"
            : "gallery-slide-in-left"
    );

    currentIndex = index;
}

function openGallery(index) {
    if (!galleryModal) {
        return;
    }

    if (modalHideTimeout) {
        clearTimeout(modalHideTimeout);
        modalHideTimeout = null;
    }

    showGalleryImage(index);

    galleryModal.hidden = false;

    requestAnimationFrame(function () {
        galleryModal.classList.add("is-open");
    });

    galleryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("image-gallery-open");

    galleryModal.focus();
}

function closeGallery() {
    if (!galleryModal) {
        return;
    }

    galleryModal.classList.remove("is-open");
    galleryModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("image-gallery-open");

    modalHideTimeout = setTimeout(function () {
        galleryModal.hidden = true;
        modalHideTimeout = null;
    }, 500);
}

gallery?.addEventListener("click", function (event) {
    const image = event.target.closest(".gallery-image");

    if (!image) {
        return;
    }

    openGallery(parseInt(image.dataset.index, 10));
});

closeButton?.addEventListener("click", closeGallery);

previousButton?.addEventListener("click", function (event) {
    event.preventDefault();
    showGalleryImage(currentIndex - 1, -1);
});

nextButton?.addEventListener("click", function (event) {
    event.preventDefault();
    showGalleryImage(currentIndex + 1, 1);
});

galleryModal?.addEventListener("click", function (event) {
    if (!event.target.closest(".image-gallery-modal-content")) {
        closeGallery();
    }
});

window.addEventListener("keydown", function (event) {
    if (!galleryModal || galleryModal.hidden) {
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        closeGallery();
        return;
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        showGalleryImage(currentIndex - 1, -1);
        return;
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        showGalleryImage(currentIndex + 1, 1);
        return;
    }
}, true);

const loadMoreButton = document.getElementById("image-gallery-load-more");
const hideButton = document.getElementById("image-gallery-hide");
const template = document.getElementById("image-gallery-template");

let loadedItems = [];

if (loadMoreButton) {
    loadMoreButton.addEventListener("click", function () {
        const fragment = template.content.cloneNode(true);
        loadedItems = Array.from(fragment.children);

        galleryGrid.appendChild(fragment);

        imagesLoaded(loadedItems, function () {
            galleryGrid.masonry.appended(loadedItems);
        });

        loadMoreButton.hidden = true;
        hideButton.hidden = false;
    });
}

if (hideButton) {
    hideButton.addEventListener("click", function () {
        galleryGrid.masonry.remove(loadedItems);
        galleryGrid.masonry.layout();

        loadedItems = [];

        loadMoreButton.hidden = false;
        hideButton.hidden = true;

        gallery.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
}
