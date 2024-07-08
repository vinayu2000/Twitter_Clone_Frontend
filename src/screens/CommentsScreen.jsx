import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { baseUrl } from "@env"
import { AuthContext } from '../context/AuthContext';

const CommentsScreen = ({ route }) => {
  const { postId } = route.params;
  const { userInfo } = useContext(AuthContext)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const getComments = async (postId) => {
    const result = await axios.get(`http://13.234.35.178/comment/${postId}`, { headers: { "Authorization": `Bearer ${userInfo.token}` } })
    if (result.data.STATUS === 'OK') {
      setComments(result.data.data)
    } else {
      setComments(null)
    }
  }
  const sendComment = async (postId, comment) => {
    const result = await axios.post(`http://13.234.35.178/comment/${postId}`, { comment }, { headers: { "Authorization": `Bearer ${userInfo.token}` } })
    if (result.data.STATUS === 'OK') {
      comments.push(result.data.data)
    } else {
      console.log(result.data.data);
    }
  }
  const getMessageSentTime = (sentDate) => {
    const messageDate = new Date(sentDate);
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === currentDate.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday " + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleString();
    }
  };

  useEffect(() => {
    getComments(postId)
  }, [])

  return (
    <>
      <ScrollView style={styles.container}>
        {comments.length > 0 ? (
          comments.map((item, index) => {
            const sentTime = getMessageSentTime(item.createdAt);
            return (
              <View key={index} style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentTime}>{sentTime}</Text>
                </View>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            );
          })
        ) : (
          <View style={styles.noCommentsContainer}>
            <Text style={styles.noCommentsText}>No Comments</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Write a comment..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => { 
          sendComment(postId, newComment) 
          setNewComment('')
           }} >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  commentContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    color: '#444',
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#888',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#00C2FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default CommentsScreen