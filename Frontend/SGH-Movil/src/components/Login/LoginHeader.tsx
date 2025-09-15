import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/loginStyles';

export default function LoginHeader() {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../../assets/images/back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
    </View>
  );
}
