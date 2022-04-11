// // Initialize butotn with users's prefered color
// let changeColor = document.getElementById("changeColor");
// 
// let bookmarkBtn = null;
// 
// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });
// 
// // When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
// 
//   console.log('tab: ', [tab]);
//   console.log('window href: ', window.location.href);
// 
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });
// 
// window.addEventListener('DOMContentLoaded', (event) => {
//   console.log('DOM fully loaded and parsed');
// 
//   setTimeout((getBookmarkBtn), 3000);
// 
// });
// 
// 
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
// 
//   console.log([tab]);
//   console.log("Iam the window: ", window.location.href);
// 
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });
// 
// 
// // The body of this function will be execuetd as a content script inside the
// // current page
// function setPageBackgroundColor() {
// 
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }


window.addEventListener('DOMContentLoaded', async function () {

  await renderVideoBookmarkList();

  [...document.querySelectorAll('.remove-btn')].forEach(function (item) {
    item.addEventListener('click', removeVideoFromList);
  });

}
);


chrome.storage.onChanged.addListener(async function () {

  await renderVideoBookmarkList();

  [...document.querySelectorAll('.remove-btn')].forEach(function (item) {
    item.addEventListener('click', removeVideoFromList);
  });
});


async function renderVideoBookmarkList(event, area) {
  (document.querySelector('#video-list-ctn')).innerHTML = "";

  let videoArr = await chrome.storage.sync.get("videoObj");
  console.log("inside popup: ", videoArr);

  let ul = document.createElement('ul');
  ul.className = 'video-list';

  for (let video of videoArr.videoObj) {
    console.log("each video title: ", video.title);

    ul.innerHTML += ` 
    <li>
          <div class="line"></div>

      <div class="video-item">
        <img src="${video.thumbnail}" width=160 height=90>
        <div class="info">
          <a href="${video.urlTimestamp}" target="_blank">
            <h2>${video.title}</h2>
          </a>
          <div class="details">
          
            <div><p>Timestamp: ${video.timeStamp}</p> </div>
            
            
            <button class="remove-btn" id=${video.url} >REMOVE</button>
            
            
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
  console.log(item.target.id);

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

  var elem = document.getElementById(removeUrl);
  elem.parentNode.removeChild(elem);

}