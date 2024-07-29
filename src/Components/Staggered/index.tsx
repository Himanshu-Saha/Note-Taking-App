import StaggeredList from '@mindinventory/react-native-stagger-view';
import { useNavigation } from '@react-navigation/native';
import ListTemplate from '../ListTemplate/listTemplate';
import { StaggedLabelProps, itemType } from './types';

export default function StaggedLabel({data}:StaggedLabelProps){
    const navigation = useNavigation();
    const renderChildren = (item:itemType) => {
        return (
            <ListTemplate note={item} nav={navigation} maxHeight={150} />
        );
      };
    //   console.log(data,'test');
      
    return (
        <StaggeredList
            data={data}
            animationType = 'NONE'
            // contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => renderChildren(item)}
          />
    )
}