import { ref } from 'vue'

export const usePostModal = () => {
  const isOpen = ref(false)
  const isEditing = ref(false)
  const form = ref({
    id: null,
    title: '',
    text: '',
    image: '',
    url: '',
    active: 1,
    sort_order: 1,
    created_at: '',
    updated_at: '',
    deleted_at: null,
  })

  const openCreate = (sortOrder = 1) => {
    isEditing.value = false
    form.value = {
      id: null,
      title: '',
      text: '',
      image: '',
      url: '',
      active: 1,
      sort_order: sortOrder,
      created_at: '',
      updated_at: '',
      deleted_at: null,
    }
    isOpen.value = true
  }

  const openEdit = (item) => {
    if (!item) return
    isEditing.value = true
    form.value = { ...item }
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    isEditing,
    form,
    openCreate,
    openEdit,
    close,
  }
}
