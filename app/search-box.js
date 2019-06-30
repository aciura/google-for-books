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
  <carousel-element></carousel-element>
`;
    class SearchBox extends HTMLElement {
        constructor() {
            super();
            this.searchBtnClicked = () => __awaiter(this, void 0, void 0, function* () {
                const query = this.input ? this.input.value : "";
                console.log("search clicked", query);
                const response = yield fetch("http://openlibrary.org/search.json?title=" + query);
                const parsed = yield response.json();
                console.log(parsed);
                const books = parsed.docs
                    .filter((doc) => doc.isbn)
                    .map((doc) => doc);
                if (this.carousel)
                    this.carousel.books = books;
                // .then(response => response.json())
                // .then(response => console.log(response))
                // .catch(error => {
                //   console.error("ERROR", error);
                // });
                //get cover
                //http://covers.openlibrary.org/b/ISBN/9789172630710-L.jpg
                //The URL pattern to access book covers is:
                //http://covers.openlibrary.org/b/$key/$value-$size.jpg
                //Where:
                // key can be any one of ISBN, OCLC, LCCN, OLID and ID (case-insensitive)
                // value is the value of the chosen key
                // size can be one of S, M and L for small, medium and large respectively.
            });
            console.log("SearchBox constructor");
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this.input = this._shadowRoot.getElementById("searchBox");
            this.btn = this._shadowRoot.getElementById("searchBtn");
            this.carousel = this._shadowRoot.querySelector("carousel-element");
            console.log("carousel", this.carousel);
            if (this.btn) {
                this.btn.addEventListener("click", this.searchBtnClicked);
            }
        }
    }
    exports.SearchBox = SearchBox;
    customElements.define("search-box", SearchBox);
});
//# sourceMappingURL=search-box.js.map