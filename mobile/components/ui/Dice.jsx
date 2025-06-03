import { Button, StyleSheet } from 'react-native';

export default function Dice({ onRoll, disabled }) {
  return (
    <Button title="Roll Dice" onPress={onRoll} disabled={disabled} color="#6200ee" />
  );
}