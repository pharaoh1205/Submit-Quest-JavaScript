## 実装の4ステップ

### Step 1: DOM要素を取得する(JavaScriptがHTMLの部品を**掴んでコントロールできる状態)**

<details>
<summary>疑問：なぜDOM操作できるようにする必要があるの？</summary>

## 理由 1. ユーザーのアクション（ボタンクリック等）を検知するため

「グー」「チョキ」「パー」のボタンが押されたことをJavaScript側で知るには、そのボタン要素を取得して **「このボタンが押されたら勝敗を計算してね」という指示（イベントリスナー）を取り付ける** 必要があります。

> **取得しないと…**
> 
> 
> ユーザーがボタンを押しても、JavaScriptは「どのボタンが押されたのか」を全く察知できません。
> 

## 理由 2. 画面の表示（テキストや色）を書き換えるため

じゃんけんの結果（「あなたの勝ち！」など）を表示するテキストエリア（`<p id="result">`）を変更するには、その場所をJavaScriptで指定する必要があります。

JavaScript

```
// 1. 変更したい場所（DOM要素）を取得しておく
const resultElement = document.getElementById('result');

// 2. その場所のテキストや見た目を書き換える
resultElement.innerHTML = "あなたの勝ち！";
resultElement.className = "win"; // 文字色を青にする
```

> **取得しないと…**
> 
> 
> 勝敗の計算結果がJavaScriptの中で出ても、それを画面のどこに表示すればいいのか分からないため、画面が更新されません。
> 

## 理由 3. 設定の状態（チェックボックスのON/OFF）を読み取るため

チートモードがONになっているかどうかを判別するには、チェックボックスの要素（`<input id="cheatMode">`）を取得して、そのチェック状態（`.checked`）を確認する必要があります。

```
// チェックボックス要素を取得しておくことで、ON/OFFが判定できる
if (cheatModeCheckbox.checked) {
  // チートモードの処理
}
```

</details>

画面上のボタンや結果表示エリア、チートモードのチェックボックスをJavaScriptで操作できるように取得します。

```
JavaScript
// ボタンをすべて取得（グー: 0, チョキ: 1, パー: 2）
const buttons = document.querySelectorAll('.button-group button');
// 結果を表示するエリアを取得
const resultElement = document.getElementById('result');
// チートモードのチェックボックスを取得
const cheatModeCheckbox = document.getElementById('cheatMode');

// 手の定義を配列で用意しておく
const hands = ['グー', 'チョキ', 'パー'];
```


## Step 2: ボタンにクリックイベントを設定する

3つのボタンそれぞれに対して「クリックされたときにじゃんけんを実行する」処理を登録します。

```
JavaScript
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    // index の値は 0: グー, 1: チョキ, 2: パー と対応しています
    playGame(index);
  });
});
```

<details>
<summary>疑問：buttons.forEach((button, index) の箇所の (button, index) に関して何故button か indexどちらか一つじゃダメなの？</summary>

結論から言うと、今回のじゃんけんゲームでは **「ボタン本体（見た目の操作）」** と **「番号（勝敗の判定）」** の **両方が絶対に必要だったから** です！
どちらか1つだけにしてしまうと、プログラムが成り立たなくなってしまいます。

## 理由：役割が全く違うから

`(button, index)` に入る2つは、それぞれ以下の役割を持っています。

- **`button` （要素）：** 画面上にある **「ボタンの部品そのもの」**
- **`index` （数字）：** そのボタンが何番目かを表す **「0, 1, 2 という数字」**

もしどちらか片方だけにしたらどうなるか、実験してみましょう。

### パターン1：`button`（ボタン本体）だけにした場合 ❌

JavaScript

```
// index を消して button だけにした場合
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    playGame( ??? ); // 👈 ここに渡す数字（0, 1, 2）が分からなくなる！
  });
});
```

- **できること：** `button.addEventListener` を使って「クリックを見張る」ことはできる。
- **困ること：** 押されたボタンが「グー（0）」「チョキ（1）」「パー（2）」のどれなのかを `playGame` に伝えることができなくなります。

### パターン2：`index`（番号）だけにした場合 ❌

JavaScript

```
// button を消して index だけにした場合
buttons.forEach((index) => {
  // 👈 そもそも「どのボタン」に見張り（addEventListener）を置けばいいか分からない！
  index.addEventListener('click', ... ); // エラーになります（数字の 0 や 1 にクリックは見張れません）
});
```

- **できること：** `playGame(index)` で数字を渡す準備はできる。
- **困ること：** `index` はただの「数字（0や1）」なので、画面上のHTMLボタンにクリックイベントを設定することができません。

</details>


### Step 3: 相手（CPU）の手をランダムに選ぶロジックを作る

`Math.random()` を使って `0`（グー）、`1`（チョキ）、`2`（パー）のいずれかをランダムに生成します。

```
JavaScript
// 0, 1, 2 のいずれかをランダムに返す関数
function getCpuHand(){
  return Math.floor(Math.random() * 3);
}
```

プログラミングで「0〜〇〇までのランダムな整数が欲しい！」というときは、以下の決まり文句を使います。

$$
\text{Math.floor}(\text{Math.random()} \times \text{欲しい種類の数})
$$

今回は「グー・チョキ・パー」の **3種類** が欲しいので、`Math.random() * 3` と書いていたわけです。

- `3` にすると ➔ **0, 1, 2** のどれかが出現
- `6` にすると ➔ **0, 1, 2, 3, 4, 5** のどれかが出現（サイコロなどに便利）

### Step 4: じゃんけんの勝敗判定と結果表示を行う

プレイヤーの手（`playerHand`）とCPUの手（`cpuHand`）を比較し、勝敗を判定して画面を更新します。

```
JavaScript
function playGame(playerHand){
  // CPUの手を取得
  const cpuHand = getCpuHand();

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

  ❶// 画面にテキストを表示 (HTMLタグを含めるため innerHTML を使用)
  resultElement.innerHTML = resultMessage;

  // クラスを付け替えて結果テキストの色を変更
  resultElement.className = resultClass;
}
```


<details>
<summary>疑問：let resultMessage = あなた: ${hands[playerHand]} vs 相手: ${hands[cpuHand]};<br>let resultClass = '';
上記に関して<br>
❶handsとplayerHand、cpuHandは何故結びつくことができるのか？<br>
❷let resultClass = '';はなんのためにあるのか？</summary>

### ❶ hands と playerHand / cpuHand が結びつく理由

結論から言うと、**「配列のインデックス（部屋番号）」** を使って呼び出しているから

#### 1. データの中身を整理

```
// 手の種類の配列（0番目, 1番目, 2番目にデータが入っている）
const hands = ['グー', 'チョキ', 'パー'];

// playerHand や cpuHand に入る値は「0」「1」「2」のどれかの数字
// 例: playerHand = 0 (グー) / cpuHand = 1 (チョキ)
```

#### 2. 配列の取り出しルール

JavaScriptでは、`配列名[数字]` と書くことで、その数字の番号（部屋）に入っている文字列を取り出すことができます。

- `hands[0]` → `'グー'`
- `hands[1]` → `'チョキ'`
- `hands[2]` → `'パー'`

#### 3. 実際の動きの例

もしプレイヤーがグー（`playerHand = 0`）を出し、CPUがチョキ（`cpuHand = 1`）を出した場合：

```
`あなた: ${hands[playerHand]} vs 相手: ${hands[cpuHand]}<br>`
```

↓ 変数に実際の数字が入る

```
`あなた: ${hands[0]} vs 相手: ${hands[1]}<br>`
```

↓ 配列から対応する文字が引き出される

```
`あなた: グー vs 相手: チョキ<br>`
```

このように、**`0, 1, 2` という「数字」を「文字（グー・チョキ・パー）」に変換するための橋渡し**として `hands[数字]` という形で結びつけています。

### ❷ `let resultClass = '';` は何のためにあるの？

結論から言うと、**勝敗に応じた文字色（CSSクラス）を入れるための「空の箱（一時的な変数）」をあらかじめ用意しておくため**

#### 理由：勝敗によって適用したいCSSクラスが変わるから

CSS側で以下のような設定がされています。

```
.win { color: #57aaff; }   /* 勝ち：青色 */
.lose { color: #ff5555; }  /* 負け：赤色 */
.draw { color: #00ff99; }  /* あいこ：緑色 */
```

勝敗判定（`if` 文）の前に `let resultClass = '';` と書いて「空の箱」を作っておき、判定結果によって中身を書き換えます。

JavaScript

```
// 1. 空の箱を用意
let resultClass = '';

// 2. 勝敗判定によって箱の中身を更新する
if (引き分け) {
  resultClass = 'draw';
} else if (勝ち) {
  resultClass = 'win';
} else {
  resultClass = 'lose';
}

// 3. 最後に画面のHTML要素（#result）にクラス名を適用する！
resultElement.className = resultClass;
```

もし最初に `let resultClass = '';` を作っておかないと、`if` の中で設定した `resultClass` を `if` の外側（`resultElement.className` の部分）で使おうとした際に「そんな変数はありません」とエラーになってしまいます。

「これから決まる結果（クラス名）を一時的に入れておくための入れ物」として用意されているものです。

</details>


<details>
<summary>疑問：cpuHandはわかるけどplayerHandは定義されてないのでは？なんで急に出てきて繋がれるのかわかりません </summary>

`playerHand` は、事前に定義されている変数ではなく、**関数 `playGame` が受け取るための「引数（ひきすう）」** としてその場で新しく作られている変数だからです。

引数の仕組みと、なぜ突然出てきても繋がるのかを2つのステップで解説します。

## 1. 関数のカッコ `()` の中身は「データを受け取るための受取口（ポスト）」

`function playGame(playerHand)` と書いたときの `playerHand` は、**「これからこの関数を実行するときに、外部から送られてくるデータを入れるための専用の箱」** です。

```
function playGame(playerHand){
  // ※この { } の中限定で playerHand という箱が使える！
}

```

- 関数の引数はその関数の処理内でだけ使用できる
    
    基本的には「その関数の `{ }`（スコープ）の中でしか使えない」という認識で間違いありません！
    
    プログラミングでは、この「使える範囲」のことをスコープ（有効範囲）と呼びます。
    
    ## ★引数が「その関数の中だけで使える」仕組み
    
    引数は、関数が実行されるときにだけ作られる「使い捨ての変数」のようなものです。
    
    ```
    JavaScript
    function playGame(playerHand){
      // ⭕️ 関数の { } の中なら playerHand が使える
      console.log(playerHand);
    }
    
    // ❌ 関数の外側で使おうとするとエラーになる！
    console.log(playerHand);
    // ➔ Uncaught ReferenceError: playerHand is not defined（定義されていません）
    ```
    
    関数が実行を終えて `{ }` を抜けると、`playerHand` という箱は自動的に消滅するため、外側からアクセスすることはできません。
    
    ## なぜそういう仕組みになっているの？
    
    もし引数や関数内の変数が外側からでも使えてしまったら、次のような大きな問題が発生してしまうためです。
    
    1. **名前の衝突が起きる**
        - 別の場所でたまたま同じ `playerHand` という名前の変数を使っていたときに、値が勝手に書き換わってしまう。
    2. **プログラムの予測が不能になる**
        - どこで誰がその数値を書き換えたのか追いかけられなくなる。
    
    「関数の外からは見えない・触れない」というルール（カプセル化）があるおかげで、**関数の中の処理だけに集中して安全にコードを書くことができる**ようになっています。
    
    ## まとめ
    
    - **引数はその関数の中（`{ }` の中）限定で使える**
    - **関数の実行が終わると消滅する**
    - **関数の外から呼び出すことはできない**
    
    「関数という部屋の中だけで有効なローカルルール（変数）」と覚えておくと完璧
    

事前に `const playerHand = ...` のように定義しておく必要はなく、関数を定義するときにカッコの中に書くだけで**自動的に変数として利用できる状態**になります。

## 2. どこからデータ（値）が渡されて繋がるの？

データが渡される瞬間は、**ボタンがクリックされたとき**です。

コードの「2. ボタンイベントの設定」の部分を見てみましょう。

JavaScript

```
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    playGame(index); // 👈 ここで index（0, 1, 2）を渡して呼び出している！
  });
});
```

実際にボタンが押されると、次のようなバトンタッチが行われます。

1. ユーザーが **「✌️ チョキ」** のボタンを押す。
2. `index` の値は **`1`** になる。
3. `playGame(1)` が呼び出される。
4. **`playGame` 関数の `playerHand` という受取口に `1` がポンッと投げ込まれる！**

```
【クリックされた時】
playGame( index )
           │  （indexの中身「1」が渡される）
           ▼
function playGame( playerHand ) ➔ この瞬間、playerHand の中身が「1」になる！
```

</details>












## 完成後の `<script>` 全体コード

上記のステップをまとめると、`<script>` タグの中身は以下のようになります。

```
HTML
<script>
  // 1. DOM要素の取得
  const buttons = document.querySelectorAll('.button-group button');
  const resultElement = document.getElementById('result');
  const hands = ['グー', 'チョキ', 'パー'];

  // 2. ボタンイベントの設定
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      playGame(index);
    });
  });

  // 3. CPUの手をランダムに決定
  function getCpuHand(){
    return Math.floor(Math.random() * 3);
  }

  // 4. 勝敗判定と画面更新
  function playGame(playerHand){
    const cpuHand = getCpuHand();

    let resultMessage = `あなた: ${hands[playerHand]} vs 相手: ${hands[cpuHand]}<br>`;
    let resultClass = '';

    if (playerHand === cpuHand) {
      resultMessage += 'あいこです！';
      resultClass = 'draw';
    } else if (
      (playerHand === 0 && cpuHand === 1) ||
      (playerHand === 1 && cpuHand === 2) ||
      (playerHand === 2 && cpuHand === 0)
    ) {
      resultMessage += 'あなたの勝ち！';
      resultClass = 'win';
    } else {
      resultMessage += 'あなたの負け...';
      resultClass = 'lose';
    }

    resultElement.innerHTML = resultMessage;
    resultElement.className = resultClass;
  }</script>
```


