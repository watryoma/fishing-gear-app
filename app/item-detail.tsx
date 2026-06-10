import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useDatabase, Item } from '@/hooks/useDatabase';

export default function ItemDetailScreen() {
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const { getItemsByCategory, deleteItem, getCategories } = useDatabase();
  const [item, setItem] = useState<Item | null>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const cats = getCategories();
    cats.forEach((cat) => {
      const items = getItemsByCategory(cat.id);
      const found = items.find((i) => i.id === itemId);
      if (found) {
        setItem(found);
        setCategoryName(cat.name);
      }
    });
  }, [itemId]);

  const handleDelete = () => {
    Alert.alert(
      '削除確認',
      `「${item?.name}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            deleteItem(itemId as string);
            router.back();
          },
        },
      ]
    );
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.itemName}>{item.name}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>カテゴリ</Text>
          <Text style={styles.value}>{categoryName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>個数</Text>
          <Text style={styles.value}>{item.count}個</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>登録日</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>購入金額</Text>
          <Text style={styles.value}>
            {item.price ? `¥${item.price.toLocaleString()}` : '未登録'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push(`/edit-item?itemId=${itemId}`)}
      >
        <Text style={styles.editButtonText}>編集する</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>削除する</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#999',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#4A90D9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});