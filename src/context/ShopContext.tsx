export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ❌ পুরানো INITIAL_PRODUCTS এর বদলে ফায়ারস্টোর থেকে ডাটা আসার আগে খালি অ্যারে [] রাখুন
  const [products, setProducts] = useState<Product[]>([]);

  // ✅ ফায়ারস্টোর থেকে রিয়েল-টাইম প্রোডাক্ট লোড করার জন্য এই useEffect টি যোগ করুন
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      if (!snapshot.empty) {
        const loadedProducts: Product[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setProducts(loadedProducts);
      } else {
        setProducts([]);
      }
    }, (error) => {
      console.error("Error fetching products from Firestore:", error);
    });

    return () => unsubscribe();
  }, []);