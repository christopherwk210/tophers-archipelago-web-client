import changelog from '@/../CHANGELOG.md?raw';
import { marked } from 'marked';
import { ref } from 'vue';

export const changelogHTML = ref('');

async function parseChangelog() {
  console.log('parse')

  const result = await marked.parse(changelog.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,''), {
    async: true,
    gfm: true
  });

  changelogHTML.value = result
    .replace(/⚙️/g, '<span data-tippy-content="New feature" class="changelog-emoji">⚙️</span>')
    .replace(/🎨/g, '<span data-tippy-content="New theme" class="changelog-emoji">🎨</span>')
    .replace(/✨/g, '<span data-tippy-content="Quality of life" class="changelog-emoji">✨</span>')
    .replace(/🪛/g, '<span data-tippy-content="New setting(s)" class="changelog-emoji">🪛</span>')
}

parseChangelog();