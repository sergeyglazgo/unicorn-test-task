export interface IContact {
  id: number,
  name: string,
  phone: string,
  createdAt: number
}

export interface State {
  contacts: Array<IContact>
}

export enum Services {
  GET_CONTACTS = 'getContacts',
  ADD_CONTACT = 'addContact',
  EDIT_CONTACT = 'editContact',
  DELETE_CONTACT = 'deleteContact'
}
