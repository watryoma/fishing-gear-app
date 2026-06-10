import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';

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
      Alert.alert('エラー', '商品名を入力してください');
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
    <ScrollView style={styles.container}>
      <Text style={styles.label}>商品名</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="例：メガバス X-80 チャート 80mm"
      />

      <Text style={styles.label}>個数</Text>
      <TextInput
        style={styles.input}
        value={count}
        onChangeText={setCount}
        keyboardType="numeric"
        placeholder="1"
      />

      <Text style={styles.label}>購入金額（任意）</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="例：1500"
      />

      <Text style={styles.label}>登録日</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>保存する</Text>
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