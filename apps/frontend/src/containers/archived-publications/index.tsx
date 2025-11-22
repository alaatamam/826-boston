import { useEffect, useState } from 'react';
import './styles.css';

interface Anthology {
  id: number;
  title: string;
  published_year: number;
  status: string;
  updated_at?: string;
  authors?: string[]; // for search by author(s)
}

// Static fallback data to satisfy "leave static for now"
const STATIC_ARCHIVED: Anthology[] = [
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
];

const MOCK_LAST_MODIFIED = 'October 15, 2025';

export default function ArchivedPublications() {
  const [archived, setArchived] = useState<Anthology[]>(STATIC_ARCHIVED);
  const [selected, setSelected] = useState<Anthology | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetch('/api/anthologies')
      .then((res) => res.json())
      .then((data) => {
        const archivedOnly = (data as Anthology[]).filter(
          (item) => item.status === 'archived',
        );
        if (archivedOnly.length > 0) {
          setArchived(archivedOnly);
        }
      })
      .catch(() => {
        // If backend fails, keep STATIC_ARCHIVED
        setArchived(STATIC_ARCHIVED);
      });
  }, []);

  // Case-insensitive search over title + authors
  const filteredArchived = archived.filter((pub) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;

    const titleMatch = pub.title.toLowerCase().includes(q);
    const authors = pub.authors || [];
    const authorMatch = authors.some((author) =>
      author.toLowerCase().includes(q),
    );

    return titleMatch || authorMatch;
  });

  return (
    <div className="archive-wrapper">
      {/* Header: title + search bar */}
      <div className="archive-toolbar">
        <h1 className="archive-title">All Publications</h1>

        <div className="archive-search-wrapper">
          <input
            className="archive-search-input"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="archive-search-icon" disabled>
            🔍
          </button>
          <button className="archive-filter-icon" disabled>
            ☷
          </button>
        </div>
      </div>

      {/* Scrollable card grid */}
      <div className="archive-grid">
        {filteredArchived.length === 0 ? (
          <div className="archive-empty">
            No publications match your search.
          </div>
        ) : (
          filteredArchived.map((pub) => (
            <button
              key={pub.id}
              className="archive-card"
              type="button"
              onClick={() => setSelected(pub)}
            >
              <div className="archive-card-body" />

              <div className="archive-card-footer">
                <div className="archive-card-footer-text">
                  <div className="archive-card-title">
                    {pub.title || 'Title'}
                  </div>
                  <div className="archive-card-meta">
                    Last modified{' '}
                    {pub.updated_at
                      ? new Date(pub.updated_at).toLocaleDateString()
                      : MOCK_LAST_MODIFIED}
                  </div>
                </div>
                <span className="archive-card-menu">•••</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Interaction pop-up modal */}
      {selected && (
        <div
          className="archive-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div className="archive-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="archive-modal-title">{selected.title}</h2>

            <div className="archive-modal-content">
              <p>
                <strong>Year:</strong> {selected.published_year ?? '—'}
              </p>
              <p>
                <strong>Status:</strong> {selected.status}
              </p>
              {selected.authors && selected.authors.length > 0 && (
                <p>
                  <strong>Author(s):</strong> {selected.authors.join(', ')}
                </p>
              )}
              <p>
                This is a placeholder pop-up interaction to satisfy the
                acceptance criteria. Additional details and actions will be
                added in future tickets.
              </p>
            </div>

            <button
              type="button"
              className="archive-modal-close"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
