import React from 'react';

import { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { ActivityIndicator, Alert, Button, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";

// import { ButtonCamera } from "../../components/ButtonCameraNFE";
import { Ionicons } from "@expo/vector-icons";


export function Dash() {
  const [cameraStats, setCameraStats] = useState(false);

  const [imageUris, setImageUris] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { nfeData } = useAuth();

  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      setLoading(true);
      if (!result.canceled && result.assets[0].uri) {
        const newImageUris = result.assets.map(asset => asset.uri);

        setImageUris((prevImage) => [...prevImage, ...newImageUris]);
      }
      if (imageUris.length >= 1) {
        setCameraStats(true)
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao abrir a câmera:', error);
    }
  };

  // const openGallery = async () => {
  //   let formData = new FormData();
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: false,
  //       aspect: [4, 3],
  //       quality: 1,
  //       allowsMultipleSelection: true,
  //     });

  //     if (!result.canceled && result.assets[0].uri) {
  //       result.assets.forEach((asset, index) => {
  //         const imageName = `photo_${index}.png`;

  //         formData.append("images", {
  //           uri: asset.uri,
  //           name: imageName,
  //           type: "image/jpg"
  //         })

  //       })

  //       const response = await axios.post('http://192.168.102.14:3031/upload', formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data"
  //         }
  //       }).then(data => {
  //         console.log(data.data)
  //         setImageUris([]);
  //       })
  //     }

  //   } catch (error) {
  //     console.error('Erro ao abrir a galeria:', error);
  //   }
  // };

  const removeImage = (index: number) => {
    const newImageUris = [...imageUris];
    newImageUris.splice(index, 1);
    setImageUris(newImageUris);
  };

  const finishOperation = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      console.log(imageUris)

      imageUris.forEach((uri, index) => {
        const imageName = `photo_${index}.png`;
        formData.append("images", {
          uri: uri,
          name: imageName,
          type: "image/jpg"
        });
      });

      const response = await axios.post('http://192.168.102.14:3031/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(data => {
        console.log(data.data)
        setImageUris([]);
        setLoading(false);

      })
      Alert.alert('Fotos salvas!');
    } catch (error) {
      console.error('Erro ao enviar as imagens:', error);
      Alert.alert('Erro ao enviar as imagens.');
    }
  };

  return (
    <View style={styles.container}>
        {loading && (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )}

        {nfeData && !loading && (
            <View style={styles.cardInfo}>
                <View style={styles.textSpan}>
                    <Text style={styles.textInfo}>CPF: </Text>
                    <Text>{nfeData?.cpf}</Text>
                </View>
                <View style={styles.textSpan}>
                    <Text style={styles.textInfo}>Nome: </Text>
                    <Text>{nfeData?.nome_cliente}</Text>
                </View>
                <View style={styles.textSpan}>
                    <Text style={styles.textInfo}>NFE: </Text>
                    <Text>{nfeData?.nfe}</Text>
                </View>
                <View style={styles.textSpan}>
                    <Text style={styles.textInfo}>Nota Fiscal: </Text>
                    <Text>{nfeData?.nota_fiscal}</Text>
                </View>
                <View style={styles.textSpan}>
                    <Text style={styles.textInfo}>Número DAV: </Text>
                    <Text>{nfeData.numero_dav}</Text>
                </View>
                <View style={styles.textSpan}>
                    <Text style={styles.textInfo}>Número Pré-Nota: </Text>
                    <Text>{nfeData?.numero_pre_nota}</Text>
                </View>
            </View>
        )}

        {!loading && (
            <View style={styles.cardInfoImages}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>Fotos capturadas</Text>
                    <Text>{imageUris.length}/10</Text>
                </View>

                <FlatList
                    horizontal
                    data={imageUris}
                    renderItem={({ item, index }) => (
                        <View style={{ position: 'relative' }}>
                            <Image source={{ uri: item }} style={styles.image} />
                            {index >= 2 && (
                                <TouchableOpacity
                                    style={styles.deleteIcon}
                                    onPress={() => removeImage(index)}
                                >
                                    <Ionicons name="trash" size={24} color="white" style={{ marginRight: 10 }} />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.imagesContainer}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )}

        <View style={{ width: "100%", flexDirection: 'column', height: 170, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.toggleCamera}>
                <Button title="Canhoto da NF-E" onPress={() => openCamera()} disabled={imageUris.length >= 1} />
            </View>
            <View style={styles.toggleCamera}>
                <Button title="Foto do Produto" onPress={() => openCamera()} disabled={imageUris.length < 1} />
            </View>

            {cameraStats && (
                <View style={{ width: "100%", flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.toggleCamera}>
                        <Button title="Selecione e Finalize" onPress={finishOperation} disabled={imageUris.length < 1} />
                    </View>
                </View>
            )}
        </View>
    </View>
);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    cardInfo: {
        width: '100%',
        height: 350,
        margin: 0,
        padding: 10,
        backgroundColor: '#f2f2f2',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        shadowColor: 'rgba(0, 0, 0, .05)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 2,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    textInfo: {
        fontWeight: '600',
        fontSize: 18,
    },
    textInfoImage: {
        fontWeight: '500',
        fontSize: 18,
        textAlign: 'right',
        marginRight: 10,
        color: '#262626',
    },
    cardInfoImages: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        padding: 10,
    },
    textSpan: {
        width: '80%',
        marginLeft: 20,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleCamera: {
        width: '80%',
        flexDirection: 'row',
        marginBottom: 20,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    imagesContainer: {
        width: '100%',
        marginTop: 10,
    },
    deleteIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        borderRadius: 50,
        padding: 5,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        marginRight: 10,
        borderRadius: 10,
    },
});