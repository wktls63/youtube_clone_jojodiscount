// getVideoInfo 함수 정의: video_id를 매개변수로 받아와서 해당 영상의 정보를 가져오는 함수
function getVideoInfo(video_id) {
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
                    // 데이터 처리 로직 추가 (예: 비디오 정보를 화면에 표시)
                    displayVideoInfo(data);
                }
            }
        }
    };
    
    // open() 메서드를 사용하여 서버에 GET 요청을 보냄
    // encodeURIComponent 함수를 사용하여 video_id를 URL에 인코딩하여 전달
    xhr.open('GET', `http://oreumi.appspot.com/video/getVideoInfo?video_id=${encodeURIComponent(video_id)}`, true);
    
    // send() 메서드를 사용하여 요청을 서버로 전송
    xhr.send();
}

// 비디오 정보를 화면에 표시하는 함수
function displayVideoInfo(videoData) {
    // 비디오 정보를 HTML 형식으로 작성하여 videoInfoHTML에 저장
    let videoInfoHTML = `<h2>${videoData.video_title}</h2>
                        <p>${videoData.video_detail}</p>
                        <p>${videoData.video_channel}</p>
                        <p>${videoData.video_id}</p>
                        <p>${videoData.views}</p>
                        <p>${videoData.upload_date}</p>
                        <p>${videoData.video_tag}</p>`;
                        
    // 화면에 표시할 곳의 id를 가진 요소에 비디오 정보를 삽입
    document.getElementById('videoInfo').innerHTML = videoInfoHTML;
}
