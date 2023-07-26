function getVideoList() {
    // XMLHttpRequest 객체 생성
    let xhr = new XMLHttpRequest();

    // XMLHttpRequest의 상태 변화를 감지하는 이벤트 핸들러
    xhr.onreadystatechange = function() {
        // 요청이 완료되었을 때(readyState === XMLHttpRequest.DONE)
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // 요청이 성공적으로 처리되었을 때(status === 200)
            if (xhr.status === 200) {
                // 서버에서 받은 JSON 형식의 응답을 JavaScript 객체로 변환
                let data = JSON.parse(xhr.responseText);

                // 서버 응답에서 'Response' 속성이 'False'인 경우, 실패 메시지 출력
                if (data.Response === 'False') {
                    console.log("유튜브 영상정보를 가져오는데 실패했습니다.");
                } else {
                    // 서버에서 받은 영상 데이터를 HTML로 가공하여 변수 'info'에 추가
                    let info = '';
                    data.forEach(videoData => {
                        info += `<h2>${videoData.video_title}</h2>
                                <p>${videoData.video_detail}</p>
                                <p>${videoData.video_channel}</p>
                                <p>${videoData.video_id}</p>
                                <p>${videoData.views}</p>
                                <p>${videoData.upload_date}</p>
                                <p>${videoData.video_tag}</p>`;
                    });

                    // HTML 'list' 요소에 가공된 영상 정보를 삽입
                    document.getElementById('youtubeInfo').innerHTML = info;
                }
            }
        }
    };

    // 서버로 GET 요청을 보냄
    xhr.open('GET', 'http://oreumi.appspot.com/video/getVideoList', true);
    xhr.send();
}
