export interface Anthology {
  id: number;
  title: string;
  published_year: number;
  status: string;
  updated_at?: string;
  authors?: string[];
}

export const STATIC_ARCHIVED: Anthology[] = [
  {
    id: 1,
    title: 'Student Voices Vol. 1',
    published_year: 2022,
    status: 'archived',
    authors: ['A. Lee', 'M. Torres'],
  },
  {
    id: 2,
    title: '826 Boston Anthology 2023',
    published_year: 2023,
    status: 'archived',
    authors: ['Jamal Wright'],
  },
  {
    id: 3,
    title: 'Neighborhood Stories',
    published_year: 2021,
    status: 'archived',
    authors: ['A. Lee'],
  },
  {
    id: 4,
    title: 'Poetry from the Classroom',
    published_year: 2020,
    status: 'archived',
    authors: ['Student Contributors'],
  },
  {
    id: 5,
    title: 'Young Writers Showcase',
    published_year: 2019,
    status: 'archived',
    authors: ['K. Chen', 'R. Patel', 'S. Johnson'],
  },
  {
    id: 6,
    title: 'Stories from Roxbury',
    published_year: 2021,
    status: 'archived',
    authors: ['Community Writers'],
  },
  {
    id: 7,
    title: 'Creative Expressions 2022',
    published_year: 2022,
    status: 'archived',
    authors: ['M. Williams', 'D. Brown'],
  },
  {
    id: 8,
    title: 'Voices of Tomorrow',
    published_year: 2023,
    status: 'archived',
    authors: ['826 Boston Students'],
  },
];

export const RECENTLY_EDITED: Anthology[] = [
  {
    id: 101,
    title: 'Untitled Publication',
    published_year: 2025,
    status: 'archived',
  },
  {
    id: 102,
    title: 'Untitled Publication',
    published_year: 2025,
    status: 'archived',
  },
  {
    id: 103,
    title: 'Untitled Publication',
    published_year: 2025,
    status: 'archived',
    authors: ['Student Contributors'],
  },
];

export const MOCK_LAST_MODIFIED = 'October 15, 2025';
