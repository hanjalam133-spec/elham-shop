import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem, Order, Category, DiscountCode, LandingPage, MenuItem } from '../types';
import { INITIAL_PRODUCTS } from '../data';
import { db, collection, getDocs, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from '../lib/firebaseClient';
import { getPdataFromUrl, getProdDataFromUrl } from '../lib/urlUtils';

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
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
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
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => void;
  addOrUpdateIncompleteOrder: (id: string, orderData: Omit<Order, 'id' | 'date' | 'status'>) => void;
  deleteIncompleteOrder: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
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
  fetchCourierFraudCheck: (phone: string) => Promise<{
    success: boolean;
    total_parcel?: number;
    delivered_parcel?: number;
    cancelled_parcel?: number;
    delivery_ratio?: number;
    message?: string;
  }>;
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

let activeUtterance: SpeechSynthesisUtterance | null = null;

export const playOrderSuccessSound = () => {
  if (localStorage.getItem("elham_audio_alerts") === "false") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.55);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.12);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.12, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.75);
    }
  } catch (error) {
    console.error("Failed to play sound:", error);
  }
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('ELHAMSHOP');
  const [adminPassword, setAdminPassword] = useState('123456');
  const [pixelId, setPixelId] = useState('');
  const [pixelAccessToken, setPixelAccessToken] = useState('');
  const [gtmId, setGtmId] = useState('');
  const [courierService, setCourierService] = useState('steadfast');
  const [courierApiKey, setCourierApiKey] = useState('');
  const [courierSecretKey, setCourierSecretKey] = useState('');
  const [storeLogo, setStoreLogo] = useState('/elham_gold_logo_1785398483246.jpg');
  const [storeBanner, setStoreBanner] = useState('/elham_hero_banner_1785398905544.jpg');
  const [storeName, setStoreName] = useState('Elham Shop');
  const [storeFavicon, setStoreFavicon] = useState('/elham_gold_logo_1785398483246.jpg');
  const [whatsappNumber, setWhatsappNumber] = useState('8801756994483');
  const [phoneNumber, setPhoneNumber] = useState('01756994483');
  const [messengerUrl, setMessengerUrl] = useState('');
  const [facebookPageUrl, setFacebookPageUrl] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle1, setHeroTitle1] = useState('');
  const [heroTitle2, setHeroTitle2] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

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
  const [shippingInsideDesc, setShippingInsideDesc] = useState('');
  const [shippingInsideShow, setShippingInsideShow] = useState(true);

  const [shippingOutsideCost, setShippingOutsideCost] = useState(120);
  const [shippingOutsideText, setShippingOutsideText] = useState('ঢাকার বাইরে');
  const [shippingOutsideDesc, setShippingOutsideDesc] = useState('');
  const [shippingOutsideShow, setShippingOutsideShow] = useState(true);

  const [freeShippingEnabled, setFreeShippingEnabled] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(3);

  const [showCategoryFilterBar, setShowCategoryFilterBar] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);

  // Load landing pages with NO auto-seeding
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = onSnapshot(collection(db, "landing_pages"), (snapshot) => {
        if (!snapshot.empty) {
          const cloudPages: LandingPage[] = snapshot.docs.map(doc => doc.data() as LandingPage);
          setLandingPages(cloudPages);
        } else {
          // Auto-seeding DISABLED: Set to empty array so deletions persist
          setLandingPages([]);
        }
      }, (error) => {
        console.error("Firestore landing_pages listener error:", error);
      });
    } catch (e) {
      console.error("Failed to setup Firestore listener:", e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Load products with NO auto-seeding
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
        if (!snapshot.empty) {
          const loadedProducts: Product[] = snapshot.docs.map(doc => doc.data() as Product);
          setProducts(loadedProducts);
        } else {
          // Auto-seeding DISABLED: Set to empty array so deletions persist
          setProducts([]);
        }
      }, (error) => {
        console.error("Firestore products listener error:", error);
      });
    } catch (e) {
      console.error("Failed to setup products listener:", e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <ShopContext.Provider value={{} as any}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};