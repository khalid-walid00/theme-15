interface Item {
  id?: string | number;
  label: string;
  url?: string;
}

interface AlpineComponent {
  $el?: HTMLElement;
  $refs?: {
    [key: string]: HTMLElement | HTMLElement[];
  };
  [key: string]: any;
}

export type { Item, AlpineComponent }; 