import React, { useState, useMemo } from 'react';

// --- Shared Icon Definitions (Duplicated for standalone functionality) ---
const Icon = ({ path, className = 'w-5 h-5', style = {} }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        {path}
    </svg>
);
const WrenchIcon = (props) => <Icon {...props} path={<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-5.6-5.6a6 6 0 0 1 7.94-7.94l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6z" />} />;
const HomeIcon = (props) => <Icon {...props} path={<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>} />;

// --- Global Data (Source of Truth - Duplicated for Admin-only context) ---
// NOTE: In a real app, this would be an API call to fetch/update data.
const initialProducts = [
    { id: 1, name: "Hybrid Tomato Seeds", category: "Seeds", price: 15.00, inventory: 50, description: "High-yield, disease-resistant variety, perfect for commercial growth.", image: "🍅" },
    { id: 2, name: "Soil pH Tester Kit", category: "Tools", price: 35.50, inventory: 12, description: "Accurate digital pH and moisture reading for perfect soil management.", image: "🧪" },
    { id: 3, name: "Organic NPK Fertilizer", category: "Fertilizer", price: 49.99, inventory: 30, description: "Balanced 10-10-10 blend for all-purpose crop nutrition.", image: "🌱" },
    { id: 4, name: "Precision Pruning Shears", category: "Tools", price: 22.00, inventory: 45, description: "Ergonomic design for clean, fast cuts to promote plant health.", image: "✂️" },
    { id: 5, name: "Drip Irrigation Line (100m)", category: "Tools", price: 89.00, inventory: 5, description: "Efficient water delivery system, minimizes waste and labor.", image: "💧" },
    { id: 6, name: "High-Protein Maize Seeds", category: "Seeds", price: 18.50, inventory: 80, description: "Drought-tolerant maize with exceptional nutritional value.", image: "🌽" },
    { id: 7, name: "Potassium Sulfate (50kg Bag)", category: "Fertilizer", price: 65.00, inventory: 20, description: "Boosts fruit quality and disease resistance in fruit crops.", image: "🔬" },
    { id: 8, name: "Pest-Resistant Bean Seeds", category: "Seeds", price: 12.00, inventory: 100, description: "Heirloom variety naturally resilient against common pests.", image: "🫘" },
];

const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

// --- Color Palette (Defined first to prevent ReferenceError) ---
const COLORS = {
    lime900: '#064e3b',
    lime700: '#4d7c0f',
    lime600: '#65a30d',
    lime500: '#84cc16',
    lime400: '#a3e635',
    gray900: '#0a0a0a',
    gray800: '#1f2937',
    gray700: '#374151',
    gray600: '#4b5563',
    gray400: '#9ca3af',
    white: '#ffffff',
};

// --- Inline Styles (CSS-in-JS) ---
// IMPORTANT: These styles rely on the COLORS object, defined above.
const styles = {
    // Colors (Reference only)
    ...COLORS,

    // Utility Styles
    appContainer: {
        backgroundColor: COLORS.gray900,
        minHeight: '100vh',
        padding: '1rem',
        fontFamily: 'sans-serif',
        color: COLORS.white,
    },
    header: {
        backgroundColor: COLORS.lime700,
        color: COLORS.white,
        padding: '1rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    card: {
        backgroundColor: COLORS.gray800,
        color: COLORS.white,
        padding: '1rem',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${COLORS.gray700}`,
    },
    inputAdmin: {
        width: '100%',
        padding: '0.5rem',
        borderRadius: '0.3rem',
        backgroundColor: COLORS.gray700,
        color: COLORS.white,
        border: `1px solid ${COLORS.gray600}`,
        outline: 'none',
    },
    buttonPrimaryBase: {
        backgroundColor: COLORS.lime600,
        color: COLORS.gray900,
        padding: '0.75rem',
        borderRadius: '0.5rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        boxShadow: `0 4px 6px -1px ${COLORS.lime600}4D`,
        transition: 'background-color 0.2s, box-shadow 0.2s',
    },
    buttonSecondaryBase: {
        color: COLORS.gray400,
        backgroundColor: 'transparent',
        padding: '0.75rem',
        marginTop: '1rem',
        cursor: 'pointer',
        textDecoration: 'none',
        border: 'none',
        display: 'block',
        textAlign: 'center',
        transition: 'color 0.2s',
    },
    scrollableArea: {
        maxHeight: 'calc(100vh - 20rem)',
        overflowY: 'auto',
        paddingRight: '1rem',
    }
};

// --- Custom Hook for Button Hover States (Must be defined here for use) ---
const useButtonStyles = (baseStyle, hoverStyle) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const style = {
        ...baseStyle,
        ...(isHovered ? hoverStyle.hover : {}),
        ...(isActive ? hoverStyle.active : {})
    };

    return {
        style,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => {
            setIsHovered(false);
            setIsActive(false);
        },
        onMouseDown: () => setIsActive(true),
        onMouseUp: () => setIsActive(false),
    };
};


// --- Admin Page Component ---
const AdminPage = ({ setPage }) => {
    // Local state for the Admin Page, initialized with mock data for demonstration
    const [editedProducts, setEditedProducts] = useState(initialProducts);

    // --- Safety Check for setPage ---
    // In case this component is rendered outside the intended App context.
    const navigateToStore = () => {
        if (typeof setPage === 'function') {
            setPage('store');
        } else {
            console.error("Navigation Error: setPage function is not available.");
            // Fallback for isolated testing/deployment environment
            alert("Simulated navigation back to store.");
        }
    };

    // Handlers
    const handleInputChange = (id, field, value) => {
        setEditedProducts(prev => prev.map(p => {
            if (p.id === id) {
                // Parse numbers, keep other fields as strings
                return {
                    ...p,
                    [field]: field === 'price' || field === 'inventory' ? parseFloat(value) || 0 : value
                };
            }
            return p;
        }));
    };

    const handleSave = () => {
        const isValid = editedProducts.every(p => p.price >= 0 && p.inventory >= 0);

        if (!isValid) {
            console.error("Error: Price and Inventory must be non-negative numbers.");
            return;
        }

        console.log("Product data successfully simulated and ready to save to database!");
        // Use the reinforced navigation function
        navigateToStore();
    };

    // Button Styles
    const baseSaveStyle = {
        ...styles.buttonPrimaryBase,
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        alignSelf: 'flex-end',
        marginTop: '1rem'
    };
    const hoverSaveStyles = {
        hover: { backgroundColor: styles.lime700 },
        active: { backgroundColor: styles.lime900, transform: 'scale(0.98)' }
    };
    const { style: saveStyle, ...saveHandlers } = useButtonStyles(baseSaveStyle, hoverSaveStyles);

    const baseBackStyle = {
        ...styles.buttonSecondaryBase,
        color: styles.gray400,
        padding: '0.75rem 1.5rem',
        margin: 0,
        fontSize: '1rem',
        border: `1px solid ${styles.gray700}`,
    };
    const hoverBackStyles = {
        hover: { color: styles.white, backgroundColor: styles.gray700 },
        active: { backgroundColor: styles.gray600 }
    };
    const { style: backStyle, ...backHandlers } = useButtonStyles(baseBackStyle, hoverBackStyles);

    // Render Header (copied for standalone context, simplified)
    const renderHeader = (title) => (
        <header style={{ ...styles.header, backgroundColor: styles.gray800, marginBottom: '1rem', borderBottom: `2px solid ${styles.lime600}` }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', color: styles.lime400 }}>
                <WrenchIcon style={{ width: '2rem', height: '2rem', marginRight: '0.75rem' }} /> {title}
            </h1>
            {/* Use the reinforced navigation function */}
            <button onClick={navigateToStore} style={{ ...styles.buttonSecondaryBase, color: styles.white, padding: '0.5rem', margin: 0, display: 'flex', alignItems: 'center' }}>
                <HomeIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} /> Go to Store
            </button>
        </header>
    );

    return (
        <div style={styles.appContainer}>
            {renderHeader("Agri-Tech Admin Panel")}
            <div style={{ width: '100%', maxWidth: '75rem', margin: '0 auto', padding: '1rem 0' }}>
                <div style={{ ...styles.card, backgroundColor: styles.gray800, padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: styles.lime500 }}>Product Inventory Management</h3>
                    </div>

                    <div style={styles.scrollableArea}>
                        {/* Table Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5rem 2fr 1fr 1fr 1fr', gap: '0.5rem', padding: '0.75rem 0', fontWeight: 'bold', borderBottom: `2px solid ${styles.gray600}`, color: styles.gray400, fontSize: '0.875rem' }}>
                            <div style={{ alignSelf: 'center' }}>#</div>
                            <div>Product Name</div>
                            <div>Category</div>
                            <div>Price ($)</div>
                            <div>Inventory</div>
                        </div>

                        {/* Table Rows */}
                        {editedProducts.map((p, index) => (
                            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.5rem 2fr 1fr 1fr 1fr', gap: '0.5rem', padding: '0.75rem 0', borderBottom: `1px solid ${styles.gray700}`, alignItems: 'center', fontSize: '0.875rem' }}>
                                <div style={{ alignSelf: 'center', color: styles.gray400 }}>{index + 1}</div>
                                <div style={{ fontWeight: '500', color: styles.white }}>{p.name}</div>
                                <div style={{ color: styles.gray400 }}>{p.category}</div>

                                {/* Editable Price */}
                                <input
                                    type="number"
                                    value={p.price}
                                    onChange={(e) => handleInputChange(p.id, 'price', e.target.value)}
                                    style={styles.inputAdmin}
                                    min="0"
                                />

                                {/* Editable Inventory */}
                                <input
                                    type="number"
                                    value={p.inventory}
                                    onChange={(e) => handleInputChange(p.id, 'inventory', e.target.value)}
                                    style={styles.inputAdmin}
                                    min="0"
                                    step="1"
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button onClick={handleSave} style={saveStyle} {...saveHandlers}>
                            Save All Changes (Simulated)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
