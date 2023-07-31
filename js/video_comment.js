const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentsList = document.getElementById('comments-list');

// 로컬 스토리지에 저장된 댓글을 가져와서 초기화
let comments = JSON.parse(localStorage.getItem('comments')) || [];

// 댓글 추가 함수
function addComment() {
    const commentText = commentInput.value;
    if (!commentText) {
        alert('Please enter a comment.');
        return;
    }

    const newComment = {
        id: Date.now(), // 댓글 고유 ID (실제로는 데이터베이스에서 생성)
        text: commentText,
    };

    comments.push(newComment);
    saveComments();
    renderComments();

    commentInput.value = ''; // 입력 필드 초기화
}

// 댓글 수정 함수
function editComment(id) {
    const editedText = prompt('Edit your comment:', comments.find(comment => comment.id === id).text);
    if (editedText === null) {
        return; // 사용자가 수정을 취소한 경우
    }

    comments = comments.map(comment => {
        if (comment.id === id) {
            return { ...comment, text: editedText };
        }
        return comment;
    });

    saveComments();
    renderComments();
}

// 댓글 삭제 함수
function deleteComment(id) {
    comments = comments.filter(comment => comment.id !== id);
    saveComments();
    renderComments();
}

// 댓글 목록을 화면에 그려주는 함수
function renderComments() {
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${comment.text}</span>
            <button onclick="editComment(${comment.id})">Edit</button>
            <button onclick="deleteComment(${comment.id})">Delete</button>
        `;
        commentsList.appendChild(li);
    });
}

// 로컬 스토리지에 댓글 저장 함수
function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}

// 페이지 로드 시 댓글 목록 렌더링
renderComments();