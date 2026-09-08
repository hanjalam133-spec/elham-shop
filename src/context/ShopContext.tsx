import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Category, DiscountCode, LandingPage, MenuItem } from '../types';
import { db, collection, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from '../lib/firebaseClient';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, size: CartItem['size'], quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isAdminLoggedIn: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  adminUsername: string;
  setAdminUsername: (username: string) => void;
  adminPassword: string;
  setAdminPassword: (password: string) => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  deleteMultipleProducts: (productIds: string[]) => Promise<void>;
  pixelId: string;
  setPixelId: (id: string) => void;
  pixelAccessToken: string;
  setPixelAccessToken: (token: string) => void;
  gtmId: string;
  setGtmId: (id: string) => void;
  courierService: string;
  setCourierService: (service: string) => void;
  courierApiKey: string;
  setCourierApiKey: (key: string) => void;
  courierSecretKey: string;
  setCourierSecretKey: (key: string) => void;
  orders: Order[];
  incompleteOrders: Order[];
  placeOrder: (orderData: any) => void;
  addOrUpdateIncompleteOrder: (id: string, orderData: any) => void;
  deleteIncompleteOrder: (id: string) => void;
  updateOrderStatus: (orderId: string, status: any) => void;
  updateOrderMetaSynced: (orderId: string, synced: boolean) => void;
  deleteOrder: (orderId: string) => void;
  blockedPhones: string[];
  blockPhone: (phone: string) => void;
  unblockPhone: (phone: string) => void;
  isPhoneBlocked: (phone: string) => boolean;
  enableDailyLimit: boolean;
  setEnableDailyLimit: (val: boolean) => void;
  whitelistedPhones: string[];
  whitelistPhone: (phone: string) => void;
  unwhitelistPhone: (phone: string) => void;
  isPhoneWhitelisted: (phone: string) => boolean;
  isDailyOrderLimitReached: (phone: string) => boolean;
  categories: Category[];
  addCategory: (category: Category) => void;
  deleteCategory: (category: Category) => void;
  categoryImages: Record<string, string[]>;
  setCategoryImage: (category: string, index: number, url: string) => void;
  consignmentMap: Record<string, string>;
  sendOrderToCourier: (orderId: string) => Promise<{ success: boolean; trackingCode?: string; message?: string }>;
  resetCourierStatus: (orderId: string) => void;
  checkBalance: () => Promise<{ success: boolean; balance?: number; message?: string }>;
  fetchCourierFraudCheck: (phone: string) => Promise<any>;
  steadfastBalance: number;
  setSteadfastBalance: (balance: number) => void;
  steadfastPaidOut: number;
  setSteadfastPaidOut: (amount: number) => void;
  discountCodes: DiscountCode[];
  addDiscountCode: (code: DiscountCode) => void;
  deleteDiscountCode: (codeString: string) => void;
  toggleDiscountCode: (codeString: string) => void;
  validateDiscountCode: (codeString: string, cartTotal: number) => { isValid: boolean; discountAmount: number; error?: string };
  storeLogo: string;
  setStoreLogo: (logo: string) => void;
  storeBanner: string;
  setStoreBanner: (banner: string) => void;
  storeName: string;
  setStoreName: (name: string) => void;
  storeFavicon: string;
  setStoreFavicon: (favicon: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;
  phoneNumber: string;
  setPhoneNumber: (num: string) => void;
  messengerUrl: string;
  setMessengerUrl: (url: string) => void;
  facebookPageUrl: string;
  setFacebookPageUrl: (url: string) => void;
  heroBadge: string;
  setHeroBadge: (badge: string) => void;
  heroTitle1: string;
  setHeroTitle1: (t1: string) => void;
  heroTitle2: string;
  setHeroTitle2: (t2: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (sub: string) => void;
  landingPages: LandingPage[];
  addLandingPage: (page: LandingPage) => void;
  updateLandingPage: (page: LandingPage) => void;
  deleteLandingPage: (id: string) => void;
  headerBgColor: string;
  setHeaderBgColor: (color: string) => void;
  headerTextColor: string;
  setHeaderTextColor: (color: string) => void;
  footerShow: boolean;
  setFooterShow: (show: boolean) => void;
  footerBgColor: string;
  setFooterBgColor: (color: string) => void;
  footerTextColor: string;
  setFooterTextColor: (color: string) => void;
  footerText: string;
  setFooterText: (text: string) => void;
  footerAddress: string;
  setFooterAddress: (address: string) => void;
  footerPayments: string;
  setFooterPayments: (payments: string) => void;
  btnInstantOrderShow: boolean;
  setBtnInstantOrderShow: (show: boolean) => void;
  btnInstantOrderText: string;
  setBtnInstantOrderText: (text: string) => void;
  btnInstantOrderBgColor: string;
  setBtnInstantOrderBgColor: (color: string) => void;
  btnInstantOrderTextColor: string;
  setBtnInstantOrderTextColor: (color: string) => void;
  btnAddToCartShow: boolean;
  setBtnAddToCartShow: (show: boolean) => void;
  btnAddToCartText: string;
  setBtnAddToCartText: (text: string) => void;
  btnAddToCartBgColor: string;
  setBtnAddToCartBgColor: (color: string) => void;
  btnAddToCartTextColor: string;
  setBtnAddToCartTextColor: (color: string) => void;
  btnDetailsShow: boolean;
  setBtnDetailsShow: (show: boolean) => void;
  btnDetailsText: string;
  setBtnDetailsText: (text: string) => void;
  btnDetailsBgColor: string;
  setBtnDetailsBgColor: (color: string) => void;
  btnDetailsTextColor: string;
  setBtnDetailsTextColor: (color: string) => void;
  shippingInsideCost: number;
  setShippingInsideCost: (cost: number) => void;
  shippingInsideText: string;
  setShippingInsideText: (text: string) => void;
  shippingInsideDesc: string;
  setShippingInsideDesc: (desc: string) => void;
  shippingInsideShow: boolean;
  setShippingInsideShow: (show: boolean) => void;
  shippingOutsideCost: number;
  setShippingOutsideCost: (cost: number) => void;
  shippingOutsideText: string;
  setShippingOutsideText: (text: string) => void;
  shippingOutsideDesc: string;
  setShippingOutsideDesc: (desc: string) => void;
  shippingOutsideShow: boolean;
  setShippingOutsideShow: (show: boolean) => void;
  freeShippingEnabled: boolean;
  setFreeShippingEnabled: (enabled: boolean) => void;
  freeShippingThreshold: number;
  setFreeShippingThreshold: (qty: number) => void;
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  showCategoryFilterBar: boolean;
  setShowCategoryFilterBar: (val: boolean) => void;
  saveStoreSettingsToCloud: (overrideSettings?: Record<string, any>) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Realtime synchronization from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      if (!snapshot.empty) {
        const loadedProducts: Product[] = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        } as Product));
        setProducts(loadedProducts);
      } else {
        setProducts([]);
      }
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, "products", product.id), product);
    } catch (e) {
      console.error("Error adding product:", e);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, "products", product.id), product);
    } catch (e) {
      console.error("Error updating product:", e);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, "products", productId));
    } catch (e) {
      console.error("Error deleting product:", e);
    }
  };

  const deleteMultipleProducts = async (productIds: string[]) => {
    try {
      const batch = writeBatch(db);
      productIds.forEach((id) => batch.delete(doc(db, "products", id)));
      await batch.commit();
    } catch (e) {
      console.error("Error deleting multiple products:", e);
    }
  };

  // State Management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true);
  const [adminUsername, setAdminUsername] = useState('ELHAMSHOP');
  const [adminPassword, setAdminPassword] = useState('123456');
  const [pixelId, setPixelId] = useState('');
  const [pixelAccessToken, setPixelAccessToken] = useState('');
  const [gtmId, setGtmId] = useState('');
  const [courierService, setCourierService] = useState('steadfast');
  const [courierApiKey, setCourierApiKey] = useState('');
  const [courierSecretKey, setCourierSecretKey] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [incompleteOrders, setIncompleteOrders] = useState<Order[]>([]);
  const [blockedPhones, setBlockedPhones] = useState<string[]>([]);
  const [enableDailyLimit, setEnableDailyLimit] = useState(false);
  const [whitelistedPhones, setWhitelistedPhones] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryImages, setCategoryImages] = useState<Record<string, string[]>>({});
  const [consignmentMap, setConsignmentMap] = useState<Record<string, string>>({});
  const [steadfastBalance, setSteadfastBalance] = useState(0);
  const [steadfastPaidOut, setSteadfastPaidOut] = useState(0);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [storeLogo, setStoreLogo] = useState('');
  const [storeBanner, setStoreBanner] = useState('');
  const [storeName, setStoreName] = useState('Elham Shop');
  const [storeFavicon, setStoreFavicon] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messengerUrl, setMessengerUrl] = useState('');
  const [facebookPageUrl, setFacebookPageUrl] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle1, setHeroTitle1] = useState('');
  const [heroTitle2, setHeroTitle2] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);

  const [headerBgColor, setHeaderBgColor] = useState('#0a1128');
  const [headerTextColor, setHeaderTextColor] = useState('#ffffff');
  const [footerShow, setFooterShow] = useState(true);
  const [footerBgColor, setFooterBgColor] = useState('#ffffff');
  const [footerTextColor, setFooterTextColor] = useState('#666666');
  const [footerText, setFooterText] = useState('');
  const [footerAddress, setFooterAddress] = useState('');
  const [footerPayments, setFooterPayments] = useState('');

  const [btnInstantOrderShow, setBtnInstantOrderShow] = useState(true);
  const [btnInstantOrderText, setBtnInstantOrderText] = useState('ইনস্ট্যান্ট অর্ডার ⚡');
  const [btnInstantOrderBgColor, setBtnInstantOrderBgColor] = useState('#f59e0b');
  const [btnInstantOrderTextColor, setBtnInstantOrderTextColor] = useState('#0a0a0a');

  const [btnAddToCartShow, setBtnAddToCartShow] = useState(true);
  const [btnAddToCartText, setBtnAddToCartText] = useState('Add to Cart');
  const [btnAddToCartBgColor, setBtnAddToCartBgColor] = useState('#0a1128');
  const [btnAddToCartTextColor, setBtnAddToCartTextColor] = useState('#ffffff');

  const [btnDetailsShow, setBtnDetailsShow] = useState(true);
  const [btnDetailsText, setBtnDetailsText] = useState('Details');
  const [btnDetailsBgColor, setBtnDetailsBgColor] = useState('#ffffff');
  const [btnDetailsTextColor, setBtnDetailsTextColor] = useState('#1a1a1a');

  const [shippingInsideCost, setShippingInsideCost] = useState(60);
  const [shippingInsideText, setShippingInsideText] = useState('ঢাকার ভিতরে');
  const [shippingInsideDesc, setShippingInsideDesc] = useState('হোম ডেলিভারি চার্জ ৳৬০');
  const [shippingInsideShow, setShippingInsideShow] = useState(true);

  const [shippingOutsideCost, setShippingOutsideCost] = useState(120);
  const [shippingOutsideText, setShippingOutsideText] = useState('ঢাকার বাইরে');
  const [shippingOutsideDesc, setShippingOutsideDesc] = useState('কুরিয়ার চার্জ ৳১২০');
  const [shippingOutsideShow, setShippingOutsideShow] = useState(true);

  const [freeShippingEnabled, setFreeShippingEnabled] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(3);
  const [showCategoryFilterBar, setShowCategoryFilterBar] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Utility Dummy Handlers
  const addToCart = () => {};
  const removeFromCart = () => {};
  const updateCartQuantity = () => {};
  const clearCart = () => {};
  const loginAdmin = () => setIsAdminLoggedIn(true);
  const logoutAdmin = () => setIsAdminLoggedIn(false);
  const placeOrder = () => {};
  const addOrUpdateIncompleteOrder = () => {};
  const deleteIncompleteOrder = () => {};
  const updateOrderStatus = () => {};
  const updateOrderMetaSynced = () => {};
  const deleteOrder = () => {};
  const blockPhone = () => {};
  const unblockPhone = () => {};
  const isPhoneBlocked = () => false;
  const whitelistPhone = () => {};
  const unwhitelistPhone = () => {};
  const isPhoneWhitelisted = () => false;
  const isDailyOrderLimitReached = () => false;
  const addCategory = () => {};
  const deleteCategory = () => {};
  const setCategoryImage = () => {};
  const sendOrderToCourier = async () => ({ success: true });
  const resetCourierStatus = () => {};
  const checkBalance = async () => ({ success: true });
  const fetchCourierFraudCheck = async () => ({ success: true });
  const addDiscountCode = () => {};
  const deleteDiscountCode = () => {};
  const toggleDiscountCode = () => {};
  const validateDiscountCode = () => ({ isValid: false, discountAmount: 0 });
  const addLandingPage = () => {};
  const updateLandingPage = () => {};
  const deleteLandingPage = () => {};
  const saveStoreSettingsToCloud = async () => {};

  return (
    <ShopContext.Provider
      value={{
        products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
        isAdminLoggedIn, loginAdmin, logoutAdmin, adminUsername, setAdminUsername,
        adminPassword, setAdminPassword, addProduct, updateProduct, deleteProduct,
        deleteMultipleProducts, pixelId, setPixelId, pixelAccessToken, setPixelAccessToken,
        gtmId, setGtmId, courierService, setCourierService, courierApiKey, setCourierApiKey,
        courierSecretKey, setCourierSecretKey, orders, incompleteOrders, placeOrder,
        addOrUpdateIncompleteOrder, deleteIncompleteOrder, updateOrderStatus,
        updateOrderMetaSynced, deleteOrder, blockedPhones, blockPhone, unblockPhone,
        isPhoneBlocked, enableDailyLimit, setEnableDailyLimit, whitelistedPhones,
        whitelistPhone, unwhitelistPhone, isPhoneWhitelisted, isDailyOrderLimitReached,
        categories, addCategory, deleteCategory, categoryImages, setCategoryImage,
        consignmentMap, sendOrderToCourier, resetCourierStatus, checkBalance,
        fetchCourierFraudCheck, steadfastBalance, setSteadfastBalance, steadfastPaidOut,
        setSteadfastPaidOut, discountCodes, addDiscountCode, deleteDiscountCode,
        toggleDiscountCode, validateDiscountCode, storeLogo, setStoreLogo, storeBanner,
        setStoreBanner, storeName, setStoreName, storeFavicon, setStoreFavicon,
        whatsappNumber, setWhatsappNumber, phoneNumber, setPhoneNumber, messengerUrl,
        setMessengerUrl, facebookPageUrl, setFacebookPageUrl, heroBadge, setHeroBadge,
        heroTitle1, setHeroTitle1, heroTitle2, setHeroTitle2, heroSubtitle, setHeroSubtitle,
        landingPages, addLandingPage, updateLandingPage, deleteLandingPage, headerBgColor,
        setHeaderBgColor, headerTextColor, setHeaderTextColor, footerShow, setFooterShow,
        footerBgColor, setFooterBgColor, footerTextColor, setFooterTextColor, footerText,
        setFooterText, footerAddress, setFooterAddress, footerPayments, setFooterPayments,
        btnInstantOrderShow, setBtnInstantOrderShow, btnInstantOrderText, setBtnInstantOrderText,
        btnInstantOrderBgColor, setBtnInstantOrderBgColor, btnInstantOrderTextColor,
        setBtnInstantOrderTextColor, btnAddToCartShow, setBtnAddToCartShow, btnAddToCartText,
        setBtnAddToCartText, btnAddToCartBgColor, setBtnAddToCartBgColor, btnAddToCartTextColor,
        setBtnAddToCartTextColor, btnDetailsShow, setBtnDetailsShow, btnDetailsText,
        setBtnDetailsText, btnDetailsBgColor, setBtnDetailsBgColor, btnDetailsTextColor,
        setBtnDetailsTextColor, shippingInsideCost, setShippingInsideCost, shippingInsideText,
        setShippingInsideText, shippingInsideDesc, setShippingInsideDesc, shippingInsideShow,
        setShippingInsideShow, shippingOutsideCost, setShippingOutsideCost, shippingOutsideText,
        setShippingOutsideText, shippingOutsideDesc, setShippingOutsideDesc, shippingOutsideShow,
        setShippingOutsideShow, freeShippingEnabled, setFreeShippingEnabled, freeShippingThreshold,
        setFreeShippingThreshold, menuItems, setMenuItems, showCategoryFilterBar,
        setShowCategoryFilterBar, saveStoreSettingsToCloud,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};