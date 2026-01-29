<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PostModal from '../components/PostModal.vue'
import SearchInput from '../components/SearchInput.vue'
import Spinner from '../components/Spinner.vue'
import { usePostModal } from '../composables/usePostModal'
import { yourTestApiService } from '../services/yourtestapi.service.js'

const posts = ref([])

const modal = usePostModal()
const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const isLoadingPosts = ref(false)
const isSaving = ref(false)

const buildImageUrl = (path = '') => {
  const normalizedPath = path.replace(/^\/+/, '')
  return `${baseUrl}/${normalizedPath}`
}

const loadPosts = async () => {
  isLoadingPosts.value = true
  try {
    const data = await yourTestApiService.getAll()
    posts.value = (data || []).sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load posts:', error)
  } finally {
    isLoadingPosts.value = false
  }
}

onMounted(loadPosts)

const totalPosts = computed(() => posts.value.length)
const searchQuery = ref('')
const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return posts.value
  return posts.value.filter((post) => post.title?.toLowerCase().includes(query))
})
const totalNames = computed(() => filteredPosts.value.length)

const openCreate = () => {
  modal.openCreate(posts.value.length + 1)
}

const openEdit = (post) => {
  if (!post) return
  modal.openEdit(post)
}

const handleSubmit = async (payload) => {
  if (!payload?.title || !payload?.text) return

  try {
    isSaving.value = true
    if (modal.isEditing.value) {
      await yourTestApiService.update(payload.id, payload)
    } else {
      await yourTestApiService.create(payload)
    }

    await loadPosts()
    modal.close()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save post:', error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (post) => {
  if (!post?.id) return

  try {
    await yourTestApiService.remove(post.id)
    await loadPosts()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to delete post:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="mx-auto max-w-6xl px-4 py-10">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-4">
          <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            YourTestAPI CRUD
          </h1>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            @click="openCreate"
          >
            Add Post
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 pb-12">
      <section class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-semibold">Posts</h2>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <SearchInput v-model="searchQuery" />
            <div class="text-sm text-slate-500">Total names: {{ totalNames }}</div>
          </div>
        </div>

        <div class="mt-6">
          <div v-if="isLoadingPosts" class="py-12">
            <Spinner />
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th class="px-4 py-3">Name</th>
                  <th class="px-4 py-3">Image</th>
                  <th class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-slate-50">
                  <td class="px-4 py-3">
                    <RouterLink
                      :to="`/post/${post.id}`"
                      class="font-medium text-slate-900 hover:text-blue-600"
                    >
                      {{ post.title }}
                    </RouterLink>
                    <div class="text-xs text-slate-500">{{ post.text }}</div>
                  </td>
                  <td class="px-4 py-3">
                    <img
                      :src="buildImageUrl(post.image)"
                      :alt="post.title"
                      class="h-12 w-12 rounded-lg object-cover"
                      loading="lazy"
                    />
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm ring-1 ring-blue-200 transition hover:bg-blue-50"
                        @click="openEdit(post)"
                      >
                        Edit
                      </button>
                      <button
                        class="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-50"
                        @click="handleDelete(post)"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>

    <PostModal
      :open="modal.isOpen.value"
      :form="modal.form.value"
      :editing="modal.isEditing.value"
      :loading="isSaving"
      @submit="handleSubmit"
      @update:open="(value) => (modal.isOpen.value = value)"
    />
  </div>
</template>
