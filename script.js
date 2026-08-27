// ============================================================
// 交通量カウント
// ============================================================


// ============================================================
// Pythonローカルサーバー
// ============================================================

const SERVER_URL =
    "http://127.0.0.1:8765";


// ============================================================
// データ
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
// Pythonから現在のカウントを取得
// ============================================================

async function loadCounts() {

    try {

        const response = await fetch(

            `${SERVER_URL}/state`,

            {
                cache: "no-store"
            }

        );


        if (!response.ok) {

            throw new Error(
                "Pythonサーバー通信エラー"
            );

        }


        const data =
            await response.json();


        directions.forEach(
            direction => {

                types.forEach(
                    type => {

                        if (

                            data[direction] &&

                            typeof data[
                                direction
                            ][type] === "number"

                        ) {

                            counts[
                                direction
                            ][type] =
                                data[
                                    direction
                                ][type];

                        }

                    }
                );

            }
        );


        updateAllDisplay();


    } catch (error) {

        // Pythonが起動していない場合などは
        // エラーを画面には表示しない

        console.log(
            "Pythonサーバーに接続できません。",
            error
        );

    }

}


// ============================================================
// ＋／－ボタン
// ============================================================

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

            throw new Error(
                "カウント変更エラー"
            );

        }


        await loadCounts();


    } catch (error) {

        console.error(
            "カウント変更エラー:",
            error
        );

    }

}


// ============================================================
// 数字を画面に表示
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
// 合計を更新
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
// 全表示を更新
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
// 全リセット
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


        await loadCounts();


    } catch (error) {

        console.error(
            "リセットエラー:",
            error
        );

    }

}


// ============================================================
// Pythonと定期的に同期
//
// 以前：100ms
// 現在：500ms
//
// PCへの負荷を下げるため500msに変更
// ============================================================

setInterval(

    loadCounts,

    500

);


// ============================================================
// ページ読み込み時
// ============================================================

loadCounts();