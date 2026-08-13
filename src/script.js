// 交通量データ
const counts = {
    up: {
        car: 0,
        truck: 0,
        bus: 0,
        bike: 0,
        person: 0,
        bicycle: 0
    },

    down: {
        car: 0,
        truck: 0,
        bus: 0,
        bike: 0,
        person: 0,
        bicycle: 0
    }
};


// カウントを増減する
function changeCount(direction, type, amount) {

    counts[direction][type] += amount;

    // 0未満にはしない
    if (counts[direction][type] < 0) {
        counts[direction][type] = 0;
    }

    // 画面を更新
    updateDisplay(direction, type);

    // 合計を更新
    updateTotal(direction);
}


// 数字を画面に表示
function updateDisplay(direction, type) {

    const element = document.getElementById(
        `${direction}-${type}`
    );

    element.textContent = counts[direction][type];
}


// 上り・下りの合計を計算
function updateTotal(direction) {

    const data = counts[direction];

    const total =
        data.car +
        data.truck +
        data.bus +
        data.bike +
        data.person +
        data.bicycle;

    document.getElementById(
        `${direction}-total`
    ).textContent = total;
}


// 全てリセット
function resetAll() {

    if (!confirm("全てのカウントをリセットしますか？")) {
        return;
    }

    const types = [
        "car",
        "truck",
        "bus",
        "bike",
        "person",
        "bicycle"
    ];

    const directions = ["up", "down"];

    directions.forEach(direction => {

        types.forEach(type => {

            counts[direction][type] = 0;

            updateDisplay(direction, type);

        });

        updateTotal(direction);
    });
}