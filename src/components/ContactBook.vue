<template>
  <h1>Contact Book</h1>
  <ContactForm @get-contacts="initData" />
  <div class="tools">
    <input
      v-model="searchQuery"
      type="search"
      placeholder="Search"
      @input="searchChange"
    />
    <span class="tools__sort-label">Sort by:</span>
    <select v-model="sortOrder" class="tools__select">
      <option value="desc">New contacts</option>
      <option value="asc">Old contacts</option>
    </select>
  </div>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="contacts">
    <ul>
      <li v-for="contact in visibleContacts" :key="contact.id">
        <Contact :contact="contact" @get-contacts="initData" />
      </li>
    </ul>
    <div class="pagination">
      <button @click="changePage('prev')" :disabled="page === 1">&lt;</button>
      <span class="pagination__page">{{ page }}</span>
      <button @click="changePage('next')" :disabled="contacts.length / visibleLimit < page">></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useStore } from "vuex"
import { Services } from "../types"
import ContactForm from "./ContactForm.vue"
import Contact from "./Contact.vue"

const store = useStore()
const isLoading = ref(false)

const sortOrder = ref('desc')
const searchQuery = ref('')

const page = ref(1)
const showFromIndex = ref(0)
const visibleLimit = 5

const contacts = computed(() => store.getters.getContacts)
const visibleContacts = computed(() => [...contacts.value].splice(showFromIndex.value, visibleLimit))

function changePage (param: string) {
  if (param === 'prev' && page.value > 1) {
    showFromIndex.value -= visibleLimit
    page.value--
  } else if (param === 'next' && contacts.value.length / visibleLimit > page.value) {
    showFromIndex.value += visibleLimit
    page.value++
  }
}

const error = ref('')

async function initData () {
  try {
    isLoading.value = true
    await store.dispatch(Services.GET_CONTACTS, {
      searchQuery: searchQuery.value,
      sortOrder: sortOrder.value,
    })
  } catch (err) {
    error.value = 'Something went wrong... Try again later!'
  } finally {
    isLoading.value = false
  }
}

function debounce () {
  let timer: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => initData(), 500)
  }
}
const searchChange = debounce()

watch(() => sortOrder.value, () => initData())

onMounted(() => initData())
</script>

<style scoped lang="scss">
.contacts {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tools {
  margin-bottom: 8px;
  &__sort-label {
    font-size: 12px;
    padding-left: 5px;
    padding-right: 2px;
   }
  &__select {
    height: 22px;
  }
}

.pagination {
  position: fixed;
  bottom: 5px;
  &__page {
    padding: 10px;
  }
}
</style>
