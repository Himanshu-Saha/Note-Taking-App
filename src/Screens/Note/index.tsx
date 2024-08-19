import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { useRealm } from "@realm/react";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageRequireSource,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleProp,
  TextInput,
  View,
} from "react-native";
import FastImage, { ImageStyle, ResizeMode } from "react-native-fast-image";
import ImageModal from "react-native-image-modal";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import CustomDialogInput from "../../Components/DialogInput";
import DropdownComponent from "../../Components/Dropdown";
import withTheme from "../../Components/HOC";
import Header from "../../Components/Header";
import ImagePicker from "../../Components/Image";
import { STRINGS, TOAST_STRINGS } from "../../Constants/Strings";
import { RootState } from "../../Store";
import { setLoading } from "../../Store/Loader";
import {
  addNoteToRealm,
  createNote,
  deleteNote,
  deleteNoteFromRealm,
  imageCompressor,
  updateNote,
  updateNoteInRealm,
  uploadImages,
  uploadImageToRealm,
} from "../../Utils";
import { toastError, toastSuccess } from "../../Utils/toast";
import { styles } from "./styles";
import { NoteScreenProps } from "./types";

const Note = ({ route, theme }: NoteScreenProps) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const realm = useRealm();
  const user = useSelector((state: RootState) => state.common.user);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const isNetworkAvalible = useSelector(
    (state: RootState) => state.network.isAvailable
  );
  const uid = user?.uid;
  let initialTitle = "";
  let noteId = "";
  let data = "";
  let labelId = "Others";
  let imageInitialData: string[] = [];
  let defaultLabelName = "Others";
  const isNew = useRef(true);
  const isCompleteNew = useRef(false);
  const noteIdExist = useRef(false);
  const dateRef = useRef(new Date());
  const RichText = useRef<RichEditor>(null);
  const img = useRef<string[]>([]);
  const noteNewId = useRef<string | null>();
  const isDeleted = useRef(false);
  if (route.params != undefined) {
    if (
      route.params?.labelDetails != undefined &&
      route.params?.note === undefined
    ) {
      labelId = route.params.labelDetails.labelId;
      defaultLabelName = route.params.labelDetails.labelName;
    } else if (route.params?.note != undefined) {
      data = route.params.note.content;
      initialTitle = route.params.note.title;
      noteId = route.params.note._id;
      labelId = route.params.labelDetails.labelId;
      defaultLabelName = route.params.labelDetails.labelName;
      isNew.current = false;
      noteIdExist.current = true;
      // if (imageInitData[noteId]) imageInitialData = imageInitData[noteId];
      imageInitialData = route.params.note.imagesURL;
      const realmImages = realm.objectForPrimaryKey("Image", noteId);
      if (realmImages) {
        imageInitialData = [...imageInitialData, ...realmImages.images];
      }
      // if (route.params.note.timestamp !== undefined) {
      //   const formatDate =
      //     route.params.note.timestamp.seconds * 1000 +
      //     Math.floor(route.params.note.timestamp.nanoseconds / 1000000);
      //   dateRef.current = new Date(formatDate);
      //   reminder.current = true;
      //   if (route.params.note.newReminder !== undefined) {
      //     isNew.current = true;
      //     dateRef.current = new Date();
      //   }
      // }
    } else {
      isCompleteNew.current = true;
    }
  }

  // const [date, setDate] = useState(dateRef.current);
  const [title, setTitle] = useState(initialTitle);
  const [label, setLable] = useState(labelId);
  // const [value, setValue] = useState(labelId);
  const [photo, setPhoto] = useState<string | null>(null);
  const [imageData, setImageData] = useState(imageInitialData);
  const [newImageData, setNewImageData] = useState<string[]>([]);
  const labelName = useRef(defaultLabelName);
  const articleData = useRef(data);
  const labelRef = useRef(labelId);
  const titleRef = useRef(initialTitle);
  const THEME = theme;
  useEffect(() => {
    labelRef.current = label;
  }, [label]);
  useEffect(() => {
    if (!photo || !uid) {
      return;
    }
    const processImage = async () => {
      try {
        const newUri = await imageCompressor(photo);
        setImageData((prevImageData) => [...prevImageData, newUri]);
        img.current = [...img.current, newUri];
      } catch (error) {
        // console.log("Error compressing image:", error);
      }
    };
    processImage();
  }, [photo, uid]);

  // useEffect(() => {
  //   setDate(dateRef.current);
  // }, []);
  // useEffect(() => {
  //   dateRef.current = date;
  // }, [date]);
  const fetchData = async () => {
    if (!titleRef.current && !articleData.current && imageData.length == 0) {
      toastError(TOAST_STRINGS.DELETE_EMPTY_NOTE);
      // handleDelete();
      return;
    } else if (!isDeleted.current) {
      if (!isNew.current) {
        if (!isLoading && isNetworkAvalible && uid) {
          dispatch(setLoading(true));
          const urls = await uploadImages(uid, img.current);
          await updateNote(
            uid,
            noteId,
            titleRef.current,
            articleData.current,
            urls
          );
          dispatch(setLoading(false));
        } else {
          const noteToRealm = {
            _id: noteId,
            title: titleRef.current,
            content: articleData.current,
            label: labelRef.current,
            imagesURL: [],
          };
          uploadImageToRealm(noteId, img.current, realm);
          updateNoteInRealm(noteToRealm, realm);
        }
      } else {
        if (!isLoading && isNetworkAvalible && uid) {
          dispatch(setLoading(true));
          const urls = await uploadImages(uid, img.current);
          await createNote(
            uid,
            labelRef.current,
            titleRef.current,
            articleData.current,
            urls ?? []
          );
          dispatch(setLoading(false));
        } else {
          const noteToRealm = {
            title: titleRef.current,
            content: articleData.current,
            label: labelRef.current,
            imagesURL: [],
          };
          addNoteToRealm(noteToRealm, img.current, realm);
        }
      }
    }
  };
  useEffect(() => {
    const fetchDataWrapper = async () => {
      try {
        await fetchData();
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    return () => {
      fetchDataWrapper();
    };
  }, [isNetworkAvalible]);
  // const scrollRef = useRef(null);
  // const onCursorPosition = (scrollY:number) => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTo({ y: scrollY - 30, animated: true });
  //   }
  // };
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVerticalOffset(heightPercentageToDP("5%"));
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVerticalOffset(0);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const handleInsertLink = () => {
    setIsDialogVisible(true);
  };
  const handleCancel = () => {
    setIsDialogVisible(false);
  };

  const handleSubmit = (link: string) => {
    RichText.current?.insertLink(link, link);
    setIsDialogVisible(false);
  };
  const handleDelete = async () => {
    isDeleted.current = true; // Set this before the deletion process starts
    try {
      if (isNetworkAvalible && !isLoading && uid) {
        await deleteNote(uid, noteId, labelRef.current, dispatch);
        toastSuccess(TOAST_STRINGS.NOTES_DELETED);
      } else {
        deleteNoteFromRealm(noteId, realm);
      }
      navigation.goBack();
    } catch (error) {
      isDeleted.current = false; // Revert if there's an error
      toastError(TOAST_STRINGS.NOTES_DELETION_FAILED);
    }
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: THEME.BACKGROUND,
        },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
        // keyboardVerticalOffset={Platform.OS === PLATEFORM.IOS ? 0 : keyboardOffset}
        style={styles.subContainer}
      >
        <View>
          <Header
            headerText={labelName.current}
            // showDelete={isNew.current ? false : true}
            showDelete={false}
            handleDelete={handleDelete}
          />
        </View>
        {isCompleteNew.current && (
          <DropdownComponent
            data={route.params?.labelData}
            value={label}
            setValue={setLable}
          />
        )}
        {/* <ScrollView style={styles.container} ref={scrollRef}> */}
        <TextInput
          onChangeText={(text) => {
            titleRef.current = text;
            setTitle(text);
          }}
          placeholder="Title"
          placeholderTextColor={THEME.NOTETEXT}
          value={title}
          style={[
            styles.title,
            {
              color: THEME.NOTETEXT,
            },
          ]}
        />
        <View>
          <FlatList
            horizontal
            data={imageData}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: widthPercentageToDP("0.5%") }}>
                <ImageModal
                  style={{
                    width: 250,
                    height: 250,
                  }}
                  source={{
                    uri: item,
                  }}
                  renderImageComponent={({ source, resizeMode, style }) => (
                    <FastImage
                      style={style as StyleProp<ImageStyle>}
                      source={source as ImageRequireSource}
                      resizeMode={resizeMode as ResizeMode}
                    />
                  )}
                />
              </View>
            )}
          ></FlatList>
        </View>

        {/* } */}
        {/* <ScrollView> */}
        <RichEditor
          disabled={false}
          containerStyle={styles.editor}
          ref={RichText}
          initialContentHTML={articleData.current}
          style={styles.rich}
          editorStyle={{
            backgroundColor: THEME.BACKGROUND,
            color: THEME.NOTETEXT,
            contentCSSText: `
            font-family: Nunito; 
            font-size: 14px;  
            display: flex; 
            flex-direction: column; 
            min-height: 200px; 
            position: absolute; 
            top: 0; right: 0; bottom: 0; left: 0;`,
          }}
          placeholder={STRINGS.START_WRITING_HERE}
          onChange={(text) => {
            articleData.current = text;
          }}
          // onCursorPosition={onCursorPosition}
          useContainer
        />
        <RichToolbar
          style={[styles.richBar]}
          editor={RichText}
          disabled={false}
          iconTint={"white"}
          selectedIconTint={"black"}
          disabledIconTint={"white"}
          iconSize={25}
          actions={[
            actions.insertImage,
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.setStrikethrough,
            actions.setUnderline,
          ]}
          onInsertLink={handleInsertLink}
          iconMap={{
            [actions.insertImage]: () => (
              <ImagePicker photo={photo} setPhoto={setPhoto} />
            ),
          }}
        />
        {/* )} */}
      </KeyboardAvoidingView>
      <CustomDialogInput
        description={STRINGS.ENTER_LINK_URL}
        placeholder={STRINGS.ENTER_URL}
        isVisible={isDialogVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        // theme={THEME}
      />
    </SafeAreaView>
  );
};

export default withTheme(Note);
