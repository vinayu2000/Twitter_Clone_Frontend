import axios from 'axios';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { AuthContext } from '../context/AuthContext';
import ImageResizer from 'react-native-image-resizer';

const AddPostScreen = ({ navigation }) => {
  const [tweet, setTweet] = useState('');
  const [imageUri, setImageUri] = useState('');
  const { userInfo } = useContext(AuthContext)

  const selectImage = async () => {
    const options = {
      title: 'Select Image',
      includeBase64: false, // Don't include base64 initially
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    await ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;

        try {
          const resizedImage = await ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80);
          const base64String = await uriToBase64(resizedImage.uri);
          setImageUri(base64String);
          console.log('Image size (base64):', base64String.length); // Log payload size
        } catch (err) {
          console.log('Image resizing error: ', err);
          Alert.alert('Error', 'Failed to resize image. Please try again.');
        }
      }
    });
  };
  const uriToBase64 = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result.split(',')[1]); 
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error('Failed to convert URI to base64'));
      };
      xhr.open('GET', uri);
      xhr.responseType = 'blob';
      xhr.send();
    });
  };

  const sendPost = async (tweet, post) => {
    try {
      // const formData = new FormData();
      // if (tweet && file) {
      //   formData.append('tweet', tweet);
      //   formData.append('file', {
      //     uri: file.uri,
      //     type: file.type,
      //     name: file.fileName
      //   });
      // } else if (tweet) {
      //   formData.append('tweet', tweet);
      // } else {
      //   formData.append('file', {
      //     uri: file.uri,
      //     type: file.type,
      //     name: file.fileName
      //   });
      // }

      const result = await axios.post(`http://13.234.35.178/post`, { tweet, post }, {headers: { Authorization: `Bearer ${userInfo.token}` },});

      if (result.data.STATUS === 'OK') {
        Alert.alert('Success!!!', 'Posted Successfully');
        navigation.navigate('Main');
      } else {
        Alert.alert('Failed!!!', result.data.data);
      }
    } catch (error) {
      console.error('Error posting:', error);
      Alert.alert('Error', 'Failed to post. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <TextInput
          placeholder="What's on your mind?"
          value={tweet}
          onChangeText={setTweet}
          multiline
          style={styles.textInput}
        />
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: `data:image/png;base64,${imageUri}` }} style={styles.imagePreview} />
          </View>
        )
        }
      </ScrollView>
      <TouchableOpacity style={styles.sendButton} onPress={() => {
        sendPost(tweet, imageUri)
      }}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pickImageButton} onPress={selectImage}>
        <Text style={styles.pickImageButtonText}>Add Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60, // Space for send button
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: Dimensions.get('window').width - 40, // Adjust width as needed
    height: 200, // Adjust height as needed
    resizeMode: 'cover',
    borderRadius: 10,
  },
  sendButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00C2FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickImageButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#CCCCCC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  pickImageButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddPostScreen;
