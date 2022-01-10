const pageLinks = document.querySelectorAll(".page-link");
const sections = document.querySelectorAll(".sections");
const pageItems = document.querySelectorAll(".page-item");
sections[0].classList.value = "sections";
pageItems[0].classList.value = "page-item active";
const pageNum = pageLinks.length;

for (let p = 0; p < pageNum; p++) {
    if (p === 0) {
        pageItems[p].classList.value = "page-item active";
    } else {
        if (p < 5 && pageItems[p]) {
            pageItems[p].classList.value = "page-item";
        } else {
            pageItems[p].classList.value = "page-item d-none"
        }
    }
}
pageLinks.forEach((pageLink, k) => {
    pageLink.addEventListener('click', function(e) {
        for (let section of sections) {
            section.classList.value = "sections d-none";
        }
        for (let pageItem of pageItems) {
            pageItem.classList.value = "page-item d-none";
        }
        sections[k].classList.value = "sections";
        let l = k === pageNum - 1 ? pageNum - 5 : (k === pageNum - 2 ? pageNum - 5 : (k > 1 ? k - 2 : (k > 0 ? k - 1 : k)));
        console.log(l + 1);
        for (let m = l; m < l + 5; m++) {
            if (pageItems[m]) {
                pageItems[m].classList.value = "page-item ";
            }
        }
        pageItems[k].classList.value = "page-item active";
    })
})