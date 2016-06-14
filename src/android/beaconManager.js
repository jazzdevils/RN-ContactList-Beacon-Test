import Beacons from 'react-native-beacons-android';
import ReactNative from 'react-native';
//import { DeviceEventEmitter } from 'react-native';

export const SCAN_MODE = {
  MonitoringMode: 'MonitoringMode',
  RangingMode: 'RangingMode'
};

export const BeaconManager = function (config) {
  return new BeaconCtrl(config); 
};

function BeaconCtrl(config){
    console.log(config);
    
    this._uuid = config.uuid;
    this._major = config.major;
    this._minor = config.minor;
    
    if(config.scanMode){
      this._scanMode = config.scanMode;
    } else {
      this._scanMode = SCAN_MODE.RangingMode;  
    }
    
    console.log(this._scanMode);
    
    this._counts = 0;
};

BeaconCtrl.prototype.startScan = function(){
  console.log(this._scanMode);
  
  Beacons.detectIBeacons();
    
  if(this._scanMode === SCAN_MODE.RangingMode){
    Beacons.startRangingBeaconsInRegion('REGION1', this._uuid)
      .then(() => console.log('Beacons ranging started successfully'))
      .catch(error => console.log('Beacons ranging not started, error: ${error}'));
    
    ReactNative.DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
      if(data['beacons'].length > 0){  
        console.log('Found beacons(' + this._counts + ')' + JSON.stringify(data));
        
        this._counts = this._counts + 1;  
      } else {
        if(this._counts > 0){
          console.log('not founded beacons'); 
        }  
        
        this._counts = 0;
      }
    });  
  } else {
    Beacons.startMonitoringForRegion('REGION2', this._uuid)
      .then(() => console.log('Beacons monitoring started successfully'))
      .catch(error => console.log('Beacons monitoring not started, error: ${error}'));
      
    ReactNative.DeviceEventEmitter.addListener('regionDidEnter', (region) => {
      console.log('Entered new beacon ' + JSON.stringify(region));
    });          
    
    ReactNative.DeviceEventEmitter.addListener('regionDidExit', (region) => {
      console.log('Exited beacon ' + JSON.stringify(region));
    });
  }
};

BeaconCtrl.prototype.stopScan = function(){
  Beacons.stopRagingBeaconInRegion()
    .then(() => console.log('Beacons ranging stopped'))
    .catch(error => console.log('Beacons ranging stopped with an error' + error));                  
};
