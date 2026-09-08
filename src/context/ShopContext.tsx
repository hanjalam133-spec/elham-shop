export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // ✅ ফায়ারস্টোর থেকে রিয়েল-টাইম ডাটা ফেচিং
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

  // ✅ অ্যাডমিন প্যানেল থেকে প্রোডাক্ট এড করার ফায়ারস্টোর ফাংশন
  const addProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, "products", product.id), product);
    } catch (error) {
      console.error("Error adding product to Firestore:", error);
    }
  };

  // ✅ প্রোডাক্ট আপডেট করার ফাংশন
  const updateProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, "products", product.id), product);
    } catch (error) {
      console.error("Error updating product in Firestore:", error);
    }
  };

  // ✅ প্রোডাক্ট ডিলিট করার ফাংশন
  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, "products", productId));
    } catch (error) {
      console.error("Error deleting product from Firestore:", error);
    }
  };