// ==============================
// 交通量データ
// ==============================

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


// ==============================
// カウントを増減する
// ==============================

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


// ==============================
// 数字を画面に表示
// ==============================

function updateDisplay(direction, type) {

    const element = document.getElementById(
        `${direction}-${type}`
    );

    element.textContent = counts[direction][type];
}


// ==============================
// 上り・下りの合計を計算
// ==============================

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


// ==============================
// 全てリセット
// ==============================

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


// ==============================
// キーボード入力
// ==============================
//
// 上り
// 1 = 普通車
// 2 = トラック
// 3 = バス
// 4 = バイク
// 5 = 歩行者
// 6 = 自転車
//
// 下り
// Q = 普通車
// W = トラック
// E = バス
// R = バイク
// T = 歩行者
// Y = 自転車
//
// ==============================

document.addEventListener("keydown", function(event) {

    const keyMap = {

        // --------------------------
        // 上り
        // --------------------------

        "1": ["up", "car"],
        "2": ["up", "truck"],
        "3": ["up", "bus"],
        "4": ["up", "bike"],
        "5": ["up", "person"],
        "6": ["up", "bicycle"],


        // --------------------------
        // 下り
        // --------------------------

        "q": ["down", "car"],
        "w": ["down", "truck"],
        "e": ["down", "bus"],
        "r": ["down", "bike"],
        "t": ["down", "person"],
        "y": ["down", "bicycle"]
    };


    // 大文字・小文字を統一
    const key = event.key.toLowerCase();


    // 登録されているキーならカウント
    if (keyMap[key]) {

        const [direction, type] = keyMap[key];

        // 既存のカウント機能を使用
        changeCount(direction, type, 1);

        // キーを押し続けたときの連続入力を防止
        event.preventDefault();
    }
});
