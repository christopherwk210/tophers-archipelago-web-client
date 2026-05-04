import changelog from '@/../CHANGELOG.md?raw';
import { useLocalization } from '@/lib/localization-util';
import { marked } from 'marked';
import { ref } from 'vue';

export const changelogHTML = ref('');

export async function parseChangelog() {
  const { t } = useLocalization();

  const result = await marked.parse(changelog.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,''), {
    async: true,
    gfm: true
  });

  changelogHTML.value = result
    .replace(/⚙️/g, `<span data-tippy-content="${t('Texts.textChangeFeature')}" class="changelog-emoji">⚙️</span>`)
    .replace(/🎨/g, `<span data-tippy-content="${t('Texts.textChangeFeature')}" class="changelog-emoji">🎨</span>`)
    .replace(/✨/g, `<span data-tippy-content="${t('Texts.textChangeQOL')}" class="changelog-emoji">✨</span>`)
    .replace(/🪛/g, `<span data-tippy-content="${t('Texts.textChangeSetting')}" class="changelog-emoji">🪛</span>`)
    .replace(/🐛/g, `<span data-tippy-content="${t('Texts.textBug')}" class="changelog-emoji">🐛</span>`)
}