## ステップ3の実装手順（背景アニメーションの連動）

### 実装の仕組み

CSSに用意されている以下の記述に注目してください。

```
CSS
/* bodyに .cheat-active がつくと .overlay にアニメが発動 */
.cheat-active .overlay {
  animation: cheatGlow 1s infinite alternate;
}
```

これは、**`body` タグに `cheat-active` というクラスがついた時だけ、背景（.overlay）が怪しく明滅する**という仕組みになっています。

ですので、JavaScript側で **「チェックボックスのON/OFFが切り替わった瞬間に `body` に `cheat-active` クラスを付け外しする処理」** を追加すれば完成します。

## 追記するJavaScriptコード


```
JavaScript
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
```

change 変化したかどうか
.clicked チェックがされたのか、チェックが外れたのか

## ポイント解説

- **`addEventListener('change', ...)`**
チェックボックスの状態が切り替わった（ONからOFF、またはOFFからONに変わった）瞬間を検知するイベントです。
- **`document.body.classList.add('cheat-active')`**
`document.body.classList.add('cheat-active');` の処理を、3つのパーツに分解して分かりやすく解説します！

一言で言うと、**「Webページの背景や全体を包んでいる `<body>` タグに、新しいシール（`cheat-active` というクラス）をペタッと貼る命令」** です。

## 3つのパーツの役割

このコードは、ドット（`.`）でつながれた3つのパーツでできています。

```
document.body . classList . add('cheat-active');
  ① どこに   .   ② 何の  . ③ どうする('シールの名前')
```

### ① `document.body`（どこに？）

- **Webページ全体を囲んでいる `<body>` タグ** を指しています。
- 画面全体の背景色や全体のレイアウトを管理している一番外側の親枠です。

### ② `classList`（何のリスト？）

- その要素が今持っている **「クラス（CSSの指定名）のリスト（一覧）」** のことです。
- 例えるなら「そのタグが服に貼っているシールのリスト」のようなものです。

### ③ `.add('cheat-active')`（どうする？）

- `add` は英語で「追加する」という意味です。
- カッコの中の `'cheat-active'` という名前のクラス（シール）を、**リストに新しく追加（付与）** します。

## 実際に何が起こるの？

この1行がJavaScriptで実行されると、HTMLの中身が以下のように変化します。

#### 【実行前】（普通の状態）

HTML

```
<body>
  ...
</body>
```

#### 【実行後】（JavaScriptが動いた瞬間）

HTML

```
<body class="cheat-active">
  ...
</body>
```

## なぜこんなことをするのか？（目的）

`<body>` に `cheat-active` というシールが貼られると、あらかじめ作っておいたCSSが「あ！`body` に `cheat-active` のシールが貼られたぞ！」と気付きます。

すると、CSS側の以下のルールが発動します。

CSS

```
/* bodyに cheat-active がついた時だけ、背景のアニメーションを動かす */
.cheat-active .overlay {
  animation: cheatGlow 1s infinite alternate;
}
```

このように、**JavaScriptで `body` にクラス（シール）を貼り付け、それを合図にしてCSS側で画面全体の見た目を一気に変える** というのがWeb開発での一番定番の手法です。

### 💡 ちなみに外す時は？

チェックボックスをOFFにした時は、`add`（追加）の代わりに **`remove`（削除）** を使ってシールを剥がします。

JavaScript

```
document.body.classList.remove('cheat-active');
```

これで `body` から `cheat-active` クラスが消え、普通の背景に戻る仕組みになっています！
