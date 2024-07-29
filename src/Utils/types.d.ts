export interface Note {
    title: string;
    content: string;
    url: string[];
    time_stamp: ReturnType<typeof serverTimestamp>;
    label?: any; // Add the label property
  }

  export interface valuesTypes{
    email:string,
    password:string,
    firstName:string,
    lastName:string,
}