import { default as auth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  View,
} from "react-native";
import ImageModal from "react-native-image-modal";
import {
  RichEditor,
  RichToolbar,
  actions
} from "react-native-pell-rich-editor";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import DateTime from "../../Components/DateTime";
import CustomDialogInput from "../../Components/DialogInput";
import DropdownComponent from "../../Components/Dropdown/dropdown";
import withTheme from "../../Components/HOC";
import Header from "../../Components/Header";
import UserImage from "../../Components/Image";
import { STRINGS } from "../../Constants/Strings";
import { loadImage } from "../../Store/Image";
import { createNote, imageCompressor, updateNote } from "../../Utils";
import { styles } from "./styles";
import { NoteScreenProps, imageState } from "./types";

const Note = ({ route, theme }:NoteScreenProps) => {
  const [photo, setPhoto] = useState<string|null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

  const dispatch = useDispatch();
  const imageInitData = useSelector(
    (state: imageState) => state.image.imageUri
  );

  const user = auth().currentUser;
  let uid = user?.uid;
  let initialTitle = "";
  let noteId = "";
  let data = "";
  let labelId = "Others";
  let imageInitialData: string[] = [];
  let defaultLabelName = "Others"
  const reminder = useRef(false);
  const isNew = useRef(true);
  const isCompleteNew = useRef(false);
  const noteIdExist = useRef(false);
  const dateRef = useRef(new Date());
  const RichText = useRef<RichEditor>(null);
  const img = useRef<string[]>([]);
  const noteNewId = useRef<string|null>();
  
  if (route.params != undefined) {
    if (route.params?.labelData != undefined) {    
      isCompleteNew.current = true;
    } else if (route.params?.note != undefined) {
      if (route.params.note.noteId == undefined) {
        labelId = route.params.note.labelRef;
        defaultLabelName = route.params.note.labelName;
      } else {
        data = route.params.note.content;
        initialTitle = route.params.note.title;
        noteId = route.params.note.noteId;
        labelId = route.params.note.labelRef;
        defaultLabelName = route.params.note.labelName;
        isNew.current = false;
        noteIdExist.current = true;
        if (imageInitData[noteId]) imageInitialData = imageInitData[noteId];
      }
      if (route.params.note.timestamp !== undefined) {
        const formatDate =
          route.params.note.timestamp.seconds * 1000 +
          Math.floor(route.params.note.timestamp.nanoseconds / 1000000);
        dateRef.current = new Date(formatDate);
        reminder.current = true;
        if (route.params.note.newReminder !== undefined) {
          isNew.current = true;
          dateRef.current = new Date();
        }
      }
    }
  }
  const [date, setDate] = useState(dateRef.current);
  const [title, setTitle] = useState(initialTitle);
  const [label, setLable] = useState(labelId);
  const [value, setValue] = useState(labelId);
  const [imageData, setImageData] = useState(imageInitialData);
  
  const labelName = useRef(defaultLabelName)
  const articleData = useRef(data);
  const labelRef = useRef(labelId);
  const titleRef = useRef(initialTitle);

  const THEME = theme;
  
  useEffect(() => {
    labelRef.current = value;
  }, [value]);
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

  useEffect(() => {
    setDate(dateRef.current);
  }, []);
  useEffect(() => {
    dateRef.current = date;
  }, [date]);

    const fetchData = async () => {
      if (!isNew.current) {
        if (reminder.current) {
          // await updateReminder(uid,noteId,titleRef.current,articleData.current,dateRef.current);
        } else {
          console.log(titleRef.current,'titleRef');
          console.log(articleData.current,'articleData');
          
          await updateNote(uid,noteId,titleRef.current,articleData.current);
        }
      }
     else {
      if (reminder.current) {
        // await createReminder(uid,titleRef.current,articleData.current,dateRef.current);
        // console.log("reminder created success");
      } else {
        await createNote(uid,labelRef.current,titleRef.current,articleData.current);
        // console.log("note created success");
      }
    }
    if (noteIdExist.current) {
      dispatch(loadImage({ uid: uid, noteId: noteId, uri: img.current }));
    } 
    else if (noteNewId.current) {     
      dispatch(
        loadImage({ uid: uid, noteId: noteNewId.current, uri: img.current })
      );
    }}

  useEffect(() => {
    return () => {
      fetchData();
    };
  }, []);
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
          <Header headerText={labelName.current} />
        </View>
        {isCompleteNew.current && (
          <DropdownComponent
            data={route.params?.labelData}
            value={value}
            setValue={setValue}
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
                  resizeMode="contain"
                  imageBackgroundColor={THEME.BACKGROUND}
                  style={{
                    height: heightPercentageToDP("20%%"),
                    width: heightPercentageToDP("20%"),
                  }}
                  source={{ uri: item }}
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
        {/* </ScrollView> */}
        {reminder.current && (
          <DateTime date={date} setDate={setDate}></DateTime>
        )}
        {reminder.current ? (
          <RichToolbar
            style={[styles.richBar]}
            editor={RichText}
            disabled={false}
            iconTint={"white"}
            selectedIconTint={"black"}
            disabledIconTint={"white"}
            // onPressAddImage={onPressAddImage}
            iconSize={25}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
              actions.setStrikethrough,
              actions.setUnderline,
            ]}
            onInsertLink={handleInsertLink}
          />
        ) : (
          <RichToolbar
            style={[styles.richBar]}
            editor={RichText}
            disabled={false}
            iconTint={"white"}
            selectedIconTint={"black"}
            disabledIconTint={"white"}
            // onPressAddImage={onPressAddImage}
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
                <UserImage photo={photo} setPhoto={setPhoto} />
              ),
            }}
          />
        )}
      </KeyboardAvoidingView>
      <CustomDialogInput
        isVisible={isDialogVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        // theme={THEME}
      />
    </SafeAreaView>
  );
};

export default withTheme(Note);
