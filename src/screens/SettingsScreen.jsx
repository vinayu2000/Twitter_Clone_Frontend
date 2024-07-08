import React, { useContext, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View, TextInput } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { baseUrl } from "@env";
import { AuthContext } from '../context/AuthContext';

const SettingsScreen = () => {
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const [feedback, setFeedback] = useState('');
  
  const handleLogout = async () => {
    Alert.alert('Confirmation Alert','Are You Sure Want to Logout?',[
      {text:'OK', onPress:()=>logout()},
      {text:'Cancel'}
    ], {cancelable: false});
  }

  const handleFeedbackSubmit = async () => {
    if (feedback.trim() === '') {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }
    try {
      const result = await axios.post(`http://13.234.35.178/post/feedback`, { feedback }, { headers: { "Authorization": `Bearer ${userInfo.token}` } });
      if (result.data.STATUS === 'OK') {
        Alert.alert('Success', 'Thank you for your feedback!');
        setFeedback('');
      } else {
        Alert.alert('Error', result.data.data);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting your feedback.');
    }
  }

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Text style={styles.welcome}>Welcome {userInfo.firstName}{' '}{userInfo.lastName}</Text>
      <Button title="Logout" color="red" onPress={handleLogout} />
      <Text style={styles.feedbackTitle}>Feedback</Text>
      <TextInput
        style={styles.feedbackInput}
        placeholder="Enter your feedback"
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />
      <Button title="Submit Feedback" onPress={handleFeedbackSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  feedbackInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
});

export default SettingsScreen;
