// home.html 에서 영상들 뿌려주는 작업 07.27 by. 박세용 // channel.html 영상 렌더 작업 07.31 노경민
// 검색 기능 작업 08.01 by. 박세용 // 조회수 00.0 천,만 회 변환 , 업로드 날짜 00 일,개월 전 변환 함수 작업  08.07 by. 박세용

function channelPage() {
    window.location.href = 'channel.html'
  }

// 비디오 리스트를 가져오는 함수
async function getVideoList() {
    const response = await fetch('http://oreumi.appspot.com/video/getVideoList');
    const data = await response.json();
    return data;
  }
  
  // 채널 정보를 가져오는 함수
  async function getChannelVideoList(channelId) {
    const response = await fetch(`https://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channelId}`, {
      method: 'POST', headers: {'accept': 'application/json'}
    });
    const data = await response.json();
    return data;
  }
  
  // 채널 비디오 가져오기
  async function getChannelVideo(channelId) {
    const response = await fetch(`https://oreumi.appspot.com/channel/getChannelVideo?video_channel=${channelId}`, {
      method: 'POST', headers: {'accept': 'application/json'}
    });
    const data = await response.json();
    return data;
  }
  
  
  // 비디오 정보를 가져오는 함수
  async function getVideoInfo(videoId) {
    const apiUrl = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  }

// 등록 후 경과 된 시간을 변환하여 표시하는 함수
function formatElapsedTime(date) {
  const start = new Date(date);
  const end = new Date(); // 현재 날짜와 시간

  const diff = Math.floor((end - start) / 1000); // 경과 시간(초 단위)

  const times = [
    {name: "년", seconds: 60 * 60 * 24 * 365},
    {name: "개월", seconds: 60 * 60 * 24 * 30},
    {name: "일", seconds: 60 * 60 * 24},
    {name: "시간", seconds: 60 * 60},
    {name: "분", seconds: 60},
  ];

  // 년 단위부터 알맞은 단위 찾기
  for (const value of times) {
    const betweenTime = Math.floor(diff / value.seconds);

    // 큰 단위는 0보다 작은 소수 단위가 나옴
    if (betweenTime >= 1) {
      return `${betweenTime}${value.name} 전`;
    }
  }

  // 현재 시간과의 차이가 모든 단위보다 작을 경우
  return "방금 전";
}

// 등록 후 경과 시간을 비동기적으로 업데이트하는 함수
async function updateElapsedTimeAsync() {
  const dateElements = document.querySelectorAll(".video-stats"); // 날짜를 표시하는 요소들을 선택

  for (const element of dateElements) {
    const dateString = element.getAttribute("data-upload-date"); // data-upload-date 속성에서 업로드 날짜 정보 가져오기
    if (dateString) {
      const elapsed = formatElapsedTime(dateString); // 경과 된 시간 변환
      element.textContent = `등록일: ${elapsed}`; // 변환된 시간을 요소에 표시
    }
  }
}

// 조회수를 "조회수 1.3만회" 형식으로 변환하는 함수
function formatViewsCount(views) {
    if (views >= 100000000) {
      const billions = Math.floor(views / 100000000);
      const millions = Math.floor((views % 100000000) / 10000000);
      return `조회수 ${billions}.${millions}억회`;
    } else if (views >= 10000) {
      const millions = Math.floor(views / 10000);
      const thousands = Math.floor((views % 10000) / 1000);
      return `조회수 ${millions}.${thousands}만회`;
    } else {
      return `조회수 ${views}회`;
    }
  }

// 검색 기능을 지원하도록 업데이트된 displayVideoList() 함수
async function displayVideoList(searchQuery = "") {
    const videoListContainer = document.getElementById("video-preview");
    let videoListHtml = ""; // 비디오 정보를 누적할 빈 문자열

    // 비디오 리스트 API 데이터 함수를 변수에 할당
    const videoList = await getVideoList();

    // 검색어를 소문자로 변환
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    // 비디오 정보를 가져오는 프로미스
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    // 채널 정보를 가져오는 프로미스
    const channelInfoPromises = videoInfoList.map((videoInfo) => getChannelVideoList(videoInfo.video_channel));
    const channelInfoList = await Promise.all(channelInfoPromises);

    for (let i = 0; i < videoList.length; i++) {
        // 비디오 제목과 채널 이름을 소문자로 변환
        const lowerCaseVideoTitle = videoInfoList[i].video_title.toLowerCase();
        const lowerCaseVideoChannel = videoInfoList[i].video_channel.toLowerCase();

        // 대소문자를 구분하지 않고 검색을 하기 위해 소문자로 변환한 값을 비교
        if (
            searchQuery &&
            !(
                lowerCaseVideoTitle.includes(lowerCaseSearchQuery) ||
                lowerCaseVideoChannel.includes(lowerCaseSearchQuery)
            )
        ) {
            continue;
        }

        // 비디오 화면 URL
        let videoURL = `location.href="./video.html?id=${videoInfoList[i].video_id}"`;

        const formattedViews = formatViewsCount(videoInfoList[i].views);
        const uploadDateElement = new Date(videoInfoList[i].upload_date);
        const formattedUploadDate = uploadDateElement.toISOString(); // ISO 형식으로 변환

        // 각각의 비디오 정보를 표시하는 HTML 코드를 생성
        const videoItemHtml = `
          <div class="video-grid-box">
            <div class="thumbnail-row">
              <img class="thumbnail" src="${videoInfoList[i].image_link}" style='width:320px;cursor:pointer;' onclick='${videoURL}' alt="Thumbnail" />
            </div>
            <div class="video-info-grid">
              <div class="channel-picture"> 
                <img class="profile-picture" style="cursor:pointer;" onclick="newChannelPage()" alt="Thumbnail" src="${channelInfoList[i].channel_profile}" />
              </div>
              <div class="video-info">
                <p class="video-title">${videoInfoList[i].video_title}</p>
                <p class="video-author" onclick="newChannelPage()">${videoInfoList[i].video_channel}</p>
                <p class="video-stats" data-upload-date="${formattedUploadDate}">
                ${formattedViews.replace('.0', '')} • ${formatElapsedTime(videoInfoList[i].upload_date)}</p>
              </div>
            </div>
          </div>
        `;

        // 생성된 HTML 코드를 videoListHtml에 누적
        videoListHtml += videoItemHtml;
    }

    // videoListHtml을 videoListContainer의 내부 콘텐츠로 설정
    videoListContainer.innerHTML = videoListHtml;
}

// 검색 버튼 클릭 이벤트 핸들러를 등록
document.getElementById("search-button").addEventListener("click", async () => {
    const searchQuery = document.getElementById("search-bar").value;
    await displayVideoList(searchQuery); // 검색 쿼리에 따라 비디오를 표시
});

// 검색 창에서 Enter 키를 눌렀을 때도 검색 기능이 작동하도록 이벤트 핸들러를 등록
document.getElementById("search-bar").addEventListener("keyup", async (event) => {
    if (event.key === "Enter") {
        const searchQuery = document.getElementById("search-bar").value;
        await displayVideoList(searchQuery); // 검색 쿼리에 따라 비디오를 표시
    }
});

// 페이지가 로드되었을 때 업로드 시간 업데이트 함수를 호출
window.addEventListener("load", updateElapsedTimeAsync);
