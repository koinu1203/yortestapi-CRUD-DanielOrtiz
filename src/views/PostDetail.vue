<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Spinner from '../components/Spinner.vue'
import { yourTestApiService } from '../services/yourtestapi.service.js'

const route = useRoute()
const post = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

const buildImageUrl = (path = '') => {
  const normalizedPath = path.replace(/^\/+/, '')
  return `${baseUrl}/${normalizedPath}`
}

const postId = computed(() => route.params.id)

const loadPost = async () => {
  if (!postId.value) return
  isLoading.value = true
  errorMessage.value = ''

  try {
    post.value = await yourTestApiService.getById(postId.value)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load post:', error)
    errorMessage.value = 'Unable to load post details.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPost)
watch(postId, loadPost)
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="mx-auto max-w-5xl px-4 py-10">
      <div class="flex flex-col gap-4">
        <RouterLink class="text-sm font-semibold text-blue-600 hover:text-blue-500" to="/">
          ← Back to posts
        </RouterLink>
        <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Post Details</h1>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 pb-12">
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div v-if="isLoading" class="py-12">
          <Spinner />
        </div>

        <div v-else-if="errorMessage" class="text-sm text-rose-600">
          {{ errorMessage }}
        </div>

        <div v-else-if="post" class="space-y-6">
          <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
            <img
              v-if="post.image"
              :src="buildImageUrl(post.image)"
              :alt="post.title"
              class="h-40 w-40 rounded-2xl object-cover"
            />
            <div class="space-y-2">
              <h2 class="text-2xl font-semibold text-slate-900">{{ post.title }}</h2>
              <p class="text-slate-600">{{ post.text }}</p>
              <a
                v-if="post.url"
                :href="post.url"
                target="_blank"
                rel="noopener"
                class="text-sm font-semibold text-blue-600 hover:text-blue-500"
              >
                Visit external link
              </a>
            </div>
          </div>

          <div class="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div class="rounded-xl bg-slate-50 p-4">
              <div class="text-xs uppercase text-slate-400">ID</div>
              <div class="font-semibold text-slate-900">{{ post.id }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 p-4">
              <div class="text-xs uppercase text-slate-400">Active</div>
              <div class="font-semibold text-slate-900">{{ post.active }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 p-4">
              <div class="text-xs uppercase text-slate-400">Sort Order</div>
              <div class="font-semibold text-slate-900">{{ post.sort_order }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 p-4">
              <div class="text-xs uppercase text-slate-400">Deleted At</div>
              <div class="font-semibold text-slate-900">{{ post.deleted_at || '—' }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 p-4">
              <div class="text-xs uppercase text-slate-400">Created At</div>
              <div class="font-semibold text-slate-900">{{ post.created_at }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 p-4">
              <div class="text-xs uppercase text-slate-400">Updated At</div>
              <div class="font-semibold text-slate-900">{{ post.updated_at }}</div>
            </div>
          </div>
        </div>

        <div v-else class="text-sm text-slate-500">No post data available.</div>
      </section>
    </main>
  </div>
</template>
