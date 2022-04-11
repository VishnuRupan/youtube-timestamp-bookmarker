// let page = document.getElementById("buttonDiv");
// let selectedClassName = "current";
// const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];
// 
// // Reacts to a button click by marking marking the selected button and saving
// // the selection
// function handleButtonClick(event) {
//   // Remove styling from the previously selected color
//   let current = event.target.parentElement.querySelector(
//     `.${selectedClassName}`
//   );
//   if (current && current !== event.target) {
//     current.classList.remove(selectedClassName);
//   }
// 
//   // Mark the button as selected
//   let color = event.target.dataset.color;
//   event.target.classList.add(selectedClassName);
//   chrome.storage.sync.set({ color });
// }
// 
// // Add a button to the page for each supplied color
// function constructOptions(buttonColors) {
//   chrome.storage.sync.get("color", (data) => {
//     let currentColor = data.color;
// 
//     // For each color we were provided…
//     for (let buttonColor of buttonColors) {
//       // …crate a button with that color…
//       let button = document.createElement("button");
//       button.dataset.color = buttonColor;
//       button.style.backgroundColor = buttonColor;
// 
//       // …mark the currently selected color…
//       if (buttonColor === currentColor) {
//         button.classList.add(selectedClassName);
//       }
// 
//       // …and register a listener for when that button is clicked
//       button.addEventListener("click", handleButtonClick);
//       page.appendChild(button);
//     }
//   });
// }
// 
// // Initialize the page by constructing the color options
// constructOptions(presetButtonColors);



console.log("show on youtube only");


document.addEventListener("yt-navigate-finish", function (event) {

    console.log('yt-navigate');

    setTimeout(run, 500);


});





function run() {

    // get right video menu bar
    var menuCtn = document.getElementById("menu-container");
    var menuCtnSpan = menuCtn.querySelector("#top-level-buttons-computed");

    // create bookmark container
    let bkmarkDiv = document.createElement('div');
    bkmarkDiv.classList.add('yt-bookmark-container');

    // insert image into bookmark container
    let bkmarkImg = document.createElement('img');
    bkmarkImg.src = chrome.runtime.getURL("images/bookmark.svg");
    bkmarkDiv.appendChild(bkmarkImg);

    menuCtnSpan.appendChild(bkmarkDiv);

    console.log("on load again: ", menuCtn);

    bkmarkDiv.addEventListener("click", async () => {

        setVideoTimestamp();
    });


    async function setVideoTimestamp() {

        let currentTime = document.querySelector('.ytp-time-current').innerHTML;
        let currentTimeSeconds = convert(currentTime) + "s";
        let currentPageUrl = window.location.href;
        let videoTitle = document.querySelectorAll("h1.ytd-video-primary-info-renderer")[0].querySelector('yt-formatted-string').innerHTML;

        let urlTimestamp = `${currentPageUrl}&t=${currentTimeSeconds}`;
        console.log("Current timestap url: ", currentPageUrl);

        let thumbnail = get_youtube_thumbnail(currentPageUrl, 'medium');

        // current video object
        const videoObj = {
            "title": videoTitle,
            "url": currentPageUrl,
            "timeStamp": currentTime,
            "urlTimestamp": urlTimestamp,
            "thumbnail": thumbnail
        };

        // get video array
        let videoArr = await chrome.storage.sync.get("videoObj");
        console.log("Get Video Arr: ", videoArr);

        if (Object.keys(videoArr).length === 0) {
            chrome.storage.sync.set({ "videoObj": [videoObj] });
        } else {

            let flag = false;
            for (let video of videoArr.videoObj) {
                if (video.url === videoObj.url) {
                    video.urlTimestamp = videoObj.urlTimestamp;
                    video.timeStamp = videoObj.timeStamp;
                    flag = true;
                }
            }

            if (!flag)
                videoArr.videoObj.push(videoObj);

            chrome.storage.sync.set({ "videoObj": videoArr.videoObj });
        }
    }


}

function convert(input) {
    var parts = input.split(':'),
        minutes = +parts[0],
        seconds = +parts[1];
    return (minutes * 60 + seconds).toFixed(0);
}

function get_youtube_thumbnail(url, quality) {
    if (url) {
        var video_id, thumbnail, result;
        if (result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)) {
            video_id = result.pop();
        }
        else if (result = url.match(/youtu.be\/(.{11})/)) {
            video_id = result.pop();
        }

        if (video_id) {
            if (typeof quality == "undefined") {
                quality = 'high';
            }

            var quality_key = 'maxresdefault'; // Max quality
            if (quality == 'low') {
                quality_key = 'sddefault';
            } else if (quality == 'medium') {
                quality_key = 'mqdefault';
            } else if (quality == 'high') {
                quality_key = 'hqdefault';
            }

            var thumbnail = "http://img.youtube.com/vi/" + video_id + "/" + quality_key + ".jpg";
            return thumbnail;
        }
    }
    return false;
}
