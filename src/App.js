//Using FireStore Database
// import {View, Text} from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import React, {useEffect, useState} from 'react';

// const App = () => {
//   const [myData, setMyData] = useState(null);
//   useEffect(() => {
//     getDatabase();
//   }, []);

//   const getDatabase = async () => {
//     try {
//       const data = await firestore()
//         .collection('testing')
//         .doc('jLaqIyDx2ICL9XWoMUTw')
//         .get();
//       console.log(data._data);
//       setMyData(data._data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <View>
//       <Text>Name:{myData ? myData.name : 'Loading'}</Text>
//       <Text>Age:{myData ? myData.age : 'Loading'}</Text>
//       <Text>
//         Hobby:
//         {myData ? myData.hobby.map(list => ` ${list}, `) : 'Loading'}
//       </Text>
//     </View>
//   );
// };

// export default App;

//Using Realtime Database
// import {View, Text} from 'react-native';
// import database from '@react-native-firebase/database';
// import React, {useEffect, useState} from 'react';

// const App = () => {
//   const [myData, setMyData] = useState(null);
//   useEffect(() => {
//     getDatabase();
//   }, []);

//   const getDatabase = async () => {
//     try {
//       const data = await database().ref('users/1').once('value');
//       console.log(data);
//       setMyData(data.val());
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <View>
//       <Text>Name:{myData ? myData.name : 'Loading'}</Text>
//       <Text>Age:{myData ? myData.age : 'Loading'}</Text>
//     </View>
//   );
// };

// export default App;

import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import Edit from './icons/Edit';
import Delete from './icons/Delete';
const App = () => {
  const [inputvalue, setInputValue] = useState(null);
  const [list, setList] = useState(null);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [selectedCardIndex, setselectedCardIndex] = useState(null);

  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    try {
      const data = await database()
        .ref('todo')
        .on('value', tempData => {
          console.log(data);
          setList(tempData.val());
        });
    } catch (err) {
      console.log(err);
    }
  };
  const addHandleData = async () => {
    try {
      if (inputvalue.length > 0) {
        const index = list.length;
        const response = await database().ref(`todo/${index}`).set({
          value: inputvalue,
        });
        console.log(response);
        setInputValue('');
      } else {
        Alert.alert('Alert', 'Input Field Mandatory');
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdateData = async () => {
    try {
      await database().ref(`todo/${selectedCardIndex}`).update({
        value: inputvalue,
      });
      setInputValue('');
      setIsUpdateData(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteData = async (cardIndex, cardvalue) => {
    try {
      Alert.alert('Alert', `Are You Sure Want to Delate ${cardvalue}`, [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel Pressed');
          },
        },
        {
          text: 'Ok',
          onPress: async () => {
            try {
              const response = await database()
                .ref(`todo/${cardIndex}`)
                .remove();
              console.log(response);
            } catch (err) {
              console.log(err);
            }
          },
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };
  const handleEdit = (cardIndex, cardvalue) => {
    try {
      console.log(cardIndex);
      setIsUpdateData(true);
      setselectedCardIndex(cardIndex);
      setInputValue(cardvalue);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View>
      <Text style={style.text}>Todo App</Text>
      <TextInput
        style={style.input}
        placeholder="Enter Item Name"
        placeholderTextColor={'#000'}
        value={inputvalue}
        onChangeText={value => setInputValue(value)}
      />
      {!isUpdateData ? (
        <TouchableOpacity
          style={style.btn}
          onPress={() => {
            addHandleData();
          }}>
          <Text style={{color: '#fff', textAlign: 'center', fontSize: 16}}>
            Add
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={style.btn}
          onPress={() => {
            handleUpdateData();
          }}>
          <Text style={{color: '#fff', textAlign: 'center', fontSize: 16}}>
            Update
          </Text>
        </TouchableOpacity>
      )}
      <Text style={style.headingText}>Todo List</Text>
      <ScrollView>
        <View style={{height: '100'}}>
          <View style={style.cardContainer}>
            <FlatList
              data={list}
              renderItem={(item, index) => {
                console.log(item.item);
                const cardIndex = item.index;
                if (item.item !== null) {
                  return (
                    <View style={style.card}>
                      <Text style={{fontSize: 24}}>{item.item.value}</Text>
                      <View style={style.edit}>
                        <TouchableOpacity
                          onPress={() => {
                            handleEdit(cardIndex, item.item.value);
                          }}>
                          <Edit />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          handleDeleteData(cardIndex, item.item.value)
                        }>
                        <Delete />
                      </TouchableOpacity>
                    </View>
                  );
                }
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default App;
const style = {
  text: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    borderWidth: 2,
    margin: 10,
    padding: 10,
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  btn: {
    backgroundColor: 'blue',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 30,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
  },
  headingText: {
    fontSize: 24,
    margin: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  edit: {
    marginLeft: 'auto',
  },
};
