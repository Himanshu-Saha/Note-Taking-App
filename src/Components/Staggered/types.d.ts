import { Note } from "../../RealmDB";

export type StaggedLabelProps = {
  data: Note[] | undefined;
  labelDetails:{ labelId: string; labelName: string } 
};

type itemType = {
  title: string;
  data: string;
  id: string;
  noteId: string;
  label: string;
  ImageUrl: string[];
};
