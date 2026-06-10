import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

const db = SQLite.openDatabaseSync('fishing-gear.db');

const CURRENT_DB_VERSION = 1;

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  parent_id: string | null;
  sort_order: number;
};

export type Item = {
  id: string;
  name: string;
  count: number;
  category_id: string;
  date: string;
  price: number | null;
};

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // テーブル作成
    db.execSync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT '📦',
        color TEXT NOT NULL DEFAULT '#8E8E93',
        parent_id TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 1,
        category_id TEXT NOT NULL,
        date TEXT NOT NULL,
        price INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);

    // マイグレーション
    const versionResult = db.getFirstSync<{ user_version: number }>(
      'PRAGMA user_version'
    );
    const currentVersion = versionResult?.user_version ?? 0;

    if (currentVersion < 1) {
      // バージョン1へのマイグレーション（将来の変更をここに追加）
      db.execSync(`PRAGMA user_version = 1`);
    }

    // 初期データ
    const existing = db.getAllSync('SELECT id FROM categories');
    if (existing.length === 0) {
      const defaults = [
        { id: 'hard-lure', name: 'ハードルアー', icon: '🎣', color: '#4A90D9' },
        { id: 'soft-bait', name: 'ソフトベイト', icon: '🪱', color: '#7BC67E' },
        { id: 'metal', name: 'メタル系', icon: '✨', color: '#F5A623' },
        { id: 'line-hook', name: 'ライン・フック類', icon: '🪝', color: '#E87C7C' },
        { id: 'rod-reel', name: 'ロッド・リール', icon: '🎿', color: '#9B7FD4' },
        { id: 'other', name: 'その他', icon: '📦', color: '#8E8E93' },
        { id: 'shikake', name: '仕掛け', icon: '🎏', color: '#FF9500' },
        { id: 'omori', name: 'オモリ', icon: '⚓', color: '#636366' },
        { id: 'uki', name: 'ウキ', icon: '🔴', color: '#FF2D55' },
      ];
      defaults.forEach((cat, index) => {
        db.runSync(
          'INSERT INTO categories (id, name, icon, color, parent_id, sort_order) VALUES (?, ?, ?, ?, NULL, ?)',
          [cat.id, cat.name, cat.icon, cat.color, index]
        );
      });
    }

    setIsReady(true);
  }, []);

  // カテゴリ関連
  const getCategories = (): Category[] => {
    return db.getAllSync<Category>(
      'SELECT * FROM categories WHERE parent_id IS NULL ORDER BY sort_order'
    );
  };

  const addCategory = (name: string, icon: string, color: string) => {
    const id = Date.now().toString();
    const categories = getCategories();
    const sort_order = categories.length;
    db.runSync(
      'INSERT INTO categories (id, name, icon, color, parent_id, sort_order) VALUES (?, ?, ?, ?, NULL, ?)',
      [id, name, icon, color, sort_order]
    );
  };

  const deleteCategory = (id: string) => {
    db.runSync('DELETE FROM items WHERE category_id = ?', [id]);
    db.runSync('DELETE FROM categories WHERE id = ?', [id]);
  };

  const updateCategoryOrder = (categories: Category[]) => {
    categories.forEach((cat, index) => {
      db.runSync('UPDATE categories SET sort_order = ? WHERE id = ?', [index, cat.id]);
    });
  };

  // 釣具関連
  const addItem = (name: string, count: number, category_id: string, price?: number) => {
    const id = Date.now().toString();
    const date = new Date().toISOString().split('T')[0];
    db.runSync(
      'INSERT INTO items (id, name, count, category_id, date, price) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, count, category_id, date, price ?? null]
    );
  };

  const getItemsByCategory = (category_id: string): Item[] => {
    return db.getAllSync<Item>(
      'SELECT * FROM items WHERE category_id = ?',
      [category_id]
    );
  };

  const updateItem = (id: string, name: string, count: number, date: string, price?: number) => {
    db.runSync(
      'UPDATE items SET name = ?, count = ?, date = ?, price = ? WHERE id = ?',
      [name, count, date, price ?? null, id]
    );
  };

  const deleteItem = (id: string) => {
    db.runSync('DELETE FROM items WHERE id = ?', [id]);
  };

  return {
    isReady,
    getCategories,
    addCategory,
    deleteCategory,
    updateCategoryOrder,
    addItem,
    getItemsByCategory,
    updateItem,
    deleteItem,
  };
}