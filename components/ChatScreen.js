import React, {useRef, useState} from 'react'
import styled from 'styled-components';
import {useRouter} from "next/router";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {Avatar, Button} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import {useCollection} from 'react-firebase-hooks/firestore';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import Message from './Message';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({chat, messages}) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
    .collection('chats')
    .doc(router.query.id)
    .collection('messages')
    .orderBy('timestamp', 'asc')
  );
  const [recipientSnapshot] = useCollection(
    db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
  )
  const showMessages = () => {
    if(messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }
    else{
      return JSON.parse(messages).map(message => (
        <Message
          key={message.id}
          user={message.user}
          message={message}
        />
      ))
    }
  }

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection('users').doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      {merge: true}
    );
    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    scrollToBottom();
  }
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar src={recipientEmail[0]}></Avatar>
        )
          
        }
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active: {' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon/>
          </IconButton>
          <IconButton>
            <MoreVertIcon/>
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
        {/* <Input value={input} onChange={e => setInput(e.target.value)} />
        <MessageSender disabled={!input} type='submit' onclick={sendMessage} >
          <SendIcon />
        </MessageSender> */}
        <MicIcon/>
      </InputContainer>
    </Container>
  )
}

export default ChatScreen
const Container = styled.div`
`;
const InputContainer = styled.form`
  display:flex;
  align-items: center;
  padding:10px;
  position:sticky;
  bottom: 0;
  background-color: white;
  z-index:100;
`;
const Input = styled.input`
  flex:1;
  outline:0;
  border:none;
  border-radius: 10px;
  padding:20px;
  background-color: whitesmoke;
  margin-left: 15px;
  margin-right: 15px;
  align-items: center;
  position:sticky;
`;
const MessageSender = styled.button`
  cursor: pointer;
  margin-right: 10px;
  background-color:transparent;
  outline:0;
  border:none;
`;
const Header = styled.div`
  display:flex;
  position:sticky;
  background-color: white;
  z-index:100;
  top:0;
  padding:11px;
  align-items: center;
  height:80px;
  border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex:1;
  > h3 {
    margin-bottom:3px;
  }
  > p {
    font-size:14px;
    color:gray;
  }
`;
const HeaderIcons = styled.div``;
const IconButton = styled(Button)``;

const MessageContainer = styled.div`
  background-color:#e5ded8;
  padding:30px;
  min-height:90vh;
`;
const EndOfMessage = styled.div` 
  margin-bottom: 50px;
`;
