<script lang="ts" setup>
import { useClipboardCopy } from '../composables/useClipboardCopy'

const website = useWebsite()
const year = useDateFormat(new Date(), 'YYYY')
const { copyText } = useClipboardCopy()

/** ウェブサイトの名前 */
const name = website.value.name
/** ソーシャルリンク */
const socials = website.value.socials
/** フッターナビゲーションの項目 */
const menu = website.value.footer.menu
/** RSSフィードのURLをコピーする */
const rssFeedCopy = async () => {
  await copyText(website.value.socials.rss.url)
}
</script>

<template>
  <footer
    class="mt-20 border-t border-primary/10 bg-gradient-to-br from-primary/10 via-white to-white py-20 dark:from-primary/10 dark:via-slate-900 dark:to-slate-900"
  >
    <div
      class="mx-auto flex w-full flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center md:px-6 lg:px-8"
    >
      <div class="flex flex-col gap-5">
        <nav>
          <ul class="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1">
            <li v-for="item in menu" :key="item.url">
              <NuxtLink :to="item.url">
                <span class="text-xs font-bold underline hover:no-underline">
                  {{ item.title }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div class="flex items-center gap-2">
          <NuxtLink
            :title="socials.bluesky.name"
            :to="socials.bluesky.url"
            aria-label="Blueskyでフォローする"
            class="relative flex size-8 items-center justify-center rounded before:absolute before:size-full before:rounded before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-20"
            target="_blank"
          >
            <span class="i-simple-icons-bluesky size-5" />
          </NuxtLink>
          <NuxtLink
            :title="socials.github.name"
            :to="socials.github.url"
            aria-label="GitHubでフォローする"
            class="relative flex size-8 items-center justify-center rounded before:absolute before:size-full before:rounded before:bg-current before:opacity-0 before:transition-opacity hover:before:opacity-20"
            target="_blank"
          >
            <span class="i-simple-icons-github size-5" />
          </NuxtLink>
          <NuxtLink
            :title="socials.form.name"
            :to="socials.form.url"
            aria-label="Google Formはこちら"
            target="_blank"
            rel="noopener noreferrer"
            class="relative flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <span class="i-mingcute-document-3-line size-5" />
          </NuxtLink>
          <button
            :title="socials.rss.name"
            aria-label="RSSフィードのURLをコピーする"
            class="relative flex size-8 items-center justify-center rounded before:absolute before:size-full before:rounded before:bg-primary/10 before:opacity-0 before:transition-opacity hover:before:opacity-20"
            @click="() => rssFeedCopy()"
          >
            <span class="i-line-md-rss size-5" />
          </button>
        </div>
      </div>
      <div class="text-xs">&copy; 2026-{{ year }} {{ name }}</div>
    </div>
  </footer>
</template>
