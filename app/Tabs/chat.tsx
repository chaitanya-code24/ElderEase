import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Listen for keyboard events
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const sendMessageToBackend = async (userMessage: string) => {
    try {
      const response = await fetch('http://172.20.10.2:5001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      return data.reply || "Sorry, I couldn't process your request.";
    } catch (error) {
      console.error("Chat request failed:", error);
      return "I'm having trouble connecting. Please try again later.";
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return;

    Keyboard.dismiss(); // Dismiss keyboard when sending message

    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    const aiResponse = await sendMessageToBackend(newUserMessage.text);

    const newAIMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponse,
    };

    setMessages((prev) => [...prev, newAIMessage]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [inputText]);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => (
      <View
        style={[
          styles.messageContainer,
          item.sender === 'user' ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Tap outside to dismiss keyboard */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />

          {/* Input Field at Bottom */}
          <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerRaised]}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything..."
              placeholderTextColor="#888"
              returnKeyType="send"
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  container: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 10,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#00483D',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F6735F',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  inputContainerRaised: {
    marginBottom: 10, // Adjusts input position when keyboard is open
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6735F',
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 20,
    height: 40,
  },
  sendButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ChatScreen;
