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

// channel.html 에 video list 불러오는 함수
async function channelVideoRender() {
    // 변수
    const videoList = await getVideoList();

    const smallVideoList = document.getElementById('Small-Video')
    const videoListContainer = document.getElementById('Video-card')
    const videoListContainerTwo = document.getElementById('Video-card-two')
    const videoListContainerThree = document.getElementById('Video-card-three')
    let smallHTML = "";
    let xsamllHTML = "";
    let xsamllHTMLTwo = "";
    let xsamllHTMLThree = "";

    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoInfoList.length; i++) {
        const videoInfo = videoInfoList[i];
        const videoId = videoInfo.video_id;

        // 조회수 변환 함수
        const formattedViews = formatViews(videoInfo.views);

        // 비디오 url
        let videoURL = `location.href="./video.html?id=${videoId}"`;

        if(i == 0) {
            const smallVideoHtml = `
            <div class="Player">
                <video src="https://storage.googleapis.com/oreumi.appspot.com/video_0.mp4" onclick='${videoURL}' controls></video>
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
                <p>Channel: Marcus Levin</p>
                <p>조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
                </div>
            </div>
            `;
            xsamllHTML += videoItemHtml;
        }   else if (5 < i && i < 11 ) {
            const videoItemHtmlTwo =`
            <div class="Xsamll-video">
                <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                <div>
                <p>${videoInfo.video_title}</p>
                <p>Channel: Marcus Levin</p>
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
                <p>Channel: Marcus Levin</p>
                <p>조회수: ${formattedViews} 회 &#183; ${videoInfo.upload_date}</p>
                </div>
            </div>
            `;
            xsamllHTMLThree += videoItemHtmlThree
        }
    }
    // xsamllHTML을 videoListContainer의 내부 콘텐츠로 설정
    smallVideoList.innerHTML = smallHTML;
    videoListContainer.innerHTML = xsamllHTML;
    videoListContainerTwo.innerHTML = xsamllHTMLTwo;
    videoListContainerThree.innerHTML = xsamllHTMLThree;
}
