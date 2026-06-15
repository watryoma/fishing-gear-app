import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useDatabase, Item } from '@/hooks/useDatabase';
import i18n from '@/constants/i18n';

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
      i18n.t('itemDetail.deleteTitle'),
      i18n.t('itemDetail.deleteMessage', { name: item?.name }),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('common.delete'),
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
        <Text>{i18n.t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.itemName}>{item.name}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('itemDetail.category')}</Text>
          <Text style={styles.value}>{categoryName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('itemDetail.count')}</Text>
          <Text style={styles.value}>
            {i18n.t('itemDetail.countValue', { count: item.count })}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('itemDetail.date')}</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('itemDetail.price')}</Text>
          <Text style={styles.value}>
            {item.price
              ? i18n.t('itemDetail.priceValue', { price: item.price.toLocaleString() })
              : i18n.t('itemDetail.noPrice')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push(`/edit-item?itemId=${itemId}`)}
      >
        <Text style={styles.editButtonText}>{i18n.t('itemDetail.edit')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>{i18n.t('itemDetail.delete')}</Text>
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