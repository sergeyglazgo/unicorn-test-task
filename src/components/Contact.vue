<template>
  <div class="contact">
    <ContactForm
      v-if="isEditMode"
      :contact="contact"
      @save="isEditMode = false"
      @get-contacts="emit('getContacts')"
    />
    <div v-else>
      <span>{{ contact.name }} {{ contact.phone }}</span>
      <div class="contact__date">Created at: {{ date }}</div>
    </div>
    <div class="contact__control">
      <button class="contact__edit-button" @click="isEditMode = !isEditMode">
        {{ isEditMode ? 'Cancel' : 'Edit' }}
      </button>
      <button @click="deleteContact">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IContact, Services } from "../types"
import { useStore } from "vuex"
import { ref } from "vue"
import ContactForm from "./ContactForm.vue"

const props = defineProps<{
  contact: IContact
}>()

const emit = defineEmits(['getContacts'])

const store = useStore()

const isEditMode = ref(false)

const date = new Date(props.contact.createdAt).toString().slice(4, 15)

async function deleteContact () {
  await store.dispatch(Services.DELETE_CONTACT, props.contact.id)
  emit('getContacts')
}
</script>

<style scoped lang="scss">
.contact {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 422px;
  min-height: 86px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.87);
  border-radius: 8px;
  &__date {
    font-size: 12px;
  }
  &__control {
    margin-top: 8px;
  }
  &__edit-button {
    margin-right: 6px;
  }
}

@media (prefers-color-scheme: light) {
 .contact {
   border-color: #646cff;
 }
}
</style>