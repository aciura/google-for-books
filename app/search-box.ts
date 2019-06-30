import { Carousel } from "./carousel";

const template = document.createElement("template");
template.innerHTML = `
  <input id="searchBox" type="text" />
  <input id="searchBtn" type="button" value="Search" />
  <carousel-element></carousel-element>
`;

export class SearchBox extends HTMLElement {
  _shadowRoot: ShadowRoot;
  input: HTMLInputElement | null;
  btn: HTMLElement | null;
  carousel: Carousel | null;

  constructor() {
    super();

    console.log("SearchBox constructor");

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.input = this._shadowRoot.getElementById(
      "searchBox"
    ) as HTMLInputElement;
    this.btn = this._shadowRoot.getElementById("searchBtn");

    this.carousel = this._shadowRoot.querySelector("carousel-element");
    console.log("carousel", this.carousel);
    if (this.btn) {
      this.btn.addEventListener("click", this.searchBtnClicked);
    }
  }

  searchBtnClicked = async () => {
    const query = this.input ? this.input.value : "";

    console.log("search clicked", query);

    const response = await fetch(
      "http://openlibrary.org/search.json?title=" + query
    );
    const parsed = await response.json();
    console.log(parsed);

    const books = parsed.docs
      .filter((doc: any) => doc.isbn)
      .map((doc: any) => doc);

    if (this.carousel) this.carousel.books = books;
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
  };
}

customElements.define("search-box", SearchBox);
