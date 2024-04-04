import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  IconButton,
  Typography,
  Box,
  Divider,
  Paper,
  Grid,
  Avatar,
  CardMedia,
} from '@mui/material';
import { styled } from '@mui/system';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { greetings, healthcareTopics, followUpQuestions } from './healthcareFilterWords'; // Import filter words

const ChatBubble = styled(Paper)(({ theme, isUser }) => ({
  backgroundColor: isUser ? '#dcf8c6' : '#f0f0f0',
  color: isUser ? '#4caf50' : 'gray',
  padding: '10px',
  borderRadius: '10px',
  maxWidth: '70%',
  wordBreak: 'break-word',
  alignSelf: 'flex-start',
  marginBottom: '10px',
  marginLeft: isUser ? 'auto' : '0',
}));

const ChatInterface = ({ patientData }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! How can I help you with your healthcare needs today?',
    },
  ]);
  const [userInput, setUserInput] = useState('');

  const handleUserInput = async () => {
    const updatedMessages = [...messages, { role: 'user', content: userInput }];

    // Check if the user input contains healthcare-related keywords
    const isHealthcareRelated = checkHealthcareKeywords(userInput);
    if (!isHealthcareRelated) {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: "Sorry, I can only assist with healthcare-related queries." }
      ]);
      setUserInput('');
      return;
    }

    try {
      const response = await axios.post(
        'https://chatgpt-best-price.p.rapidapi.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: updatedMessages,
        },
        {
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key':
              '6430d7d4a3msh742c93506bac7aap106846jsne8be0f7127dd',
            'X-RapidAPI-Host': 'chatgpt-best-price.p.rapidapi.com',
          },
        }
      );

      const botResponse = response.data.choices[0].message.content;
      setMessages([...updatedMessages, { role: 'assistant', content: botResponse }]);
      setUserInput('');
      saveConversation([...updatedMessages, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  const checkHealthcareKeywords = (message) => {
    const lowercaseMessage = message.toLowerCase();
    const allKeywords = [...greetings, ...healthcareTopics, ...followUpQuestions];
    console.log('allKeywords', allKeywords)
    return allKeywords.some(keyword => lowercaseMessage.includes(keyword));
  };

  

  const deleteConversation = () => {
    setMessages([]);
    localStorage.removeItem('conversation');
    alert('Conversation deleted!');
  };

  const formatResponseContent = (content) => {
    if (content.includes('-')) {
      const listItems = content.split('\n');
      const listElements = listItems.map((item, index) => <li key={index}>{item}</li>);
      return <ul>{listElements}</ul>;
    } else {
      return <p>{content}</p>;
    }
  };


  const saveConversation = (conversation) => {
    const conversationJSON = JSON.stringify(conversation);
    localStorage.setItem('conversation', conversationJSON);
  };

  return (
    <Box
      sx={{
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#F9F6EE',
        marginTop: '30px',
        minHeight: '80vh',
        position: 'relative',
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" align="left" gutterBottom position="relative">
          Conversations
        </Typography>
        <IconButton variant="outlined" onClick={deleteConversation}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Box mb={2}>
        {messages.map((message, index) => (
          <Grid key={index} container alignItems="center">
            <Grid item xs={12}>
              <ChatBubble isUser={message.role === 'user'}>
                <Typography variant="body1">
                  {message.role === 'user' && <ChatBubbleOutlineIcon />} {' '}
                  {formatResponseContent(message.content)}
                </Typography>
              </ChatBubble>
            </Grid>
            {message.role === 'user' && (
              <CardMedia  sx={{ textAlign: 'center', marginBottom: '20px', ml: '95%' }}>
                <Avatar alt="User Avatar" src={patientData[0]?.profile_picture} sx={{width: 25, height: 25}}/>
              </CardMedia>
            )}
          </Grid>
        ))}
      </Box>
      
      <Box display="flex" alignItems="center" width='95%' position ='absolute' bottom={0}>
      
        <TextField
          fullWidth
          label="Enter your message"
          variant="outlined"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleUserInput}>
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatInterface;
