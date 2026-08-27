// ========================================
// 交通量データ
// ========================================

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


// ========================================
// Pythonローカルサーバー
// ========================================

const SERVER_URL = "http://127.0.0.1:8765";


// ========================================
// 種類
// ========================================

const types = [
    "car",
    "truck",
    "bus",
    "bike",
    "person",
    "bicycle"
];


const directions = [
    "up",
    "down"
];


// ========================================
// Pythonから現在のカウントを取得
// ========================================

async function loadCounts() {

    try {

        const response = await fetch(
            `${SERVER_URL}/state`,
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("通信エラー");
        }

        const data = await response.json();


        directions.forEach(direction => {

            types.forEach(type => {

                if (
                    data[direction] &&
                    typeof data[direction][type] === "number"
                ) {

                    counts[direction][type] =
                        data[direction][type];

                }

            });

        });


        updateAllDisplay();


    } catch (error) {

        console.log(
            "Pythonサーバーに接続できません。",
            error
        );

    }

}


// ========================================
// ＋／－ボタン
// ========================================

async function changeCount(
    direction,
    type,
    amount
) {

    let endpoint;

    if (amount > 0) {

        endpoint = "increment";

    } else {

        endpoint = "decrement";

    }


    try {

        const response = await fetch(
            `${SERVER_URL}/${endpoint}` +
            `?direction=${direction}` +
            `&type=${type}`,
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {
            throw new Error("カウント変更エラー");
        }


        await loadCounts();


    } catch (error) {

        console.error(
            "カウント変更エラー:",
            error
        );

    }

}


// ========================================
// 表示更新
// ========================================

function updateDisplay(
    direction,
    type
) {

    const element =
        document.getElementById(
            `${direction}-${type}`
        );


    if (!element) {
        return;
    }


    element.textContent =
        counts[direction][type];

}


// ========================================
// 合計更新
// ========================================

function updateTotal(direction) {

    const data =
        counts[direction];


    const total =
        data.car +
        data.truck +
        data.bus +
        data.bike +
        data.person +
        data.bicycle;


    const element =
        document.getElementById(
            `${direction}-total`
        );


    if (element) {

        element.textContent =
            total;

    }

}


// ========================================
// 全表示更新
// ========================================

function updateAllDisplay() {

    directions.forEach(direction => {

        types.forEach(type => {

            updateDisplay(
                direction,
                type
            );

        });


        updateTotal(direction);

    });

}


// ========================================
// 全リセット
// ========================================

async function resetAll() {

    if (
        !confirm(
            "全てのカウントをリセットしますか？"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${SERVER_URL}/reset`
            );


        if (!response.ok) {

            throw new Error(
                "リセットエラー"
            );

        }


        await loadCounts();


    } catch (error) {

        console.error(
            "リセットエラー:",
            error
        );

    }

}


// ========================================
// 0.1秒ごとにPythonと同期
// ========================================

setInterval(
    loadCounts,
    100
);


// ========================================
// 起動時
// ========================================

loadCounts();