import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useDatabase } from '@/hooks/useDatabase';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export default function AiScanScreen() {
  const router = useRouter();
  const { getCategories } = useDatabase();
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //カメラ起動、カメラの起動きょか
  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('エラー', 'カメラの許可が必要です');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 ?? null);
    }
  };

  const handleGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('エラー', 'ギャラリーへのアクセス許可が必要です');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 ?? null);
    }
  };

const handleAnalyze = async () => {
  if (!imageBase64) return;
  setIsLoading(true);

  try {
    console.log('APIキー:', GEMINI_API_KEY);
    
    const categories = getCategories();
    const categoryList = categories.map((c) => `${c.id}:${c.name}`).join(', ');

    const prompt = `この画像に写っている釣具の商品名を全て読み取ってください。
各商品について以下のJSON形式で返してください。
カテゴリは以下から最も適切なものを選んでください：${categoryList}

返答はJSON配列のみで、説明文は不要です：
[
  {"name": "商品名", "category_id": "カテゴリID", "count": 1}
]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          }],
        }),
      }
    );

    const data = await response.json();
    console.log('APIレスポンス:', JSON.stringify(data));
    
    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const items = JSON.parse(clean);

    router.push({
      pathname: '/ai-confirm',
      params: { items: JSON.stringify(items) },
    });
  } catch (error) {
    console.log('エラー詳細:', error);
    Alert.alert('エラー', '解析に失敗しました。もう一度試してください。');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.description}>
        釣具の写真を撮影またはギャラリーから選択すると、AIが商品名を自動で読み取ります。
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cameraButton} onPress={handleCamera}>
          <Text style={styles.buttonIcon}>📷</Text>
          <Text style={styles.buttonText}>カメラで撮影</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.galleryButton} onPress={handleGallery}>
          <Text style={styles.buttonIcon}>🖼️</Text>
          <Text style={styles.buttonText}>ギャラリーから選択</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity
            style={[styles.analyzeButton, isLoading && styles.analyzeButtonDisabled]}
            onPress={handleAnalyze}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.analyzeButtonText}>AIで解析する</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  cameraButton: {
    flex: 1,
    backgroundColor: '#4A90D9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  galleryButton: {
    flex: 1,
    backgroundColor: '#7BC67E',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
  },
  analyzeButton: {
    backgroundColor: '#F5A623',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});