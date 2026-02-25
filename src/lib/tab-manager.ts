import { computed, defineComponent, h, ref, shallowReactive, type Ref, type ShallowReactive } from 'vue';

// Tabs as an object for future extensibility
export interface Tab {
  label: string | Ref<string>;
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
      return () => {
        return h('div', { 'data-vue-tab': true }, [
          h('menu', { role: 'tablist' }, this.tabs.map((tab, index) => {
            return h('li', { role: 'tab', 'aria-selected': this.currentTabIndex.value === index }, [
              h('a', { onClick: () => this.currentTabIndex.value = index }, typeof tab.label === 'string' ? tab.label : tab.label.value)
            ]);
          })),
          h('div', { class: 'window', role: 'tabpanel' }, [
            h('div', { class: 'window-body' }, [
              slots.default ? slots.default({ currentTabIndex: this.currentTabIndex.value, currentTab: this.currentTab.value }) : null
            ])
          ])
        ]);
      };
    })
  }
}