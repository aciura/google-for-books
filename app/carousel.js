(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const template = document.createElement("template");
    template.innerHTML = `
  <link rel="stylesheet" type="text/css" href="carousel.css" />
  <div class="carousel-wrapper">
    <div id="loader">
      <img src="../image/loader.gif" />
    </div>
    <div class="carousel" id="carousel">
    </div>
  </div>
`;
    const CarouselScrollDelay = 2500;
    class Carousel extends HTMLElement {
        constructor() {
            super();
            this._books = [];
            this.activeItem = 0;
            this.isPlaying = true;
            this.timeoutHandleId = 0;
            this.hideLoader = () => {
                if (this.loader)
                    this.loader.style.display = "none";
            };
            this.showLoader = () => {
                if (this.loader)
                    this.loader.style.display = "block";
            };
            this.scrollCarousel = () => {
                this.hideLoader();
                if (this.carousel) {
                    const photos = this.carousel.querySelectorAll(".carousel__photo");
                    const prevItem = (this.activeItem - 1 + photos.length) % photos.length;
                    photos[prevItem].setAttribute("class", "carousel__photo");
                    const newActiveItem = (this.activeItem + 1) % photos.length;
                    preloadImage(photos[newActiveItem]);
                    photos[this.activeItem].setAttribute("class", "carousel__photo prev");
                    photos[newActiveItem].setAttribute("class", "carousel__photo active");
                    const nextItem = (newActiveItem + 1) % photos.length;
                    preloadImage(photos[nextItem]);
                    photos[nextItem].setAttribute("class", "carousel__photo next");
                    this.activeItem = newActiveItem;
                }
                this.timeoutHandleId = window.setTimeout(this.scrollCarousel, CarouselScrollDelay);
            };
            this.handleVisibilityChange = () => {
                if (document.hidden) {
                    document.title = "Hidden";
                    this.isPlaying = false;
                }
                else {
                    document.title = "Playing";
                    this.isPlaying = true;
                }
            };
            console.log("Carousel constructor");
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this.carousel = this._shadowRoot.querySelector("div.carousel");
            this.loader = this._shadowRoot.getElementById("loader");
            this.hideLoader();
            // Handle page visibility change
            document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
        }
        get books() {
            return this._books;
        }
        set books(array) {
            console.log("carousel: set books");
            this.activeItem = 0;
            this._books = array;
            this.setAttribute("books", this._books.length.toString());
            //From Documentation:
            //The URL pattern to access book covers is:
            //http://covers.openlibrary.org/b/$key/$value-$size.jpg
            //Where:
            // key can be any one of ISBN, OCLC, LCCN, OLID and ID (case-insensitive)
            // value is the value of the chosen key
            // size can be one of S, M and L for small, medium and large respectively.
            // example: http://covers.openlibrary.org/b/ISBN/9789172630710-L.jpg
            const documentWidth = document.documentElement.clientWidth;
            let imageSize = "L";
            if (documentWidth <= 501)
                imageSize = "S";
            else if (documentWidth <= 1000)
                imageSize = "M";
            for (let book of this._books) {
                const imageKey = `${book.cover_i}-${imageSize}.jpg`;
                const img = document.createElement("img");
                img.setAttribute("class", "carousel__photo");
                img.setAttribute("data-src", `http://covers.openlibrary.org/b/ID/${imageKey}?default=false`);
                img.setAttribute("onerror", "this.onerror=null;this.src='../image/placeholder.png'");
                if (this.carousel)
                    this.carousel.appendChild(img);
            }
            this.scrollCarousel();
        }
        reset() {
            console.log("reset");
            this.showLoader();
            window.clearTimeout(this.timeoutHandleId);
            this._books = [];
            this.activeItem = 0;
            this.isPlaying = false;
            if (this.carousel) {
                this.removeChildren(this.carousel);
            }
        }
        removeChildren(carousel) {
            while (carousel.childElementCount) {
                if (carousel.firstElementChild)
                    carousel.removeChild(carousel.firstElementChild);
            }
        }
    }
    exports.Carousel = Carousel;
    function preloadImage(element) {
        if (element && element.hasAttribute("data-src")) {
            element.setAttribute("src", element.getAttribute("data-src") || "");
            element.removeAttribute("data-src");
        }
    }
    customElements.define("carousel-element", Carousel);
});
//# sourceMappingURL=carousel.js.map