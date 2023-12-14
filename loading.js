let loaderEl = document.createElement("img");
loaderEl.src = "./images/cat-paws.jpg"
loaderEl.classList.add("loader")

export function ShowLoader() {
    document.body.appendChild(loaderEl);
}

export function HideLoader() {
    document.body.removeChild(loaderEl);
}