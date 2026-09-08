/* ============================================================
   交通量カウント
   HTML + CSS + JavaScriptのみで動作

   機能
   ・普通車 / トラック / バス / バイク / 自転車 / 歩行者
   ・上り / 下り
   ・＋ / − ボタン
   ・キーボード入力
   ・キーボード設定変更
   ・localStorage保存
   ・CSV出力
   ・全リセット
   ・← Undo
   ・→ Redo
   ・長押しによる連続入力防止
============================================================ */


/* ============================================================
   localStorage
============================================================ */

const STORAGE_KEY = "traffic_counts";

const KEY_STORAGE_KEY = "traffic_key_settings";


/* ============================================================
   カウントデータ
============================================================ */

const counts = {

    up: {

        car: 0,

        truck: 0,

        bus: 0,

        bike: 0,

        bicycle: 0,

        person: 0

    },

    down: {

        car: 0,

        truck: 0,

        bus: 0,

        bike: 0,

        bicycle: 0,

        person: 0

    }

};


/* ============================================================
   種類
============================================================ */

const types = [

    "car",

    "truck",

    "bus",

    "bike",

    "bicycle",

    "person"

];


/* ============================================================
   方向
============================================================ */

const directions = [

    "up",

    "down"

];


/* ============================================================
   日本語名称
============================================================ */

const typeNames = {

    car: "普通車",

    truck: "トラック",

    bus: "バス",

    bike: "バイク",

    bicycle: "自転車",

    person: "歩行者"

};


/* ============================================================
   初期キー設定

   上り
   1 → 普通車
   2 → トラック
   3 → バス
   4 → バイク
   5 → 自転車
   6 → 歩行者

   下り
   Q → 普通車
   W → トラック
   E → バス
   R → バイク
   T → 自転車
   Y → 歩行者
============================================================ */

const DEFAULT_KEYS = {

    up: {

        car: "1",

        truck: "2",

        bus: "3",

        bike: "4",

        bicycle: "5",

        person: "6"

    },

    down: {

        car: "Q",

        truck: "W",

        bus: "E",

        bike: "R",

        bicycle: "T",

        person: "Y"

    }

};


/* ============================================================
   現在のキー設定
============================================================ */

const keySettings = {

    up: {

        ...DEFAULT_KEYS.up

    },

    down: {

        ...DEFAULT_KEYS.down

    }

};


/* ============================================================
   キー設定対象
============================================================ */

let settingTarget = null;


/* ============================================================
   Undo / Redo
============================================================ */

const undoHistory = [];

const redoHistory = [];


/* ============================================================
   履歴最大数
============================================================ */

const MAX_HISTORY = 100;


/* ============================================================
   カウントデータを完全コピー
============================================================ */

function cloneCounts() {

    return JSON.parse(

        JSON.stringify(

            counts

        )

    );

}


/* ============================================================
   カウントデータ復元
============================================================ */

function restoreCounts(state) {

    directions.forEach(function(direction) {

        types.forEach(function(type) {

            if (

                state[direction] &&

                typeof state[direction][type]
                === "number"

            ) {

                counts[direction][type] =

                    state[direction][type];

            }

        });

    });


    updateAllDisplay();

    saveCounts();

}


/* ============================================================
   Undo履歴へ追加
============================================================ */

function pushUndoHistory() {

    undoHistory.push(

        cloneCounts()

    );


    if (

        undoHistory.length > MAX_HISTORY

    ) {

        undoHistory.shift();

    }


    /*
       新しい操作をした場合、
       Redo履歴は削除
    */

    redoHistory.length = 0;

}


/* ============================================================
   Undo
   ←キー
============================================================ */

function undo() {

    if (

        undoHistory.length === 0

    ) {

        updateSaveStatus(

            "戻せる操作がありません"

        );

        return;

    }


    /*
       現在の状態をRedoへ保存
    */

    redoHistory.push(

        cloneCounts()

    );


    /*
       一つ前の状態
    */

    const previousState =

        undoHistory.pop();


    /*
       復元
    */

    restoreCounts(

        previousState

    );


    updateSaveStatus(

        "← 一つ前の数値に戻しました"

    );

}


/* ============================================================
   Redo
   →キー
============================================================ */

function redo() {

    if (

        redoHistory.length === 0

    ) {

        updateSaveStatus(

            "やり直せる操作がありません"

        );

        return;

    }


    /*
       現在の状態をUndoへ保存
    */

    undoHistory.push(

        cloneCounts()

    );


    /*
       次の状態
    */

    const nextState =

        redoHistory.pop();


    /*
       復元
    */

    restoreCounts(

        nextState

    );


    updateSaveStatus(

        "→ 操作をやり直しました"

    );

}


/* ============================================================
   データ保存
============================================================ */

function saveCounts() {

    try {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(

                counts

            )

        );


        updateSaveStatus(

            "保存済み"

        );

    }

    catch (error) {

        console.error(

            "データ保存エラー:",

            error

        );


        updateSaveStatus(

            "保存エラー"

        );

    }

}


/* ============================================================
   保存状態表示
============================================================ */

function updateSaveStatus(message) {

    const element =

        document.getElementById(

            "save-status"

        );


    if (!element) {

        return;

    }


    element.textContent =

        message;

}


/* ============================================================
   データ読み込み
============================================================ */

function loadCounts() {

    try {

        const savedData =

            localStorage.getItem(

                STORAGE_KEY

            );


        if (!savedData) {

            return;

        }


        const data =

            JSON.parse(

                savedData

            );


        directions.forEach(function(direction) {

            if (

                !data[direction] ||

                typeof data[direction]
                !== "object"

            ) {

                return;

            }


            types.forEach(function(type) {

                const value =

                    data[direction][type];


                if (

                    typeof value === "number" &&

                    Number.isInteger(value) &&

                    value >= 0

                ) {

                    counts[direction][type] =

                        value;

                }

            });

        });


        console.log(

            "保存データを読み込みました。"

        );

    }

    catch (error) {

        console.error(

            "データ読み込みエラー:",

            error

        );

    }

}


/* ============================================================
   キー設定保存
============================================================ */

function saveKeySettings() {

    try {

        localStorage.setItem(

            KEY_STORAGE_KEY,

            JSON.stringify(

                keySettings

            )

        );

    }

    catch (error) {

        console.error(

            "キー設定保存エラー:",

            error

        );

    }

}


/* ============================================================
   キー設定読み込み
============================================================ */

function loadKeySettings() {

    try {

        const savedData =

            localStorage.getItem(

                KEY_STORAGE_KEY

            );


        if (!savedData) {

            return;

        }


        const data =

            JSON.parse(

                savedData

            );


        directions.forEach(function(direction) {

            if (

                !data[direction] ||

                typeof data[direction]
                !== "object"

            ) {

                return;

            }


            types.forEach(function(type) {

                const value =

                    data[direction][type];


                if (

                    typeof value === "string" &&

                    value.length > 0

                ) {

                    keySettings[direction][type] =

                        value;

                }

            });

        });


        console.log(

            "キー設定を読み込みました。"

        );

    }

    catch (error) {

        console.error(

            "キー設定読み込みエラー:",

            error

        );

    }

}


/* ============================================================
   キー表示更新
============================================================ */

function updateKeyDisplay() {

    document

        .querySelectorAll(".key")

        .forEach(function(button) {

            const direction =

                button.dataset.direction;


            const type =

                button.dataset.type;


            if (

                keySettings[direction] &&

                keySettings[direction][type]

            ) {

                button.textContent =

                    keySettings[
                        direction
                    ][type];

            }

        });

}


/* ============================================================
   キーの使用状況を検索
============================================================ */

function findKeyOwner(

    key,

    ignoreDirection,

    ignoreType

) {

    const normalizedKey =

        key.toLowerCase();


    for (

        const direction of directions

    ) {

        for (

            const type of types

        ) {

            /*
               自分自身は無視
            */

            if (

                direction === ignoreDirection &&

                type === ignoreType

            ) {

                continue;

            }


            const currentKey =

                keySettings[
                    direction
                ][type];


            if (

                currentKey.toLowerCase()
                === normalizedKey

            ) {

                return {

                    direction: direction,

                    type: type

                };

            }

        }

    }


    return null;

}


/* ============================================================
   キー設定開始
============================================================ */

function startKeySetting(

    direction,

    type

) {

    settingTarget = {

        direction: direction,

        type: type

    };


    const status =

        document.getElementById(

            "key-setting-status"

        );


    if (status) {

        status.textContent =

            `${typeNames[type]}（${
                direction === "up"
                    ? "上り"
                    : "下り"
            }）の新しいキーを押してください`;

        status.classList.add(

            "active"

        );

    }


    /*
       すべての設定中表示を解除
    */

    document

        .querySelectorAll(".key")

        .forEach(function(button) {

            button.classList.remove(

                "setting"

            );

        });


    /*
       対象を設定中表示
    */

    const target =

        document.querySelector(

            `.key[data-direction="${direction}"][data-type="${type}"]`

        );


    if (target) {

        target.classList.add(

            "setting"

        );

    }

}


/* ============================================================
   キー設定
============================================================ */

function setKey(key) {

    if (!settingTarget) {

        return;

    }


    const direction =

        settingTarget.direction;


    const type =

        settingTarget.type;


    /*
       ESCでキャンセル
    */

    if (

        key === "Escape"

    ) {

        cancelKeySetting();

        return;

    }


    /*
       設定できないキー
    */

    const invalidKeys = [

        "Shift",

        "Control",

        "Alt",

        "Meta",

        "CapsLock",

        "Tab",

        "ContextMenu",

        "Dead",

        "Process",

        "Unidentified"

    ];


    if (

        invalidKeys.includes(key)

    ) {

        showKeySettingMessage(

            "そのキーは設定できません"

        );

        return;

    }


    /*
       既に使われているキーか確認
    */

    const owner =

        findKeyOwner(

            key,

            direction,

            type

        );


    if (owner) {

        showKeySettingMessage(

            `そのキーはすでに「${
                typeNames[owner.type]
            }（${
                owner.direction === "up"
                    ? "上り"
                    : "下り"
            }）」に設定されています`

        );

        return;

    }


    /*
       表示用キー名
    */

    let displayKey = key;


    /*
       英数字1文字なら大文字
    */

    if (

        key.length === 1

    ) {

        displayKey =

            key.toUpperCase();

    }


    /*
       新しいキーを設定
    */

    keySettings[
        direction
    ][type] =

        displayKey;


    /*
       保存
    */

    saveKeySettings();


    /*
       表示更新
    */

    updateKeyDisplay();


    /*
       設定終了
    */

    cancelKeySetting();


    showKeySettingMessage(

        `「${displayKey}」に設定しました`

    );

}


/* ============================================================
   キー設定キャンセル
============================================================ */

function cancelKeySetting() {

    settingTarget = null;


    /*
       設定中表示解除
    */

    document

        .querySelectorAll(".key")

        .forEach(function(button) {

            button.classList.remove(

                "setting"

            );

        });


    /*
       状態表示
    */

    const status =

        document.getElementById(

            "key-setting-status"

        );


    if (status) {

        status.textContent =

            "キー表示をクリックすると変更できます";

        status.classList.remove(

            "active"

        );

    }

}


/* ============================================================
   キー設定メッセージ
============================================================ */

function showKeySettingMessage(message) {

    const status =

        document.getElementById(

            "key-setting-status"

        );


    if (!status) {

        return;

    }


    status.textContent =

        message;

}


/* ============================================================
   キー設定初期化
============================================================ */

function resetKeySettings() {

    const result =

        window.confirm(

            "キーボード設定を初期状態に戻しますか？"

        );


    if (!result) {

        return;

    }


    directions.forEach(function(direction) {

        types.forEach(function(type) {

            keySettings[
                direction
            ][type] =

                DEFAULT_KEYS[
                    direction
                ][type];

        });

    });


    saveKeySettings();

    updateKeyDisplay();

    cancelKeySetting();


    showKeySettingMessage(

        "キー設定を初期状態に戻しました"

    );

}


/* ============================================================
   表示更新
============================================================ */

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


/* ============================================================
   合計更新
============================================================ */

function updateTotal(direction) {

    const data =

        counts[direction];


    const total =

        data.car +

        data.truck +

        data.bus +

        data.bike +

        data.bicycle +

        data.person;


    const element =

        document.getElementById(

            `${direction}-total`

        );


    if (!element) {

        return;

    }


    element.textContent =

        total;

}


/* ============================================================
   全表示更新
============================================================ */

function updateAllDisplay() {

    directions.forEach(function(direction) {

        types.forEach(function(type) {

            updateDisplay(

                direction,

                type

            );

        });


        updateTotal(

            direction

        );

    });

}


/* ============================================================
   カウント変更
============================================================ */

function changeCount(

    direction,

    type,

    amount

) {

    /*
       方向確認
    */

    if (!counts[direction]) {

        return;

    }


    /*
       種類確認
    */

    if (

        typeof counts[
            direction
        ][type] !== "number"

    ) {

        return;

    }


    /*
       操作前の状態を保存
    */

    pushUndoHistory();


    /*
       カウント変更
    */

    counts[
        direction
    ][type] += amount;


    /*
       0未満禁止
    */

    if (

        counts[
            direction
        ][type] < 0

    ) {

        counts[
            direction
        ][type] = 0;

    }


    /*
       表示更新
    */

    updateDisplay(

        direction,

        type

    );


    updateTotal(

        direction

    );


    /*
       保存
    */

    saveCounts();

}


/* ============================================================
   全てリセット
============================================================ */

function resetAll() {

    const result =

        window.confirm(

            "全てのカウントをリセットしますか？"

        );


    if (!result) {

        return;

    }


    /*
       リセット前の状態を保存
    */

    pushUndoHistory();


    /*
       全て0
    */

    directions.forEach(function(direction) {

        types.forEach(function(type) {

            counts[
                direction
            ][type] = 0;

        });

    });


    /*
       表示更新
    */

    updateAllDisplay();


    /*
       保存
    */

    saveCounts();


    updateSaveStatus(

        "全てリセットしました"

    );

}


/* ============================================================
   CSV出力
============================================================ */

function exportCSV() {

    /*
       CSVヘッダー
    */

    const rows = [

        [

            "方向",

            "種類",

            "カウント"

        ]

    ];


    /*
       上り
    */

    types.forEach(function(type) {

        rows.push([

            "上り",

            typeNames[type],

            counts.up[type]

        ]);

    });


    /*
       下り
    */

    types.forEach(function(type) {

        rows.push([

            "下り",

            typeNames[type],

            counts.down[type]

        ]);

    });


    /*
       CSV文字列作成
    */

    const csv =

        rows

            .map(function(row) {

                return row

                    .map(function(value) {

                        const text =

                            String(

                                value ?? ""

                            );


                        return (

                            '"' +

                            text.replace(

                                /"/g,

                                '""'

                            ) +

                            '"'

                        );

                    })

                    .join(",");

            })

            .join("\r\n");


    /*
       UTF-8 BOM
    */

    const blob =

        new Blob(

            [

                "\uFEFF",

                csv

            ],

            {

                type:

                    "text/csv;charset=utf-8;"

            }

        );


    /*
       ダウンロードURL
    */

    const url =

        URL.createObjectURL(

            blob

        );


    /*
       現在日時
    */

    const now =

        new Date();


    const year =

        now.getFullYear();


    const month =

        String(

            now.getMonth() + 1

        ).padStart(

            2,

            "0"

        );


    const day =

        String(

            now.getDate()

        ).padStart(

            2,

            "0"

        );


    const hour =

        String(

            now.getHours()

        ).padStart(

            2,

            "0"

        );


    const minute =

        String(

            now.getMinutes()

        ).padStart(

            2,

            "0"

        );


    const second =

        String(

            now.getSeconds()

        ).padStart(

            2,

            "0"

        );


    /*
       ファイル名
    */

    const filename =

        `交通量カウント_${
            year
        }${
            month
        }${
            day
        }_${
            hour
        }${
            minute
        }${
            second
        }.csv`;


    /*
       ダウンロードリンク
    */

    const link =

        document.createElement(

            "a"

        );


    link.href =

        url;


    link.download =

        filename;


    document.body.appendChild(

        link

    );


    /*
       ダウンロード
    */

    link.click();


    /*
       要素削除
    */

    link.remove();


    /*
       URL解放
    */

    URL.revokeObjectURL(

        url

    );


    /*
       状態表示
    */

    updateSaveStatus(

        "CSVを出力しました"

    );


    console.log(

        "CSV出力:",

        filename

    );

}


/* ============================================================
   キーボード入力
============================================================ */

document.addEventListener(

    "keydown",

    function(event) {


        /* ====================================================
           キー設定中
        ==================================================== */

        if (settingTarget) {

            event.preventDefault();


            setKey(

                event.key

            );


            return;

        }


        /* ====================================================
           INPUT / TEXTAREA
        ==================================================== */

        if (

            event.target.tagName === "INPUT" ||

            event.target.tagName === "TEXTAREA" ||

            event.target.isContentEditable

        ) {

            return;

        }


        /* ====================================================
           長押し防止
        ==================================================== */

        if (event.repeat) {

            return;

        }


        /* ====================================================
           ← Undo
        ==================================================== */

        if (

            event.key === "ArrowLeft"

        ) {

            event.preventDefault();


            undo();


            return;

        }


        /* ====================================================
           → Redo
        ==================================================== */

        if (

            event.key === "ArrowRight"

        ) {

            event.preventDefault();


            redo();


            return;

        }


        /* ====================================================
           設定されたキーを検索
        ==================================================== */

        const pressedKey =

            event.key.toLowerCase();


        for (

            const direction of directions

        ) {

            for (

                const type of types

            ) {

                const configuredKey =

                    keySettings[
                        direction
                    ][type].toLowerCase();


                if (

                    configuredKey ===

                    pressedKey

                ) {

                    event.preventDefault();


                    changeCount(

                        direction,

                        type,

                        1

                    );


                    return;

                }

            }

        }

    }

);


/* ============================================================
   キー表示クリック
============================================================ */

document.addEventListener(

    "click",

    function(event) {

        const keyButton =

            event.target.closest(

                ".key"

            );


        if (!keyButton) {

            return;

        }


        const direction =

            keyButton.dataset.direction;


        const type =

            keyButton.dataset.type;


        if (

            !direction ||

            !type

        ) {

            return;

        }


        startKeySetting(

            direction,

            type

        );

    }

);


/* ============================================================
   ページ起動
============================================================ */

function initialize() {

    /*
       カウント読み込み
    */

    loadCounts();


    /*
       キー設定読み込み
    */

    loadKeySettings();


    /*
       カウント表示
    */

    updateAllDisplay();


    /*
       キー表示
    */

    updateKeyDisplay();


    /*
       起動ログ
    */

    console.log(

        "================================"

    );


    console.log(

        "交通量カウントシステム起動"

    );


    console.log(

        "================================"

    );


    console.log(

        "キーボード操作：ON"

    );


    console.log(

        "長押し防止：ON"

    );


    console.log(

        "CSV出力：ON"

    );


    console.log(

        "キー設定：ON"

    );


    console.log(

        "←：一つ前に戻す"

    );


    console.log(

        "→：やり直す"

    );


    console.log(

        "上り：1 2 3 4 5 6"

    );


    console.log(

        "1 → 普通車"

    );


    console.log(

        "2 → トラック"

    );


    console.log(

        "3 → バス"

    );


    console.log(

        "4 → バイク"

    );


    console.log(

        "5 → 自転車"

    );


    console.log(

        "6 → 歩行者"

    );


    console.log(

        "下り：Q W E R T Y"

    );


    console.log(

        "Q → 普通車"

    );


    console.log(

        "W → トラック"

    );


    console.log(

        "E → バス"

    );


    console.log(

        "R → バイク"

    );


    console.log(

        "T → 自転車"

    );


    console.log(

        "Y → 歩行者"

    );

}


/* ============================================================
   起動
============================================================ */

initialize();
