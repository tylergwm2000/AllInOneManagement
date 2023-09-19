import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function TaskItem(props) {
    return(
      <View style={styles.taskItem}>
        <Pressable onPress={props.onDeleteItem.bind(this, props.id)} style={({pressed}) => pressed && styles.pressedItem} android_ripple={{color: '#210644'}}>
          <Text style={styles.taskText}>{props.text}</Text>
        </Pressable>
      </View>
    );
};

const styles = StyleSheet.create({
  taskItem: {
    margin: 8,
    borderRadius: 6,
    backgroundColor: '#5e0acc',
  },
  pressedItem: {
    opacity: 0.5,
  },
  taskText: {
    color: 'white',
    padding: 8,
  },
});