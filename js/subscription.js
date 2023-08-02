// 구독버튼 누를 경우 구독중, 구독중에서 버튼 누를경우 구독취소
let isSubscribed = false;

function toggleSubscription() {
    isSubscribed = !isSubscribed;
    const subscribeBtn = document.getElementById("Subscribes-Btn");

    if (isSubscribed) {
        subscribeBtn.textContent = "SUBSCRIBING";
        subscribeBtn.style.backgroundColor = '#4d4d4d';
    } else {
        subscribeBtn.textContent = "SUBSCRIBES";
        subscribeBtn.style.backgroundColor='red';

    }
}