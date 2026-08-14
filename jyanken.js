// ボタンをすべて取得（グー: 0, チョキ: 1, パー: 2）
const buttons = document.querySelectorAll('.button-group button');
// 結果を表示するエリアを取得
const resultElement = document.getElementById('result');
// チートモードのチェックボックスを取得
const cheatModeCheckbox = document.getElementById('cheatMode');

// 手の定義を配列で用意しておく
const hands = ['グー', 'チョキ', 'パー']; // index の値は 0: グー, 1: チョキ, 2: パー

// ボタンにクリックイベントを設定
buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        // index の値は 0: グー, 1: チョキ, 2: パー と対応
        playGame(index);
    });
});

// 相手（CPU）の手をランダムに選ぶロジックを作る
// 0, 1, 2 のいずれかをランダムに返す関数
function getCpuHand(){
  return Math.floor(Math.random() * 3);
}

// じゃんけんの勝敗判定と結果表示を行う
function playGame(playerHand){

  let cpuHand;

  // ----------------------------------------------------
  // 【チートモードの判定】
  // ----------------------------------------------------
  if (cheatModeCheckbox.checked) {
    // チートONのとき：プレイヤーの手に対して「負ける手」をCPUに選ばせる
    if (playerHand === 0) {
      cpuHand = 1; // プレイヤーがグー   ➔ CPUはチョキ
    } else if (playerHand === 1) {
      cpuHand = 2; // プレイヤーがチョキ ➔ CPUはパー
    } else if (playerHand === 2) {
      cpuHand = 0; // プレイヤーがパー   ➔ CPUはグー
    }
  } else {
    // チートOFFのとき：通常通りランダムで選ぶ
    cpuHand = getCpuHand();
  }
  // ----------------------------------------------------

  //  表示する文字とクラス
  let resultMessage = `あなた: ${hands[playerHand]} vs 相手: ${hands[cpuHand]}<br>`;
  let resultClass = '';

  // 勝敗判定
  if (playerHand === cpuHand) {
    resultMessage += 'あいこです！';
    resultClass = 'draw';
  } else if (
    (playerHand === 0 && cpuHand === 1) || // グー vs チョキ
    (playerHand === 1 && cpuHand === 2) || // チョキ vs パー
    (playerHand === 2 && cpuHand === 0)    // パー vs グー
  ) {
    resultMessage += 'あなたの勝ち！';
    resultClass = 'win';
  } else {
    resultMessage += 'あなたの負け...';
    resultClass = 'lose';
  }

  // 画面にテキストを表示 (HTMLタグを含めるため innerHTML を使用)
  resultElement.innerHTML = resultMessage;

  // クラスを付け替えて結果テキストの色を変更
  resultElement.className = resultClass;
}


// =========================================
// ステップ3: チートモードON/OFF時の背景切り替え演出
// =========================================
cheatModeCheckbox.addEventListener('change', () => {
  if (cheatModeCheckbox.checked) {
    // チェックが入ったら body に 'cheat-active' クラスを付与
    document.body.classList.add('cheat-active');
  } else {
    // チェックが外れたら 'cheat-active' クラスを削除
    document.body.classList.remove('cheat-active');
  }
});