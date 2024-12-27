import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  NativeModules,
  Dimensions,
} from 'react-native';

const { AutoClickerModule } = NativeModules;

const App = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [interval, setInterval] = useState('1000');
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    requestPermissions();
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const hasPermission = await AutoClickerModule.checkAccessibilityPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Auto Clicker needs accessibility permission to work. Please enable it in Settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => AutoClickerModule.openAccessibilitySettings(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const startAutoClicker = () => {
    if (isNaN(interval) || parseInt(interval) < 100) {
      Alert.alert('Invalid Interval', 'Please enter a valid interval (minimum 100ms)');
      return;
    }

    const newTimer = setInterval(async () => {
      try {
        const { width, height } = Dimensions.get('window');
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        await AutoClickerModule.simulateClick(x, y);
        setClickCount((prevCount) => prevCount + 1);
      } catch (error) {
        console.warn('Click simulation failed:', error);
        stopAutoClicker();
      }
    }, parseInt(interval));

    setTimer(newTimer);
    setIsRunning(true);
  };

  const stopAutoClicker = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsRunning(false);
  };

  const resetCount = () => {
    setClickCount(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Auto Clicker</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Interval (ms):</Text>
          <TextInput
            style={styles.input}
            value={interval}
            onChangeText={setInterval}
            keyboardType="numeric"
            placeholder="Enter interval in milliseconds"
          />
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Clicks: {clickCount}</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetCount}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, isRunning ? styles.stopButton : styles.startButton]}
          onPress={isRunning ? stopAutoClicker : startAutoClicker}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Stop' : 'Start'} Auto Clicker
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  counterText: {
    fontSize: 18,
    marginRight: 15,
  },
  resetButton: {
    padding: 8,
    backgroundColor: '#666',
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
