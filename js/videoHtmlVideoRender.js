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