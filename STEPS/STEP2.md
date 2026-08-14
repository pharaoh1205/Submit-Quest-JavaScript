
## 全体の処理フロー

```
【プレイヤーがボタンを押したとき】
 ├─ チートモードが OFF の場合 ➔ 通常通りランダムで手を選ぶ
 └─ チートモードが ON の場合  ➔ プレイヤーの手を見て「負ける手」を選ぶ
```

## 1. `cheatModeCheckbox` とは？

まず、直前のコードで以下のように取得していました。

```
const cheatModeCheckbox = document.getElementById('cheatMode');
```

これは、HTMLの `<input type="checkbox" id="cheatMode">` という「チェックボックスそのもの（スイッチ）」をJavaScriptで扱えるように掴んでおいた状態です。

## 2. `.checked`（ドット・チェックド）とは？

JavaScriptでは、チェックボックスの要素の後ろに `.checked` をつけると、**今のチェック状態を `true` か `false` で教えてくれるプロパティ（性質）** が用意されています。

- **チェックが入っている（ON）とき** ➔ **`true`**
- **チェックが外れている（OFF）とき** ➔ **`false`**

## 3. なぜ `if (cheatModeCheckbox.checked)` だけで動くのか？

プログラミングの `if` 文は、**「カッコの中身が `true` になったら、中の処理を実行する」** というルールで動いています。

本来的には、以下のように書くイメージです。

```
JavaScript
// 「もしチェック状態が true (ON) だったら」という意味
if (cheatModeCheckbox.checked === true) {
  // チート処理を実行
}
```

ですが`cheatModeCheckbox.checked` 自体が元から `true` か `false` のどちらかの値を持っているので、**`=== true` を省略してすっきり書くのがJavaScriptの一般的な書き方**になっています。

## 流れのまとめ

1. ユーザーが「グー」「チョキ」「パー」のボタンを押す
2. `playGame()` 関数が動き出す
3. `if (cheatModeCheckbox.checked)` がチェックボックスを見る
    - **チェックが入っていたら（`true`）** ➔ `if` の中の「CPUが絶対に負ける手を選ぶ処理」を実行
    - **チェックが外れていたら（`false`）** ➔ `else` の「ランダムで手を選ぶ処理」を実行

「`cheatModeCheckbox.checked` は **『今チェック付いてる？』と問いかけて、`true` か `false` を返してもらう命令**」と捉えると理解しやすくなります！

1. **`cpuHand` の決定タイミング**
プレイヤーの手（`playerHand`）が分かった**後**にCPUの手を決めることで、絶対に負けない手（後出しジャンケン）を自動化しています。

## JavaScriptコード

```
const resultElement = document.getElementById('result');
const cheatModeCheckbox = document.getElementById('cheatMode');

// じゃんけんを実行する関数（0: グー, 1: チョキ, 2: パー）
function playGame(playerHand){
  let cpuHand;

  // 1. チートモードがONかどうかチェック
  if (cheatModeCheckbox.checked) {
    // 【チートON】CPUは必ず負ける手を選ぶ
    if (playerHand === 0) cpuHand = 1;      // プレイヤー: グー   ➔ CPU: チョキ
    else if (playerHand === 1) cpuHand = 2; // プレイヤー: チョキ ➔ CPU: パー
    else if (playerHand === 2) cpuHand = 0; // プレイヤー: パー   ➔ CPU: グー
  } else {
    // 【チートOFF】通常通りランダムで手を選ぶ (0〜2)
    cpuHand = Math.floor(Math.random() * 3);
  }

```
