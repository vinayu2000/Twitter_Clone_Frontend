import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '@env';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons'

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([])
  const { userInfo, email } = useContext(AuthContext)

  const getAllPosts = async () => {
    const result = await axios.get(`http://13.234.35.178/post`, { headers: { "Authorization": `Bearer ${userInfo.token}` } })
    if (result.data.STATUS === 'OK') {
      setPosts(result.data.data)
    } else {
      console.log(result.data.data);
    }
  }
  const likeDislikePost = async (postId) => {
    const result = await axios.get(`http://13.234.35.178/like/${postId}`, { headers: { "Authorization": `Bearer ${userInfo.token}` } })
    if (result.data.STATUS === 'OK') {
      getAllPosts()
    } else {
      return null
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
  console.log('Posts===>', posts);
  useEffect(() => {
    getAllPosts()
  }, [])
  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {
            posts.map((item, index) => {
              const sentTime = getMessageSentTime(item.createdAt)

              return (
                <>
                  <View key={index} style={styles.tweetCard}>
                    <View style={styles.header}>
                      <Image source={require('../images/profile_pic_default.jpg')} style={styles.profilePic} />
                      <View style={styles.headerText}>
                        <Text style={styles.postedBy}>{item.firstName} {''} {item.lastName}</Text>
                        <Text style={styles.postTime}>{sentTime}</Text>
                      </View>
                    </View>
                    <Text style={styles.tweet}>{item.tweet}</Text>
                    <Image source={{ uri: `data:image/png;base64,${item.post}` }} style={styles.postImage} />
                    <View style={styles.likesContainer}>
                      <TouchableOpacity onPress={() => {
                        likeDislikePost(item._id)
                      }}>
                        <Icon name='favorite' size={20} color={Array.isArray(item.liked) && item.liked.includes(email) ? '#00C2FF' : ''} />
                      </TouchableOpacity>
                      <Text style={styles.likeCount}>{item.likes}</Text>
                      <TouchableOpacity onPress={()=>{
                        navigation.navigate('Comments',{postId:item._id})
                      }}>
                        <Icon name='comment' size={20} color='#00C2FF' />
                      </TouchableOpacity>
                      <Text style={styles.commentCount}>{item.comments}</Text>
                    </View>
                  </View>
                </>
              )
            })
          }
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={() => { navigation.navigate('Add Post') }}>
        <Icon name='create' size={30} color='white' />
      </TouchableOpacity>
    </>
  )
}


const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1
  },
  container: {
    backgroundColor: '#e3e5e6',
    padding: 10,
  },
  tweetCard: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    minHeight:100
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  profilePic: {
    height: 30,
    width: 30,
    borderRadius: 15,
    resizeMode: 'contain'
  },
  headerText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
    flex: 1
  },
  postedBy: {
    color: 'black',
    fontWeight: '800',
    marginRight: 10,
    fontSize: 16
  },
  postTime: {
    color: 'gray',
    fontSize: 12
  },
  tweet: {
    marginBottom: 10,
    color: 'black'
  },
  postImage: {
    minHeight: 100,
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 10
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  likeCount: {
    color: 'black',
    marginLeft: 5,
    marginRight: 15
  },
  commentCount: {
    color: 'black',
    marginLeft: 5
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00C2FF',
    borderRadius: 50,
    padding: 10
  },
})

export default HomeScreen