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
async function getChannelVideoList() {
  const response = await fetch('http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi', {
    method: 'POST'
  });
  const data = await response.json();
  return data;
}

// 채널 비디오 가져오는 함수
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


// video 화면에 video를 불러오는 함수

async function videoPlyerRender(id) {
  // 지역 변수
  const videoList = await getVideoList();

  const videoPlayer = document.getElementById('Youtube-Player');

  let playerHtml = '';

  const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
  const videoInfoList = await Promise.all(videoInfoPromises);

  for (let i = 0; i < videoInfoList.length; i++) {
    const videoInfo = videoInfoList[i];
    const videoId = videoInfo.video_id;

    // 조회수 변환 함수
    const formattedViews = formatViews(videoInfo.views);

    // 비디오 url
    let videoURL = `location.href="./video.html?id=${videoId}"`;

    if (id == videoId) {
      const videoPlayerHtml = `
                <div>
                <video autoplay controls style='width:100%;'>
                    <source src='${videoInfo.video_link}'>
                </video>
                </div>
            `;
      playerHtml += videoPlayerHtml

    }

  }
  videoPlayer.innerHTML = playerHtml;

}



// 오른쪽에 다음 재생 영상 목록을 불러오는 함수
async function displayVideoList(searchQuery = '') {
  const videoListContainer = document.getElementById('video-preview');
  let videoListHtml = ''; // 비디오 정보를 누적할 빈 문자열

  // 비디오 정보를 한 번에 가져오는 비동기 함수 호출
  const videoInfoPromises = [];
  for (let videoId = 0; videoId <= 20; videoId++) {
    videoInfoPromises.push(getVideoInfo(videoId));
  }
  const videoInfoList = await Promise.all(videoInfoPromises);

  for (const videoInfo of videoInfoList) {
    // 비디오 화면 URL
    let videoURL = `location.href="./video.html?id=${videoInfo.video_id}"`;
    // 조회수를 포맷하여 "45,4819" 형식으로 변환
    const formattedViews = formatViews(videoInfo.views);
    // 각각의 비디오 정보를 표시하는 HTML 코드를 생성
    const videoItemHtml = `
        <style>
            .video-grid-box{
                display:flex;
            }
            .thumbnail-row{
                margin-right:10px;
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
