import { useToast } from './useToast'

export interface ClipboardCopyOptions {
  successTitle?: string
  successDescription?: string
  errorTitle?: string
  errorDescription?: string
  unsupportedBrowserDescription?: string
}

const defaultOptions: Required<ClipboardCopyOptions> = {
  successTitle: 'RSSをコピーしました',
  successDescription:
    'RSS購読アプリ等に登録することでブログの更新があった際に通知を受け取れます。',
  errorTitle: 'RSSのコピーに失敗しました',
  errorDescription: 'クリップボードへの書き込みに失敗しました。',
  unsupportedBrowserDescription:
    'このブラウザはClipboard APIに対応していません。',
}

export const useClipboardCopy = () => {
  const { addToast } = useToast()

  const copyText = async (
    text: string,
    options: ClipboardCopyOptions = {},
  ): Promise<boolean> => {
    const {
      successTitle,
      successDescription,
      errorTitle,
      errorDescription,
      unsupportedBrowserDescription,
    } = {
      ...defaultOptions,
      ...options,
    }

    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      addToast({
        title: errorTitle,
        description: unsupportedBrowserDescription,
        type: 'error',
      })
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      addToast({
        title: successTitle,
        description: successDescription,
        type: 'success',
      })
      return true
    } catch {
      addToast({
        title: errorTitle,
        description: errorDescription,
        type: 'error',
      })
      return false
    }
  }

  return {
    copyText,
  }
}
