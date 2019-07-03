import { Carousel } from "./carousel";

declare const webkitSpeechRecognition: any;

const template = document.createElement("template");
template.innerHTML = `
  <input id="searchBox" type="text" />
  <input id="searchBtn" type="button" value="Search" />
  <input id="voiceBtn" type="button" value="Voice" />
  <div id="searchTime"><span></span></div>
  <carousel-element></carousel-element>
`;

export class SearchBox extends HTMLElement {
  _shadowRoot: ShadowRoot;
  input: HTMLInputElement | null;
  btn: HTMLElement | null;
  carousel: Carousel | null;
  searchTime: HTMLElement | null;
  voiceBtn: HTMLElement | null;

  constructor() {
    super();

    console.log("SearchBox constructor");

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.input = this._shadowRoot.getElementById(
      "searchBox"
    ) as HTMLInputElement;
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

  fetchBooksBy = async (title: string) => {
    if (this.carousel) this.carousel.reset();

    try {
      const response = await fetch(
        "http://openlibrary.org/search.json?title=" + title
      );
      this.displaySearchTime(new Date());

      const parsed = await response.json();

      const books = parsed.docs
        .filter((doc: any) => doc.cover_i)
        .map((doc: any) => doc);

      if (this.carousel) this.carousel.books = books;
    } catch (error) {
      console.error("Error", error);
    }
  };

  speechRecognition = () => {
    const recognition = new webkitSpeechRecognition();

    recognition.onresult = (event: any) => {
      console.log("Voice recognition result", event.results);

      const text = event.results[0][0].transcript;

      if (this.input) this.input.value = text;
      if (text) this.fetchBooksBy(text);
    };
    recognition.start();
  };

  searchBtnClicked = async () => {
    const title = this.input ? this.input.value : "";
    console.log("Search clicked", title);

    this.fetchBooksBy(title);
  };

  displaySearchTime = (date: Date) => {
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
}

customElements.define("search-box", SearchBox);
