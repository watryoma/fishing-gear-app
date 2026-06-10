import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';

const COLORS = [
  '#4A90D9', '#7BC67E', '#F5A623', '#E87C7C',
  '#9B7FD4', '#8E8E93', '#FF9500', '#636366',
  '#FF2D55', '#00C7BE', '#30B0C7', '#32ADE6',
];

const ICONS = [
  '🎣', '🪱', '✨', '🪝', '🎿', '📦',
  '🎏', '⚓', '🔴', '🐟', '🦈', '🌊',
];

export default function AddCategoryScreen() {
  const router = useRouter();
  const { addCategory } = useDatabase();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4A90D9');
  const [selectedIcon, setSelectedIcon] = useState('🎣');

  const handleSave = () => {
    if (name.trim() === '') {
      return;
    }
    addCategory(name, selectedIcon, selectedColor);
    router.back();
  };

  return (
    <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={styles.label}>カテゴリ名</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="例：ジグヘッド"
      />

      <Text style={styles.label}>アイコン</Text>
      <View style={styles.grid}>
        {ICONS.map((icon) => (
          <TouchableOpacity
            key={icon}
            style={[
              styles.iconButton,
              selectedIcon === icon && styles.iconButtonActive,
            ]}
            onPress={() => setSelectedIcon(icon)}
          >
            <Text style={styles.iconText}>{icon}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>カラー</Text>
      <View style={styles.grid}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: color },
              selectedColor === color && styles.colorButtonActive,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      {/* プレビュー */}
      <Text style={styles.label}>プレビュー</Text>
      <View style={styles.previewCard}>
        <View style={[styles.previewIcon, { backgroundColor: selectedColor }]}>
          <Text style={styles.previewIconText}>{selectedIcon}</Text>
        </View>
        <Text style={styles.previewName}>{name || 'カテゴリ名'}</Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>追加する</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconButtonActive: {
    borderColor: '#4A90D9',
  },
  iconText: {
    fontSize: 24,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderWidth: 3,
    borderColor: '#000',
  },
  previewCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  previewIconText: {
    fontSize: 22,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
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