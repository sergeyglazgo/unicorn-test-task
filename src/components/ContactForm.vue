<template>
  <form class="form" @submit.prevent="saveContact">
    <input v-model="name" type="text" placeholder="Name" />
    <input v-model="phone" type="tel" placeholder="Phone number" />
    <button type="submit" :disabled="isSaveDisabled">Save</button>
  </form>
</template>

<script setup lang="ts">
import { IContact, Services } from "../types"
import {computed, ref} from "vue"
import { useStore } from "vuex"

const props = withDefaults(defineProps<{
  contact?: IContact | null
}>(), {
  contact: null
})
const emit = defineEmits(['save', 'getContacts'])

const store = useStore()

const name = ref(props.contact?.name || '')
const phone = ref(props.contact?.phone || '')

async function saveContact () {
  const payload = {
    id: props.contact?.id || 0,
    name: name.value,
    phone: phone.value,
    createdAt: props.contact?.createdAt || Date.now()
  }

  if (props.contact?.id) {
    await store.dispatch(Services.EDIT_CONTACT, payload)
    emit('save')
  } else {
    await store.dispatch(Services.ADD_CONTACT, payload)
  }
  name.value = ''
  phone.value = ''
  emit('getContacts')
}

const isSaveDisabled = computed(() => {
  return !((!props.contact && name.value && phone.value) ||
    (props.contact && (name.value !== props.contact.name || phone.value !== props.contact.phone)))
})
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 4px;
}
</style>
