import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'; // Import TouchableOpacity and TouchableWithoutFeedback
import React, { useState, useEffect } from 'react';
import { Metronome } from "./utils/metronome";
import { Audio } from 'expo-av';
import Alert from './components/Alert'

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [metronome, setMetronome] = useState<Metronome | null>(null);
  const [isLightOn, setIsLightOn] = useState(false);
  const [inputFields, setInputFields] = useState([
    { label: 'Time Signature ', value: '4' },
    { label: 'BPM ', value: '110' },
    { label: 'Bars Between Ticks ', value: '2' },
    { label: 'Count-in Bars ', value: '2' },
  ]);
  const [woodblockAudio, setWoodblockAudio] = useState<Audio.Sound | null>(null);
const [showAlert, setShowAlert] = useState<boolean>(false)
  useEffect(() => {
    const loadAudio = async () => {
      const audio = new Audio.Sound();
      try {
        await audio.loadAsync(require('./assets/audio/metronome-sound.mp3'));
        setWoodblockAudio(audio);
      } catch (error) {
        console.error('Failed to load audio:', error);
      }
    };
    loadAudio();
    return () => {
      if (woodblockAudio) {
        woodblockAudio.unloadAsync();
      }
    };
  }, []);

  const canStart = () => {
    // Check if all fields have valid numbers
    return inputFields.every(field => !isNaN(parseInt(field.value)));
  };

  const handleToggle = () => {
    if (canStart()) {
      if (isRunning) {
        handleStop();
      } else {
        handleStart();
      }
    } else {
      setShowAlert(true)
    }
  };

  const handleStart = () => {
    const [timeSig, tempo, barsBetweenTicks, countInBars] = inputFields.map(field => parseInt(field.value, 10));
    const newMetronome = new Metronome(
        timeSig,
        tempo,
        barsBetweenTicks,
        countInBars,
        handleTick
    );
    newMetronome.start();
    setMetronome(newMetronome);
    setIsRunning(true);
  };

  const handleStop = () => {
    if (metronome) {
      metronome.stop();
      setIsRunning(false);
    }
  };

  const handleTick = async () => {
    if (woodblockAudio) {
      try {
        await woodblockAudio.replayAsync();
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
    setIsLightOn(true);
    setTimeout(() => {
      setIsLightOn(false);
    }, 120);
  };

  const handleChange = (index: number, value: string) => {
    const newInputFields = [...inputFields];
    newInputFields[index].value = value;
    setInputFields(newInputFields);
  };

  const handleInputClick = (index: number) => {
    const newInputFields = [...inputFields];
    newInputFields[index].value = '';
    setInputFields(newInputFields);
    handleStop();
  };

  const handleContainerPress = () => {
    Keyboard.dismiss();
  };

  return (
      <TouchableWithoutFeedback onPress={handleContainerPress}>
        <View style={styles.container}>
        <Alert visible={showAlert} title={'Value Required'} message={'Please input a value to continue'} onClose={() => setShowAlert(false)}/>
          <StatusBar style="auto" />
          <View style={[styles.light, isLightOn ? styles.lightOn : null]} />
          <View style={styles.inputContainer}>
            {inputFields.map((field, index) => (
                <View key={index} style={styles.inputItem}>
                  <Text style={styles.text}>{field.label}</Text>
                  <TextInput
                      style={styles.input}
                      caretHidden={true}
                      value={field.value}
                      onChangeText={(text) => handleChange(index, text)}
                      onPressIn={() => handleInputClick(index)}
                      keyboardType="numeric"
                  />
                </View>
            ))}
          </View>

          <View style={styles.button} onTouchStart={handleToggle}>
            <Text style={styles.text}>{isRunning ? 'Stop ' : 'Start '}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#000',
    alignItems: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 300,
    width: '84%',
    padding: 20,
    backgroundColor: '#000'
  },
  inputItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '45%',
    height: 120,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#444',
  },
  input: {
    flex: 1,
    borderWidth: 0,
    color: '#999',
    fontSize: 20,
    width: '100%',
    textAlign: 'center',
  },
  light: {
    width: 180,
    height: 12,
    borderRadius: 10,
    backgroundColor: '#111',
    marginBottom: 80,
  },
  lightOn: {
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  button: {
    marginTop: 100,
    alignItems: 'center',
    borderRadius: 100,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#444',
    padding: 20,
    width: '60%'
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 10,
    padding: 4,
    color: '#777',
    marginTop: 2,
    },
});
