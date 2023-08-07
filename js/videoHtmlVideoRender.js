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
  // 구독자수를 포맷해주는 함수 
  function formatSubscribersCount(subscribers) {
    if (subscribers >= 1000000) {
      return `구독자 ${Math.floor(subscribers / 10000)}만명`;
    } else if (subscribers >= 100000) {
      return `구독자 ${Math.floor(subscribers / 1000)}.${Math.floor((subscribers % 1000) / 100)}만명`;
    } else {
      return `구독자 ${subscribers}명`;
    }
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
  
  
  // video 화면에 video를 불러오는 함수
  
  async function videoPlyerRender(id) {
    // 지역 변수
    const videoList = await getVideoList();
  
    const videoPlayer = document.getElementById('Youtube-Player');
    const videoDesc = document.getElementById('Video-Desc')
  
    let playerHtml = '';
    let vidoDescHtml = '';
  
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);
  
    const channelInfoPromises = videoInfoList.map((videoInfo) => getChannelVideoList(videoInfo.video_channel));
    const channelInfoList = await Promise.all(channelInfoPromises);
  
    console.log(channelInfoList)
  
    // URL
    const oreumiChannelURL = `location.href="./channel.html?id=oreumi"`;
    const rabbitChannelURL = `location.href="./channel.html?id=나와%20토끼들"`;
  
  
    for (let i = 0; i < videoInfoList.length; i++) {
      const videoInfo = videoInfoList[i];
      const videoId = videoInfo.video_id;
  
      // 조회수 변환 함수
      const formattedViews = formatViewsCount(videoInfo.views);
      const formattedUploadDate = formatElapsedTime(videoInfo.upload_date);
  
      if (id == videoId) {
        const videoPlayerHtml = `
                  <div>
                  <video autoplay controls style='width:100%;'>
                      <source src='${videoInfo.video_link}'>
                  </video>
                  </div>
                  <div class="Video-Info">
                      <div class="Video-Info">
                          <div class="Title">${videoInfo.video_title}</div>
                          <div class="Info">
                              <div class="Info-text">${formattedViews.replace(".0", "")} &nbsp; ${formattedUploadDate}</div>
                              <div class="Top-Level">
                                  <!--좋아요 버튼-->
                                  <div class="like">
                                      <button id="likeButton" class="liked" onclick="toggleLike()">
                                          <img class="liked" src="icon/liked.png" alt="">
                                      </button>
                                      <div id="likeCount" , class="Button-text">1000</div>
                                  </div>
                                  <!-- 싫어요 버튼-->
                                  <div class="like">
                                      <button id="dislikeButton" class="liked" onclick="toggleDislike()">
                                          <img class="liked" src="icon/disliked.png" alt="">
                                      </button>
                                      <div id="dislikeCount" class="Button-text">632</div>
                                  </div>
                                  <div class="like">
                                      <img class="liked" src="icon/share.png" alt="">
                                      <div class="Button-text">SHARE</div>
                                  </div>
                                  <div class="like">
                                      <img class="liked" src="icon/save.png" alt="">
                                      <div class="Button-text">SAVE</div>
                                  </div>
                                  <div class="like">
                                      <img class="liked" src="icon/more.png" alt="">
                                      <div class="Button-text"> </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <style>
                      .liked{
                        margin-top:7px;
                      }
                      </style>
              `;
        playerHtml += videoPlayerHtml
  
      }
  
    }
  
    if (id < 10) {
      const formattedSubscribersCount = formatSubscribersCount(channelInfoList[10].subscribers)

      const videoChannelDesc = `
                    <div class="Channel-Title">
                      <img class="Pic" style="cursor: pointer; width: 50px; height: 50px; border-radius: 70%; overflow: hidden;" onclick='${oreumiChannelURL}' src="${channelInfoList[0].channel_profile}" alt="">
                      <div class="Profile-Name">
                          <div class="Name" style="cursor:pointer;" onclick='${oreumiChannelURL}'>${channelInfoList[0].channel_name}</div>
                          <div class="Subscribe-People">${formattedSubscribersCount.replace(".0", "")}</div>
                      </div>
                      <button id="Subscribes-Btn" class="Subscribes-Btn" onclick="toggleSubscription()"
                          onclick="handleClick()">SUBSCRIBES
                      </button>
                      <style>
                      .Subscribes-Btn {
                        float:right;
                        margin-left:50px;
                        margin-bottom:50px;
                        width:116px;
                      }
                      </style>
                    </div>
                    <div class="Channel-Info">
                      <p>안녕하세요. 이스트소프트입니다.</p>
                      <p>이스트소프트는 정부의 디지털 인재양성 및 고용창출을 위한</p>
                      <p>K-디지털 트레이닝 사업의 훈련 기관으로 선정되어,</p>
                      <p>올해 마지막 [ESTsoft] 백엔드 개발자 부트캠프 오르미 3기 교육생 모집이 시작되었습니다.</p>
                    </div>
      `;
      vidoDescHtml += videoChannelDesc
  
    } else {
      const formattedSubscribersCount = formatSubscribersCount(channelInfoList[10].subscribers)

      const videoChannelDescTwo = `
                    <div class="Channel-Title">
                      <img class="Pic" style="cursor: pointer; width: 50px; height: 50px; border-radius: 70%; overflow: hidden;" onclick='${rabbitChannelURL}' src="${channelInfoList[10].channel_profile}" alt="">
                      <div class="Profile-Name">
                          <div class="Name" style="cursor:pointer;" onclick='${rabbitChannelURL}'>${channelInfoList[10].channel_name}</div>
                          <div class="Subscribe-People">${formattedSubscribersCount.replace(".0", "")}</div>
                      </div>
                      <button id="Subscribes-Btn" class="Subscribes-Btn" onclick="toggleSubscription()"
                          onclick="handleClick()">SUBSCRIBES
                      </button>
                    </div>
                    <div class="Channel-Info">
                      <p>안녕하세요. 이스트소프트입니다.</p>
                      <p>이스트소프트는 정부의 디지털 인재양성 및 고용창출을 위한</p>
                      <p>K-디지털 트레이닝 사업의 훈련 기관으로 선정되어,</p>
                      <p>올해 마지막 [ESTsoft] 백엔드 개발자 부트캠프 오르미 3기 교육생 모집이 시작되었습니다.</p>
                    </div>
      `;
      vidoDescHtml += videoChannelDescTwo
    }
  
  
    videoPlayer.innerHTML = playerHtml;
    videoDesc.innerHTML = vidoDescHtml;
  
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
      
      // 조회수 변환
      const formattedViews = formatViewsCount(videoInfo.views);
      // 업로드 날짜 변환
      const formattedUploadDate = formatElapsedTime(videoInfo.upload_date);


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
  }

    // 페이지 로딩 시에 비디오 목록을 표시하도록 설정
    document.addEventListener("DOMContentLoaded", () => {
        displayVideoList();
    });