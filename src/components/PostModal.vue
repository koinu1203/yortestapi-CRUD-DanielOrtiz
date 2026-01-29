<script setup>
import { ref, watch } from 'vue'
import Spinner from './Spinner.vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  form: {
    type: Object,
    required: true,
  },
  editing: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'update:open'])

const draft = ref({ ...props.form })

watch(
  () => [props.open, props.form],
  ([isOpen]) => {
    if (isOpen) {
      draft.value = { ...props.form }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    v-if="props.open"
    class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 px-4 py-6 sm:items-center"
  >
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          {{ editing ? 'Update Post' : 'Create Post' }}
        </h3>
        <button
          class="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
          @click="emit('update:open', false)"
        >
          ✕
        </button>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="emit('submit', { ...draft })">
        <div>
          <label class="text-sm font-medium text-slate-600">Title</label>
          <input
            v-model="draft.title"
            type="text"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Enter a title"
            required
          />
        </div>
        <div>
          <label class="text-sm font-medium text-slate-600">Subtitle</label>
          <input
            v-model="draft.text"
            type="text"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Short description"
            required
          />
        </div>
        <div>
          <label class="text-sm font-medium text-slate-600">Image</label>
          <input
            v-model="draft.image"
            type="text"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="/img/bird3.jpg"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-slate-600">URL</label>
          <input
            v-model="draft.url"
            type="url"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="https://example.com"
          />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="text-sm font-medium text-slate-600">Active</label>
            <select
              v-model.number="draft.active"
              class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium text-slate-600">Sort Order</label>
            <input
              v-model.number="draft.sort_order"
              type="number"
              min="1"
              class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        

        <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100"
            @click="emit('update:open', false)"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="loading"
          >
            <Spinner v-if="loading" />
            <span>{{ editing ? 'Save Changes' : 'Create Post' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
