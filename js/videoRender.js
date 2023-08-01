// home.html 에서 영상들 뿌려주는 작업 07.27 by. 박세용 // channel.html 영상 렌더 작업 07.31 노경민

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



// displayVideoList() 함수 정의
async function displayVideoList() {
  try {
    const videoListContainer = document.getElementById('video-preview');
    let videoListHtml = ''; // 비디오 정보를 누적할 빈 문자열

    for (let videoId = 0; videoId <= 20; videoId++) {
      const videoInfo = await getVideoInfo(videoId);

      // 비디오 화면 url
      let videoURL = `location.href="./video.html?id=${videoId}"`;

      // 조회수를 포맷하여 "45,4819" 형식으로 변환
      const formattedViews = formatViews(videoInfo.views);

      // videoInfo를 사용하여 각각의 비디오 정보를 표시하는 HTML 코드를 생성
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
      // 생성된 HTML 코드를 videoListHtml에 누적.
      videoListHtml += videoItemHtml;
    }
    console.log(videoListHtml)
    // videoListHtml을 videoListContainer의 내부 콘텐츠로 설정
    videoListContainer.innerHTML = videoListHtml;
  } catch (error) {
    console.error('에러:', error);
  }
}

// DOMContentLoaded 이벤트 핸들러를 사용하여 HTML 문서가 파싱된 후 displayVideoList() 함수를 실행
document.addEventListener('DOMContentLoaded', displayVideoList);




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