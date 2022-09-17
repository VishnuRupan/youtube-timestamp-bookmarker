
document.addEventListener("yt-navigate-finish", function (event) {
    setTimeout(run, 500);
});

function run() {
    // get right video menu bar
    const bookmarkCtn = document.createElement('div');
    bookmarkCtn.classList.add('bookmark-ctn');

    const bkmarkImg = document.createElement('img');
    bkmarkImg.src = chrome.runtime.getURL("images/bookmark.svg");
    bkmarkImg.classList.add('bookmark-btn');


    const youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    bookmarkCtn.appendChild(bkmarkImg);
    youtubeLeftControls.appendChild(bookmarkCtn);

    bkmarkImg.addEventListener("click", async () => {
        setVideoTimestamp();
    });

    

    async function setVideoTimestamp() {
        let currentTime = document.querySelector('.ytp-time-current').innerHTML;
        let videoLength = document.querySelector('.ytp-time-duration').innerHTML;
        let currentTimeSeconds = convert(currentTime) + "s";
        let currentPageUrl = (window.location.href).split("&t")[0];
        let videoTitle = document.querySelectorAll("h1.ytd-video-primary-info-renderer")[0].querySelector('yt-formatted-string').innerHTML;

        let urlTimestamp = `${currentPageUrl}&t=${currentTimeSeconds}`;

        let thumbnail = get_youtube_thumbnail(currentPageUrl, 'medium');
        let dateUpdated = new Date().toLocaleDateString('en-us', { year: "numeric", month: "numeric", day: "numeric" });


        // current video object
        const videoObj = {
            "title": videoTitle,
            "url": currentPageUrl,
            "timeStamp": currentTime,
            "videoLength": videoLength,
            "urlTimestamp": urlTimestamp,
            "thumbnail": thumbnail,
            "dateUpdated": dateUpdated,
            "heart": "open"
        };

        // get video array
        let videoArr = await chrome.storage.sync.get("videoObj");

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
    let parts = input.split(':');

    if (parts.length === 1) {
        return (Number(parts[0])).toFixed(0);

    } else if (parts.length === 2) {
        return (Number(parts[0]) * 60 + Number(parts[1])).toFixed(0);
    } else {
        return (((Number(parts[0]) * 60) * 60) + Number(parts[1]) * 60 + Number(parts[0])).toFixed(0);
    }
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
