import { createStore } from 'vuex'
import { IContact, State } from "../types"
import axios from "axios"

const baseURL = 'https://63e50270c04baebbcdb16344.mockapi.io/contacts'

async function fetchContacts (url: URL) {
  return await fetch(url, {
    method: 'GET',
    headers: {'content-type':'application/json'},
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
  }).then(contacts => contacts)
}

export const store = createStore<State>({
  state: {
    contacts: []
  },
  mutations: {
    setContacts (state, contacts: Array<IContact>) {
      state.contacts = contacts
    }
  },
  actions: {
    async getContacts ({ commit }, { searchQuery, sortOrder }) {
      const url = new URL(baseURL)
      const searchField = isNaN(+searchQuery) ? 'name' : 'phone'

      url.searchParams.append(searchField, searchQuery)
      url.searchParams.append('sortBy', 'createdAt')
      url.searchParams.append('order', sortOrder)

      const res = await fetchContacts(url)

      commit('setContacts', res)
    },

    async addContact ({ commit }, payload: IContact) {
      await axios.post(baseURL, payload)
    },

    async editContact (_, payload: IContact) {
      await axios.put(`${baseURL}/${payload.id}`, payload)
    },

    async deleteContact (_, payload: number) {
      await axios.delete(`${baseURL}/${payload}`)
    },
  },
  getters: {
    getContacts (state) {
      return state.contacts
    }
  }
})