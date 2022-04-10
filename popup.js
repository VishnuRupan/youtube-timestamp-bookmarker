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


