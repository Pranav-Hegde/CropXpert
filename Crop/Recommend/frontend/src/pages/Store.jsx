import React, { useState, useMemo, useEffect } from 'react';

// =====================================================================
// --- GLOBAL DATA STORE (Simulated Database) ---
// Note: This data is intentionally mutable and global for cross-component sync.
// =====================================================================

let products = [
    { id: 1, name: "Hybrid Tomato Seeds", category: "Seeds", price: 15.00, inventory: 50, description: "High-yield, disease-resistant variety, perfect for commercial growth.", image: "🍅" },
    { id: 2, name: "Soil pH Tester Kit", category: "Tools", price: 35.50, inventory: 12, description: "Accurate digital pH and moisture reading for perfect soil management.", image: "🧪" },
    { id: 3, name: "Organic NPK Fertilizer", category: "Fertilizer", price: 49.99, inventory: 30, description: "Balanced 10-10-10 blend for all-purpose crop nutrition.", image: "🌱" },
    { id: 4, name: "Precision Pruning Shears", category: "Tools", price: 22.00, inventory: 45, description: "Ergonomic design for clean, fast cuts to promote plant health.", image: "✂️" },
    { id: 5, name: "Drip Irrigation Line (100m)", category: "Tools", price: 89.00, inventory: 5, description: "Efficient water delivery system, minimizes waste and labor.", image: "💧" },
    { id: 6, name: "High-Protein Maize Seeds", category: "Seeds", price: 18.50, inventory: 80, description: "Drought-tolerant maize with exceptional nutritional value.", image: "🌽" },
    { id: 7, name: "Potassium Sulfate (50kg Bag)", category: "Fertilizer", price: 65.00, inventory: 20, description: "Boosts fruit quality and disease resistance in fruit crops.", image: "🔬" },
    { id: 8, name: "Pest-Resistant Bean Seeds", category: "Seeds", price: 12.00, inventory: 100, description: "Heirloom variety naturally resilient against common pests.", image: "🫘" },
];

let globalOrders = [];
let refreshKey = 0; // Signals product changes (inventory/price)
let ordersRefreshKey = 0; // Signals order status/date changes

// Global Accessors
const globalGetProducts = () => products;
const globalGetOrders = () => globalOrders;
const globalGetRefreshKey = () => refreshKey;
const globalGetOrdersRefreshKey = () => ordersRefreshKey;

// Global Mutators
const globalSetProducts = (newProducts) => {
    products = JSON.parse(JSON.stringify(newProducts));
};

const globalAddOrder = (order) => {
    // Add new order to the start of the list (most recent first)
    globalOrders = [{
        ...order,
        status: 'Pending',
        expectedDate: 'TBD'
    }, ...globalOrders];
    ordersRefreshKey += 1;
};

const globalUpdateOrder = (orderId, updates) => {
    const orderIndex = globalOrders.findIndex(o => o.orderId === orderId);
    if (orderIndex !== -1) {
        globalOrders[orderIndex] = { ...globalOrders[orderIndex], ...updates };
        ordersRefreshKey += 1;
        // NOTE: We no longer console.log the refresh key here to avoid console noise.
    }
};

const globalIncrementRefreshKey = () => {
    refreshKey += 1;
};

// =====================================================================
// --- ICON AND UTILITY DEFINITIONS ---
// =====================================================================
const Icon = ({ path, style = {} }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        {path}
    </svg>
);

const ShoppingCartIcon = (props) => <Icon {...props} path={<><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.5 2h2.25L7 9h14l-2 7H5.25z" /></>} />;
const SeedIcon = (props) => <Icon {...props} path={<><path d="M10.82 2.189c-.6-.628-1.57-.7-2.25-.17l-3.32 2.5a1.5 1.5 0 0 0-.25 2.11l1.76 2.5A6.002 6.002 0 0 0 12.33 13h1.34a2 2 0 0 0 2-2V9.33a6.002 6.002 0 0 0-4.04-5.64l-2.5-1.76a1.5 1.5 0 0 0-2.11.25z" /><path d="M16.5 10c0 4.142-3.358 7.5-7.5 7.5S1.5 14.142 1.5 10" /><path d="M12 17c0 4.142-3.358 7.5-7.5 7.5S18.5 24.142 18.5 20" /></>} />;
const HomeIcon = (props) => <Icon {...props} path={<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>} />;
const CheckCircleIcon = (props) => <Icon {...props} path={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></>} />;
const SettingsIcon = (props) => <Icon {...props} path={<><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" /><path d="M12 14V10" /></>} />;
const TrendingUpIcon = (props) => <Icon {...props} path={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>} />;
const ListOrderedIcon = (props) => <Icon {...props} path={<><line x1="10" x2="21" y1="6" y2="6" /><line x1="10" x2="21" y1="12" y2="12" /><line x1="10" x2="21" y1="18" y2="18" /><path d="M4 6h1" /><path d="M4 12h1" /><path d="M4 18h1" /></>} />;
const UserIcon = (props) => <Icon {...props} path={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />;
const TruckIcon = (props) => <Icon {...props} path={<><path d="M1 21h22v-3H1z" /><path d="M4 17V7h4v10H4z" /><path d="M22 17V7h-4v10h4z" /><path d="M8 17h8V7H8v10z" /></>} />;

const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
const generateOrderId = () => `AGRI-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

// --- Inline Styles (CSS-in-JS) ---
const styles = {
    // Colors
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
    red600: '#dc2626',
    blue600: '#2563eb',
    green600: '#059669',

    // Utility Styles
    appContainer: {
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        padding: '1rem',
        fontFamily: 'sans-serif',
        color: '#ffffff',
    },
    header: {
        backgroundColor: '#4d7c0f',
        color: '#ffffff',
        padding: '1rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    adminHeader: {
        backgroundColor: '#b91c1c',
        color: '#ffffff',
        padding: '1rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    card: {
        backgroundColor: '#1f2937',
        color: '#f9fafb',
        padding: '1rem',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        border: '1px solid #374151',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        backgroundColor: '#374151',
        color: '#ffffff',
        border: '1px solid #4b5563',
        outline: 'none',
    },
    buttonPrimaryBase: {
        backgroundColor: '#65a30d',
        color: '#0a0a0a',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(101, 163, 13, 0.3)',
        transition: 'background-color 0.2s, box-shadow 0.2s, transform 0.1s',
    },
    scrollableArea: {
        maxHeight: '15rem',
        overflowY: 'auto',
        paddingRight: '0.5rem',
    },
    // NEW STYLE FOR ADMIN SWITCH BUTTON
    adminSwitchLink: {
        color: '#a3e635', // Lime text
        backgroundColor: 'transparent',
        padding: '0.5rem 0',
        marginTop: '1rem',
        cursor: 'pointer',
        border: 'none',
        display: 'block',
        textAlign: 'center',
        textDecoration: 'underline',
        fontSize: '0.9rem',
        transition: 'color 0.2s',
    }
};

// --- Custom Hook for Button Hover States ---
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


// --- USER LOGIN COMPONENT (MODIFIED) ---
const UserLogin = ({ setMode, setUserId }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const hoverStyles = {
        hover: { backgroundColor: styles.lime700, boxShadow: '0 8px 15px -3px rgba(77, 124, 15, 0.5)' },
        active: { backgroundColor: styles.lime900, transform: 'scale(0.98)' }
    };
    const { style: buttonStyle, ...buttonHandlers } = useButtonStyles({ ...styles.buttonPrimaryBase, marginTop: '1.5rem', width: '100%' }, hoverStyles);

    // Style for the Admin switch link
    const adminLinkHoverStyles = {
        hover: { color: styles.lime500 },
        active: { color: styles.lime600 }
    };
    const { style: adminLinkStyle, ...adminLinkHandlers } = useButtonStyles(styles.adminSwitchLink, adminLinkHoverStyles);


    const handleSubmit = (e) => {
        e.preventDefault();
        // Authentication Logic (Simulated: Any non-empty credentials work for user login)
        if (username.trim() && password.trim()) {
            // Use the username as the unique user ID for tracking orders
            const simulatedUserId = 'user-' + username.trim().toLowerCase();
            setUserId(simulatedUserId);
            setMode('user');
            setError('');
        } else {
            setError(`Username and Password cannot be empty.`);
        }
    };

    return (
        <div style={{ ...styles.appContainer, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ ...styles.card, maxWidth: '25rem', padding: '2rem', backgroundColor: styles.gray800 }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <UserIcon style={{ width: '3rem', height: '3rem', color: styles.lime400 }} />
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: styles.white, marginTop: '0.5rem' }}>Customer Login</h2>
                    <p style={{ color: styles.gray400, fontSize: '0.875rem' }}>Enter any non-empty credentials to create a session and start shopping.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: styles.gray300, display: 'block', marginBottom: '0.25rem' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            placeholder="e.g., JaneDoe"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: styles.gray300, display: 'block', marginBottom: '0.25rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="Your Secret Password"
                            required
                        />
                    </div>
                    {error && (
                        <p style={{ color: styles.red600, fontSize: '0.875rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>
                    )}
                    <button type="submit" style={buttonStyle} {...buttonHandlers}>
                        <UserIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Access Store
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('adminLogin')}
                        style={adminLinkStyle}
                        {...adminLinkHandlers}
                    >
                        Are you an Admin?
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- USER ORDERS PAGE ---
const UserOrdersPage = ({ userId, setPage }) => {
    const [orders, setOrders] = useState(globalGetOrders());
    const [orderKey, setOrderKey] = useState(globalGetOrdersRefreshKey());

    // Poll for order status updates from Admin
    useEffect(() => {
        const syncOrders = () => {
            const globalKey = globalGetOrdersRefreshKey();
            if (globalKey !== orderKey) {
                setOrders(globalGetOrders());
                setOrderKey(globalKey);
            }
        };
        const intervalId = setInterval(syncOrders, 1000);
        return () => clearInterval(intervalId);
    }, [orderKey]);

    const userOrders = useMemo(() => orders.filter(o => o.userId === userId), [orders, userId]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Shipped': return { color: styles.green600, fontWeight: 'bold' };
            case 'Canceled': return { color: styles.red600, fontWeight: 'bold' };
            default: return { color: styles.blue600, fontWeight: 'bold' };
        }
    };

    return (
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 0' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: styles.lime400, marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <ListOrderedIcon style={{ width: '2rem', height: '2rem', marginRight: '0.5rem' }} /> Your Order History ({userOrders.length})
            </h2>

            <button
                onClick={() => setPage('store')}
                style={{ ...styles.buttonPrimaryBase, backgroundColor: styles.gray700, color: styles.white, padding: '0.5rem 1rem', marginBottom: '1rem' }}
            >
                ← Back to Store
            </button>

            {userOrders.length === 0 ? (
                <div style={{ ...styles.card, padding: '2rem', textAlign: 'center', color: styles.gray400 }}>
                    You haven't placed any orders yet.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {userOrders.map(order => (
                        <div key={order.orderId} style={{ ...styles.card, backgroundColor: styles.gray800, padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${styles.gray700}`, paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                                <div>
                                    <span style={{ fontWeight: '600', color: styles.gray400, fontSize: '0.875rem', display: 'block' }}>Order ID: {order.orderId}</span>
                                    <span style={{ fontWeight: 'bold', color: styles.lime400, fontSize: '1.5rem' }}>{formatCurrency(order.totalPrice)}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: '600', color: styles.gray400, fontSize: '0.875rem', display: 'block' }}>Status:</span>
                                    <span style={{ ...getStatusStyle(order.status), fontSize: '1.25rem' }}>{order.status}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: '600', color: styles.gray400, display: 'block' }}>Expected Delivery:</span>
                                    <span style={{ color: order.status === 'Shipped' ? styles.green600 : styles.white, fontWeight: 'bold' }}>
                                        {order.expectedDate === 'TBD' ? 'Date Pending' : order.expectedDate}
                                    </span>
                                </div>
                                <details style={{ cursor: 'pointer', color: styles.lime400, fontSize: '0.9rem' }}>
                                    <summary>View Items ({order.cart.length})</summary>
                                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem', color: styles.gray400 }}>
                                        {order.cart.map(item => (
                                            <li key={item.id}>
                                                {item.quantity}x {item.name}
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- ADMIN MAIN COMPONENT ---
const Admin = ({ switchMode }) => {
    const [localProducts, setLocalProducts] = useState(globalGetProducts());
    const [orders, setOrders] = useState(globalGetOrders());
    const [activeTab, setActiveTab] = useState('inventory');

    // Sync state for local product edits
    useEffect(() => {
        setLocalProducts(globalGetProducts());
    }, [activeTab]);

    // Sync state for orders (needed after user places an order)
    useEffect(() => {
        if (activeTab === 'orders') {
            // Update local orders list whenever the tab is selected or the key changes
            setOrders(globalGetOrders());
        }
        // Since globalGetOrders doesn't depend on ordersRefreshKey, we don't need it in deps, 
        // but calling setOrders(globalGetOrders()) on tab switch is sufficient.
    }, [activeTab]);


    // INVENTORY MANAGEMENT HANDLERS
    const handleProductChange = (id, field, value) => {
        setLocalProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === id ? { ...p, [field]: value } : p
            )
        );
    };
    const handleSaveChanges = () => {
        globalSetProducts(localProducts);
        globalIncrementRefreshKey();
        alert('Product inventory and prices saved and synchronized!');
    };

    // ORDER MANAGEMENT HANDLER (FIXED)
    const handleOrderUpdate = (orderId, field, value) => {
        let finalValue = value;
        // Logic to handle empty date input
        if (field === 'expectedDate' && !value) {
            finalValue = 'TBD';
        }

        const updates = { [field]: finalValue };

        // 1. Update the global store (which triggers the refresh key update)
        globalUpdateOrder(orderId, updates);

        // 2. Update the local admin view immediately to reflect the change
        setOrders(prevOrders => prevOrders.map(o =>
            o.orderId === orderId ? { ...o, [field]: finalValue } : o
        ));
    };

    const headerStyle = { ...styles.card, backgroundColor: styles.gray700, padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', color: styles.lime400 };
    const orderHeaderStyle = { ...styles.card, backgroundColor: styles.gray700, padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1.5fr 0.5fr', gap: '1rem', fontWeight: 'bold', fontSize: '0.875rem', color: styles.lime400 };

    const renderInventory = () => (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: styles.lime400 }}>Product Inventory Management 🛠️</h2>
                <button
                    onClick={handleSaveChanges}
                    style={{ ...styles.buttonPrimaryBase, backgroundColor: '#059669', color: styles.white, padding: '0.5rem 1rem', fontSize: '1rem' }}
                >
                    <TrendingUpIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Global Save & Sync
                </button>
            </div>
            <div style={headerStyle}>
                <span>ID / Name</span>
                <span style={{ textAlign: 'right' }}>Category</span>
                <span style={{ textAlign: 'center' }}>Price</span>
                <span style={{ textAlign: 'center' }}>Inventory</span>
                <span>Action</span>
            </div>
            <div style={{ ...styles.scrollableArea, maxHeight: 'calc(100vh - 280px)', paddingRight: '0.5rem' }}>
                {localProducts.map(product => (
                    <div key={product.id} style={{ ...styles.card, backgroundColor: styles.gray800, margin: '0.5rem 0', padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'center' }}>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold', color: styles.white }}>{product.id}. {product.name}</span>
                            <span style={{ fontSize: '0.75rem', color: styles.gray400 }}>{product.image} {product.description.substring(0, 30)}...</span>
                        </div>
                        <span style={{ textAlign: 'right', color: styles.gray300 }}>{product.category}</span>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ marginRight: '0.25rem', color: styles.lime400 }}>$</span>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={product.price.toFixed(2)}
                                onChange={(e) => handleProductChange(product.id, 'price', parseFloat(e.target.value))}
                                style={{ ...styles.input, padding: '0.4rem', fontSize: '0.9rem', width: 'auto', minWidth: '80px', textAlign: 'center' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <input
                                type="number"
                                min="0"
                                value={product.inventory}
                                onChange={(e) => handleProductChange(product.id, 'inventory', parseInt(e.target.value))}
                                style={{ ...styles.input, padding: '0.4rem', fontSize: '0.9rem', width: 'auto', minWidth: '80px', textAlign: 'center' }}
                            />
                        </div>

                        <button
                            onClick={handleSaveChanges}
                            style={{ ...styles.buttonPrimaryBase, backgroundColor: '#65a30d', color: styles.gray900, padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                        >
                            Save
                        </button>
                    </div>
                ))}
            </div>
        </>
    );

    const renderOrders = () => (
        <>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: styles.lime400, marginBottom: '1rem' }}>Customer Orders (Total: {orders.length}) 📦</h2>

            <div style={orderHeaderStyle}>
                <span>Order ID / Total</span>
                <span>Customer Info</span>
                <span>Status</span>
                <span>Expected Date</span>
                <span>Items</span>
            </div>
            <div style={{ ...styles.scrollableArea, maxHeight: 'calc(100vh - 280px)', paddingRight: '0.5rem' }}>
                {orders.length === 0 ? (
                    <p style={{ textAlign: 'center', color: styles.gray400, padding: '2rem' }}>No orders have been placed yet.</p>
                ) : (
                    orders.map((order, index) => (
                        <div key={order.orderId} style={{ ...styles.card, backgroundColor: styles.gray800, margin: '0.5rem 0', padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1.5fr 0.5fr', gap: '1rem', alignItems: 'center', border: `1px solid ${order.status === 'Shipped' ? styles.green600 : order.status === 'Canceled' ? styles.red600 : styles.blue600}` }}>

                            {/* Order ID / Total */}
                            <div>
                                <span style={{ fontWeight: 'bold', color: styles.white, display: 'block' }}>{order.orderId}</span>
                                <span style={{ color: styles.lime400, fontWeight: 'bold', fontSize: '1.125rem' }}>{formatCurrency(order.totalPrice)}</span>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <span style={{ fontWeight: '600', color: styles.white, display: 'block', fontSize: '0.9rem' }}>{order.name}</span>
                                <span style={{ fontSize: '0.75rem', color: styles.gray400 }}>{order.address.split('\n')[0]}...</span>
                            </div>

                            {/* Status Management */}
                            <div>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleOrderUpdate(order.orderId, 'status', e.target.value)}
                                    style={{ ...styles.input, backgroundColor: styles.gray700, padding: '0.5rem', width: '100%', fontSize: '0.9rem', color: styles.white }}
                                >
                                    <option value="Pending">Pending (Default)</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Canceled">Canceled</option>
                                </select>
                            </div>

                            {/* Expected Date Management */}
                            <div>
                                <input
                                    type="date"
                                    // Handle 'TBD' case for input[type="date"] by setting value to empty string
                                    value={order.expectedDate === 'TBD' ? '' : order.expectedDate}
                                    // Use 'expectedDate' as the field name
                                    onChange={(e) => handleOrderUpdate(order.orderId, 'expectedDate', e.target.value)}
                                    style={{ ...styles.input, backgroundColor: styles.gray700, padding: '0.5rem', width: '100%', fontSize: '0.9rem', color: styles.white }}
                                />
                            </div>

                            {/* Items Summary */}
                            <details style={{ cursor: 'pointer', color: styles.lime400, fontSize: '0.8rem', textAlign: 'center' }}>
                                <summary>Items</summary>
                                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem', color: styles.gray400, textAlign: 'left' }}>
                                    {order.cart.map(item => (
                                        <li key={item.id}>
                                            {item.quantity}x
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </div>
                    ))
                )}
            </div>
        </>
    );

    return (
        <div style={{ ...styles.appContainer, backgroundColor: styles.gray900 }}>
            <header style={styles.adminHeader}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', color: styles.white }}>
                    <SettingsIcon style={{ width: '2rem', height: '2rem', marginRight: '0.75rem', color: '#f87171' }} /> Admin Panel
                </h1>
                <button
                    onClick={() => { switchMode('userLogin'); }}
                    style={{ ...styles.buttonPrimaryBase, color: styles.white, padding: '0.5rem 1rem', margin: 0, backgroundColor: '#991b1c', borderRadius: '0.5rem' }}
                >
                    → Logout
                </button>
            </header>

            <div style={{ maxWidth: '75rem', margin: '0 auto' }}>
                {/* Tab Navigation */}
                <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem', backgroundColor: activeTab === 'inventory' ? styles.lime600 : styles.gray700, color: activeTab === 'inventory' ? styles.gray900 : styles.white }}
                    >
                        <TrendingUpIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Inventory
                    </button>
                    <button
                        onClick={() => { setActiveTab('orders'); setOrders(globalGetOrders()); }}
                        style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem', backgroundColor: activeTab === 'orders' ? styles.lime600 : styles.gray700, color: activeTab === 'orders' ? styles.gray900 : styles.white }}
                    >
                        <ListOrderedIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Orders
                    </button>
                </div>

                {activeTab === 'inventory' ? renderInventory() : renderOrders()}
            </div>
        </div>
    );
};
// --- END ADMIN MAIN COMPONENT ---


// --- ADMIN LOGIN COMPONENT (FIXED) ---
const AdminLogin = ({ setMode, setIsAdminAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const hoverStyles = {
        hover: { backgroundColor: '#991b1b', boxShadow: '0 8px 15px -3px rgba(153, 27, 27, 0.5)' },
        active: { backgroundColor: '#7f1d1d', transform: 'scale(0.98)' }
    };
    const { style: buttonStyle, ...buttonHandlers } = useButtonStyles({ ...styles.buttonPrimaryBase, backgroundColor: styles.red600, color: styles.white, marginTop: '1.5rem', width: '100%' }, hoverStyles);

    // Style for the User switch link
    const userLinkHoverStyles = {
        hover: { color: styles.gray400 },
        active: { color: styles.gray600 }
    };
    const { style: userLinkStyle, ...userLinkHandlers } = useButtonStyles(styles.adminSwitchLink, userLinkHoverStyles);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            // 1. Set Auth state
            setIsAdminAuthenticated(true);
            // 2. Explicitly set mode to 'admin' to trigger navigation in App's render logic
            setMode('admin');
            setError('');
        } else {
            setError('Invalid credentials. Use user: admin, password: admin123');
        }
    };

    return (
        <div style={{ ...styles.appContainer, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ ...styles.card, maxWidth: '25rem', padding: '2rem', backgroundColor: styles.gray800 }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <SettingsIcon style={{ width: '3rem', height: '3rem', color: '#f87171' }} />
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: styles.white, marginTop: '0.5rem' }}>Admin Portal Login</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: styles.gray300, display: 'block', marginBottom: '0.25rem' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            placeholder="admin"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ color: styles.gray300, display: 'block', marginBottom: '0.25rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="admin123"
                            required
                        />
                    </div>
                    {error && (
                        <p style={{ color: styles.red600, fontSize: '0.875rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>
                    )}
                    <button type="submit" style={buttonStyle} {...buttonHandlers}>
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('userLogin')}
                        style={userLinkStyle}
                        {...userLinkHandlers}
                    >
                        Back to User Login
                    </button>
                </form>
            </div>
        </div>
    );
};
// --- END ADMIN LOGIN COMPONENT ---


// --- User App & Sub-components (ProductCard, Checkout, Confirmation) ---

const ProductCard = ({ product, addToCart }) => {
    const hoverButtonStyles = {
        hover: { backgroundColor: styles.lime700, boxShadow: '0 8px 15px -3px rgba(77, 124, 15, 0.5)' },
        active: { backgroundColor: styles.lime900, transform: 'scale(0.98)' }
    };
    const { style: buttonHoverStyle, ...buttonHandlers } = useButtonStyles(styles.buttonPrimaryBase, hoverButtonStyles);

    const isAvailable = product.inventory > 0;

    const cardStyle = {
        ...styles.card,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'box-shadow 0.3s',
    };

    const buttonStyle = {
        ...buttonHoverStyle,
        marginTop: '1rem',
        boxShadow: isAvailable ? styles.buttonPrimaryBase.boxShadow : 'none',
        backgroundColor: isAvailable ? buttonHoverStyle.backgroundColor : styles.gray600,
        color: isAvailable ? styles.gray900 : styles.gray400,
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        opacity: isAvailable ? 1 : 0.6,
    };

    return (
        <div style={cardStyle}>
            <div>
                <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.75rem' }}>{product.image}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: styles.lime400, marginBottom: '0.25rem' }}>{product.name}</h3>
                <p style={{ fontSize: '1.125rem', fontWeight: '600', color: styles.white, marginBottom: '0.5rem' }}>{formatCurrency(product.price)}</p>
                <p style={{ fontSize: '0.875rem', color: styles.gray400, marginBottom: '1rem' }}>{product.description}</p>
                <p style={{ fontSize: '0.75rem', color: styles.gray400 }}>Stock: {product.inventory}</p>
            </div>
            <button
                onClick={() => addToCart(product.id)}
                disabled={!isAvailable}
                style={buttonStyle}
                {...buttonHandlers}
            >
                {isAvailable ? "Add to Cart" : "Out of Stock"}
            </button>
        </div>
    );
};

const ConfirmationPage = ({ orderDetails, setPage }) => {
    const hoverButtonStyles = {
        hover: { backgroundColor: styles.lime700 },
        active: { backgroundColor: styles.lime900, transform: 'scale(0.98)' }
    };
    const { style: buttonStyle, ...buttonHandlers } = useButtonStyles(styles.buttonPrimaryBase, hoverButtonStyles);

    if (!orderDetails) {
        return <div style={{ textAlign: 'center', fontSize: '1.25rem', color: styles.red600, padding: '3rem 0' }}>Error: Order details missing.</div>;
    }

    const containerStyle = {
        ...styles.card,
        backgroundColor: styles.gray800,
        padding: '2rem',
        maxWidth: '48rem',
        margin: '2rem auto',
        border: `4px solid ${styles.lime600}`,
        textAlign: 'center',
    };

    const summaryStyle = {
        backgroundColor: styles.gray700,
        padding: '1.5rem',
        borderRadius: '0.5rem',
        textAlign: 'left',
        marginTop: '1.5rem',
    };

    return (
        <div style={{ width: '100%', maxWidth: '48rem', margin: '0 auto', padding: '2rem 0' }}>
            <div style={containerStyle}>
                <CheckCircleIcon style={{ width: '4rem', height: '4rem', margin: '0 auto', color: styles.lime400, marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: styles.white, marginBottom: '0.5rem' }}>Order Confirmed!</h2>
                <p style={{ fontSize: '1.125rem', color: styles.lime400, marginBottom: '1.5rem' }}>Thank you for stocking up your farm supplies.</p>

                <div style={summaryStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${styles.gray600}`, paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: styles.gray400, fontWeight: '500' }}>Order ID:</span>
                        <span style={{ fontWeight: '800', color: styles.white }}>{orderDetails.orderId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${styles.gray600}`, paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: styles.gray400, fontWeight: '500' }}>Grand Total:</span>
                        <span style={{ fontWeight: '800', color: styles.lime400, fontSize: '1.5rem' }}>{formatCurrency(orderDetails.totalPrice)}</span>
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <p style={{ fontSize: '0.875rem', color: styles.gray400, marginBottom: '1rem' }}>
                        Your order is currently **Pending**. Check your order history page for Admin updates on delivery status and expected date.
                    </p>
                    <button
                        onClick={() => setPage('store')}
                        style={{ ...buttonStyle, ...{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' } }}
                        {...buttonHandlers}
                    >
                        <HomeIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} /> Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

const CheckoutPage = ({ products, cart, totalPrice, setPage, confirmOrder }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formData, setFormData] = useState({ name: '', email: '', address: '' });

    const basePrimaryStyle = { ...styles.buttonPrimaryBase, width: '100%', fontSize: '1.25rem', padding: '1rem', boxShadow: `0 15px 30px -5px ${styles.lime400}66` };
    const hoverPrimaryStyles = { hover: { backgroundColor: styles.lime700, boxShadow: `0 15px 30px -5px ${styles.lime400}88` }, active: { backgroundColor: styles.lime900, transform: 'scale(0.98)' } };
    const { style: primaryStyle, ...primaryHandlers } = useButtonStyles(basePrimaryStyle, hoverPrimaryStyles);

    const baseSecondaryStyle = { ...styles.buttonPrimaryBase, color: styles.gray400, backgroundColor: 'transparent', marginTop: '0', boxShadow: 'none' };
    const hoverSecondaryStyles = { hover: { color: styles.lime400 }, active: { color: styles.lime500 } };
    const { style: secondaryStyle, ...secondaryHandlers } = useButtonStyles(baseSecondaryStyle, hoverSecondaryStyles);

    const cartItemsList = useMemo(() => {
        return Object.keys(cart).map(id => {
            const product = products.find(p => p.id === parseInt(id));
            if (product) { return { ...product, quantity: cart[id] }; }
            return null;
        }).filter(item => item && item.quantity > 0);
    }, [cart, products]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.address) {
            alert("Please fill in your full name, email, and shipping address to proceed.");
            return;
        }

        const details = {
            orderId: generateOrderId(),
            name: formData.name,
            email: formData.email,
            address: formData.address,
            paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card (Simulated)' : 'Net Banking / UPI (Simulated)',
            totalPrice: totalPrice,
            cart: cartItemsList
        };

        confirmOrder(details);
    };

    const formTitleStyle = { fontSize: '1.5rem', fontWeight: 'bold', color: styles.lime400, marginBottom: '1.5rem', display: 'flex', alignItems: 'center' };
    const sectionCardStyle = { ...styles.card, backgroundColor: styles.gray800, padding: '1.5rem', marginBottom: '1.5rem', border: `1px solid ${styles.gray700}` };
    const labelStyle = { display: 'flex', alignItems: 'center', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color 0.2s', };
    const inputTextStyle = { ...styles.input, backgroundColor: styles.gray700, border: `1px solid ${styles.gray600}`, color: styles.white, };


    return (
        <div style={{ width: '100%', maxWidth: '64rem', margin: '0 auto', padding: '2rem 0' }}>
            <h2 style={formTitleStyle}>
                <TruckIcon style={{ width: '1.75rem', height: '1.75rem', marginRight: '0.75rem' }} /> Billing & Checkout
            </h2>

            <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 1' }}>
                    <div style={sectionCardStyle}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: styles.white, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}> Shipping & Contact</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input type="text" name="name" placeholder="Full Name (for shipping)" value={formData.name} onChange={handleInputChange} required style={inputTextStyle} />
                                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required style={inputTextStyle} />
                            </div>
                            <textarea name="address" placeholder="Full Shipping Address" rows="3" value={formData.address} onChange={handleInputChange} required style={inputTextStyle}></textarea>
                        </div>
                    </div>
                </div>

                <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ ...styles.card, backgroundColor: styles.gray800, padding: '1.5rem', border: `2px solid ${styles.lime600}80`, height: 'min-content' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: styles.lime400 }}>Order Summary</h3>
                        <div style={{ ...styles.scrollableArea, maxHeight: '18rem', marginBottom: '1rem' }}>
                            {cartItemsList.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', borderBottom: `1px solid ${styles.gray700}`, paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ color: styles.gray400 }}>{item.name}</span>
                                    <span style={{ fontWeight: '500', color: styles.white }}>{item.quantity} x {formatCurrency(item.price)}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ paddingTop: '1rem', borderTop: `2px solid ${styles.lime600}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.25rem', paddingTop: '0.75rem' }}>
                                <span>GRAND TOTAL:</span>
                                <span style={{ color: styles.lime400 }}>{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" style={primaryStyle} {...primaryHandlers}>
                        Place Order – {formatCurrency(totalPrice)}
                    </button>
                    <button type="button" onClick={() => setPage('store')} style={secondaryStyle} {...secondaryHandlers}>
                        ← Back to Store
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- MAIN APPLICATION COMPONENT (FIXED) ---
const App = () => {
    // Mode: 'user' (store, checkout, orders), 'userLogin', 'admin', 'adminLogin'
    const [mode, setMode] = useState('userLogin');

    // User State
    const [userId, setUserId] = useState(null); // Set after successful user login
    const [page, setPage] = useState('store'); // user pages: 'store', 'checkout', 'confirmation', 'orders'

    // Admin State
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    // Global Data Sync States
    const [products, setProducts] = useState(globalGetProducts());
    const [refreshKey, setRefreshKey] = useState(globalGetRefreshKey());

    // Cart and Order State (MOVED UP FOR INITIALIZATION FIX)
    const [cart, setCart] = useState({});
    const [orderDetails, setOrderDetails] = useState(null);

    // Product Data Synchronization Effect (Polling for Admin changes)
    useEffect(() => {
        if (mode !== 'user' && mode !== 'admin') return;

        const syncData = () => {
            const globalKey = globalGetRefreshKey();
            if (globalKey !== refreshKey) {
                setProducts(globalGetProducts());
                setRefreshKey(globalKey);
            }
        };
        const intervalId = setInterval(syncData, 500);
        return () => clearInterval(intervalId);
    }, [refreshKey, mode]);


    const filteredProducts = useMemo(() => {
        if (!products || page !== 'store') return [];
        const categories = [{ "name": "All Products" }].concat(
            [{ name: "Seeds" }, { name: "Tools" }, { name: "Fertilizer" }]
        );
        const selectedCategory = categories.find(c => c.name === page.split(':')[1])?.name || "All Products";

        if (selectedCategory === "All Products") return products;
        return products.filter(p => p.category === selectedCategory);
    }, [page, products]);

    const { totalItems, totalPrice } = useMemo(() => {
        let items = 0;
        let price = 0;
        for (const id in cart) {
            const product = products.find(p => p.id === parseInt(id));
            if (product) {
                items += cart[id];
                price += cart[id] * product.price;
            }
        }
        return { totalItems: items, totalPrice: price };
    }, [cart, products]); // Now 'cart' is correctly initialized

    const handleConfirmOrder = (details) => {
        // 1. Log the order to the global store (for Admin), including User ID
        globalAddOrder({ ...details, userId: userId });

        // 2. Reduce product inventory globally
        const updatedProducts = products.map(p => {
            const cartItem = details.cart.find(item => item.id === p.id);
            if (cartItem) { return { ...p, inventory: p.inventory - cartItem.quantity }; }
            return p;
        });
        globalSetProducts(updatedProducts);
        globalIncrementRefreshKey(); // Sync new inventory to all users/admin

        setOrderDetails(details);
        setCart({});
        setPage('confirmation');
    }

    const addToCart = (id) => {
        const product = products.find(p => p.id === id);
        if (!product || product.inventory <= (cart[id] || 0)) return;
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    // Header component to simplify rendering
    const renderHeader = (title) => (
        <header style={styles.header}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center' }}>
                <SeedIcon style={{ width: '2rem', height: '2rem', marginRight: '0.75rem' }} /> {title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => setPage('orders')}
                    style={{ ...styles.buttonPrimaryBase, backgroundColor: styles.gray700, color: styles.white, padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                    <ListOrderedIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} /> My Orders
                </button>
                <button
                    onClick={() => { setUserId(null); setMode('userLogin'); }}
                    style={{ ...styles.buttonPrimaryBase, backgroundColor: styles.red600, color: styles.white, padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                    <UserIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.25rem' }} /> Logout
                </button>
            </div>
        </header>
    );

    // --- RENDER LOGIC ---

    if (mode === 'adminLogin') {
        return <AdminLogin setMode={setMode} setIsAdminAuthenticated={setIsAdminAuthenticated} />;
    }

    // FIX: Consolidate the Admin check into a single block to ensure proper fall-through.
    if (mode === 'admin') {
        if (!isAdminAuthenticated) {
            // Should not happen if setMode('admin') is only called from AdminLogin success,
            // but including it as a fallback safety measure.
            return <AdminLogin setMode={setMode} setIsAdminAuthenticated={setIsAdminAuthenticated} />;
        }
        return <Admin switchMode={setMode} />;
    }


    if (mode === 'userLogin' || !userId) {
        return <UserLogin setMode={setMode} setUserId={setUserId} />;
    }

    // --- User Mode Pages ---
    const userPageTitle = {
        'store': 'Agri-Tech Supply Store',
        'checkout': 'Agri-Tech Checkout',
        'confirmation': 'Order Confirmed',
        'orders': 'My Orders'
    }[page] || 'Agri-Tech Supply Store';

    if (page === 'checkout') {
        return (
            <div style={styles.appContainer}>
                {renderHeader(userPageTitle)}
                <CheckoutPage products={products} cart={cart} totalPrice={totalPrice} setPage={setPage} confirmOrder={handleConfirmOrder} />
            </div>
        );
    }

    if (page === 'confirmation') {
        return (
            <div style={styles.appContainer}>
                {renderHeader(userPageTitle)}
                <ConfirmationPage orderDetails={orderDetails} setPage={setPage} />
            </div>
        );
    }

    if (page === 'orders') {
        return (
            <div style={styles.appContainer}>
                {renderHeader(userPageTitle)}
                <UserOrdersPage userId={userId} setPage={setPage} />
            </div>
        );
    }

    // Default: 'store' view
    return (
        <div style={styles.appContainer}>
            {renderHeader(userPageTitle)}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Category Filter */}
                <div style={{ ...styles.card, backgroundColor: styles.gray800, padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    {[{ name: "All Products" }, { name: "Seeds" }, { name: "Tools" }, { name: "Fertilizer" }].map((cat) => {
                        const isSelected = page.split(':')[1] === cat.name || (page === 'store' && cat.name === 'All Products');
                        const buttonStyle = {
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? styles.lime600 : styles.gray700,
                            color: isSelected ? styles.gray900 : styles.gray200,
                            boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                        };
                        return (
                            <button
                                key={cat.name}
                                onClick={() => setPage(`store:${cat.name}`)}
                                style={buttonStyle}
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                </div>

                {/* Product Grid & Cart Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '80rem', margin: '0 auto', width: '100%' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} addToCart={addToCart} />
                        ))}
                    </div>

                    {/* Bottom Cart Summary (Fixed style removed, embedded in flow) */}
                    <div style={{ width: '100%', maxWidth: '20rem', margin: '0 auto', gridColumn: 'span 1' }}>
                        <div style={{ ...styles.card, backgroundColor: styles.gray800, padding: '1.25rem', border: `2px solid ${styles.lime600}80` }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: styles.lime400, display: 'flex', alignItems: 'center' }}>
                                <ShoppingCartIcon style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem', color: styles.lime400 }} /> Shopping Cart
                                <span style={{ marginLeft: 'auto', backgroundColor: styles.lime600, color: styles.gray900, fontSize: '0.75rem', fontWeight: '800', padding: '0.25rem 0.5rem', borderRadius: '9999px' }}>{totalItems}</span>
                            </h2>

                            {totalItems === 0 ? (
                                <p style={{ color: styles.gray400, fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>Your cart is empty. Start planting!</p>
                            ) : (
                                <>
                                    <div style={{ ...styles.scrollableArea, maxHeight: '15rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
                                        {Object.keys(cart).map(id => {
                                            const product = products.find(p => p.id === parseInt(id));
                                            const quantity = cart[id];
                                            if (!product) return null;
                                            return (
                                                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${styles.gray700}`, paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: '500', fontSize: '0.875rem', color: styles.white }}>{product.name}</span>
                                                        <span style={{ fontSize: '0.75rem', color: styles.gray400 }}>{formatCurrency(product.price)} x {quantity}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{ paddingTop: '1rem', borderTop: `2px solid ${styles.lime600}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem', color: styles.white }}>
                                            <span>Total:</span>
                                            <span style={{ color: styles.lime400 }}>{formatCurrency(totalPrice)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPage('checkout')}
                                        style={{ ...styles.buttonPrimaryBase, width: '100%', marginTop: '1rem', padding: '0.75rem', fontSize: '1rem', fontWeight: '800' }}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
