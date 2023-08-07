const input = document.querySelector('.Comment-input');
const itemAdd = document.querySelector('.Comment-Add');
const comments = document.querySelector('.Comments');

const onAdd = () => {
    const text = input.value;
    if (input.value === '') {
        input.focus();
        return;
    }
    // 댓글 기본 세팅
    const container = document.createElement('div');
    container.setAttribute('class', 'itemContainer');

    // 이미지 요소 생성 및 속성 설정
    const itemSetting = document.createElement('img');
    itemSetting.src = 'icon/james.png';
    //itemSetting.style.; // 

    // 텍스트 요소 생성
    const textElement = document.createElement('p');
    textElement.textContent = 'JOJO할인';
    textElement.setAttribute('class', 'itemNameText');
    container.appendChild(itemSetting);
    container.appendChild(textElement);


    // 댓글 컨테이너 시작
    const item = document.createElement('div');
    item.setAttribute('class', 'item');

    //따봉 요소 생성
    const likeContainer = document.createElement('div');
    likeContainer.setAttribute('class', 'likeContainer');

    const likeElement = document.createElement('img');
    likeElement.setAttribute('id', 'likeElement');
    likeElement.src = 'icon/liked.png';
    const dislikeElement = document.createElement('img');
    dislikeElement.src = 'icon/disliked.png';

    likeContainer.appendChild(likeElement);
    likeContainer.appendChild(dislikeElement);

    //컨테이너 생성
    const itemText = document.createElement('span');
    itemText.setAttribute('class', 'itemText');
    itemText.innerHTML = text;

    const itemEdit = document.createElement('button'); // 수정 버튼 생성
    itemEdit.setAttribute('class', 'itemEdit'); // 클래스 추가
    itemEdit.innerHTML = '수정'; // 버튼 내용 설정
    itemEdit.addEventListener('click', () => {
        const editText = prompt('수정할 내용을 입력하세요:', itemText.innerHTML);
        if (editText !== null) {
            itemText.innerHTML = editText;
        }
    });

    const itemDel = document.createElement('button');
    itemDel.setAttribute('class', 'itemDel');
    itemDel.innerHTML = '삭제';
    itemDel.addEventListener('click', () => {
        comments.removeChild(container);
        comments.removeChild(item);

    });


    item.appendChild(itemText); //댓글내용
    item.appendChild(likeContainer); //따봉묶음
    item.appendChild(itemEdit); //수정버튼
    item.appendChild(itemDel);  //삭제버튼
    comments.append(container); // 댓글 기본세팅
    comments.appendChild(item); // 댓글 세부내용


    input.value = '';
    input.focus();
};

itemAdd.addEventListener('click', () => {
    onAdd();
});

itemAdd.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        onAdd();
    }
    return;
});