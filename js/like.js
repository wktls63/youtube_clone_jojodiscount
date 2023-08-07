let isLiked = false;     
let isDisliked = false;  
let likeCount = 1000;
let dislikeCount = 632; 

// 좋아요 status 관리
function toggleLike() {
  isLiked = !isLiked;
  if (isLiked) {
    likeCount += 1;
    // 만약 싫어요가 눌러져 있다면, 싫어요 취소하고 좋아요추가
    if (isDisliked) {
      isDisliked = false;
      dislikeCount -= 1;
    }
  } else {
    likeCount -= 1;
  }
  updateLikeCount();
}

// 싫어요 status
function toggleDislike() {
  isDisliked = !isDisliked;
  if (isDisliked) {
    dislikeCount += 1;
    // 만약 좋아요가 눌러져 있다면, 좋아요 취소하고 싫어요 추가
    if (isLiked) {
      isLiked = false;
      likeCount -= 1;
    }
  } else {
    dislikeCount -= 1;
  }
  updateLikeCount();
}

function updateLikeCount() {
  const likeCountElement = document.getElementById('likeCount');
  likeCountElement.innerText = likeCount;
  console.log("Like : " + likeCount);
  const dislikeCountElement = document.getElementById('dislikeCount');
  dislikeCountElement.innerText = dislikeCount;
  console.log("DisLike : " + dislikeCount);
}