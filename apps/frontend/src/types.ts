export enum AnthologyStatus {
  ARCHIVED = 'Archived',
  NOT_STARTED = 'NotStarted',
  DRAFTING = 'Drafting',
  CAN_BE_SHARED = 'CanBeShared',
}

export enum AnthologyPubLevel {
  ZINE = 'Zine',
  CHAPBOOK = 'Chapbook',
  PERFECT_BOUND = 'PerfectBound',
  SIGNATURE = 'Signature',
}

export interface Anthology {
  id: number;
  title: string;
  description: string;
  published_year: number;
  programs?: string[] | string;
  inventory?: number;
  status: AnthologyStatus;
  pub_level: AnthologyPubLevel;
  photo_url?: string;
  genre?: string;
  theme?: string;
  isbn?: string;
  shopify_url?: string;
}

