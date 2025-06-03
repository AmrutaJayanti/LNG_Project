import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Token from './Token';

export default function Board({ positions, playerColor, onTokenPress }) {
  return (
    <View style={styles.board}>
      {Object.entries(positions).map(([color, tokens]) =>
        tokens.map((pos, index) => (
          <TouchableOpacity
            key={`${color}-${index}`}
            onPress={() => color === playerColor && onTokenPress(index)}
            disabled={color !== playerColor}
          >
            <Token color={color} position={pos} />
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
});