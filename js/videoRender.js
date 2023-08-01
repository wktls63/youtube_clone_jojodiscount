// home.html 에서 영상들 뿌려주는 작업 07.27 by. 박세용 // channel.html 영상 렌더 작업 07.31 노경민
// 검색 기능 작업 08.01 by. 박세용

// 숫자를 "454,4819" 형식으로 변환하는 함수
function formatViews(views) {
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  // 비디오 리스트를 가져오는 함수
  async function getVideoList() {
    const response = await fetch('http://oreumi.appspot.com/video/getVideoList');
    const data = await response.json();
    return data;
  }

  // 채널 정보를 가져오는 함수
  async function getChannelVideo() {
    const apiUrl = `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi`;
    const response = await fetch(apiUrl);
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

// 검색 기능을 지원하도록 업데이트된 displayVideoList() 함수
async function displayVideoList(searchQuery = '') {
    try {
      const videoListContainer = document.getElementById('video-preview');
      let videoListHtml = ''; // 비디오 정보를 누적할 빈 문자열
  
      // 검색어를 소문자로 변환
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
  
      // 비디오 정보를 한 번에 가져오는 비동기 함수 호출
      const videoInfoPromises = [];
      for (let videoId = 0; videoId <= 20; videoId++) {
        videoInfoPromises.push(getVideoInfo(videoId));
      }
      const videoInfoList = await Promise.all(videoInfoPromises);
  
      for (const videoInfo of videoInfoList) {
        // 비디오 제목과 채널 이름을 소문자로 변환
        const lowerCaseVideoTitle = videoInfo.video_title.toLowerCase();
        const lowerCaseVideoChannel = videoInfo.video_channel.toLowerCase();
  
        // 대소문자를 구분하지 않고 검색을 하기 위해 소문자로 변환한 값을 비교
        if (searchQuery && !(lowerCaseVideoTitle.includes(lowerCaseSearchQuery) || lowerCaseVideoChannel.includes(lowerCaseSearchQuery))) {
          continue;
        }
  
        // 비디오 화면 URL
        let videoURL = `location.href="./video.html?id=${videoInfo.videoId}"`;
  
        // 조회수를 포맷하여 "45,4819" 형식으로 변환
        const formattedViews = formatViews(videoInfo.views);
  
        // 각각의 비디오 정보를 표시하는 HTML 코드를 생성
        const videoItemHtml = `
          <div class="video-grid-box">
            <div class="thumbnail-row">
              <img class="thumbnail" src="${videoInfo.image_link}" style='width:320px;cursor:pointer;' onclick='${videoURL}' alt="Thumbnail" />
            </div>
            <div class="video-info-grid">
              <div class="channel-picture">
                <img class="profile-picture" alt="Thumbnail" src="icon/alan.png" />
              </div>
              <div class="video-info">
                <p class="video-title">${videoInfo.video_title}</p>
                <p class="video-author">Channel: ${videoInfo.video_channel}</p>
                <p class="video-stats">조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
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
      console.error('에러:', error);
    }
  }
  
  // HTML 파싱된 후 displayVideoList() 함수를 실행하는 DOMContentLoaded 이벤트 핸들러를 등록
  document.addEventListener('DOMContentLoaded', () => {
    displayVideoList(); // 처음에는 모든 비디오를 표시
  });
  
// 검색 버튼 클릭 이벤트 핸들러를 등록
document.getElementById('search-button').addEventListener('click', () => {
    const searchQuery = document.getElementById('search-bar').value;
    displayVideoList(searchQuery); // 검색 쿼리에 따라 비디오를 표시
  });
  
  // 검색 창에서 Enter 키를 눌렀을 때도 검색 기능이 작동하도록 이벤트 핸들러를 등록
  document.getElementById('search-bar').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      const searchQuery = document.getElementById('search-bar').value;
      displayVideoList(searchQuery); // 검색 쿼리에 따라 비디오를 표시
    }
  });

  // channel.html 에 video list 불러오는 함수
  async function channelVideoRender() {
    try {

      // 변수
      const videoListContainer = document.getElementById('Video-card')
      let xsamllHTML = "";
      
      for (let videoId = 0; videoId <= 20; videoId++) {
        const videoInfo = await getVideoInfo(videoId);

        // 조회수 변환 함수
        const formattedViews = formatViews(videoInfo.views);

        // 비디오 url
        let videoURL = `location.href="./video.html?id=${videoId}"`;

        const videoItemHtml = `
          <div>
            <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
            <div>
              <p>${videoInfo.video_title}</p>
              <p>Channel: ${videoInfo.video_channel}</p>
              <p>조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
            </div>
          </div>
        `;
        xsamllHTML += videoItemHtml;
    }
    // xsamllHTML을 videoListContainer의 내부 콘텐츠로 설정
    videoListContainer.innerHTML = xsamllHTML;
  } catch (error) {
    console.error('에러:', error);
  }
}

// HTML 파싱된 후 렌더 함수 실행
document.addEventListener('DOMContentLoaded', channelVideoRender);