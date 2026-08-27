// ============================================================
// 交通量カウント
// ============================================================


// ============================================================
// Pythonサーバー
// ============================================================

const SERVER_URL =
    "http://127.0.0.1:8765";


// ============================================================
// カウント
// ============================================================

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


// ============================================================
// 種類
// ============================================================

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


// ============================================================
// 画面更新
// ============================================================

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
        counts[
            direction
        ][type];

}


// ============================================================
// 合計更新
// ============================================================

function updateTotal(
    direction
) {

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


// ============================================================
// 全画面更新
// ============================================================

function updateAllDisplay() {

    directions.forEach(
        direction => {

            types.forEach(
                type => {

                    updateDisplay(
                        direction,
                        type
                    );

                }
            );


            updateTotal(
                direction
            );

        }
    );

}


// ============================================================
// Pythonからデータを受け取る
// ============================================================

function applyCounts(
    newCounts
) {

    if (!newCounts) {

        return;

    }


    directions.forEach(
        direction => {

            if (!newCounts[direction]) {

                return;

            }


            types.forEach(
                type => {

                    if (
                        typeof
                        newCounts[
                            direction
                        ][type]
                        === "number"
                    ) {

                        counts[
                            direction
                        ][type] =
                            newCounts[
                                direction
                            ][type];

                    }

                }
            );

        }
    );


    updateAllDisplay();

}


// ============================================================
// SSE接続
// ============================================================

function connectEvents() {

    const eventSource =
        new EventSource(
            `${SERVER_URL}/events`
        );


    // --------------------------------------------------------
    // 接続成功
    // --------------------------------------------------------

    eventSource.onopen =
        function() {

            console.log(
                "Pythonサーバー接続：ON"
            );

        };


    // --------------------------------------------------------
    // Pythonからデータ受信
    // --------------------------------------------------------

    eventSource.onmessage =
        function(event) {

            try {

                const data =
                    JSON.parse(
                        event.data
                    );


                if (data.counts) {

                    applyCounts(
                        data.counts
                    );

                }

            } catch (error) {

                console.error(
                    "データ処理エラー:",
                    error
                );

            }

        };


    // --------------------------------------------------------
    // 接続エラー
    // --------------------------------------------------------

    eventSource.onerror =
        function() {

            console.log(
                "Pythonサーバー接続待機中..."
            );

        };

}


// ============================================================
// ＋／－ボタン
// ============================================================

async function changeCount(
    direction,
    type,
    amount
) {

    const endpoint =
        amount > 0
            ? "increment"
            : "decrement";


    try {

        const response =
            await fetch(

                `${SERVER_URL}/${endpoint}` +

                `?direction=${direction}` +

                `&type=${type}`

            );


        if (!response.ok) {

            throw new Error(
                "通信エラー"
            );

        }


        // SSEから即座に画面更新されるので
        // ここではloadCountsしない


    } catch (error) {

        console.error(
            "カウント変更エラー:",
            error
        );

    }

}


// ============================================================
// リセット
// ============================================================

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


    } catch (error) {

        console.error(
            "リセットエラー:",
            error
        );

    }

}


// ============================================================
// 起動
// ============================================================

connectEvents();