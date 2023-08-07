// 채널 비디오를 채널html에 뿌려주는 함수 작성자 노경민 8/02

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
  

// channel.html 에 video list 불러오는 함수
async function channelVideoRender(id) {
    // 변수
    const videoList = await getVideoList();

    // html 요소 변수
    const channelCover = document.getElementById('Channel-cover');
    const channelProImg = document.getElementById('Channel-pro-img');
    const channelName = document.getElementById('Name');
    const subScriber = document.getElementById('subscribers');

    const smallVideoList = document.getElementById('Small-Video');
    const videoListContainer = document.getElementById('Video-card');
    const videoListContainerTwo = document.getElementById('Video-card-two');
    const videoListContainerThree = document.getElementById('Video-card-three');

    // html에 삽입될 내용 변수
    let smallHTML = "";
    let xsamllHTML = "";
    let xsamllHTMLTwo = "";
    let xsamllHTMLThree = "";

    // 비디오 리스트를 병렬로 가져오는 변수
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    // 채널 리스트를 병렬로 가져오는 변수
    const channelInfoPromises = videoInfoList.map((videoInfo) => getChannelVideoList(videoInfo.video_channel));
    const channelInfoList = await Promise.all(channelInfoPromises);

    // 넘겨받은 id 값이 "oreumi" 라면 해당 조건문 실행
    if (id === 'oreumi') {

        // 비디오 info 반복문
        for (let i = 0; i < videoInfoList.length; i++) {
            const videoInfo = videoInfoList[i];
            const videoId = videoInfo.video_id;
            const channelProfile = channelInfoList[i]
        
    
            // 조회수 변환 함수
            const formattedViews = formatViewsCount(videoInfo.views);
            const formattedUploadDate = formatElapsedTime(videoInfo.upload_date);
            const formattedSubscribersCount = formatSubscribersCount(channelInfoList[10].subscribers)
    
            // 비디오 url
            let videoURL = `location.href="./video.html?id=${videoId}"`;
            
            // 비디오 id값이 0 이면 channel.html small 비디오로 추가
            if(i == 0) {

                // 오르미 채널 배너, 구독자, 프로필으로 요소변경
                channelName.innerHTML = `${channelProfile.channel_name}`
                subScriber.textContent = `${formattedSubscribersCount}`
                channelCover.setAttribute('src', `${channelProfile.channel_banner}`)
                channelProImg.setAttribute('src', `${channelProfile.channel_profile}`)

                // 삽입 내용
                const smallVideoHtml = `
                <div class="Player">
                    <video src='${videoInfo.video_link}' onclick='${videoURL}' autoplay controls></video>
                </div>
                <div class="Smaill-Video-Desc">
                    <div class="Video-Title">
                        <div class="Title" style="cursor:pointer;">${videoInfo.video_title}</div>
                        <div class="Time">${formattedViews.replace(".0", "")} &#183; ${formattedUploadDate}</div>
                    </div>
                    <div class="Descriptions">
                        <p>조조할인 노경민, 오준경, 김경희, 박세용, 김동준 화이팅!!
                        조조할인 노경민, 오준경, 김경희, 박세용, 김동준 화이팅!!
                        조조할인 노경민, 오준경, 김경희, 박세용, 김동준 화이팅!!
                        조조할인 노경민, 오준경, 김경희, 박세용, 김동준 화이팅!!
                        </p>
                    </div>
                </div>
                `;
                smallHTML += smallVideoHtml
            } else if (0 < i && i< 6) {
                const videoItemHtml = `
                <div class="Xsamll-video">
                    <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                    <div>
                    <p>${videoInfo.video_title}</p>
                    <p>Channel: ${videoInfo.video_channel}</p>
                    <p> ${formattedViews.replace(".0", "")}  &#183; ${formattedUploadDate}</p>
                    </div>
                </div>
                `;
                xsamllHTML += videoItemHtml;
            }   else if (5 < i && i < 10 ) {
                const videoItemHtmlTwo =`
                <div class="Xsamll-video">
                    <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                    <div>
                    <p>${videoInfo.video_title}</p>
                    <p>Channel: ${videoInfo.video_channel}</p>
                    <p>${formattedViews.replace(".0", "")} &#183; ${formattedUploadDate}</p>
                    </div>
                </div>
                `;
                xsamllHTMLTwo += videoItemHtmlTwo
            } else if (10 < i && i < 16 ) {
                const videoItemHtmlThree =`
                <div class="Xsamll-video">
                    <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                    <div>
                    <p>${videoInfo.video_title}</p>
                    <p>Channel: ${videoInfo.video_channel}</p>
                    <p>${formattedViews.replace(".0", "")} &#183; ${formattedUploadDate}</p>
                    </div>
                </div>
                `;
                xsamllHTMLThree += videoItemHtmlThree
            }
        }

    } else {

        // 넘겨받은 id 값이 oreumi 가 아니라면 해당 조건문 실행
        for (let i = 0; i < videoInfoList.length; i++) {
            const videoInfo = videoInfoList[i];
            const videoId = videoInfo.video_id;
            const channelProfile = channelInfoList[i]
    
            // 조회수 변환 함수
            const formattedViews = formatViewsCount(videoInfo.views);
            const formattedUploadDate = formatElapsedTime(videoInfo.upload_date);
            const formattedSubscribersCount = formatSubscribersCount(channelInfoList[10].subscribers)
    
            // 비디오 url
            let videoURL = `location.href="./video.html?id=${videoId}"`;
    
            if(i == 10) {

                // 나와 토끼 채널 배너, 구독자, 프로필으로 요소변경
                channelName.innerHTML = `${channelProfile.channel_name}`
                subScriber.textContent = `${formattedSubscribersCount}`
                channelCover.setAttribute('src', `${channelProfile.channel_banner}`)
                channelProImg.setAttribute('src', `${channelProfile.channel_profile}`)

                // 삽입 내용
                const smallVideoHtml = `
                <div class="Player">
                    <video src='${videoInfo.video_link}' onclick='${videoURL}' autoplay controls></video>
                </div>
                <div class="Smaill-Video-Desc">
                    <div class="Video-Title">
                        <div class="Title" style="cursor:pointer;">${videoInfo.video_title}</div>
                        <p>${formattedViews.replace(".0", "")} &#183; ${formattedUploadDate}</p>
                    </div>
                    <div class="Descriptions">
                        <p>조조할인 노경민, 오준경, 김경희, 박세용, 김동준 화이팅!!
                        조조할인 노경민, 오준경, 김경희, 박세용, 김동준 화이팅!!
                        조조할인 노경민, 오준경, 김경희, 박세용, 김동준 화이팅!!
                        조조할인 노경민, 오준경, 김경희, 박세용, 김동준 화이팅!!
                        </p>
                    </div>
                </div>
                `;
                smallHTML += smallVideoHtml
            } else if (10 < i && i< 16) {
                const videoItemHtml = `
                <div class="Xsamll-video">
                    <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                    <div>
                    <p>${videoInfo.video_title}</p>
                    <p>Channel: ${videoInfo.video_channel}</p>
                    <p>${formattedViews.replace(".0", "")} &#183; ${formattedUploadDate}</p>
                    </div>
                </div>
                `;
                xsamllHTML += videoItemHtml;
            }   else if (16 < i && i < 21 ) {
                const videoItemHtmlTwo =`
                <div class="Xsamll-video">
                    <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                    <div>
                    <p>${videoInfo.video_title}</p>
                    <p>Channel: ${videoInfo.video_channel}</p>
                    <p>${formattedViews.replace(".0", "")} &#183; ${formattedUploadDate}</p>
                    </div>
                </div>
                `;
                xsamllHTMLTwo += videoItemHtmlTwo
            } else if (10 < i && i < 16 ) {
                const videoItemHtmlThree =`
                <div class="Xsamll-video">
                    <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                    <div>
                    <p>${videoInfo.video_title}</p>
                    <p>Channel: ${videoInfo.video_channel}</p>
                    <p>${formattedViews.replace(".0", "")} &#183; ${formattedUploadDate}</p>
                    </div>
                </div>
                `;
                xsamllHTMLThree += videoItemHtmlThree
            }
        }

    }


    // xsamllHTML을 videoListContainer의 내부 콘텐츠로 설정
    smallVideoList.innerHTML = smallHTML;
    videoListContainer.innerHTML = xsamllHTML;
    videoListContainerTwo.innerHTML = xsamllHTMLTwo;
    videoListContainerThree.innerHTML = xsamllHTMLThree;
}
