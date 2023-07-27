let isSubscribed = false;

function toggleSubscription() {
    isSubscribed = !isSubscribed;
    const subscribeBtn = document.getElementById("subscribeBtn");

    if (isSubscribed) {
        subscribeBtn.textContent = "SUBSCRIBING";
    } else {
        subscribeBtn.textContent = "SUBSCRIBES";

    }
}