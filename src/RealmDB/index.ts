import Realm, { BSON } from "realm";

export class Note extends Realm.Object<Note> {
  _id!: BSON.ObjectId;
  title!: string;
  content!: string;
  label!: string;
  imagesURL!: string;
  timestamp!: Date;

  static schema: Realm.ObjectSchema = {
    name: "Note",
    properties: {
      _id: "objectId",
      title: "string",
      content: "string",
      label: "string",
      imagesURL: "string",
      timestamp: "date", // Use 'date' for Date objects
    },
    primaryKey: "_id",
  };
}

export class Label extends Realm.Object<Label> {
  name!: string;
  count!: number;

  static schema: Realm.ObjectSchema = {
    name: "Label",
    properties: {
      name: "string",
      count: "int", // Use 'int' for integer numbers
    },
  };
}

export const realmConfig = {
  schema: [Note.schema, Label.schema],
};

const realmInstance = new Realm(realmConfig);

export function addNoteToRealm(note) {
    console.log(note,'test');
    const noteData = {
        _id: note.id,
        title: note.title,
        content: note.content,
        label: note.label,
        imagesURL: note.url,
        //   timestamp: "date", 
    }
    console.log(noteData,'fadsfsdfa2345325345');

//   realmInstance.write(() => {
//     realmInstance.create("Note", note);
//   });
}

export function updateNoteInRealm(note) {
    console.log(note,'updated');
    
//   realmInstance.write(() => {
//     let existingNote = realmInstance.objectForPrimaryKey("Note", note.id);
//     if (existingNote) {
//       existingNote.title = note.title;
//       existingNote.content = note.content;
//       existingNote.label = note.label;
//       existingNote.imagesURL = note.imagesURL;
//       existingNote.timestamp = note.timestamp;
//     }
//   });
}

export function deleteNoteFromRealm(noteId) {
  realmInstance.write(() => {
    let noteToDelete = realmInstance.objectForPrimaryKey("Note", noteId);
    if (noteToDelete) {
      realmInstance.delete(noteToDelete);
    }
  });
}
