import React, { useState } from 'react';
import './publication-view.css';

// Image URLs from Figma (valid for 7 days)
const imgFrame69 =
  'https://www.figma.com/api/mcp/asset/27db9716-ebe4-4d05-9381-9d4ba2775e07';
const imgFluentIosArrow24Filled =
  'https://www.figma.com/api/mcp/asset/9dd37d35-ce13-43de-805f-35b5b07db7b2';
const imgVector3 =
  'https://www.figma.com/api/mcp/asset/4ca5ccfb-1405-4fd9-b3c9-d042e992c842';
const imgOuiPopout =
  'https://www.figma.com/api/mcp/asset/1d347115-ddef-48af-a9c8-1630ca868276';
const imgFluentMdl2SortUp =
  'https://www.figma.com/api/mcp/asset/9ab3c931-ce49-467c-8fa5-db208f8a8f7c';
const imgVector4 =
  'https://www.figma.com/api/mcp/asset/534605ee-2c35-48c7-a5a6-0cdf0c2abfbf';

type TabType = 'publications' | 'assets' | 'production-details' | 'inventory';

// --- Components ---

interface TabButtonProps {
  id: TabType;
  label: string;
  activeTab: TabType;
  onClick: (id: TabType) => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  id,
  label,
  activeTab,
  onClick,
}) => (
  <button
    onClick={() => onClick(id)}
    className={`tab-item ${activeTab === id ? 'tab-active' : ''}`}
  >
    {label}
  </button>
);

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="detail-row">
    <p className="detail-label">{label}</p>
    <p
      className={`detail-value ${
        value === 'Empty' ? 'detail-value-empty' : ''
      }`}
    >
      {value}
    </p>
  </div>
);

interface DetailRowLinkProps {
  label: string;
  linkText: string;
}

const DetailRowLink: React.FC<DetailRowLinkProps> = ({ label, linkText }) => (
  <div className="detail-row detail-row-link">
    <p className="detail-label">{label}</p>
    <button type="button" className="detail-link">
      <span className="detail-link-text">{linkText}</span>
      <div
        className="link-icon"
        style={{
          maskImage: `url(${imgOuiPopout})`,
          WebkitMaskImage: `url(${imgOuiPopout})`,
        }}
      />
    </button>
  </div>
);

const DetailRowStatus: React.FC = () => (
  <div className="detail-row detail-row-special">
    <p className="detail-label">Status</p>
    <div className="status-badge-container">
      <div className="status-badge">
        <div className="status-icon">
          <img src={imgVector4} alt="" />
        </div>
        <span>Can Be Shared</span>
      </div>
    </div>
  </div>
);

const DetailRowSponsors: React.FC = () => (
  <div className="detail-row detail-row-special">
    <p className="detail-label">Sponsors</p>
    <div className="sponsor-tags">
      <div className="sponsor-tag">
        Northeastern University Office of City and Community Engagement
      </div>
      <div className="sponsor-tag">Suffolk University</div>
    </div>
  </div>
);

interface AssetRowProps {
  name: string;
  type: string;
  size: string;
}

const AssetRow: React.FC<AssetRowProps> = ({ name, type, size }) => (
  <div className="assets-table-row">
    <span className="table-row-name">{name}</span>
    <div className="table-row-right">
      <span className="table-row-type">{type}</span>
      <span className="table-row-size">{size}</span>
    </div>
  </div>
);

interface MetadataRowProps {
  label: string;
  tags: { label: string; className: string }[];
}

const MetadataRow: React.FC<MetadataRowProps> = ({ label, tags }) => (
  <div className="metadata-row">
    <p className="metadata-label">{label}</p>
    <div className="tag-group">
      {tags.map((tag, index) => (
        <div key={index} className={`tag ${tag.className}`}>
          {tag.label}
        </div>
      ))}
    </div>
  </div>
);

interface MetadataRowSingleProps {
  label: string;
  value: string;
}

const MetadataRowSingle: React.FC<MetadataRowSingleProps> = ({
  label,
  value,
}) => (
  <div className="metadata-row-single">
    <p className="metadata-label">{label}</p>
    <p className="metadata-value">{value}</p>
  </div>
);

// --- Data ---

const publicationDetails = [
  {
    label: 'Subtitle',
    value:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    label: 'Byline',
    value:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    label: 'Theme',
    value:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    label: 'Praise/Pull Quotes',
    value:
      '"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
  },
];

const productionDetails = [
  { label: 'Foreword Author', value: 'Agnes Ugoji' },
  { label: 'Age Category', value: 'Empty' },
  { label: 'Pub Level', value: 'Level 2' },
  { label: 'Pub Date', value: 'June 30, 2025' },
  { label: 'ISBN', value: '979-8-88694-087-9' },
  { label: 'Dimensions', value: '7" x 7"' },
  { label: 'Binding Type', value: 'Perfect Bound' },
  { label: 'Page Count', value: '132' },
  { label: 'Print Run', value: '500' },
  { label: 'Printed By', value: 'Marquis' },
  { label: 'Number of Students', value: '53' },
  { label: 'Printing Cost', value: '$2,906.40' },
  { label: 'Weight', value: '6.2 oz / 176 g' },
];

const inventoryItems = [
  { label: 'Devs/Comms Office (1865 Columbus)', value: '79' },
  { label: 'The Hub (1989 Columbus)', value: '400' },
  { label: 'Tutoring Center (3035 Office)', value: 'Empty' },
  { label: 'Archived', value: '3' },
  { label: "Holland Writers' Room Library", value: 'Empty' },
  { label: "New Missions Writers' Room", value: 'Empty' },
  { label: "BINcA Writers' Room", value: 'Empty' },
  { label: "O'Bryant Writers' Room", value: 'Empty' },
  { label: "BTU Writers' Room", value: 'Empty' },
  { label: "Muñiz Writers' Room", value: 'Empty' },
];

const assets = [
  { name: 'name_of_file', type: 'PDF', size: '6.2 MB' },
  { name: 'name_of_file', type: 'PDF', size: '6.2 MB' },
  { name: 'name_of_file', type: 'PDF', size: '6.2 MB' },
];

const PublicationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('publications');
  const [isExpanded, setIsExpanded] = useState(false);

  const fullDescription =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="publication-view">
      {/* Breadcrumb Header */}
      <div className="breadcrumb-header">
        <a href="/archive" className="breadcrumb-link">
          Archived
        </a>
        <div className="breadcrumb-separator">
          <img src={imgVector3} alt="" />
        </div>
        <p className="breadcrumb-current">Untitled Publication</p>
      </div>

      {/* Main Content */}
      <div className="publication-content">
        {/* Publication Header Section */}
        <div className="publication-header">
          <div className="publication-image">
            <img src={imgFrame69} alt="Publication cover" />
          </div>
          <div className="publication-info">
            <div className="publication-title-section">
              <h1 className="publication-title">Untitled Publication</h1>
              <p className="publication-author">Author Name(s)</p>
              <div className="publication-description">
                <p className="description-text">
                  {isExpanded
                    ? fullDescription
                    : `${fullDescription.slice(0, 153)}...`}
                </p>
                <div className="read-more-link" onClick={toggleReadMore}>
                  <p>{isExpanded ? 'Read Less' : 'Read More'}</p>
                  <div
                    className="read-more-arrow"
                    style={{
                      transform: isExpanded
                        ? 'rotate(90deg)'
                        : 'rotate(270deg)',
                    }}
                  >
                    <img src={imgFluentIosArrow24Filled} alt="" />
                  </div>
                </div>
              </div>
            </div>

            <MetadataRow
              label="Genre"
              tags={[
                { label: 'Fantasy', className: 'tag-fantasy' },
                { label: 'Science Fiction', className: 'tag-science-fiction' },
                { label: 'Mystery', className: 'tag-mystery' },
              ]}
            />

            <MetadataRow
              label="Theme"
              tags={[
                { label: 'Short Stories', className: 'tag-neutral' },
                { label: 'Creative Writing', className: 'tag-neutral' },
              ]}
            />

            <MetadataRowSingle label="Program" value="YLAB" />
            <MetadataRowSingle label="Publishing Permission" value="All" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <TabButton
            id="publications"
            label="Publications"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="assets"
            label="Assets"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="production-details"
            label="Production Details"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="inventory"
            label="Inventory"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'publications' && (
          <div className="tab-content">
            {publicationDetails.map((detail, index) => (
              <DetailRow
                key={index}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="assets-content">
            <div className="assets-filters">
              <div className="filter-badge filter-active">Program Files</div>
              <div className="filter-badge">Design Files</div>
              <div className="filter-badge">
                OMCHAI + Tracker
                <img src={imgOuiPopout} alt="" className="filter-icon" />
              </div>
            </div>
            <div className="assets-table">
              <div className="assets-table-header">
                <div className="table-header-left">
                  <span>Name</span>
                  <img src={imgFluentMdl2SortUp} alt="" className="sort-icon" />
                </div>
                <div className="table-header-right">
                  <span>File Type</span>
                  <span>Size</span>
                </div>
              </div>
              <div className="assets-table-body">
                {assets.map((asset, index) => (
                  <AssetRow
                    key={index}
                    name={asset.name}
                    type={asset.type}
                    size={asset.size}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'production-details' && (
          <div className="tab-content">
            <DetailRowStatus />
            <DetailRowSponsors />
            {productionDetails.map((detail, index) => (
              <DetailRow
                key={index}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="tab-content">
            {inventoryItems.map((item, index) => (
              <DetailRow key={index} label={item.label} value={item.value} />
            ))}
            <DetailRowLink
              label="Projects"
              linkText="FY25 Publications Archived"
            />
            <DetailRow label="Individual Pieces" value="Empty" />
            <DetailRow label="Place" value="Empty" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationView;
