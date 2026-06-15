import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import i18n from '@/constants/i18n';

type ScannedItem = {
  name: string;
  category_id: string;
  count: number;
};

export default function AiConfirmScreen() {
  const { items: itemsParam } = useLocalSearchParams();
  const router = useRouter();
  const { addItem, getCategories } = useDatabase();
  const categories = getCategories();
  const [items, setItems] = useState<ScannedItem[]>(
    JSON.parse(itemsParam as string)
  );

  const getCategoryName = (category_id: string): string => {
    const cat = categories.find((c) => c.id === category_id);
    return cat?.name ?? i18n.t('category.defaultTitle');
  };

  const handleDelete = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveAll = () => {
    if (items.length === 0) {
      Alert.alert(i18n.t('aiConfirm.errorTitle'), i18n.t('aiConfirm.errorMessage'));
      return;
    }
    items.forEach((item) => {
      addItem(item.name, item.count, item.category_id);
    });
    Alert.alert(
      i18n.t('aiConfirm.successTitle'),
      i18n.t('aiConfirm.successMessage', { count: items.length }),
      [{ text: i18n.t('common.ok'), onPress: () => router.push('/') }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.description}>{i18n.t('aiConfirm.description')}</Text>

      {items.map((item, index) => (
        <View key={index} style={styles.itemCard}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>{getCategoryName(item.category_id)}</Text>
            <Text style={styles.itemCount}>
              {i18n.t('aiConfirm.itemCount', { count: item.count })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(index)}
          >
            <Text style={styles.deleteButtonText}>{i18n.t('aiConfirm.delete')}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {items.length === 0 && (
        <Text style={styles.emptyText}>{i18n.t('aiConfirm.empty')}</Text>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAll}>
        <Text style={styles.saveButtonText}>
          {i18n.t('aiConfirm.saveAll', { count: items.length })}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  itemCard: {
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
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 13,
    color: '#4A90D9',
    marginBottom: 2,
  },
  itemCount: {
    fontSize: 13,
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#4A90D9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});