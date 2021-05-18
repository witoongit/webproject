const returnDate = document.querySelector("#returnDate")

const tabs = document.querySelectorAll(".flight-tab")
tabs.forEach((tab) => {
        tab.addEventListener("click", tabswap)
});


function tabswap() {
    tabs.forEach((tab) => {
        tab.classList.toggle("notactive");
       
    });
     returnDate.toggleAttribute("Disabled")
}


