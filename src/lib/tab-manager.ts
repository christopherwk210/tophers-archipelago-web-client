
import { computed, defineComponent, h, ref, shallowReactive, isRef, type Ref, type ShallowReactive } from 'vue';
import { I18nT } from 'vue-i18n';
import type { LocaleKey } from './localization-util';

// Tabs as an object for future extensibility
export interface Tab {
  label: string | Ref<string>;
  keypath?: LocaleKey;
}

export class TabManager<T extends Tab> {
  tabs: ShallowReactive<T[]>;

  /** The index of the current tab */
  currentTabIndex = ref(0);

  readonly currentTab = computed(() => this.tabs[this.currentTabIndex.value]!);

  constructor(tabs: T[]) {
    this.tabs = shallowReactive([ ...tabs ]);
  }

  /**
   * Creates a Vue component connected to the tab manager
   * (See Connected.vue for an example usage)
   */
  createVueComponent() {
    return defineComponent((_, { slots }) => {
      // <div data-vue-tab>
      return () => h('div', { 'data-vue-tab': true }, [
        // <menu role="tablist">
        h('menu', { role: 'tablist' }, this.tabs.map((tab, index) => {
          // <li role="tab" aria-selected="true">
          return h('li', { onClick: () => this.currentTabIndex.value = index, role: 'tab', 'aria-selected': this.currentTabIndex.value === index }, [
            // <a>{{ tab.label }}</a>
            typeof tab.keypath !== 'string' ? h('a', {  }, typeof tab.label === 'string' ? tab.label : tab.label.value) : h(I18nT, { keypath: tab.keypath, tag: 'a', scope: 'global' })
          // </li>
          ]);
        // </menu>
        })),
        // <div class="window" role="tabpanel">
        h('div', { class: 'window', role: 'tabpanel' }, [
          // <div class="window-body">
          h('div', { class: 'window-body' }, [
            // <slot></slot>
            slots.default ? slots.default({ currentTabIndex: this.currentTabIndex.value, currentTab: this.currentTab.value }) : null
          // </div>
          ])
        // </div>
        ])
      // </div>
      ]);
    })
  }
}