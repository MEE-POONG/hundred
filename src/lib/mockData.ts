import { Product, Order, User, Payment, BlogArticle, Certificate } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "collagen-vitamin-c",
    name: "Collagen + Vitamin C",
    shortDescription: "Support skin elasticity and natural radiance",
    price: 1290,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
    ],
    category: "Skin Health",
    healthGoal: ["Skin", "Anti-Aging"],
    tags: ["Vegan", "Sugar-Free"],
    benefits: [
      "Supports collagen production for skin elasticity",
      "Enhanced with Vitamin C for antioxidant protection",
      "May help reduce appearance of fine lines",
      "Supports overall skin health and radiance",
    ],
    ingredients: [
      "Hydrolyzed Marine Collagen Peptides (5,000mg)",
      "Vitamin C (Ascorbic Acid) (100mg)",
      "Hyaluronic Acid (50mg)",
      "Biotin (30mcg)",
    ],
    howToUse: "Take 2 capsules daily with meals, or as directed by your healthcare professional. For best results, use consistently for at least 8-12 weeks.",
    warnings: [
      "Consult your healthcare provider before use if pregnant or nursing",
      "Keep out of reach of children",
      "Store in a cool, dry place away from direct sunlight",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 150,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 234,
  },
  {
    id: "2",
    slug: "probiotic-complex",
    name: "Probiotic Complex",
    shortDescription: "Support digestive health and gut balance",
    price: 890,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    ],
    category: "Gut Health",
    healthGoal: ["Gut", "Immunity"],
    tags: ["Vegan", "Sugar-Free", "Gluten-Free"],
    benefits: [
      "Contains 10 billion CFU of beneficial bacteria",
      "Supports healthy digestive function",
      "May enhance immune system response",
      "Promotes gut microbiome balance",
    ],
    ingredients: [
      "Lactobacillus acidophilus (3 billion CFU)",
      "Bifidobacterium lactis (3 billion CFU)",
      "Lactobacillus plantarum (2 billion CFU)",
      "Bifidobacterium longum (2 billion CFU)",
      "Prebiotic Fiber (200mg)",
    ],
    howToUse: "Take 1 capsule daily on an empty stomach, preferably in the morning. Can be taken with or without food.",
    warnings: [
      "Consult your healthcare provider before use if you have a compromised immune system",
      "Keep refrigerated after opening for maximum potency",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 200,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 189,
  },
  {
    id: "3",
    slug: "omega-3-premium",
    name: "Omega-3 Premium",
    shortDescription: "Support heart and brain health",
    price: 1150,
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&q=80",
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80",
    ],
    category: "Heart Health",
    healthGoal: ["Heart", "Brain"],
    tags: ["Sugar-Free"],
    benefits: [
      "High-potency EPA and DHA from fish oil",
      "Supports cardiovascular health",
      "May enhance cognitive function",
      "Purified to remove heavy metals and contaminants",
    ],
    ingredients: [
      "Fish Oil Concentrate (1,200mg)",
      "EPA (Eicosapentaenoic Acid) (600mg)",
      "DHA (Docosahexaenoic Acid) (400mg)",
      "Vitamin E (as antioxidant) (10 IU)",
    ],
    howToUse: "Take 2 softgels daily with meals. Do not exceed recommended dosage.",
    warnings: [
      "Consult your healthcare provider if taking blood-thinning medications",
      "Contains fish derivatives",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 120,
    isVegan: false,
    isSugarFree: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: "4",
    slug: "multivitamin-complete",
    name: "Multivitamin Complete",
    shortDescription: "Comprehensive daily nutritional support",
    price: 790,
    image: "https://images.unsplash.com/photo-1550572017-4e39e00b8de3?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1550572017-4e39e00b8de3?w=800&q=80",
    ],
    category: "General Wellness",
    healthGoal: ["Energy", "Immunity", "Overall Health"],
    tags: ["Vegan", "Sugar-Free"],
    benefits: [
      "Complete spectrum of essential vitamins and minerals",
      "Supports energy metabolism",
      "Enhances immune function",
      "Promotes overall wellness",
    ],
    ingredients: [
      "Vitamin A, C, D, E, K",
      "B-Complex Vitamins (B1, B2, B3, B5, B6, B7, B9, B12)",
      "Calcium, Magnesium, Zinc, Selenium",
      "Iron, Copper, Manganese, Chromium",
    ],
    howToUse: "Take 1 tablet daily with food for optimal absorption.",
    warnings: [
      "Consult your healthcare provider before use if pregnant or nursing",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 300,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 276,
  },
  {
    id: "5",
    slug: "zinc-vitamin-d",
    name: "Zinc + Vitamin D3",
    shortDescription: "Support immune system and bone health",
    price: 650,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    ],
    category: "Immunity",
    healthGoal: ["Immunity", "Bone Health"],
    tags: ["Vegan", "Sugar-Free"],
    benefits: [
      "Supports normal immune function",
      "Promotes calcium absorption for bone health",
      "May reduce duration of common cold symptoms",
      "Supports skin health",
    ],
    ingredients: [
      "Zinc (as Zinc Gluconate) (25mg)",
      "Vitamin D3 (Cholecalciferol) (2000 IU)",
      "Copper (to maintain zinc-copper balance) (1mg)",
    ],
    howToUse: "Take 1 capsule daily with a meal.",
    warnings: [
      "Do not exceed recommended dosage",
      "High doses of zinc may cause nausea",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 250,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: false,
    rating: 4.5,
    reviewCount: 142,
  },
  {
    id: "6",
    slug: "magnesium-glycinate",
    name: "Magnesium Glycinate",
    shortDescription: "Support relaxation and muscle recovery",
    price: 720,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
    ],
    category: "Sleep & Recovery",
    healthGoal: ["Sleep", "Muscle Recovery"],
    tags: ["Vegan", "Sugar-Free", "Gluten-Free"],
    benefits: [
      "Highly bioavailable form of magnesium",
      "Supports muscle relaxation and recovery",
      "May promote restful sleep",
      "Supports nervous system health",
    ],
    ingredients: [
      "Magnesium (as Magnesium Glycinate) (400mg)",
      "Glycine (200mg)",
    ],
    howToUse: "Take 2 capsules in the evening, 1-2 hours before bedtime.",
    warnings: [
      "May cause digestive discomfort if taken on an empty stomach",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 180,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 98,
  },
  {
    id: "7",
    slug: "biotin-hair-growth",
    name: "Biotin Hair Growth",
    shortDescription: "Support healthy hair, skin and nails",
    price: 590,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    ],
    category: "Beauty",
    healthGoal: ["Hair", "Skin", "Nails"],
    tags: ["Vegan", "Sugar-Free"],
    benefits: [
      "High-potency biotin for hair health",
      "Supports keratin production",
      "May strengthen brittle nails",
      "Promotes healthy skin",
    ],
    ingredients: [
      "Biotin (10,000mcg)",
      "Zinc (15mg)",
      "Vitamin C (60mg)",
      "Silica (from Bamboo Extract) (20mg)",
    ],
    howToUse: "Take 1 capsule daily with food.",
    warnings: [
      "May interfere with certain lab tests; inform your healthcare provider",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 220,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: false,
    rating: 4.4,
    reviewCount: 167,
  },
  {
    id: "8",
    slug: "turmeric-curcumin",
    name: "Turmeric Curcumin",
    shortDescription: "Support joint health and natural inflammation response",
    price: 850,
    image: "https://images.unsplash.com/photo-1505575967455-4815dc22f43f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505575967455-4815dc22f43f?w=800&q=80",
    ],
    category: "Joint Health",
    healthGoal: ["Joint Health", "Inflammation Support"],
    tags: ["Vegan", "Sugar-Free", "Gluten-Free"],
    benefits: [
      "Contains 95% standardized curcuminoids",
      "Enhanced with black pepper extract for absorption",
      "Supports healthy inflammatory response",
      "May support joint comfort and mobility",
    ],
    ingredients: [
      "Turmeric Root Extract (1,000mg)",
      "Curcuminoids (95% standardization) (950mg)",
      "BioPerine Black Pepper Extract (10mg)",
    ],
    howToUse: "Take 2 capsules daily with meals.",
    warnings: [
      "Consult your healthcare provider if taking blood-thinning medications",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 165,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 203,
  },
  {
    id: "9",
    slug: "ashwagandha-stress",
    name: "Ashwagandha Stress Support",
    shortDescription: "Support stress management and mental clarity",
    price: 920,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    ],
    category: "Mental Wellness",
    healthGoal: ["Stress", "Mental Clarity", "Energy"],
    tags: ["Vegan", "Sugar-Free"],
    benefits: [
      "Traditional adaptogen for stress support",
      "May help maintain healthy cortisol levels",
      "Supports mental clarity and focus",
      "Promotes overall sense of calm",
    ],
    ingredients: [
      "Ashwagandha Root Extract (KSM-66) (600mg)",
      "Withanolides (5% standardization) (30mg)",
    ],
    howToUse: "Take 1 capsule twice daily with meals, or as directed by your healthcare professional.",
    warnings: [
      "Not recommended during pregnancy or nursing",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 140,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: "10",
    slug: "vitamin-b-complex",
    name: "B-Complex Energy",
    shortDescription: "Support energy metabolism and nervous system",
    price: 680,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80",
    ],
    category: "Energy",
    healthGoal: ["Energy", "Mental Clarity"],
    tags: ["Vegan", "Sugar-Free"],
    benefits: [
      "Complete B-vitamin complex",
      "Supports energy production at cellular level",
      "May reduce fatigue",
      "Supports healthy nervous system function",
    ],
    ingredients: [
      "Vitamin B1 (Thiamine) (50mg)",
      "Vitamin B2 (Riboflavin) (50mg)",
      "Vitamin B3 (Niacin) (50mg)",
      "Vitamin B5 (Pantothenic Acid) (50mg)",
      "Vitamin B6 (Pyridoxine) (50mg)",
      "Vitamin B7 (Biotin) (300mcg)",
      "Vitamin B9 (Folate) (400mcg)",
      "Vitamin B12 (Methylcobalamin) (100mcg)",
    ],
    howToUse: "Take 1 capsule daily with breakfast.",
    warnings: [
      "May cause bright yellow urine (harmless)",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 210,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: false,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    id: "11",
    slug: "iron-gentle",
    name: "Gentle Iron Complex",
    shortDescription: "Support healthy iron levels without stomach upset",
    price: 620,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    ],
    category: "General Wellness",
    healthGoal: ["Energy", "Blood Health"],
    tags: ["Vegan", "Sugar-Free"],
    benefits: [
      "Gentle iron bisglycinate form",
      "Supports healthy hemoglobin levels",
      "May reduce fatigue associated with low iron",
      "Enhanced with Vitamin C for absorption",
    ],
    ingredients: [
      "Iron (as Ferrous Bisglycinate) (25mg)",
      "Vitamin C (100mg)",
      "Folate (400mcg)",
      "Vitamin B12 (10mcg)",
    ],
    howToUse: "Take 1 capsule daily with food, or as directed by your healthcare professional.",
    warnings: [
      "Consult your healthcare provider before use",
      "Keep out of reach of children - accidental overdose of iron is a leading cause of poisoning in children",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 190,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: false,
    rating: 4.3,
    reviewCount: 87,
  },
  {
    id: "12",
    slug: "green-superfood",
    name: "Green Superfood Blend",
    shortDescription: "Comprehensive greens and antioxidant support",
    price: 1450,
    image: "https://images.unsplash.com/photo-1505575967455-4815dc22f43f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505575967455-4815dc22f43f?w=800&q=80",
    ],
    category: "General Wellness",
    healthGoal: ["Immunity", "Energy", "Overall Health"],
    tags: ["Vegan", "Sugar-Free", "Organic"],
    benefits: [
      "Blend of organic greens and superfoods",
      "Rich in antioxidants and phytonutrients",
      "Supports daily nutritional needs",
      "May boost energy and vitality",
    ],
    ingredients: [
      "Organic Spirulina (1,000mg)",
      "Organic Chlorella (500mg)",
      "Organic Wheatgrass (500mg)",
      "Organic Barley Grass (500mg)",
      "Organic Spinach Powder (300mg)",
      "Organic Kale Powder (300mg)",
      "Digestive Enzyme Blend (100mg)",
    ],
    howToUse: "Mix 1 scoop (5g) with water, juice, or smoothie daily.",
    warnings: [
      "May contain iodine from sea vegetables",
      "This product is not intended to diagnose, treat, cure, or prevent any disease",
    ],
    stock: 95,
    isVegan: true,
    isSugarFree: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 112,
  },
];

export const orders: Order[] = [
  {
    id: "1",
    orderNumber: "NV-2024-001234",
    date: "2024-12-20",
    status: "completed",
    items: [
      {
        product: products[0],
        quantity: 2,
        price: products[0].price,
      },
      {
        product: products[1],
        quantity: 1,
        price: products[1].price,
      },
    ],
    subtotal: 3470,
    shipping: 50,
    discount: 0,
    total: 3520,
    shippingInfo: {
      name: "Somchai Prasert",
      email: "somchai@example.com",
      phone: "081-234-5678",
      address: "123 Sukhumvit Road",
      city: "Bangkok",
      postalCode: "10110",
    },
    paymentMethod: "Credit Card",
  },
  {
    id: "2",
    orderNumber: "NV-2024-001235",
    date: "2024-12-18",
    status: "shipped",
    items: [
      {
        product: products[2],
        quantity: 1,
        price: products[2].price,
      },
    ],
    subtotal: 1150,
    shipping: 50,
    discount: 100,
    total: 1100,
    shippingInfo: {
      name: "Nittaya Wongsiri",
      email: "nittaya@example.com",
      phone: "089-876-5432",
      address: "456 Rama IV Road",
      city: "Bangkok",
      postalCode: "10500",
    },
    paymentMethod: "QR Payment",
  },
  {
    id: "3",
    orderNumber: "NV-2024-001236",
    date: "2024-12-15",
    status: "paid",
    items: [
      {
        product: products[3],
        quantity: 3,
        price: products[3].price,
      },
    ],
    subtotal: 2370,
    shipping: 0,
    discount: 237,
    total: 2133,
    shippingInfo: {
      name: "Apinya Suwannarat",
      email: "apinya@example.com",
      phone: "092-345-6789",
      address: "789 Petchburi Road",
      city: "Bangkok",
      postalCode: "10400",
    },
    paymentMethod: "Bank Transfer",
  },
];

export const users: User[] = [
  {
    id: "1",
    name: "Somchai Prasert",
    email: "somchai@example.com",
    phone: "081-234-5678",
    role: "customer",
    registeredDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Nittaya Wongsiri",
    email: "nittaya@example.com",
    phone: "089-876-5432",
    role: "customer",
    registeredDate: "2024-03-22",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@noirvita.com",
    phone: "02-123-4567",
    role: "admin",
    registeredDate: "2023-11-01",
  },
];

export const payments: Payment[] = [
  {
    id: "1",
    orderId: "1",
    date: "2024-12-20",
    amount: 3520,
    method: "Credit Card",
    status: "completed",
  },
  {
    id: "2",
    orderId: "2",
    date: "2024-12-18",
    amount: 1100,
    method: "QR Payment",
    status: "completed",
  },
  {
    id: "3",
    orderId: "3",
    date: "2024-12-15",
    amount: 2133,
    method: "Bank Transfer",
    status: "pending",
  },
];

export const blogArticles: BlogArticle[] = [
  {
    id: "1",
    slug: "collagen-benefits-skin-health",
    title: "Understanding Collagen: Benefits for Skin Health",
    excerpt: "Explore the science behind collagen supplementation and its potential benefits for maintaining skin elasticity and hydration.",
    content: `
# Understanding Collagen: Benefits for Skin Health

Collagen is the most abundant protein in the human body, accounting for approximately 30% of total protein content. It plays a crucial role in maintaining skin structure, elasticity, and hydration.

## What is Collagen?

Collagen is a structural protein that forms the foundation of connective tissues throughout the body, including skin, bones, tendons, and ligaments. There are at least 16 types of collagen, with Type I being the most abundant in skin.

## Natural Collagen Decline

As we age, our body's natural collagen production decreases by approximately 1% per year after age 20. This decline contributes to common signs of aging such as fine lines, wrinkles, and reduced skin elasticity.

## Collagen Supplementation

Research suggests that oral collagen supplementation may support skin health through several mechanisms:

- **Hydration**: Studies indicate collagen peptides may help improve skin hydration levels
- **Elasticity**: Regular supplementation may support skin elasticity
- **Dermal Density**: Some research suggests potential benefits for dermal collagen density

## Choosing Quality Supplements

When selecting a collagen supplement, consider:

- **Source**: Marine or bovine collagen peptides
- **Molecular Weight**: Hydrolyzed collagen for better absorption
- **Additional Ingredients**: Vitamin C supports natural collagen synthesis
- **Third-Party Testing**: Look for quality certifications

## Important Considerations

While research is promising, individual results may vary. Collagen supplementation should be part of a comprehensive approach to skin health that includes:

- Adequate hydration
- Balanced nutrition
- Sun protection
- Quality sleep
- Stress management

**Disclaimer**: This article is for informational purposes only and is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before starting any supplement regimen.
    `,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80",
    author: "Dr. Siriporn Tanaka",
    publishedDate: "2024-12-10",
    tags: ["Collagen", "Skin Health", "Anti-Aging"],
    readTime: 8,
  },
  {
    id: "2",
    slug: "gut-health-immune-system",
    title: "The Gut-Immune Connection: What You Need to Know",
    excerpt: "Discover how gut health influences your immune system and practical steps to support your digestive wellness.",
    content: `
# The Gut-Immune Connection: What You Need to Know

The human gut is home to trillions of microorganisms, collectively known as the gut microbiome. This complex ecosystem plays a vital role in overall health, particularly immune function.

## Understanding the Gut Microbiome

Your gut microbiome consists of:

- Bacteria (both beneficial and harmful)
- Viruses
- Fungi
- Other microorganisms

A healthy balance of these organisms supports digestive health, nutrient absorption, and immune function.

## The Immune Connection

Approximately 70% of the immune system resides in the gut-associated lymphoid tissue (GALT). The gut microbiome influences immune function through:

- **Barrier Function**: Supporting the intestinal barrier that prevents harmful substances from entering the bloodstream
- **Immune Cell Training**: Helping educate immune cells to distinguish between harmful and harmless substances
- **Anti-inflammatory Compounds**: Producing substances that support healthy inflammatory responses

## Supporting Gut Health

Consider these evidence-based approaches:

### Diet
- Include fermented foods (if tolerated)
- Consume adequate fiber from diverse sources
- Stay hydrated
- Limit processed foods

### Lifestyle
- Manage stress levels
- Get regular physical activity
- Prioritize quality sleep
- Avoid unnecessary antibiotic use

### Supplementation
Probiotic supplements may support gut health, particularly:
- After antibiotic treatment
- During times of digestive discomfort
- For specific health goals under professional guidance

## Important Considerations

Individual microbiomes are unique. What works for one person may not work for another. Consult a healthcare professional for personalized guidance, especially if you have:

- Digestive disorders
- Autoimmune conditions
- Compromised immune function
- Chronic health conditions

**Disclaimer**: This information is educational and not intended to diagnose, treat, cure, or prevent any disease.
    `,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80",
    author: "Dr. Apinya Wellness",
    publishedDate: "2024-12-05",
    tags: ["Gut Health", "Immunity", "Probiotics"],
    readTime: 10,
  },
  {
    id: "3",
    slug: "omega-3-heart-brain-health",
    title: "Omega-3 Fatty Acids: Supporting Heart and Brain Health",
    excerpt: "Learn about the essential role of omega-3 fatty acids in cardiovascular and cognitive health.",
    content: `
# Omega-3 Fatty Acids: Supporting Heart and Brain Health

Omega-3 fatty acids are essential fats that the body cannot produce on its own, making dietary intake crucial for optimal health.

## Types of Omega-3s

The three main types are:

- **EPA (Eicosapentaenoic Acid)**: Primarily found in fish oil
- **DHA (Docosahexaenoic Acid)**: Abundant in fish oil and algae
- **ALA (Alpha-Linolenic Acid)**: Found in plant sources like flaxseed

The body can convert small amounts of ALA to EPA and DHA, but this process is inefficient.

## Cardiovascular Benefits

Research supports omega-3s for heart health:

- May help maintain healthy triglyceride levels
- Supports healthy blood pressure in normal ranges
- May support healthy inflammatory responses
- Contributes to overall cardiovascular function

## Brain and Cognitive Support

DHA is a major structural component of brain tissue:

- Supports brain cell membrane integrity
- May play a role in cognitive function
- Important during pregnancy for fetal brain development
- May support mood and mental well-being

## Dietary Sources

### Fish and Seafood
- Salmon
- Mackerel
- Sardines
- Anchovies
- Herring

### Plant Sources (ALA)
- Flaxseeds and flaxseed oil
- Chia seeds
- Walnuts
- Hemp seeds

## Supplementation Considerations

When choosing omega-3 supplements:

- **Purity**: Look for third-party testing for contaminants
- **Form**: Triglyceride or phospholipid forms may have better absorption
- **Dosage**: Follow healthcare provider recommendations
- **Storage**: Keep refrigerated to prevent oxidation

## Safety Notes

- Consult your healthcare provider if taking blood-thinning medications
- High doses may increase bleeding risk
- Quality matters - choose reputable brands with purity testing

**Disclaimer**: This content is for educational purposes only and not intended to diagnose, treat, cure, or prevent any disease.
    `,
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1200&q=80",
    author: "Dr. Nattapong Research",
    publishedDate: "2024-11-28",
    tags: ["Omega-3", "Heart Health", "Brain Health"],
    readTime: 9,
  },
  {
    id: "4",
    slug: "vitamin-d-importance",
    title: "Vitamin D: The Sunshine Vitamin for Immune and Bone Health",
    excerpt: "Understanding vitamin D's crucial role in immune function, bone health, and overall wellness.",
    content: `
# Vitamin D: The Sunshine Vitamin for Immune and Bone Health

Vitamin D is a fat-soluble vitamin that functions more like a hormone in the body, influencing numerous physiological processes.

## How We Get Vitamin D

The body produces vitamin D when skin is exposed to UVB radiation from sunlight. However, many factors affect production:

- Geographic location
- Season
- Time of day
- Skin pigmentation
- Age
- Sunscreen use

## Key Functions

### Bone Health
- Regulates calcium absorption
- Supports bone mineralization
- Important for skeletal development and maintenance

### Immune Function
- Supports immune cell function
- May influence immune response
- Plays a role in inflammatory processes

### Other Potential Benefits
Research is exploring vitamin D's role in:
- Mood and mental health
- Muscle function
- Cardiovascular health

## Deficiency Concerns

Vitamin D deficiency is common, particularly in:
- People with limited sun exposure
- Older adults
- Those with darker skin pigmentation
- Individuals with certain medical conditions

Symptoms may include:
- Fatigue
- Muscle weakness
- Bone pain
- Mood changes

## Food Sources

Natural dietary sources are limited:
- Fatty fish (salmon, mackerel)
- Egg yolks
- Fortified foods (milk, cereals)
- Mushrooms exposed to UV light

## Supplementation

Many healthcare providers recommend vitamin D supplementation:

- **Typical Dose**: 1,000-2,000 IU daily for adults
- **Testing**: Blood tests can determine vitamin D status
- **Form**: Vitamin D3 (cholecalciferol) is generally preferred
- **Timing**: Take with fat-containing meals for better absorption

## Safety Considerations

While vitamin D toxicity is rare, it's possible with very high doses:
- Follow recommended dosages
- Regular testing if taking high doses
- Consult healthcare provider for personalized recommendations

**Disclaimer**: This information is educational and not intended to replace medical advice. Consult your healthcare provider for personalized guidance.
    `,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80",
    author: "Dr. Siriporn Tanaka",
    publishedDate: "2024-11-20",
    tags: ["Vitamin D", "Immunity", "Bone Health"],
    readTime: 7,
  },
];

export const certificates: Certificate[] = [
  {
    id: "1",
    name: "Good Manufacturing Practice",
    shortName: "GMP",
    description: "Our facility is certified under Good Manufacturing Practice standards, ensuring consistent quality, safety, and efficacy in all our products. GMP certification demonstrates our commitment to maintaining the highest manufacturing standards.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    issuedBy: "FDA Thailand",
    validUntil: "2025-12-31",
  },
  {
    id: "2",
    name: "Hazard Analysis and Critical Control Points",
    shortName: "HACCP",
    description: "HACCP certification ensures systematic identification and control of potential hazards in our production process. This internationally recognized food safety system guarantees the safety and quality of our supplements.",
    image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&q=80",
    issuedBy: "Ministry of Public Health",
    validUntil: "2025-11-30",
  },
  {
    id: "3",
    name: "Food and Drug Administration Certified Facility",
    shortName: "FDA (TH)",
    description: "Our products and facilities are registered and approved by the Thai Food and Drug Administration. This certification confirms compliance with all regulatory requirements for dietary supplement manufacturing and distribution.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    issuedBy: "Thai FDA",
    validUntil: "2026-01-15",
  },
];
