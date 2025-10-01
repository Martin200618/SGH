import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../styles/loginStyles';

interface PasswordInputProps {
  value: string;
  onChange: (text: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

function PasswordInputComponent({ value, onChange, isVisible, onToggle }: PasswordInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Image
          source={isVisible ? require('../../assets/images/eye.png') : require('../../assets/images/eye-off.png')}
          style={styles.inputIcon}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChange}
        secureTextEntry={!isVisible}
      />
    </View>
  );
}

// memo evita renders innecesarios si las props no cambian
export const PasswordInput = memo(PasswordInputComponent);
