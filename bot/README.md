# Windowsで遊ぶときだけ起動するDiscord Bot

ブラウザ版で作成したタイムラインのJSONまたは音声付きZIPを利用し、ボイスチャンネルへ予告音声を流します。Botを動かすPCは、プレイ中は起動してネット接続を維持します。ゲームとの自動連携はありません。

## 初回セットアップ
1. リポジトリ全体をDownload ZIPまたはgit cloneで取得します。botフォルダだけでは動きません。
2. Node.js 24.17以上をWindowsにインストールします。
3. https://discord.com/developers/applications で専用Applicationを作成します。Botのトークン、General InformationのApplication IDを確認します。
4. Discordのユーザー設定 → 詳細設定 → 開発者モードをONにし、サーバーIDと自分のユーザーIDをコピーします。
5. InstallationでGuild Installを選び、Scopesにbotとapplications.commands、Bot PermissionsにView Channels・Connect・Speakを設定して、自分のサーバーへ招待します。管理者権限とMessage Content Intentは不要です。
6. `setup.cmd`をダブルクリックします。依存関係の取得にはネット接続が必要です。
7. 作成された`bot/.env`をメモ帳で開き、4項目を設定します。トークンはPC内に保管し、チャット・GitHub・画像に載せません。
8. `prepare-audio.cmd`でWindowsの日本語音声からWAVパーツを生成します。System.Speechで利用可能な日本語音声がない場合は、Windowsの言語・音声設定で日本語音声を追加するか、録音ファイルを利用してください。
9. `register.cmd`で専用サーバーにスラッシュコマンドを登録します。この専用Applicationのサーバー内コマンドを置き換えます。

音声は `audio/right.wav`、`audio/stack.mp3` など、ブラウザ版のパーツIDと一致するファイル名で差し替えられます。既存WAVは音声生成で上書きしません。読み上げ音声はWindows環境によって異なります。DAVE対応の@discordjs/voiceを使用し、FFmpegはffmpeg-staticで導入します。

## 毎回の利用
1. ブラウザ編集ページからJSONまたは音声付きZIPを書き出し、`bot/timelines`に入れます。
2. `start.cmd`をダブルクリックします。
3. 自分が通常のボイスチャンネルに入り、`/join`、`/test`で音声を確認します。
4. `/list`でファイルを確認し、`/start boss:sample.json`などで開始します。戦闘開始時に手動で操作します。
5. 終了時はBotのウィンドウでCtrl+C。Botは退出して停止します。

| コマンド | 動作 |
|---|---|
| /join | 操作者のVCに参加 |
| /start boss:ファイル名 | 選択したタイムラインを0秒から開始 |
| /start | 選択済みタイムラインを再開 |
| /pause | タイマー・再生を停止 |
| /reset | 0秒へ戻し、次の開始を待つ |
| /seek seconds:120 | 経過120秒へ補正。過去の音声は読み上げない |
| /status | 時刻と次の行動を表示 |
| /list | ローカルファイル一覧 |
| /test | 共通音声の右・頭割りを試聴（停止中のみ） |
| /leave | 退出・停止 |

設定した本人だけが指定サーバー内で操作できます。コマンドの応答は本人だけに表示され、予告音声は同じVCの参加者に聞こえます。会話の受信・録音は行いません。Botトークンをブラウザ版へ渡す必要はありません。

## 制約と検証
- `sample.json`は架空の時間の操作サンプルです。
- ランダムな左右やデバフはBotから自動判定しません。
- 通信・音声再生の遅延を考慮して予告秒数を調整します。PCのスリープは禁止してください。
- 音声は順番に再生するため長い組み合わせは次の予告に重なる可能性があります。短いパーツを利用してください。
- 音声ZIPは60MB以内、各エントリ10MB以内。JSONと認識済み音声だけを読み込み、ZIPのパス指定で任意ファイルは書き込みません。
- /startで音声が不足している場合は開始せず通知します。
- Bot切断・再生エラー時はタイマーを停止します。再接続後、/seekで補正してください。
- 自動テストで時刻判定・補正・入力検証を確認します。Discord接続とWindows音声生成の実機試験には本人の環境・認証設定が必要です。

## 開発
`cd bot` → `npm ci` → `npm run check` → `npm test`。公開用WebビルドはBotフォルダを含めず、GitHub Pagesにトークンを配置しません。
