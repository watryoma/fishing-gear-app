import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useDatabase, Item } from '@/hooks/useDatabase';
import i18n from '@/constants/i18n';

export default function EditItemScreen() {
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const { getCategories, getItemsByCategory, updateItem } = useDatabase();
  const [item, setItem] = useState<Item | null>(null);
  const [name, setName] = useState('');
  const [count, setCount] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const cats = getCategories();
    cats.forEach((cat) => {
      const items = getItemsByCategory(cat.id);
      const found = items.find((i) => i.id === itemId);
      if (found) {
        setItem(found);
        setName(found.name);
        setCount(found.count.toString());
        setDate(found.date);
        setPrice(found.price ? found.price.toString() : '');
      }
    });
  }, [itemId]);

  const handleSave = () => {
    if (name.trim() === '') {
      Alert.alert(i18n.t('editItem.errorTitle'), i18n.t('editItem.errorMessage'));
      return;
    }
    updateItem(
      itemId as string,
      name,
      parseInt(count),
      date,
      price ? parseInt(price) : undefined
    );
    router.back();
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>{i18n.t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.label}>{i18n.t('editItem.name')}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={i18n.t('editItem.namePlaceholder')}
      />

      <Text style={styles.label}>{i18n.t('editItem.count')}</Text>
      <TextInput
        style={styles.input}
        value={count}
        onChangeText={setCount}
        keyboardType="numeric"
        placeholder="1"
      />

      <Text style={styles.label}>{i18n.t('editItem.price')}</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder={i18n.t('editItem.pricePlaceholder')}
      />

      <Text style={styles.label}>{i18n.t('editItem.date')}</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder={i18n.t('editItem.datePlaceholder')}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{i18n.t('editItem.save')}</Text>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#4A90D9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});