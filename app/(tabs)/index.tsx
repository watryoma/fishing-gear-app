import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useDatabase, Category } from '@/hooks/useDatabase';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

export default function HomeScreen() {
  const router = useRouter();
  const { getCategories, getItemsByCategory, deleteCategory, updateCategoryOrder } = useDatabase();
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [isEditing, setIsEditing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  const loadCategories = () => {
    const cats = getCategories();
    setCategories(cats);
    const newCounts: { [key: string]: number } = {};
    cats.forEach((category) => {
      const items = getItemsByCategory(category.id);
      newCounts[category.id] = items.length;
    });
    setCounts(newCounts);
  };

  const handleDeleteCategory = (category: Category) => {
    const itemCount = counts[category.id] ?? 0;
    const message = itemCount > 0
      ? `「${category.name}」を削除しますか？\n登録されている${itemCount}個の釣具も削除されます。`
      : `「${category.name}」を削除しますか？`;

    Alert.alert('削除確認', message, [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          deleteCategory(category.id);
          loadCategories();
        },
      },
    ]);
  };

  const handleDragEnd = ({ data }: { data: Category[] }) => {
    setCategories(data);
    updateCategoryOrder(data);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Category>) => {
    return (
      <TouchableOpacity
        style={[styles.categoryCard, isActive && styles.categoryCardActive]}
        onPress={() => {
          if (isEditing) {
            handleDeleteCategory(item);
          } else {
            router.push(`/category/${item.id}`);
          }
        }}
        onLongPress={isEditing ? drag : undefined}
      >
        {isEditing && <Text style={styles.dragIcon}>☰</Text>}
        {isEditing && <Text style={styles.deleteIcon}>🗑️</Text>}
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.itemCount}>{counts[item.id] ?? 0}個</Text>
        </View>
        {!isEditing && <Text style={styles.arrow}>›</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>釣具管理</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push('/ai-scan')}
          >
            <Text style={styles.scanButtonText}>📷 AI撮影</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButton}>
              {isEditing ? '完了' : '編集'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitle}>カテゴリを選択</Text>

      <DraggableFlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/add-category')}
      >
        <Text style={styles.addButtonText}>＋ カテゴリ追加</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scanButton: {
    backgroundColor: '#4A90D9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  editButton: {
    fontSize: 16,
    color: '#4A90D9',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryCardActive: {
    opacity: 0.8,
    shadowOpacity: 0.3,
    elevation: 8,
  },
  dragIcon: {
    fontSize: 18,
    color: '#999',
    marginRight: 8,
  },
  deleteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: '#ccc',
  },
  addButton: {
    backgroundColor: '#4A90D9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});