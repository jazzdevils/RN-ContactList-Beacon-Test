/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import {BeaconManager, SCAN_MODE } from './beaconManager';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableHighlight,
} from 'react-native';

const Beacon_UUID = '00000000-FB69-1001-B000-001C4DF1C3C1';  

var Contacts = require('react-native-contacts'); 

var myPhoneNumberList = null;

export default class App extends Component {
  
  constructor() {
    super();
    
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }
  
  componentDidMount() {
    var beaconConfig = {
      uuid:Beacon_UUID, 
      major:-1, 
      minor:-1,
      scanMode: SCAN_MODE.MonitoringMode,// .RangingMode,
    }
    BeaconManager(beaconConfig).startScan();
    
    this.fetchData();
  }
  
  _pressMe(){
    <TouchableHighlight onPressIn={this._onPressIn} onPressOut={this._onPressOut} style={styles.touchable}>
      <View style={styles.button}>
        <Text style={styles.welcome}>
          { this.state.pressing ? 'EEK!' : 'PUSH ME' }
        </Text>
      </View>
    </TouchableHighlight>
  }
  
  fetchData() {
    myPhoneNumberList = [];
    
    Contacts.getAll((err, _contacts) => {
      if(err && err.type === 'permissionDenied'){
        console.log('permissionDenied')
      }else{
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(_contacts),
        });
        
        // console.log(_contacts);
      }
    })
  }
  
  render() {
    return (
      <View style={{flex:1}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderContactsData}
          style={styles.listView}
        />
      </View>
    );
  }
  
  renderContactsData(_contact) {
    // console.log(_contact.phoneNumbers);
    // console.log('length : ' + _contact.phoneNumbers.length);
    
    _contact.phoneNumbers.map(function(phoneNumber, i) { 
     let phone = phoneNumber.number.replace(/[^\d]/g, '');
    //  myPhoneNumberList.push(phone);
     console.log(phone);
     
     let oPhone = {};
     oPhone['ID'] = myPhoneNumberList.length + 1;
     oPhone['value'] = phone;
     myPhoneNumberList.push(oPhone);
     
     console.log('myPhoneNumberList : ' + JSON.stringify(myPhoneNumberList));  
    })
    
    if (_contact.thumbnailPath.length) {
      return (
        <View style={styles.container}>
          <Image
            source={{uri: _contact.thumbnailPath}}
            style={styles.thumbnail}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.recordID}>{_contact.recordID}</Text>
            <Text style={styles.givenName}>{_contact.givenName}</Text>
            {/*<Text style={styles.phoneNumbers}>{this.renderPhoneData(_contact.phoneNumbers).bind}</Text>*/}
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.recordID}>{_contact.recordID}</Text>
            <Text style={styles.givenName}>{_contact.givenName}</Text>
            
          </View>
        </View>
      );
    } 
  }
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  recordID: {
    marginBottom: 8,
    textAlign: 'center',
  },
  givenName: {
    textAlign: 'center',
  },
  phoneNumbers: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});