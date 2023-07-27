// getChannelVideo 함수 정의: video_channel을 매개변수로 받아와서 해당 채널의 비디오 정보를 가져오는 함수
function getChannelVideo(video_channel) {
    // XMLHttpRequest 객체 생성
    let xhr = new XMLHttpRequest();
    
    // 비동기 요청 상태가 변할 때마다 호출되는 이벤트 핸들러 설정
    xhr.onreadystatechange = function() {
        // 요청 상태가 DONE인 경우 (요청이 완료되었을 때)
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // 서버의 응답 상태가 200인 경우 (요청이 성공적으로 완료됨)
            if (xhr.status === 200) {
                // 서버로부터 받은 응답 데이터를 JSON 형식으로 파싱하여 data 변수에 저장
                let data = JSON.parse(xhr.responseText);
                
                // 서버의 응답 데이터가 'False'인 경우 (영상정보를 가져오는데 실패한 경우)
                if (data.Response === 'False') {
                    console.log("유튜브 영상정보를 가져오는데 실패했습니다.");
                } else {
                    // 데이터 처리 로직 추가 (예: 비디오 목록을 화면에 표시)
                    displayVideoList(data);
                }
            }
        }
    };
    
    // open() 메서드를 사용하여 서버에 GET 요청을 보냄
    // encodeURIComponent 함수를 사용하여 video_channel을 URL에 인코딩하여 전달
    xhr.open('POST', `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=${encodeURIComponent(video_channel)}`, true);
    
    // send() 메서드를 사용하여 요청을 서버로 전송
    xhr.send();
}

// 비디오 목록을 화면에 표시하는 함수
function displayVideoList(videoData) {
    // 비디오 목록을 표시할 HTML 코드를 저장할 변수 초기화
    let videoListHTML = '';
    
    // videoData 배열의 각 비디오 정보에 대해 반복
    videoData.forEach(video => {
        // 비디오 정보를 HTML 형식으로 작성하여 videoListHTML에 추가
        videoListHTML += `<div class="video-item">
                            <h2>${video.video_title}</h2>
                            <p>${video.video_detail}</p>
                            <p>${video.video_channel}</p>
                            <p>${video.video_id}</p>
                            <p>${video.views}</p>
                            <p>${video.upload_date}</p>
                            <p>${video.video_tag}</p>
                          </div>`;
    });
    
    // 화면에 표시할 곳의 id를 가진 요소에 비디오 목록을 삽입
    document.getElementById('channelInfo').innerHTML = videoListHTML;
}