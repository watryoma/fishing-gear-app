import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import i18n from '@/constants/i18n';

export default function AddItemScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  const { addItem } = useDatabase();
  const [name, setName] = useState('');
  const [count, setCount] = useState('1');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleSave = () => {
    if (name.trim() === '') {
      Alert.alert(i18n.t('addItem.errorTitle'), i18n.t('addItem.errorMessage'));
      return;
    }
    addItem(
      name,
      parseInt(count),
      categoryId as string,
      price ? parseInt(price) : undefined
    );
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.label}>{i18n.t('addItem.name')}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={i18n.t('addItem.namePlaceholder')}
      />

      <Text style={styles.label}>{i18n.t('addItem.count')}</Text>
      <TextInput
        style={styles.input}
        value={count}
        onChangeText={setCount}
        keyboardType="numeric"
        placeholder="1"
      />

      <Text style={styles.label}>{i18n.t('addItem.price')}</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder={i18n.t('addItem.pricePlaceholder')}
      />

      <Text style={styles.label}>{i18n.t('addItem.date')}</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder={i18n.t('addItem.datePlaceholder')}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{i18n.t('addItem.save')}</Text>
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