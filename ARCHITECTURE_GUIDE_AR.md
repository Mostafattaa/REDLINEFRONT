# دليل معماري شامل لمشروع التجارة الإلكترونية

## 📚 جدول المحتويات
1. [مجلد Services (الخدمات)](#services)
2. [مجلد Utils (الأدوات المساعدة)](#utils)
3. [مجلد Hooks (الخطافات)](#hooks)
4. [العلاقات بين المجلدات](#relationships)

---

## 🔧 مجلد Services (الخدمات) {#services}

### 📖 التعريف
مجلد **Services** يحتوي على الوظائف المسؤولة عن التواصل مع الخدمات الخارجية مثل:
- استدعاء APIs (واجهات برمجة التطبيقات)
- التعامل مع التخزين المحلي (localStorage/sessionStorage)
- إدارة قواعد البيانات
- التواصل مع الخوادم الخارجية

### 📁 الملفات الموجودة

#### 1️⃣ `api.js` - خدمة الاتصال بالـ API

**الغرض الرئيسي:**
هذا الملف مسؤول عن جميع عمليات الاتصال بالخادم الخارجي (DummyJSON API) لجلب بيانات المنتجات.

**المكونات الأساسية:**

##### أ) إعدادات الاتصال
```javascript
const API_BASE_URL = 'https://dummyjson.com';  // عنوان الخادم الأساسي
const CACHE_DURATION = 5 * 60 * 1000;          // مدة التخزين المؤقت (5 دقائق)
const MAX_RETRIES = 3;                          // عدد محاولات إعادة الاتصال
const RETRY_DELAY = 1000;                       // التأخير بين المحاولات (1 ثانية)
```

##### ب) نظام التخزين المؤقت (Caching)
**لماذا نستخدم التخزين المؤقت؟**
- تقليل عدد الطلبات للخادم
- تسريع تحميل البيانات
- توفير استهلاك البيانات
- تحسين تجربة المستخدم

**كيف يعمل؟**

1. عند طلب بيانات، يتحقق النظام من وجودها في الذاكرة المؤقتة
2. إذا كانت موجودة وصالحة (أقل من 5 دقائق)، يتم إرجاعها مباشرة
3. إذا لم تكن موجودة أو منتهية الصلاحية، يتم طلبها من الخادم

##### ج) الوظائف الرئيسية

**1. `getAllProducts()`** - جلب جميع المنتجات
```javascript
// الاستخدام:
const products = await getAllProducts({ limit: 30, skip: 0 });
```
- **limit**: عدد المنتجات المطلوبة
- **skip**: عدد المنتجات المراد تخطيها (للصفحات)
- **الإرجاع**: مصفوفة من المنتجات

**2. `getProductById(id)`** - جلب منتج واحد بالمعرف
```javascript
// الاستخدام:
const product = await getProductById(5);
```
- **id**: رقم معرف المنتج
- **الإرجاع**: كائن المنتج الكامل

**3. `searchProducts(query)`** - البحث عن منتجات
```javascript
// الاستخدام:
const results = await searchProducts('phone', { limit: 10 });
```
- **query**: نص البحث
- **الإرجاع**: مصفوفة المنتجات المطابقة

**4. `getAllCategories()`** - جلب جميع الفئات
```javascript
// الاستخدام:
const categories = await getAllCategories();
```
- **الإرجاع**: مصفوفة الفئات مع تفاصيلها

**5. `getProductsByCategory(category)`** - جلب منتجات فئة معينة
```javascript
// الاستخدام:
const products = await getProductsByCategory('smartphones');
```
- **category**: اسم الفئة
- **الإرجاع**: مصفوفة منتجات الفئة

**6. `getRelatedProductsById(id)`** - جلب منتجات مشابهة
```javascript
// الاستخدام:
const related = await getRelatedProductsById(5);
```
- **id**: معرف المنتج الحالي
- **الإرجاع**: مصفوفة من 4 منتجات مشابهة

##### د) معالجة الأخطاء وإعادة المحاولة

**نظام إعادة المحاولة الذكي:**

- إذا فشل الطلب، يعيد المحاولة تلقائياً حتى 3 مرات
- يزيد التأخير بين كل محاولة (1 ثانية، 2 ثانية، 4 ثوان)
- يوفر رسائل خطأ واضحة للمستخدم

**أنواع الأخطاء المعالجة:**
- 404: المورد غير موجود
- 500: خطأ في الخادم
- Network Error: مشكلة في الاتصال بالإنترنت

##### هـ) تطبيع البيانات (Data Normalization)

**لماذا نحتاج تطبيع البيانات؟**
API الخارجي قد يرسل البيانات بصيغة مختلفة عما نحتاجه في التطبيق.

**مثال على التطبيع:**
```javascript
// البيانات من API:
{ category: "smartphones" }

// بعد التطبيع:
{ category: { name: "smartphones", slug: "smartphones" } }
```

---

#### 2️⃣ `storage.js` - خدمة التخزين المحلي

**الغرض الرئيسي:**
إدارة تخزين البيانات في متصفح المستخدم (localStorage و sessionStorage).

**الفرق بين localStorage و sessionStorage:**

| الميزة | localStorage | sessionStorage |
|--------|-------------|----------------|
| **مدة البقاء** | دائم (حتى يتم حذفه) | مؤقت (حتى إغلاق المتصفح) |
| **الاستخدام** | سلة التسوق | حالة تسجيل الدخول |
| **المشاركة** | بين جميع التبويبات | تبويب واحد فقط |

**الوظائف الرئيسية:**

**1. إدارة سلة التسوق (Cart Management)**

```javascript
// حفظ السلة
saveCart(cart)
// - يحول المصفوفة إلى نص JSON
// - يحفظها في localStorage
// - يعالج أخطاء امتلاء المساحة

// تحميل السلة
loadCart()
// - يقرأ البيانات من localStorage
// - يحولها من JSON إلى مصفوفة
// - يتحقق من صحة البيانات
// - يرجع مصفوفة فارغة إذا كانت البيانات تالفة

// مسح السلة
clearCart()
// - يحذف بيانات السلة من localStorage
```

**2. إدارة المصادقة (Authentication Management)**

```javascript
// حفظ حالة المستخدم
saveAuth(user)
// - يحفظ بيانات المستخدم في sessionStorage
// - تُحذف تلقائياً عند إغلاق المتصفح

// تحميل حالة المستخدم
loadAuth()
// - يقرأ بيانات المستخدم
// - يرجع null إذا لم يكن مسجل دخول

// تسجيل الخروج
clearAuth()
// - يحذف بيانات المستخدم من sessionStorage
```

**معالجة الأخطاء:**
- **QuotaExceededError**: عند امتلاء مساحة التخزين، يحذف البيانات القديمة
- **JSON Parse Error**: عند تلف البيانات، يعيد تعيينها
- **Try-Catch**: جميع العمليات محمية من الأخطاء

---

## 🛠️ مجلد Utils (الأدوات المساعدة) {#utils}

### 📖 التعريف
مجلد **Utils** يحتوي على وظائف مساعدة صغيرة قابلة لإعادة الاستخدام في أي مكان بالتطبيق.

**الفرق بين Utils و Services:**
- **Utils**: وظائف بسيطة لا تتواصل مع خدمات خارجية
- **Services**: وظائف معقدة تتواصل مع APIs أو قواعد بيانات

### 📁 الملفات الموجودة

#### 1️⃣ `formatters.js` - أدوات التنسيق

**الغرض:** تنسيق البيانات لعرضها بشكل جميل للمستخدم.

**الوظيفة الوحيدة:**

```javascript
formatPrice(price)
// المدخل: 29.99
// المخرج: "29.99"
// الاستخدام: عرض الأسعار بصيغة موحدة
```

**لماذا نحتاج هذه الوظيفة؟**
- توحيد عرض الأسعار في كل التطبيق
- ضمان عرض رقمين بعد الفاصلة دائماً
- سهولة التعديل المستقبلي (إضافة رمز العملة مثلاً)

---

#### 2️⃣ `validators.js` - أدوات التحقق

**الغرض:** التحقق من صحة البيانات المدخلة من المستخدم.

**الوظائف:**

**1. `validateEmail(email)`** - التحقق من البريد الإلكتروني
```javascript
validateEmail('user@example.com')  // true
validateEmail('invalid-email')      // false
```
- يستخدم Regular Expression للتحقق
- يتأكد من وجود @ و نطاق صحيح

**2. `validateRequired(value)`** - التحقق من الحقول المطلوبة
```javascript
validateRequired('John')    // true
validateRequired('')        // false
validateRequired('   ')     // false (مسافات فقط)
```
- يتحقق من أن الحقل ليس فارغاً
- يتجاهل المسافات الزائدة

**أهمية التحقق من البيانات:**
- منع إرسال بيانات خاطئة للخادم
- تحسين تجربة المستخدم برسائل خطأ واضحة
- حماية التطبيق من البيانات الضارة

---

#### 3️⃣ `sortHelpers.js` - أدوات الترتيب

**الغرض:** ترتيب المنتجات حسب معايير مختلفة.

**الوظيفة الرئيسية:**

```javascript
sortProducts(products, sortBy)
```

**خيارات الترتيب:**
- `'price-asc'`: السعر من الأقل للأعلى
- `'price-desc'`: السعر من الأعلى للأقل
- `'name-asc'`: الاسم أبجدياً (أ-ي)
- `'name-desc'`: الاسم أبجدياً عكسياً (ي-أ)

**مثال الاستخدام:**
```javascript
const products = [
  { title: 'Phone', price: 500 },
  { title: 'Laptop', price: 1000 }
];

const sorted = sortProducts(products, 'price-asc');
// النتيجة: Phone أولاً، ثم Laptop
```

**ملاحظة مهمة:**
- تُنشئ نسخة جديدة من المصفوفة (لا تعدل الأصلية)
- تستخدم `localeCompare` للترتيب الأبجدي الصحيح

---

#### 4️⃣ `filterHelpers.js` - أدوات التصفية

**الغرض:** تصفية المنتجات حسب معايير متعددة.

**الوظائف:**

**1. `filterByCategory(products, categorySlug)`**
```javascript
// تصفية المنتجات حسب الفئة
const smartphones = filterByCategory(products, 'smartphones');
```

**2. `filterByPriceRange(products, minPrice, maxPrice)`**
```javascript
// تصفية المنتجات حسب نطاق السعر
const affordable = filterByPriceRange(products, 0, 500);
```

**3. `filterBySearch(products, query)`**
```javascript
// البحث في العنوان والفئة
const results = filterBySearch(products, 'phone');
```

**4. `applyAllFilters(products, filters)`**
```javascript
// تطبيق جميع الفلاتر مرة واحدة
const filtered = applyAllFilters(products, {
  categorySlug: 'smartphones',
  minPrice: 100,
  maxPrice: 1000,
  searchQuery: 'samsung'
});
```

**كيف تعمل التصفية المتعددة؟**
1. تبدأ بجميع المنتجات
2. تطبق فلتر الفئة (إن وُجد)
3. تطبق فلتر السعر (إن وُجد)
4. تطبق فلتر البحث (إن وُجد)
5. تُرجع النتيجة النهائية

---

#### 5️⃣ `cartHelpers.js` - أدوات سلة التسوق

**الغرض:** إدارة عمليات سلة التسوق (إضافة، تعديل، حذف).

**الوظائف الرئيسية:**

**1. `calculateSubtotal(price, quantity)`**
```javascript
// حساب المجموع الفرعي لمنتج
calculateSubtotal(50, 3)  // 150
```

**2. `calculateTotal(cartItems)`**
```javascript
// حساب المجموع الكلي للسلة
const total = calculateTotal([
  { price: 50, quantity: 2 },  // 100
  { price: 30, quantity: 1 }   // 30
]);
// النتيجة: 130
```

**3. `calculateShipping(subtotal)`**
```javascript
// حساب تكلفة الشحن
calculateShipping(150)  // 0 (شحن مجاني فوق 100)
calculateShipping(50)   // 10 (رسوم شحن)
```

**4. `addToCart(cart, product)`**
```javascript
// إضافة منتج للسلة
// - إذا كان موجوداً: يزيد الكمية
// - إذا لم يكن موجوداً: يضيفه بكمية 1
```

**5. `updateCartItemQuantity(cart, productId, newQuantity)`**
```javascript
// تحديث كمية منتج
// - يتحقق من أن الكمية بين 1 و 99
// - يُقرّب الأرقام العشرية
```

**6. `removeFromCart(cart, productId)`**
```javascript
// حذف منتج من السلة
```

**7. `getCartCount(cart)`**
```javascript
// حساب عدد المنتجات الكلي
const count = getCartCount([
  { quantity: 2 },
  { quantity: 3 }
]);
// النتيجة: 5
```

**8. `isProductInCart(cart, productId)`**
```javascript
// التحقق من وجود منتج في السلة
isProductInCart(cart, 5)  // true أو false
```

**9. `clearCart()`**
```javascript
// مسح السلة بالكامل
const emptyCart = clearCart();  // []
```

**مبدأ Immutability (عدم التعديل المباشر):**
جميع هذه الوظائف تُرجع مصفوفة جديدة ولا تعدل المصفوفة الأصلية.

**لماذا؟**
- يساعد React على اكتشاف التغييرات
- يمنع الأخطاء الغريبة
- يسهل التراجع عن العمليات

---

## 🎣 مجلد Hooks (الخطافات) {#hooks}

### 📖 التعريف
**Hooks** هي وظائف خاصة في React تسمح لك باستخدام ميزات React (مثل الحالة والتأثيرات) في المكونات الوظيفية.

**قواعد Hooks:**
1. يجب أن تبدأ بكلمة `use`
2. تُستدعى فقط في المستوى الأعلى (ليس داخل loops أو conditions)
3. تُستدعى فقط في مكونات React أو Hooks أخرى

### 📁 الملفات الموجودة

#### 1️⃣ `useCart.js` - خطاف سلة التسوق

**الغرض:** إدارة حالة سلة التسوق في التطبيق بالكامل.

**ما يفعله:**
1. يحمل السلة من localStorage عند بدء التطبيق
2. يحفظ السلة تلقائياً عند أي تغيير
3. يوفر وظائف لإدارة السلة

**الحالات (States) المُدارة:**
```javascript
const [cart, setCart] = useState([]);           // محتويات السلة
const [cartCount, setCartCount] = useState(0);  // عدد المنتجات
```

**الوظائف المُصدّرة:**
```javascript
const {
  cart,              // مصفوفة المنتجات
  cartCount,         // عدد المنتجات الكلي
  addToCart,         // إضافة منتج
  updateQuantity,    // تحديث الكمية
  removeItem,        // حذف منتج
  clearCart,         // مسح السلة
  subtotal,          // المجموع الفرعي
  shipping,          // تكلفة الشحن
  total,             // المجموع الكلي
  calculateSubtotal  // حساب مجموع منتج
} = useCart();
```

**كيف يعمل؟**

**عند بدء التطبيق:**
```javascript
useEffect(() => {
  const savedCart = loadCart();  // تحميل من localStorage
  setCart(savedCart);
  setCartCount(getCartCount(savedCart));
}, []);  // [] تعني: مرة واحدة فقط عند البدء
```

**عند تغيير السلة:**
```javascript
useEffect(() => {
  saveCart(cart);                    // حفظ في localStorage
  setCartCount(getCartCount(cart));  // تحديث العدد
}, [cart]);  // يعمل كلما تغيرت cart
```

**مثال الاستخدام في مكون:**
```javascript
function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  
  const isInCart = cart.some(item => item.id === product.id);
  
  return (
    <button onClick={() => addToCart(product)}>
      {isInCart ? 'في السلة' : 'أضف للسلة'}
    </button>
  );
}
```

---

#### 2️⃣ `useAuth.js` - خطاف المصادقة

**الغرض:** إدارة حالة تسجيل دخول المستخدم.

**الحالة المُدارة:**
```javascript
const [user, setUser] = useState(() => loadAuth());
```

**الوظائف المُصدّرة:**
```javascript
const {
  user,              // بيانات المستخدم (أو null)
  isAuthenticated,   // هل المستخدم مسجل دخول؟
  login,             // تسجيل الدخول
  logout             // تسجيل الخروج
} = useAuth();
```

**كيف يعمل تسجيل الدخول؟**
```javascript
const login = (userDataOrUsername, password) => {
  // يدعم طريقتين:
  // 1. كائن: login({ username: 'John', email: 'john@example.com' })
  // 2. منفصل: login('John', 'password123')
  
  const userData = {
    username: userDataOrUsername.username,
    email: userDataOrUsername.email,
    isAuthenticated: true
  };
  
  setUser(userData);  // حفظ في الحالة
  // سيتم حفظه تلقائياً في sessionStorage
};
```

**الحفظ التلقائي:**
```javascript
useEffect(() => {
  if (user) {
    saveAuth(user);      // حفظ في sessionStorage
  } else {
    clearAuth();         // حذف من sessionStorage
  }
}, [user]);
```

**مثال الاستخدام:**
```javascript
function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header>
      {user ? (
        <>
          <span>مرحباً {user.username}</span>
          <button onClick={logout}>تسجيل الخروج</button>
        </>
      ) : (
        <Link to="/login">تسجيل الدخول</Link>
      )}
    </header>
  );
}
```

---

#### 3️⃣ `useDebounce.js` - خطاف التأخير

**الغرض:** تأخير تنفيذ عملية حتى يتوقف المستخدم عن الكتابة.

**المشكلة التي يحلها:**
عند البحث، لا نريد إرسال طلب للخادم مع كل حرف يكتبه المستخدم.

**الحل:**
ننتظر حتى يتوقف المستخدم عن الكتابة لمدة 300 ميلي ثانية.

**كيف يعمل؟**
```javascript
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // إنشاء مؤقت
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // إلغاء المؤقت السابق عند تغيير value
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**مثال الاستخدام:**
```javascript
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);  // يُنفذ فقط بعد التوقف عن الكتابة
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="ابحث..."
    />
  );
}
```

**السيناريو:**
1. المستخدم يكتب "p" → لا شيء يحدث
2. المستخدم يكتب "h" → لا شيء يحدث
3. المستخدم يكتب "o" → لا شيء يحدث
4. المستخدم يكتب "n" → لا شيء يحدث
5. المستخدم يكتب "e" → لا شيء يحدث
6. المستخدم يتوقف لمدة 300ms → يتم البحث عن "phone"

**الفوائد:**
- تقليل عدد الطلبات للخادم
- تحسين الأداء
- توفير استهلاك البيانات

---

## 🔗 العلاقات بين المجلدات {#relationships}

### 📊 التسلسل الهرمي

```
Components (المكونات)
    ↓ تستخدم
Hooks (الخطافات)
    ↓ تستخدم
Services (الخدمات) + Utils (الأدوات)
    ↓ تتواصل مع
External APIs / Browser Storage
```

### 🔄 مثال عملي كامل: إضافة منتج للسلة

**1. المستخدم ينقر على زر "أضف للسلة" في `ProductCard.jsx`**
```javascript
<button onClick={() => addToCart(product)}>
  أضف للسلة
</button>
```

**2. الزر يستدعي `addToCart` من `useCart` Hook**
```javascript
const { addToCart } = useCart();
```

**3. `useCart` يستخدم `addToCartHelper` من `cartHelpers.js`**
```javascript
const addToCart = (product) => {
  setCart(prevCart => addToCartHelper(prevCart, product));
};
```

**4. `addToCartHelper` يضيف المنتج أو يزيد الكمية**
```javascript
export function addToCart(cart, product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    return cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    return [...cart, { ...product, quantity: 1 }];
  }
}
```

**5. `useCart` يحفظ السلة تلقائياً في localStorage**
```javascript
useEffect(() => {
  saveCart(cart);  // من storage.js
}, [cart]);
```

**6. `saveCart` من `storage.js` يحفظ البيانات**
```javascript
export function saveCart(cart) {
  localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
}
```

---

### 🎯 مثال آخر: البحث عن منتجات

**1. المستخدم يكتب في شريط البحث**
```javascript
<input onChange={(e) => setQuery(e.target.value)} />
```

**2. `useDebounce` يؤخر التنفيذ**
```javascript
const debouncedQuery = useDebounce(query, 300);
```

**3. عند التوقف عن الكتابة، يتم استدعاء API**
```javascript
useEffect(() => {
  if (debouncedQuery) {
    searchProducts(debouncedQuery);  // من api.js
  }
}, [debouncedQuery]);
```

**4. `searchProducts` من `api.js` يجلب النتائج**
```javascript
export async function searchProducts(query) {
  const data = await get('/products/search', { q: query });
  return normalizeProducts(data.products);
}
```

**5. النتائج تُعرض للمستخدم**

---

## 📝 ملخص الفروقات

| المجلد | الغرض | أمثلة | يتواصل مع خارجي؟ |
|--------|-------|-------|------------------|
| **Services** | التواصل مع خدمات خارجية | API calls, localStorage | ✅ نعم |
| **Utils** | وظائف مساعدة بسيطة | تنسيق، تصفية، ترتيب | ❌ لا |
| **Hooks** | إدارة الحالة والتأثيرات | useCart, useAuth | ❌ لا (يستخدم Services) |

---

## 🎓 نصائح للمطورين

### متى تضيف وظيفة في Services؟
- عند الحاجة للتواصل مع API
- عند التعامل مع localStorage/sessionStorage
- عند الحاجة لنظام تخزين مؤقت

### متى تضيف وظيفة في Utils؟
- عند الحاجة لوظيفة بسيطة قابلة لإعادة الاستخدام
- عند تنسيق أو تحويل البيانات
- عند التحقق من صحة البيانات

### متى تضيف Hook جديد؟
- عند الحاجة لإدارة حالة معقدة
- عند الحاجة لمشاركة منطق بين مكونات متعددة
- عند الحاجة لتأثيرات جانبية (side effects)

---

## 🔍 أسئلة شائعة

**س: لماذا لا نضع كل الكود في المكونات مباشرة؟**
ج: للحفاظ على المكونات بسيطة وسهلة القراءة، ولإعادة استخدام الكود.

**س: ما الفرق بين Hook و Utility Function؟**
ج: Hook يستخدم ميزات React (useState, useEffect)، بينما Utility Function وظيفة JavaScript عادية.

**س: لماذا نستخدم التخزين المؤقت (Caching)؟**
ج: لتقليل الطلبات للخادم وتسريع التطبيق وتوفير البيانات.

**س: ما هو Immutability ولماذا مهم؟**
ج: عدم تعديل البيانات الأصلية مباشرة، بل إنشاء نسخة جديدة. مهم لـ React لاكتشاف التغييرات.

---

## 📚 مصادر إضافية

- [React Hooks Documentation](https://react.dev/reference/react)
- [JavaScript Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

**تم إنشاء هذا الدليل بواسطة:** Kiro AI Assistant
**التاريخ:** 2026
**الإصدار:** 1.0

---

## 🎉 خاتمة

هذا الدليل يغطي جميع جوانب معمارية المجلدات الثلاثة الأساسية في مشروع التجارة الإلكترونية. فهم هذه المفاهيم سيساعدك على:

1. ✅ كتابة كود منظم وقابل للصيانة
2. ✅ إعادة استخدام الكود بكفاءة
3. ✅ تطوير ميزات جديدة بسرعة
4. ✅ إصلاح الأخطاء بسهولة
5. ✅ العمل ضمن فريق بفعالية

**تذكر:** الممارسة هي المفتاح! حاول فهم كل وظيفة وكيف تتفاعل مع الأخرى.

**بالتوفيق في رحلتك البرمجية! 🚀**
