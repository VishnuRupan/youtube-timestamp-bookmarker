var videoHeartIcon = document.querySelectorAll(".heart-icon");
var iconCtn = document.querySelector(".icon-ctn");
var menuCtn = document.querySelector(".menu-ctn");
var settingsCtn = document.querySelector("#settings");
var searchInput = document.getElementById("search-input");
var addVideoTitleBtn = document.querySelectorAll(".add-video-title");

var likedVideoFilter = document.getElementById("likes-select-filter");
var dateVideoFilter = document.getElementById("date-select-filter");
var clearListBtn = document.getElementById("clear-list-btn");
var rootElement = document.body;

window.addEventListener("DOMContentLoaded", async function () {
  await renderVideoBookmarkList();

  const toggle = document.querySelector("#toggle");

  var setTheme = (await chrome.storage.sync.get("theme")).theme;
  if (setTheme) rootElement.classList.toggle("lightMode");
  toggle.checked = setTheme;

  [...document.querySelectorAll(".remove-btn")].forEach(function (item) {
    item.addEventListener("click", removeVideoFromList);
  });

  [...document.querySelectorAll(".heart-icon")].forEach(function (item) {
    item.addEventListener("click", heartIconToggle);
  });

  [...document.querySelectorAll(".add-video-title")].forEach(function (item) {
    item.addEventListener("click", updatedVideoTitle);
  });

  searchInput.addEventListener("keyup", searchFilter);
  menuCtn.addEventListener("click", menuToggle);
  likedVideoFilter.addEventListener("click", videoLikesFilter);
  dateVideoFilter.addEventListener("click", dateFilter);

  toggle.addEventListener("click", async function (item) {
    var themeToggle = rootElement.classList.toggle("lightMode");
    await chrome.storage.sync.set({ theme: themeToggle });
    toggle.checked = themeToggle;
  });

  clearListBtn.addEventListener("click", async function () {
    if (confirm("Are you sure you want to clear your bookmark list?"))
      await chrome.storage.sync.remove("videoObj");
  });
});

chrome.storage.onChanged.addListener(async function () {
  await renderVideoBookmarkList();

  [...document.querySelectorAll(".remove-btn")].forEach(function (item) {
    item.addEventListener("click", removeVideoFromList);
  });

  [...document.querySelectorAll(".heart-icon")].forEach(function (item) {
    item.addEventListener("click", heartIconToggle);
  });

  [...document.querySelectorAll(".add-video-title")].forEach(function (item) {
    item.addEventListener("click", updatedVideoTitle);
  });
});

async function renderVideoBookmarkList(event, area) {
  document.querySelector("#video-list-ctn").innerHTML = "";

  let bkmarkImg = document.createElement("img");
  bkmarkImg.src = chrome.runtime.getURL("images/bookmark.svg");

  let videoArr = await chrome.storage.sync.get("videoObj");

  let ul = document.createElement("ul");
  ul.className = "video-ul";

  for (let video of videoArr.videoObj) {
    ul.innerHTML += ` 
        <li>
        <div class="card-ctn ctn" id="${video.url}">
            <div class="section-info d-row">
                <div class="img-ctn ctn">
                  <a href="${video.urlTimestamp}" target="_blank" class="cursor">
                    <img src="${video.thumbnail}" alt="video thumbnail">
                  </a>
                </div>
                <div class="info-ctn ctn d-column">
                    <a href="${video.urlTimestamp}" target="_blank" class="title-url cursor">
                        <h2 class="title"> ${video.title} </h2>
                    </a>
                    <div class="video-details-ctn d-row">
                        <div class="icon-details d-row">
                            <img class="icon calender" src="./images/calender-icon.svg" alt="">
                            <span>${video.dateUpdated}</span>
                        </div>
                        <div class="icon-details">
                            <img class="icon" src="./images/clock.svg" alt="">
                            <span>${video.timeStamp} / ${video.videoLength}</span>
                        </div>
                    </div>
                    <div class="input-ctn d-row">
                        <input id="input-${video.url}" type="text" placeholder="bookmark a name"
                            class="bookmark-name text-input">
                        <img id="add-${video.url}" class="add-video-title icon cursor" src="./images/plus-button.svg" alt="">
                    </div>
                </div>
            </div>
            <div class="section-icons d-row">
                <div class="icon-ctn ctn d-column">
                    <div class="icon heart cursor">
                        <img id="heart-icon" class="${video.heart} heart-icon" src="./images/${video.heart}-heart.svg" alt="">
                    </div>
                    <div class="icon trashcan cursor remove-btn">
                        <img src="./images/trashcan.svg" alt="">
                    </div>
                </div>
                <div class="right-arrow-ctn ctn d-row">
                  <a href="${video.urlTimestamp}" target="_blank" class="title-url cursor">
                    <img class="icon cursor" src="./images/right-arrow.svg" alt="">
                  </a>
                </div>
            </div>
        </div>
      </li>
    `;
  }
  //document.querySelector('#video-list-ctn').innerHTML = "";
  document.querySelector("#video-list-ctn").appendChild(ul);
}

async function removeVideoFromList(item) {
  const removeUrl = item.target.closest(".card-ctn").id;
  let videoArr = (await chrome.storage.sync.get("videoObj")).videoObj;

  for (let video of videoArr) {
    if (video.url === removeUrl) {
      let index = videoArr.indexOf(video);
      if (index > -1) {
        videoArr.splice(index, 1);
      }
      await chrome.storage.sync.set({ videoObj: videoArr });
    }
  }
}

async function updatedVideoTitle(item) {
  const idString = item.target.id.toString().substring(4);
  const inputField = document.getElementById(`input-${idString}`);

  let videoObject = await chrome.storage.sync.get("videoObj");
  let videoArr = videoObject.videoObj;

  let video = videoArr.find((vid) => {
    return vid.url === idString;
  });

  video.title = inputField.value;

  await chrome.storage.sync.set({ videoObj: videoArr });
}

async function heartIconToggle(item) {
  heartIcon = item.target;
  let videoArr = (await chrome.storage.sync.get("videoObj")).videoObj;

  let videoID = heartIcon.closest(".card-ctn").id;

  videoArr.forEach((video, val) => {
    if (video.url === videoID) {
      if (heartIcon.classList.contains("open")) {
        heartIcon.src = "./images/close-heart.svg";
        heartIcon.classList.add("close");
        heartIcon.classList.remove("open");
        videoArr[val].heart = "close";
      } else {
        heartIcon.src = "./images/open-heart.svg";
        heartIcon.classList.add("open");
        heartIcon.classList.remove("close");
        videoArr[val].heart = "open";
      }
    }
  });

  await chrome.storage.sync.set({ videoObj: videoArr });
}

async function searchFilter() {
  let filter, ul, li, a, i, txtValue;

  filter = searchInput.value.toUpperCase();

  ul = document.querySelector(".video-ul");

  li = ul.querySelectorAll("li");

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("h2")[0];

    if (!a.innerText || !a.textContent) {
      txtValue = li[i].getElementsByTagName("h2")[0];
    } else txtValue = a.textContent || a.innerText;

    if (txtValue.toUpperCase().indexOf(filter) > -1) li[i].style.display = "";
    else li[i].style.display = "none";
  }
}

async function menuToggle() {
  if (settingsCtn.classList.contains("close-menu")) {
    settingsCtn.classList.add("open-menu");
    settingsCtn.classList.remove("close-menu");
  } else {
    settingsCtn.classList.add("close-menu");
    settingsCtn.classList.remove("open-menu");
  }
}

async function videoLikesFilter(item) {
  let selectedOption = item.target.value;
  let ul, li, heartIcon;

  ul = document.querySelector(".video-ul");
  li = ul.querySelectorAll("li");

  if (selectedOption === "Liked") {
    for (i = 0; i < li.length; i++) {
      heartIcon = li[i].getElementsByClassName("heart-icon")[0];
      if (heartIcon.classList.contains("close")) li[i].style.display = "";
      else li[i].style.display = "none";
    }
  } else {
    for (i = 0; i < li.length; i++) {
      heartIcon = li[i].getElementsByClassName("heart-icon")[0];
      li[i].style.display = "";
    }
  }
}

async function dateFilter(item) {
  let selectedOption = item.target.value;

  let ul, li;

  ul = document.querySelector(".video-ul");
  li = ul.querySelectorAll("li");

  let videoArr = (await chrome.storage.sync.get("videoObj")).videoObj;

  let result;
  if (selectedOption === "Oldest")
    result = videoArr.sort(
      (date1, date2) =>
        Date.parse(date1.dateUpdated) - Date.parse(date2.dateUpdated)
    );
  else
    result = videoArr.sort(
      (date1, date2) =>
        Date.parse(date2.dateUpdated) - Date.parse(date1.dateUpdated)
    );

  await chrome.storage.sync.set({ videoObj: result });
  likedVideoFilter.value = "All";
}

///////////////////////////// UPDATES /////////////////////////////
