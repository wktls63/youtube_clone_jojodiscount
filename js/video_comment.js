const input = document.querySelector('.Comment-input');
const itemAdd = document.querySelector('.Comment-Add');
const comments = document.querySelector('.Comments');

const onAdd = () => {
    const text = input.value;
    if (input.value === '') {
        input.focus();
        return;
    }

    const item = document.createElement('li');
    item.setAttribute('class', 'item');

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
        comments.removeChild(item);
    });

    item.appendChild(itemText);
    item.appendChild(itemEdit); // 수정 버튼을 아이템에 추가
    item.appendChild(itemDel);
    comments.appendChild(item);
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