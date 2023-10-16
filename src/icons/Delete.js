import {View, Text} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Delete = () => {
  return (
    <View style={style.edit}>
      <Icon name="delete" size={30} color="red" />
    </View>
  );
};

export default Delete;

const style = {
  edit: {
    marginLeft: 15,
  },
};
