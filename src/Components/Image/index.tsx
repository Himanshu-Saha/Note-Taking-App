import React from 'react';
import { TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { ICONS } from '../../Constants/Icons';
import { userImageProps } from './types';


export default function ImagePicker({photo,setPhoto}:userImageProps) {
  
  const handleImagePicker = () => {
    async function launch() {
      const response = await launchImageLibrary({
        mediaType:'photo'
      });
      if (!response.didCancel) {
        if(response.assets)
          setPhoto(response.assets[0].uri);
      }
    }
    launch();
  };

  return (
    
    <TouchableOpacity onPress={handleImagePicker}>
      {ICONS.CAMERA(
        heightPercentageToDP('2.8%'),
        heightPercentageToDP('2.8%'),
        'none',
      )}
      </TouchableOpacity>
    
  );
}

