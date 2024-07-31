
export const NoteSchema = {
    name: 'Note',
    properties: {
      id: 'string',
      title: 'string',
      content: 'string',
      label: 'string',
      imagesURL: 'string[]',
      time_stamp: 'date'
    },
    primaryKey: 'id',
  };
  
  export const LabelSchema = {
    name: 'Label',
    properties: {
      name: 'string',
      count: 'int'
    },
  };
  
  
  const ChangeQueueSchema = {
    name: 'ChangeQueue',
    properties: {
      id: 'string',
      operation: 'string',
      data: 'string',
      timestamp: 'date',
    },
  };

  

  