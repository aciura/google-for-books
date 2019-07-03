var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
  <input id="searchBox" type="text" />
  <input id="searchBtn" type="button" value="Search" />
  <input id="voiceBtn" type="button" value="Voice" />
  <div id="searchTime"><span></span></div>
  <carousel-element></carousel-element>
`;
    class SearchBox extends HTMLElement {
        constructor() {
            super();
            this.fetchBooksBy = (title) => __awaiter(this, void 0, void 0, function* () {
                if (this.carousel)
                    this.carousel.reset();
                try {
                    const response = yield fetch("http://openlibrary.org/search.json?title=" + title);
                    this.displaySearchTime(new Date());
                    const parsed = yield response.json();
                    const books = parsed.docs
                        .filter((doc) => doc.cover_i)
                        .map((doc) => doc);
                    if (this.carousel)
                        this.carousel.books = books;
                }
                catch (error) {
                    console.error("Error", error);
                }
            });
            this.speechRecognition = () => {
                const recognition = new webkitSpeechRecognition();
                recognition.onresult = (event) => {
                    console.log("Voice recognition result", event.results);
                    const text = event.results[0][0].transcript;
                    if (this.input)
                        this.input.value = text;
                    if (text)
                        this.fetchBooksBy(text);
                };
                recognition.start();
            };
            this.searchBtnClicked = () => __awaiter(this, void 0, void 0, function* () {
                const title = this.input ? this.input.value : "";
                console.log("Search clicked", title);
                this.fetchBooksBy(title);
            });
            this.displaySearchTime = (date) => {
                if (this.searchTime) {
                    const options = {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: false
                    };
                    const dateFormatter = Intl.DateTimeFormat(navigator.language, options);
                    const span = document.createElement("span");
                    span.innerText = "Fetched at " + dateFormatter.format(date);
                    if (this.searchTime.firstElementChild) {
                        this.searchTime.replaceChild(span, this.searchTime.firstElementChild);
                    }
                }
            };
            console.log("SearchBox constructor");
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this.input = this._shadowRoot.getElementById("searchBox");
            this.btn = this._shadowRoot.getElementById("searchBtn");
            if (this.btn) {
                this.btn.addEventListener("click", this.searchBtnClicked);
            }
            this.carousel = this._shadowRoot.querySelector("carousel-element");
            this.searchTime = this._shadowRoot.getElementById("searchTime");
            this.voiceBtn = this._shadowRoot.getElementById("voiceBtn");
            if (this.voiceBtn)
                this.voiceBtn.addEventListener("click", this.speechRecognition);
        }
    }
    exports.SearchBox = SearchBox;
    customElements.define("search-box", SearchBox);
});
//# sourceMappingURL=search-box.js.map