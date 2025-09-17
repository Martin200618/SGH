import React, { memo } from 'react';
import { View, TextInput, Image } from 'react-native';
import { styles } from '../../styles/loginStyles';

interface PasswordInputProps {
  value: string;
  onChange: (text: string) => void;
}

function PasswordInputComponent({ value, onChange }: PasswordInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <Image source={require('../../assets/images/lock.png')} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChange}
        secureTextEntry
      />
    </View>
  );
}

// memo evita renders innecesarios si las props no cambian
export const PasswordInput = memo(PasswordInputComponent);
