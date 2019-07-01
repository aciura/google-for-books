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
  <div class="carousel" id="carousel">
    <div class="carousel__button--next"></div>
    <div class="carousel__button--prev"></div>
  </div>
</div>`;
    const CarouselScrollDelay = 2500;
    class Carousel extends HTMLElement {
        constructor() {
            super();
            this._books = [];
            this.isPlaying = true;
            this.scrollCarousel = () => {
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
                setTimeout(this.scrollCarousel, CarouselScrollDelay);
            };
            this.initActiveItem = () => {
                if (this.carousel) {
                    const photos = this.carousel.querySelectorAll(".carousel__photo");
                    preloadImage(photos[this.activeItem]);
                    photos[this.activeItem].setAttribute("class", "carousel__photo active");
                }
                setTimeout(this.scrollCarousel, CarouselScrollDelay);
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
            this.activeItem = 0;
            // Handle page visibility change
            document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
        }
        get books() {
            return this._books;
        }
        set books(newValue) {
            console.log("carousel: new books set:", newValue);
            this.activeItem = 0;
            this._books = newValue;
            this.setAttribute("books", this._books.length.toString());
            for (let book of this._books) {
                const img = document.createElement("img");
                img.setAttribute("class", "carousel__photo");
                img.setAttribute("data-src", `http://covers.openlibrary.org/b/ISBN/${book.isbn[0]}-L.jpg`);
                if (this.carousel)
                    this.carousel.appendChild(img);
            }
            this.initActiveItem();
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
// let itemClassName = "carousel__photo";
// let items = document.getElementsByClassName(itemClassName);
// console.log("items:", items);
// let totalItems = items.length;
// let slide = 0;
// let moving = true;
// function moveNext() {
//   console.log("moveNext");
//   if (!moving) {
//     slide = slide + (1 % totalItems);
//     moveCarouselTo(slide);
//   }
// }
// function movePrev() {
//   console.log("movePrev");
//   if (!moving) {
//     slide = slide - 1;
//     if (slide < 0) {
//       slide = totalItems - 1;
//     }
//     moveCarouselTo(slide);
//   }
// }
// function setInitialClasses() {
//   console.log("setInitialClasses");
//   items[totalItems - 1].classList.add("prev");
//   items[0].classList.add("active");
//   items[1].classList.add("next");
// }
// function setEventListeners() {
//   let next = document.getElementsByClassName("carousel__button--next")[0];
//   let prev = document.getElementsByClassName("carousel__button--prev")[0];
//   next.addEventListener("click", moveNext);
//   prev.addEventListener("click", movePrev);
// }
// function disableInteraction() {
//   moving = true;
//   setTimeout(function() {
//     moving = false;
//   }, 500);
// }
// function moveCarouselTo(slide: any) {
//   console.log("moveCarouselTo", slide, totalItems);
//   if (!moving) {
//     disableInteraction();
//     // Update the "old" adjacent slides with "new" ones
//     var newPrevious = slide - 1,
//       newNext = slide + 1,
//       oldPrevious = slide - 2,
//       oldNext = slide + 2;
//     // Test if carousel has more than three items
//     if (totalItems - 1 > 3) {
//       console.log("slide", slide, totalItems);
//       // Checks and updates if the new slides are out of bounds
//       if (newPrevious <= 0) {
//         oldPrevious = totalItems - 1;
//       } else if (newNext >= totalItems - 1) {
//         oldNext = 0;
//       }
//       // Checks and updates if slide is at the beginning/end
//       if (slide === 0) {
//         newPrevious = totalItems - 1;
//         oldPrevious = totalItems - 2;
//         oldNext = slide + 1;
//       } else if (slide === totalItems - 1) {
//         newPrevious = slide - 1;
//         newNext = 0;
//         oldNext = 1;
//       }
//       // Now we've worked out where we are and where we're going,
//       // by adding/removing classes we'll trigger the transitions.
//       // Reset old next/prev elements to default classes
//       items[oldPrevious].className = itemClassName;
//       items[oldNext].className = itemClassName;
//       // Add new classes
//       items[newPrevious].className = itemClassName + " prev";
//       items[slide].className = itemClassName + " active";
//       items[newNext].className = itemClassName + " next";
//     }
//   }
// }
// function initCarousel() {
//   console.log("initCarousel");
//   setInitialClasses();
//   setEventListeners();
//   // Set moving to false so that the carousel becomes interactive
//   moving = false;
// }
// initCarousel();
//# sourceMappingURL=carousel.js.map