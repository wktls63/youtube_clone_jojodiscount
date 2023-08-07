// home.html 에서 영상들 뿌려주는 작업 07.27 by. 박세용 // channel.html 영상 렌더 작업 07.31 노경민
// 검색 기능 작업 08.01 by. 박세용
// 숫자를 "454,4819" 형식으로 변환하는 함수

function formatViews(views) {
  return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
async function getChannelVideoList() {
  const response = await fetch('http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi', {
      method: 'POST'
  });
  const data = await response.json();
  return data;
}

// 채널 비디오 가져오기
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
        let videoURL = `location.href="./video.html?id=${videoInfo.video_id}"`;
  
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
                <img class="profile-picture" onclick='channelPage()' alt="Thumbnail" src="icon/alan.png" />
              </div>
              <div class="video-info">
                <p class="video-title">${videoInfo.video_title}</p>
                <p class="video-author" onclick='channelPage()'>Channel: ${videoInfo.video_channel}</p>
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
  }
  
  
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


// 등록 후 경과 된 시간 노출
const TIME_ZONE = 3240 * 10000;

function elapsedTime(date) {
  const start = new Date(date);
  const end = new Date(new Date().getTime() + TIME_ZONE); // 현재 날짜

  const diff = (end - start) / 1000; // 경과 시간

  const times = [
    { name: '년', milliSeconds: 60 * 60 * 24 * 365 },
    { name: '개월', milliSeconds: 60 * 60 * 24 * 30 },
    { name: '일', milliSeconds: 60 * 60 * 24 },
    { name: '시간', milliSeconds: 60 * 60 },
    { name: '분', milliSeconds: 60 },
  ];

  // 년 단위부터 알맞는 단위 찾기
  for (const value of times) {
    const betweenTime = Math.floor(diff / value.milliSeconds);

    // 큰 단위는 0보다 작은 소수 단위 나옴
    if (betweenTime > 0) {
      return `${betweenTime}${value.name} 전`;
    }
  }

  // 모든 단위가 맞지 않을 시
  return "방금 전";
}

const change = (date) => {
  document.querySelector("h2").innerHTML = elapsedTime(date);
}

document.querySelector("input").setAttribute("max", new Date(new Date().getTime() + TIME_ZONE).toISOString().split("T")[0])
