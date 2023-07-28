// home.html 에서 영상들 뿌려주는 작업 07.27 by. 박세용 //

// 숫자를 "454,4819" 형식으로 변환하는 함수
function formatViews(views) {
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  
        // 조회수를 포맷하여 "45,4819" 형식으로 변환
        const formattedViews = formatViews(videoInfo.views);
  
        // videoInfo를 사용하여 각각의 비디오 정보를 표시하는 HTML 코드를 생성
        const videoItemHtml = `
          <div class="thumbnail-row">
            <img class="thumbnail" src="${videoInfo.image_link}" alt="Thumbnail" />
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