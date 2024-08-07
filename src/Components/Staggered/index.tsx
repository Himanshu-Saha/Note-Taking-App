import StaggeredList from '@mindinventory/react-native-stagger-view';
import { useNavigation } from '@react-navigation/native';
import { Note } from '../../RealmDB';
import ListTemplate from '../ListTemplate/listTemplate';
import { StaggedLabelProps } from './types';

export default function StaggedLabel({data,labelDetails}:StaggedLabelProps){
    const navigation = useNavigation();
    const renderChildren = (item:Note) => {
        return (
            <ListTemplate note={item} maxHeight={150} labelDetails={labelDetails}/>
        );
      };
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