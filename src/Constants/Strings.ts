export const STRINGS = {
  GOOGLE_SIGN_IN: 'Sign in with Google',
  NOTE_TAKING_APP: {
    PART1: 'Note-Ta',
    PART2: 'king App',
  },
  LOG_IN: 'Log In',
  SIGN_OUT: 'Sign Out',
  SAVE_SHARE_NOTES: 'Save and share notes',
  CREATE_ACCOUNT: 'Create Account',
  HAVE_ACCOUNT: 'Already have an account?',
  ADD_LABEL: 'Add Label',
  LABEL_NAME: 'Label Name',
  RESET_PASSWORD: 'Reset Password',
  FIRST_NAME: 'First Name',
  FIRST_NAME_SMALL: 'firstName',
  LAST_NAME: 'Last Name',
  LAST_NAME_SMALL: 'lastName',
  EMAIL: 'Email',
  EMAIL_SMALL: 'email',
  PASSWORD: 'Password',
  PASSWORD_SMALL: 'password',
  PHONE_NUMBER: 'Phone Number',
  PHONE_NUMBER_SMALL: 'number',
  CONFIRM_PASSWORD: 'Confirm Password',
  CONFIRM_PASSWORD_SMALL: 'confirmPassword',
  SUBMIT: 'Submit',
  SIGN_UP_CONDITIONS:
    'By continuing, you agree to our Terms of Service and Privacy Policy.',
  FORGOT_PASSWORD: 'Forgot Password?',
  INVALID_CREDENTIALS: 'Invalid Credentials',
  EMPTY_CREDENTIALS: 'Missing Email or Password',
  TEMP_LABEL_1: 'Personal',
  TEMP_LABEL_2: 'Academic',
  TEMP_LABEL_3: 'Work',
  TEMP_LABEL_4: 'Others',
  TEMP_TITLE: 'Meeting Notes',
  TEMP_CONTENT:'Discussion points: project updates, deadlines, action items',
  FIREBASE:{
    USER:'user',
    NOTES:'notes',
    LABELS:'labels',
    REMINDER:'reminder'
  },
  THEME:'Theme',
  LIGHT:'Light',
  DARK:'Dark',
  UPDATE_IMAGE:'Update Image',
  VERSION:'Version',
  IS_LOGGED_IN:'isLogedIn',
  SETTINGS:'Settings',
  FIRST_NAME_WARNING:'Please enter your first name',
  LAST_NAME_WARNING:'Please enter your last name',
  EMAIL_WARNING:'Please enter email',
  PASSWORD_WARNING:'Please enter your password',
  AVAILABLE_SPACE:'Available Space',
  STORAGE:'20 .254 GB of 25 GB Used',
  NOTE:'Note-Taking App',
  SETTING:{
    CHANGE_PASSWORD:'Change Password - (will soon be available)',
    CHANGE_PROFILE:'Profile - (will soon be available)'
  },
  ARE_YOU_SURE:"Are you sure?",
  CANCEL:'CANCEL',
  OK:'OK',
  START_WRITING_HERE:'Start Writing Here',
  NO_REMINDER_EXIST:'No such reminder exist',
  ADD_REMINDER:'Add Reminder',
  CHECK_EMAIL:'Please check your email...',
  ADD_NEW_NOTES:'+  Add New Notes',
  ENTER_LINK_URL:'Enter Link URL',
  ENTER_URL:'"Enter URL"',
  ENTER_YOUR:'Enter your ' ,
  PHOTO_UPLOAD_FAILED:'Photo upload failed',
  UNKNOWN_ERROR:'unknown error'
};

export const STRINGS_FIREBASE = {
  TIME_STAMP:'time_stamp',
  DB_TIME_STAMP:'timeStamp',
  ORDER:'asc',
  LABEL:'label'
} as const

export const YUP_STRINGS = {
  INVALID_EMAIL: 'Invalid email',
  INVALID_PASSWORD:
    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  PASSWORD_NOT_MATCH: "Password doesn't match",
  INVALID_FIRST_NAME: 'Invalid first name',
  INVALID_LAST_NAME: 'Invalid last name',
  ENTER_EMAIL: 'Please enter email',
  ENTER_PASSWORD: 'Please enter your password',
  PHONE_NUMBER_WARNING1: 'Number must be exactly 10 digits',
  PHONE_NUMBER_WARNING2: 'Enter Number',
  FIRST_NAME_WARNING: 'Please enter your first name',
  LAST_NAME_WARNING: 'Please enter your last name',
  EMAIL_WARNING: 'Please enter email',
  PASSWORD_WARNING: 'Please enter your password',
  PASSWORD_SMALL: 'password',
  CONFIRM_PASSWORD: 'Please enter confirm password',
} as const;

export const PLATEFORM = {
  IOS:'ios',
  ANDROID:'Android'
}


// 
export const NOTES = {
  PERSONAL: {
    NAME: 'Personal',
    TITLE: 'Personal Notes!',
    CONTENT: 'Note your upcoming plans and goals!',
  },
  ACADEMICS: {
    NAME: 'Academic',
    TITLE: 'Study Notes!',
    CONTENT: 'Add lectures, track assignments, and notes.',
  },
  WORK: {
    NAME: 'Work',
    TITLE: 'Work Notes!',
    CONTENT: 'Track tasks, meetings, and projects here.',
  },
  OTHERS: {
    NAME: 'Others',
    TITLE: 'Miscellaneous Notes!',
    CONTENT: 'Your space for all miscellaneous notes.',
  },
};

export const FIREBASE_STRINGS = {
  USER: 'user',
  LABELS: 'labels',
  NOTES: 'notes',
  LABEL: 'label',
  TIME_STAMP:'time_stamp',
  ORDER:'asc',
  ERROR: {
    INVALID_CREDENTIALS: 'auth/invalid-credential',
    DEFAULT: 'Some error occured please try again',
    POPUP_CLOSED: 'auth/popup-closed-by-user',
  },
}as const;

export const REALM = {
  STATUS:{
    ADD:'added',
    DELETE:'removed',
    MODIFY:'modified',
    FIRESTORE:'firestore'
  }
}