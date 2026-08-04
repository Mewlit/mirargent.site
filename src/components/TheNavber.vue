<script lang="ts" setup>
import { Switch } from '@headlessui/vue'
import { useFixedHeader } from 'vue-use-fixed-header'
import { useClipboardCopy } from '../composables/useClipboardCopy'
import { useToast } from '../composables/useToast'

// 固定ヘッダー制御
const headerRef = ref<HTMLElement | null>(null)
const { styles } = useFixedHeader(headerRef)

// Composables & State
const website = useWebsite()
const colorMode = useColorMode()
const { copyText } = useClipboardCopy()

/** ウェブサイトの名前 */
const name = website.value.name

/** ダークモード管理 */
const isDark = computed<boolean>({
  get: () => colorMode.value === 'dark',
  set: (val) => {
    colorMode.value = val ? 'dark' : 'light'
    useToast().addToast({
      title: `カラーモードを${val ? 'ダーク' : 'ライト'}モードに切り替えました`,
      type: 'success',
    })
  },
})

/** ソーシャルリンク */
const socials = website.value.socials

/** RSSフィードのURLをコピーする */
const rssFeedCopy = async () => {
  await copyText(website.value.socials.rss.url)
}

// ナビゲーションメニュー定義（動的データとアイコンを紐付け）
const items = computed(() => [
  { name: 'Home', path: '/', icon: 'i-line-md-home-simple' },
  { name: 'OriginalHome', path: '/original', icon: 'i-line-md-home-md' },
  {
    name: 'About',
    path: '/about',
    icon: 'i-line-md-person-search',
  },
  {
    name: 'Diary',
    path: '/blog',
    icon: 'i-line-md-calendar',
  },
  { name: 'Lab', path: '/labs', icon: 'i-line-md-cancel' },
  {
    name: 'Bags',
    path: '/bags',
    icon: 'i-line-md-cancel',
  },
  {
    name: 'Bookmarks',
    path: '/books',
    icon: 'i-line-md-link',
  },
])
</script>

<template>
  <div ref="headerRef" :style="styles" class="fixed top-0 z-50 w-full">
    <nav class="mx-auto w-full px-4 sm:px-6 lg:px-8">
      <ul
        class="my-4 flex items-center gap-1 rounded-full border border-white/30 bg-primary/30 px-4 py-1.5 text-sm font-medium text-slate-800 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-sm dark:border-primary/20 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-white/10"
      >
        <!-- ロゴエリア -->
        <li class="mr-2 flex items-center">
          <NuxtLink
            :title="`${name} トップページ`"
            to="/"
            class="flex items-center transition-opacity hover:opacity-70"
          >
            <img
              :alt="`${name} ロゴ`"
              src="/android-chrome-512x512.png"
              width="100"
              height="25"
              class="block h-6 w-auto dark:hidden"
            />
            <img
              :alt="`${name} ロゴ`"
              src="/android-chrome-512x512.png"
              width="100"
              height="25"
              class="hidden h-6 w-auto dark:block"
            />
            <!--
            <img
              :alt="`${name} ロゴ`"
              src="/assets/logo-light.svg"
              width="100"
              height="25"
              class="block h-6 w-auto dark:hidden"
            />
            <img
              :alt="`${name} ロゴ`"
              src="/assets/logo-dark.svg"
              width="100"
              height="25"
              class="hidden h-6 w-auto dark:block"
            />
            -->
          </NuxtLink>
        </li>

        <!-- ディバイダー -->
        <li class="h-4 w-px bg-gray-200 dark:bg-gray-700" />

        <!-- ナビゲーションメニュー -->
        <li v-for="item in items" :key="item.path">
          <NuxtLink
            :to="item.path"
            :title="item.name"
            class="hover:text-primary-500 dark:hover:text-primary-400 relative z-10 flex size-9 items-center justify-center text-gray-700 transition dark:text-gray-200"
            active-class="text-primary-600 dark:text-primary-400"
          >
            <!-- アイコン本体：z-10 で背景より前面に配置 -->
            <span :class="[item.icon, 'relative z-10 size-5 shrink-0']" />

            <!-- アクティブ時のアンダーライン -->
            <span
              v-if="$route.path === item.path"
              class="from-primary-500/0 via-primary-500/70 to-primary-500/0 dark:from-primary-400/0 dark:via-primary-400/40 dark:to-primary-400/0 absolute inset-x-1 -bottom-px z-10 h-px bg-gradient-to-r"
            />

            <!-- アクティブ時の背景円：z-0 でアイコンの後ろに配置 -->
            <span
              v-if="$route.path === item.path"
              class="absolute left-1/2 top-1/2 z-0 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-100 dark:bg-white/10"
            />

            <span class="sr-only">{{ item.name }}</span>
          </NuxtLink>
        </li>

        <!-- スペーサー -->
        <li class="flex-1" />

        <!-- アクションエリア（Google Form / RSS / ダークモード切替） -->
        <li class="flex items-center gap-1">
          <!-- Google Form リンク -->
          <NuxtLink
            :to="socials.form.url"
            :title="socials.form.name"
            aria-label="Google Formはこちら"
            target="_blank"
            rel="noopener noreferrer"
            class="relative flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <span class="i-line-md-file-document size-5" />
          </NuxtLink>

          <!-- RSS コピーボタン -->
          <button
            :title="socials.rss.name"
            aria-label="RSSフィードのURLをコピーする"
            class="relative flex size-8 items-center justify-center rounded-full transition-colors hover:bg-primary/10 dark:hover:bg-white/10"
            @click="rssFeedCopy"
          >
            <span class="i-line-md-rss size-4" />
          </button>

          <!-- ダークモードトグル -->
          <Switch
            v-model="isDark"
            aria-label="カラーモードを切り替える"
            class="relative flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <span
              :key="isDark ? 'dark' : 'light'"
              class="i-line-md-sun-rising-loop size-5 dark:i-line-md-moon-rising-loop"
            />
          </Switch>
        </li>
      </ul>
    </nav>
  </div>
</template>
