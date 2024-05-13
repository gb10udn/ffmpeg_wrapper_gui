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