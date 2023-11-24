import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function TaskItem(props) {
    var showDate = false, showTime = false;
    var date, time;
    if (props.date != 'Date' && props.date != undefined){
      showDate = true;
      date = new Date(props.date);
    }
    if (props.time != 'Time' && props.time != undefined){
      showTime = true;
      time = new Date(props.time);
    }

    return(//edit onPress
      <Pressable onPress={props.onClick.bind(this, props.id)} style={[({pressed}) => pressed && styles.pressedItem, styles.taskItem]} android_ripple={{color: '#210644'}}>
        <Text style={styles.taskText}>{props.text}</Text>
        <View style={{justifyContent: 'center'}}>
          {showDate ? <Text style={styles.datetimeText}>{date.toLocaleDateString('en', {month: 'short', day: 'numeric', year:'numeric'})}</Text> : null}
          {showTime ? <Text style={styles.datetimeText}>{time.toLocaleTimeString('en', {hour: '2-digit', minute: '2-digit'})}</Text> : null}
        </View>
      </Pressable>
    );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontFamily: 'Helvetica',
    fontSize: 18,
  },
  datetimeText: {
    color: 'white',
    fontFamily: 'Helvetica',
    fontSize: 14,
    textAlign: 'right',
    marginRight: 8,
  }
});