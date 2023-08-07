// 채널 비디오를 채널html에 뿌려주는 함수 작성자 노경민 8/02

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
            const formattedViews = formatViews(videoInfo.views);
    
            // 비디오 url
            let videoURL = `location.href="./video.html?id=${videoId}"`;
            
            // 비디오 id값이 0 이면 channel.html small 비디오로 추가
            if(i == 0) {

                // 오르미 채널 배너, 구독자, 프로필으로 요소변경
                channelName.innerHTML = `${channelProfile.channel_name}`
                subScriber.textContent = `구독자 ${channelProfile.subscribers}명`
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
                        <div class="Time">${formattedViews} 회 &#183; ${videoInfo.upload_date}</div>
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
                    <p>조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
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
                    <p>조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
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
                    <p>조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
                    </div>
                </div>
                `;
                
            }
        }

    } else {

        // 넘겨받은 id 값이 oreumi 가 아니라면 해당 조건문 실행
        for (let i = 0; i < videoInfoList.length; i++) {
            const videoInfo = videoInfoList[i];
            const videoId = videoInfo.video_id;
            const channelProfile = channelInfoList[i]
    
            // 조회수 변환 함수
            const formattedViews = formatViews(videoInfo.views);
    
            // 비디오 url
            let videoURL = `location.href="./video.html?id=${videoId}"`;
    
            if(i == 10) {

                // 나와 토끼 채널 배너, 구독자, 프로필으로 요소변경
                channelName.innerHTML = `${channelProfile.channel_name}`
                subScriber.textContent = `구독자 ${channelProfile.subscribers}명`
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
                        <div class="Time">${formattedViews} 회 &#183; ${videoInfo.upload_date}</div>
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
                    <p>조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
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
                    <p>조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
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
                    <p>조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
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
