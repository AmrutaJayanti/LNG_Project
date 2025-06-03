import { View, Text, StyleSheet } from 'react-native';

export default function Token({ color, position }) {
  const colorStyles = {
    red: '#ff0000',
    green: '#00ff00',
    yellow: '#ffff00',
    blue: '#0000ff',
  };

  return (
    <View style={[styles.token, { backgroundColor: colorStyles[color] }]}>
      <Text style={styles.position}>{position}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  token: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  position: { color: '#fff', fontWeight: 'bold' },
});