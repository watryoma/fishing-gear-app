# 釣具管理アプリ / Fishing Gear Manager

釣具をカテゴリ別に管理できるモバイルアプリです。AIで写真から釣具を自動認識する機能を搭載しています。

React Native (Expo) を使ったポートフォリオ作品です。

---

## スクリーンショット

<!-- スクリーンショットをGitHubにアップしたら、ここのURLを差し替えてください -->

---

## 主な機能

- 📦 カテゴリ別に釣具を管理
- 🤖 Gemini 2.5 Flash による AI スキャン（写真から商品名を自動取得）
- 🗂 ドラッグ＆ドロップでカテゴリを並び替え
- 📝 商品名・個数・金額・日付を登録・編集・削除
- 🌐 日本語 / 英語 対応（デバイスの言語設定に自動で切り替え）
- 💾 SQLite によるローカルデータ保存

---

## 使用技術

| 技術 | 用途 |
|---|---|
| React Native / Expo | モバイルアプリフレームワーク |
| Expo Router | ファイルベースのナビゲーション |
| expo-sqlite | ローカルデータベース |
| Gemini 2.5 Flash API | AI画像解析 |
| i18n-js / expo-localization | 多言語対応 |
| react-native-draggable-flatlist | ドラッグ＆ドロップUI |

---

## セットアップ

1. リポジトリをクローン

```bash
git clone https://github.com/watryoma/fishing-gear-app.git
cd fishing-gear-app
```

2. 依存パッケージをインストール

```bash
npm install
```

3. 環境変数を設定

   プロジェクトのルートに `.env` ファイルを作成し、Gemini の APIキーを追加してください：

   EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here

4. アプリを起動

```bash
npx expo start
```

---

## 作者

- GitHub: [@watryoma](https://github.com/watryoma)

---

## English

A mobile app to manage your fishing gear with AI-powered item scanning.

Built with React Native (Expo) as a portfolio project.

### Features

- 📦 Manage fishing gear organized by category
- 🤖 AI scanning powered by Gemini 2.5 Flash — automatically detects item names from photos
- 🗂 Drag-and-drop category reordering
- 📝 Add, edit, and delete items with name, quantity, price, and date
- 🌐 Japanese / English language support (follows device language setting)
- 💾 Local database storage using SQLite

### Tech Stack

| Technology | Purpose |
|---|---|
| React Native / Expo | Mobile app framework |
| Expo Router | File-based navigation |
| expo-sqlite | Local database |
| Gemini 2.5 Flash API | AI image analysis |
| i18n-js / expo-localization | Internationalization |
| react-native-draggable-flatlist | Drag-and-drop UI |

### Author

- GitHub: [@watryoma](https://github.com/watryoma)