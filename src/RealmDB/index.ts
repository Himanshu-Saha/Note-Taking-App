import Realm from "realm";

export class Note extends Realm.Object<Note> {
  _id!: string;
  title?: string;
  content?: string;
  label!: string;
  imagesURL?: string[];
  timestamp!: Date;
  synced?: boolean;
  status?: string;

  static schema: Realm.ObjectSchema = {
    name: "Note",
    properties: {
      _id: "string",
      title: "string",
      content: "string",
      label: "string",
      imagesURL: "string[]",
      timestamp: "date",
      synced: "bool",
      status: "string",
    },
    primaryKey: "_id",
  };
}

export class Label extends Realm.Object<Label> {
  _id!: string;
  label!: string;
  count!: number;
  timestamp!: Date;
  synced?: boolean;
  status?: string;

  static schema: Realm.ObjectSchema = {
    primaryKey: "_id",
    name: "Label",
    properties: {
      _id: "string",
      label: "string",
      count: "int",
      countInitial:'int',
      timestamp: "date",
      synced: "bool",
      status: "string",
    },
  };
}

export class Image extends Realm.Object<Image> {
  noteId!: string;
  images?: string[];
  static schema: Realm.ObjectSchema = {
    name: "Image",
    primaryKey: "noteId",
    properties: {
      noteId: "string",
      images: "string[]",
    },
  };
}

export const realmConfig = {
  schema: [Note.schema, Label.schema, Image.schema],
  schemaVersion: 2,
};
