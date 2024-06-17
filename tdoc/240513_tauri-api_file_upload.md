# 1. tauri-api
- フロントエンドでは権限の関係でできないことも、Tauri-API で実行できる。(ローカルファイルアクセスなど)
- [Tauri 公式](https://github.com/tauri-apps/tauri/tree/dev/examples/api)
  - `README.md` を参考にした。




## 1.1. ファイルアップロード
- .tsx の書き方と、設定のどちらもが必要。
- [参考](https://zenn.dev/bpk_t/scraps/4f9523470ea151)

### 1.1.1. .tsx でのコードの例

```tsx
import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';

const upload = async () => {
  const file = await open();                              // open -> ローカルファイルのフルパスを取得できる。
  if (typeof file === 'string') {
    if (props.videoRef.current) {
      props.videoRef.current.src = convertFileSrc(file);  // convertFileSrc -> フルパスを dataUrl として扱う
    }
  }    
}
```

### 1.1.2. `tauri.conf.json` での設定
- [公式ドキュメント](https://tauri.app/v1/api/js/tauri/#convertfilesrc)

```json
"allowlist": {
  "all": false,
  "shell": {
    "all": false,
    "open": true
  },
  "dialog": {
    "open": true
  },
  "protocol": {
    "asset": true,
    "assetScope": ["**"]
  }
}

"security": {
  "csp": "default-src 'self'; img-src 'self' asset: https://asset.localhost"
},
```





# 2. トラブルシューティング

## 2.1. build 時の挙動が違う
- `dev` 環境で実行した場合はできていたが、`build` 環境では、動画ファイルがアップロードできなかった。
- `Refused to load media from { アップロードしたファイルパス } because it violates the following Content Security Policy directive: "default-src 'self'". Note that 'media-src' was not explicitly set, so 'default-src' is used as a fallback.`

### 2.1.1. build された .exe でコンソールを開く
- `npm run tauri build -- --debug` で、コンソール付きの App が生成される (注意: `debug` フォルダに生成する。) ので、そこをチェックする。
  - 参考: [Tauri 公式ドキュメント](https://tauri.app/v1/guides/debugging/application/)
  - `npm run tauri build --debug` でないので、注意。(本当は、`--` が途中に必要。Rust の仕様と思う。)

### 2.1.2. CSP (Content Security Policy: CSP)
- [MDN ドキュメント: CSP](https://developer.mozilla.org/ja/docs/Web/HTTP/CSP)
- 動画のポリシーを書いていなかったのでエラーが発生したみたい。
- 動画は、`media-src` で設定できる。

### 2.1.3. 対策: Tauri の設定を書き換えた
```json
{
  "security": {
    "csp": "default-src 'self'; media-src 'self' asset: https://asset.localhost"
  }
}
```


## 2.2. ビルド不能
- エラーメッセージ
  ```
  LLVM ERROR: out of memory
  Allocation failed
  error: could not compile ffmpeg_wrapper_gui (bin "ffmpeg_wrapper_gui")
  ```
- メモリ不足でコンパイルエラーが出た。

### 2.2.1. 対策1: 【効果無し】build キャッシュ初期化
- `git` からプロジェクトを再ダウンロードすると、普通に build できたので。

```bash
cd ./tauri-src
cargo clean  # これで過去の設定をクリアできるみたい。

cd ..
npm run tauri dev
```

### 2.2.2. 対策2: 【効果有り】並列数抑制
- 以下コマンド実行で、ビルドできた。

```powershell
$env:RUSTFLAGS="-C codegen-units=1 -C incremental=false"  # 一時的な環境変数設定
npm run tauri build
```