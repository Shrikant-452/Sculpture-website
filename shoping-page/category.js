const displayCategoryContainer = (data) => {
  let imageSection = document.getElementById("category-box");
  imageSection.innerHTML = "";
  Object.keys(data).forEach((item) => {
    const element = data[item];
    imageSection.innerHTML += `<div class="column has-text-centered is-4-touch is-2-desktop">
                    <div class="px-2">
                        <a href="../shoping-page/statues.html" title="${element.title}"><img src="${element.img}" title="Hindu Statues" alt="${element.title}" width="155" height="155">
                        </a> 
                    </div>
                        <div class="title is-size-7 is-size-6-desktop is-family-secondary is-uppercase pt-3"><a href="/statues.html" title="Hindu Statues">${element.title}</a></div>
                </div>`;
  });
};

function displayCategory() {
  console.log("Hello");
  fetch("../category.json")
    .then((res) => res.json())
    .then((data) => {
      displayCategoryContainer(data);
    });
}

displayCategory();
