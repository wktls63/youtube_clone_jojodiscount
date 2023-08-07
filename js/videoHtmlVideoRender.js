// 등록 후 경과 된 시간을 변환하여 표시하는 함수
function formatElapsedTime(date) {
    const start = new Date(date);
    const end = new Date(); // 현재 날짜와 시간
  
    const diff = Math.floor((end - start) / 1000); // 경과 시간(초 단위)
  
    const times = [
      { name: "년", seconds: 60 * 60 * 24 * 365 },
      { name: "개월", seconds: 60 * 60 * 24 * 30 },
      { name: "일", seconds: 60 * 60 * 24 },
      { name: "시간", seconds: 60 * 60 },
      { name: "분", seconds: 60 },
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
  
  // 비디오 리스트를 가져오는 함수
  async function getVideoList() {
    const response = await fetch("http://oreumi.appspot.com/video/getVideoList");
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
  
  // video 화면에 video를 불러오는 함수
  async function videoPlayerRender(id) {
    try {
      const videoList = await getVideoList();
      const videoPlayer = document.getElementById("Youtube-Player");
      let playerHtml = "";
  
      const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
      const videoInfoList = await Promise.all(videoInfoPromises);
  
      for (const videoInfo of videoInfoList) {
        const videoId = videoInfo.video_id;
  
        if (id === videoId) {
          const videoPlayerHtml = `
            <div>
              <video autoplay controls style="width: 100%;">
                <source src="${videoInfo.video_link}">
              </video>
            </div>
          `;
          playerHtml += videoPlayerHtml;
        }
      }
  
      videoPlayer.innerHTML = playerHtml;
    } catch (error) {
      console.error("Error rendering video player:", error);
    }
  }
  
  // 오른쪽에 다음 재생 영상 목록을 불러오는 함수
  async function displayVideoList(searchQuery = "") {
    const videoListContainer = document.getElementById("video-preview");
    let videoListHtml = ""; // 수정: 변수 이름 변경
  
    try {
      // 비디오 정보를 가져오는 비동기 함수 호출
      const videoInfoPromises = [];
      for (let videoId = 0; videoId <= 20; videoId++) {
        videoInfoPromises.push(getVideoInfo(videoId));
      }
      const videoInfoList = await Promise.all(videoInfoPromises);
  
      for (const videoInfo of videoInfoList) {
        // 비디오 화면 URL
        const videoURL = `./video.html?id=${videoInfo.video_id}`;
        // 조회수 변환
        const formattedViews = formatViewsCount(videoInfo.views);
        // 업로드 날짜 변환
        const formattedUploadDate = formatElapsedTime(videoInfo.upload_date);
        // 검색어 소문자 변환
        const lowerCaseSearchQuery = searchQuery.toLowerCase();
  
        // 비디오 제목과 채널 이름 소문자 변환
        const lowerCaseVideoTitle = videoInfo.video_title.toLowerCase();
        const lowerCaseVideoChannel = videoInfo.video_channel.toLowerCase();
  
        // 검색 조건 확인
        if (
          searchQuery &&
          !(
            lowerCaseVideoTitle.includes(lowerCaseSearchQuery) ||
            lowerCaseVideoChannel.includes(lowerCaseSearchQuery)
          )
        ) {
          continue; // 검색 조건에 맞지 않으면 건너뜀
        }
  
        // 각각의 비디오 정보를 표시하는 HTML 코드를 생성
        const videoItemHtml = `
          <style>
            .video-grid-box {
              display: flex;
            }
            .thumbnail-row {
              margin-right: 10px;
            }
          </style>
    
          <div class="video-grid-box">
            <div class="thumbnail-row">
              <img class="thumbnail" src="${videoInfo.image_link}" style='width:200px;cursor:pointer;' onclick='${videoURL}' alt="Thumbnail" />
            </div>
            <div class="video-info-grid">
              <div class="video-info">
                <p class="video-title">${videoInfo.video_title}</p>
                <p class="video-author">Channel: ${videoInfo.video_channel}</p>
                <p class="video-stats">${formattedViews.replace(".0", "")} &#183; ${formattedUploadDate}</p>
              </div>
            </div>
          </div>
        `;
        // 생성된 HTML 코드를 videoListHtml에 누적
        videoListHtml += videoItemHtml;
      }
  
      // videoListHtml을 videoListContainer의 내부 콘텐츠로 설정
      videoListContainer.innerHTML = videoListHtml;
    } catch (error) {
      console.error("Error displaying video list:", error);
    }
  }
  
  // 페이지 로딩 시에 비디오 목록을 표시하도록 설정
  document.addEventListener("DOMContentLoaded", () => {
    displayVideoList();
  
    // 검색 버튼 클릭 이벤트 핸들러를 등록
    const searchButton = document.getElementById("search-button");
    const searchBar = document.getElementById("search-bar");
  
    if (searchButton && searchBar) {
      searchButton.addEventListener("click", async () => {
        const searchQuery = searchBar.value;
        await displayVideoList(searchQuery); // 검색 쿼리에 따라 비디오를 표시
      });
  
      // 검색 창에서 Enter 키를 눌렀을 때도 검색 기능이 작동하도록 이벤트 핸들러를 등록
      searchBar.addEventListener("keyup", async (event) => {
        if (event.key === "Enter") {
          const searchQuery = searchBar.value;
          await displayVideoList(searchQuery); // 검색 쿼리에 따라 비디오를 표시
        }
      });
    } else {
      console.error("검색 버튼 또는 검색 창을 찾을 수 없습니다.");
    }
  });