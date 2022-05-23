var videoHeartIcon = document.querySelectorAll(".heart-icon");
let iconCtn = document.querySelector(".icon-ctn");
let menuCtn = document.querySelector(".menu-ctn");
let settingsCtn = document.querySelector("#settings");
let searchInput = document.getElementById("search-input");

let likedVideoFilter = document.getElementById('likes-select-filter');
let dateVideoFilter = document.getElementById('date-select-filter');


window.addEventListener('DOMContentLoaded', async function () {

  await renderVideoBookmarkList();

  [...document.querySelectorAll('.remove-btn')].forEach(function (item) {
    item.addEventListener('click', removeVideoFromList);
  });


  [...document.querySelectorAll('.heart-icon')].forEach(function (item) {
    item.addEventListener('click', heartIconToggle);
  });

  document.getElementById("search-input").addEventListener('keyup', searchFilter);

});



chrome.storage.onChanged.addListener(async function () {

  await renderVideoBookmarkList();

  [...document.querySelectorAll('.remove-btn')].forEach(function (item) {
    item.addEventListener('click', removeVideoFromList);
  });
});


async function renderVideoBookmarkList(event, area) {
  (document.querySelector('#video-list-ctn')).innerHTML = "";

  let bkmarkImg = document.createElement('img');
  bkmarkImg.src = chrome.runtime.getURL("images/bookmark.svg");

  let videoArr = await chrome.storage.sync.get("videoObj");

  let ul = document.createElement('ul');
  ul.className = 'video-ul';

  for (let video of videoArr.videoObj) {

    ul.innerHTML += ` 
        <li>
        <div class="card-ctn ctn" id="${video.url}">
            <div class="section-info d-row">
                <div class="img-ctn ctn">
                    <img src="${video.thumbnail}" alt="">
                </div>
                <div class="info-ctn ctn d-column">
                    <a href="${video.urlTimestamp}" target="_blank" class="title-url">
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
                        <input type="text" placeholder="bookmark a name"
                            class="bookmark-name text-input">
                        <img class="icon cursor" src="./images/plus-button.svg" alt="">
                    </div>
                </div>
            </div>
            <div class="section-icons d-row">
                <div class="icon-ctn ctn d-column">
                    <div class="icon heart cursor">
                        <img id="heart-icon" class="${video.heart} heart-icon" src="./images/${video.heart}-heart.svg" alt="">
                    </div>
                    <div class="icon trashcan cursor">
                        <img src="./images/trashcan.svg" alt="">
                    </div>
                </div>
                <div class="right-arrow-ctn ctn d-row">
                    <img class="icon cursor" src="./images/right-arrow.svg" alt="">
                </div>
            </div>
        </div>
      </li>
    `;

  }
  //document.querySelector('#video-list-ctn').innerHTML = "";
  document.querySelector('#video-list-ctn').appendChild(ul);
}

async function removeVideoFromList(item) {

  const removeUrl = item.target.id;
  let videoArr = await chrome.storage.sync.get("videoObj");

  for (let video of videoArr.videoObj) {
    if (video.url === removeUrl) {
      let index = videoArr.videoObj.indexOf(video);
      if (index > -1) {
        videoArr.videoObj.splice(index, 1);
      }
      await chrome.storage.sync.set({ "videoObj": videoArr.videoObj });

    }
  }

  let elem = document.getElementById(removeUrl);
  elem.parentNode.removeChild(elem);

}

async function heartIconToggle(item) {
  heartIcon = item.target;
  let videoArr = (await chrome.storage.sync.get("videoObj")).videoObj;

  let videoID = heartIcon.closest(".card-ctn").id;
  let videoIdx;

  let selectedVideoObj = (videoArr.filter((video, val) => {
    videoIdx = val;
    return video.url === videoID;
  }))[0];



  if (heartIcon.classList.contains("open")) {
    heartIcon.src = "./images/close-heart.svg";
    heartIcon.classList.add("close");
    heartIcon.classList.remove("open");
    selectedVideoObj.heart = "close";
  } else {
    heartIcon.src = "./images/open-heart.svg";
    heartIcon.classList.add("open");
    heartIcon.classList.remove("close");
    selectedVideoObj.heart = "open";
  }

  videoArr[videoIdx].heart = selectedVideoObj.heart;
  console.log(videoArr);
  await chrome.storage.sync.set({ "videoObj": videoArr });

}

async function searchFilter() {

  let filter, ul, li, a, i, txtValue;

  filter = searchInput.value.toUpperCase();

  ul = document.querySelector(".video-ul");
  console.log(ul);

  li = ul.querySelectorAll("li");


  for (i = 0; i < li.length; i++) {

    a = li[i].getElementsByTagName("a")[0];

    if (!a.innerText || !a.textContent) txtValue = li[i].getElementsByTagName("h2")[0].getElementsByTagName("a")[0].textContent;
    else txtValue = a.textContent || a.innerText;;


    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }

  }
}



///////////////////////////// UPDATES /////////////////////////////




likedVideoFilter.addEventListener("click", function () {
  let selectedOption = likedVideoFilter.value;
  let ul, li, heartIcon;

  ul = document.getElementById("video-ul");

  li = ul.getElementsByTagName("li");

  if (selectedOption === "Liked") {

    for (i = 0; i < li.length; i++) {
      heartIcon = li[i].getElementsByClassName('heart-icon')[0];
      if (heartIcon.classList.contains("close")) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  } else {
    for (i = 0; i < li.length; i++) {
      heartIcon = li[i].getElementsByClassName('heart-icon')[0];

      li[i].style.display = "";
    }
  }
});


dateVideoFilter.addEventListener("click", function () {
  let selectedOption = dateVideoFilter.value;
  let ul, li, dateTag;

  ul = document.getElementById("video-ul");

  li = ul.getElementsByTagName("li");

  if (selectedOption === "Oldest") {

  }
});