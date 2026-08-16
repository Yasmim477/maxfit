export type Category = "Proteínas" | "Performance" | "Saúde" | "Acessórios" | "Snacks";

export type Product = {
  id: number;
  slug: string;
  familySlug: string;
  variantName: string;
  name: string;
  brand: string;
  category: Category;
  goal: string;
  size: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  accent: string;
  description: string;
  benefits: string[];
  stock: number;
  sortOrder: number;
  featured: boolean;
};

type ProductInput = Omit<Product, "description" | "benefits" | "stock" | "sortOrder" | "featured"> &
  Partial<Pick<Product, "description" | "benefits" | "stock" | "sortOrder" | "featured">>;

const product = (data: ProductInput): Product => ({
  description: "Qualidade Maxfit para acompanhar sua rotina de treino.",
  benefits: ["Qualidade selecionada", "Excelente custo-benefício", "Envio rápido"],
  stock: 50,
  sortOrder: data.id,
  featured: false,
  ...data,
});

const whey = {
  familySlug: "whey-prime",
  name: "100% Whey Prime",
  brand: "MAXFIT LABS",
  category: "Proteínas" as const,
  goal: "Ganho de massa",
  price: 139.9,
  oldPrice: 179.9,
  rating: 4.9,
  reviews: 438,
  image: "/assets/images/maxfit-whey-prime.webp",
  accent: "#c8ff2e",
  description: "Blend proteico cremoso com 24 g de proteína por porção, feito para recuperação e construção muscular.",
  benefits: ["24 g de proteína", "Ótima dissolução", "Aminoácidos essenciais"],
  featured: true,
  sortOrder: 10,
};

const preWorkout = {
  familySlug: "pre-treino-insane",
  name: "Pré-Treino Insane",
  brand: "MAXFIT LABS",
  category: "Performance" as const,
  goal: "Energia e foco",
  price: 94.9,
  oldPrice: 129.9,
  rating: 4.8,
  reviews: 284,
  image: "/assets/images/maxfit-pre-treino.webp",
  accent: "#ff5b63",
  description: "Fórmula de alta energia para treinos intensos, com foco e disposição do início ao fim.",
  benefits: ["Energia prolongada", "Mais foco", "300 g · 30 doses"],
  featured: true,
  sortOrder: 30,
};

const isolate = {
  familySlug: "whey-isolado-zero",
  name: "Whey Isolado Zero",
  brand: "MAXFIT LABS",
  category: "Proteínas" as const,
  goal: "Definição muscular",
  price: 189.9,
  oldPrice: 229.9,
  rating: 4.8,
  reviews: 197,
  image: "/assets/images/maxfit-iso-zero.webp",
  accent: "#5ed2ff",
  description: "Proteína isolada de rápida absorção, sem lactose e com baixo teor de carboidratos.",
  benefits: ["Zero lactose", "26 g de proteína", "Baixo carboidrato"],
  featured: true,
  sortOrder: 20,
};

const vegan = {
  familySlug: "vegan-pro",
  name: "Vegan Protein Pro",
  brand: "MAXFIT LABS",
  category: "Proteínas" as const,
  goal: "Nutrição vegetal",
  price: 149.9,
  oldPrice: 184.9,
  rating: 4.8,
  reviews: 168,
  image: "/assets/images/maxfit-vegan.webp",
  accent: "#54c96c",
  description: "Proteína vegetal completa, cremosa e sem ingredientes de origem animal.",
  benefits: ["100% vegetal", "22 g de proteína", "Sem lactose"],
  sortOrder: 40,
};

const hyperMass = {
  familySlug: "hyper-mass",
  name: "Hyper Mass",
  brand: "MAXFIT LABS",
  category: "Proteínas" as const,
  goal: "Ganho de peso e massa",
  price: 124.9,
  oldPrice: 159.9,
  rating: 4.7,
  reviews: 121,
  image: "/assets/images/maxfit-hyper-mass.webp",
  accent: "#ff8c2e",
  description: "Hipercalórico completo para elevar o aporte energético e apoiar o ganho de massa.",
  benefits: ["Alta densidade calórica", "Proteínas e carboidratos", "3 kg"],
  sortOrder: 50,
};

const gear = {
  brand: "MAXFIT GEAR",
  category: "Acessórios" as const,
  image: "/assets/images/maxfit-gear.webp",
};

const snacks = {
  brand: "MAXFIT FOODS",
  category: "Snacks" as const,
  image: "/assets/images/maxfit-snacks.webp",
};

export const FALLBACK_PRODUCTS: Product[] = [
  product({ id: 1, slug: "whey-prime-chocolate", variantName: "Chocolate belga", size: "900 g · Chocolate belga", badge: "Mais vendido", ...whey }),
  product({ id: 2, slug: "creatina-monohidratada", familySlug: "creatina-monohidratada", variantName: "Sem sabor", name: "Creatina Monohidratada", brand: "MAXFIT LABS", category: "Performance", goal: "Força e potência", size: "300 g · 100% pura", price: 79.9, oldPrice: 109.9, rating: 4.9, reviews: 612, image: "/assets/images/maxfit-creatina.webp", badge: "Top 1 creatina", accent: "#35a7ff", description: "Creatina monohidratada micronizada e sem aditivos, para força, potência e desempenho.", benefits: ["100% pura", "3 g por dose", "Sem sabor"], featured: true, sortOrder: 60 }),
  product({ id: 3, slug: "pre-treino-insane-frutas-vermelhas", variantName: "Frutas vermelhas", size: "300 g · Frutas vermelhas", badge: "Novo", ...preWorkout }),
  product({ id: 4, slug: "whey-isolado-zero-baunilha", variantName: "Baunilha", size: "900 g · Baunilha", badge: "Zero lactose", ...isolate }),
  product({ id: 5, slug: "multivitaminico-complete", familySlug: "multivitaminico-complete", variantName: "120 cápsulas", name: "Multivitamínico Complete", brand: "MAXFIT NUTRITION", category: "Saúde", goal: "Saúde e imunidade", size: "120 cápsulas", price: 49.9, oldPrice: 64.9, rating: 4.7, reviews: 156, image: "/assets/images/maxfit-multi-daily.webp", badge: "Uso diário", accent: "#e6b84c", description: "Vitaminas e minerais essenciais em uma fórmula prática para a rotina.", benefits: ["23 nutrientes", "Antioxidantes", "120 cápsulas"], sortOrder: 120 }),
  product({ id: 6, slug: "omega-3-ultra", familySlug: "omega-3-ultra", variantName: "120 cápsulas", name: "Ômega 3 Ultra", brand: "MAXFIT NUTRITION", category: "Saúde", goal: "Bem-estar diário", size: "120 cápsulas · 1000 mg", price: 59.9, oldPrice: 79.9, rating: 4.8, reviews: 209, image: "/assets/images/maxfit-multi-daily.webp", badge: "Alta concentração", accent: "#5ed2ff", description: "Fonte concentrada de EPA e DHA para complementar a alimentação diária.", benefits: ["EPA + DHA", "Alta concentração", "120 cápsulas"], sortOrder: 130 }),
  product({ id: 7, slug: "pasta-amendoim-crunchy", familySlug: "pasta-amendoim", variantName: "Crocante", name: "Pasta de Amendoim Pro", goal: "Energia saudável", size: "600 g · Crocante", price: 34.9, oldPrice: 44.9, rating: 4.9, reviews: 331, badge: "Sem açúcar", accent: "#e9ad62", description: "Pasta de amendoim integral, fonte de gorduras boas e sem adição de açúcar.", benefits: ["Sem açúcar", "100% amendoim", "Fonte de proteína"], sortOrder: 180, ...snacks }),
  product({ id: 8, slug: "protein-bar-chocolate-crunch", familySlug: "protein-bar", variantName: "Chocolate Crunch", name: "Protein Bar", goal: "Lanche proteico", size: "Caixa com 12 · Chocolate Crunch", price: 74.9, oldPrice: 89.9, rating: 4.7, reviews: 124, badge: "15 g proteína", accent: "#d89cff", description: "Barra macia e crocante para levar proteína a qualquer lugar.", benefits: ["15 g de proteína", "Caixa com 12", "Prática e saborosa"], sortOrder: 190, ...snacks }),
  product({ id: 9, slug: "coqueteleira-pro-700-fume", familySlug: "coqueteleira-pro-700", variantName: "Fumê", name: "Coqueteleira Pro 700", goal: "Praticidade", size: "700 ml · Fumê", price: 39.9, oldPrice: 54.9, rating: 4.8, reviews: 275, badge: "BPA free", accent: "#c8ff2e", description: "Coqueteleira resistente com mixer interno e fechamento seguro.", benefits: ["BPA free", "Mixer interno", "Tampa antivazamento"], sortOrder: 220, ...gear }),
  product({ id: 10, slug: "kit-mini-bands-force", familySlug: "kit-mini-bands-force", variantName: "5 intensidades", name: "Kit Mini Bands Force", goal: "Treino funcional", size: "5 intensidades · Bolsa inclusa", price: 64.9, oldPrice: 84.9, rating: 4.8, reviews: 188, accent: "#ff8f70", description: "Cinco níveis de resistência para mobilidade, ativação e treino funcional.", benefits: ["5 intensidades", "Tecido resistente", "Bolsa inclusa"], sortOrder: 230, ...gear }),
  product({ id: 11, slug: "luva-training-grip-m", familySlug: "luva-training-grip", variantName: "M", name: "Luva Training Grip", goal: "Proteção e aderência", size: "Tamanho M · Par", price: 69.9, oldPrice: 89.9, rating: 4.6, reviews: 94, accent: "#a6b0be", description: "Luva respirável com palma aderente para proteger as mãos durante o treino.", benefits: ["Palma antiderrapante", "Tecido respirável", "Ajuste firme"], sortOrder: 240, ...gear }),
  product({ id: 12, slug: "cinto-power-lift-m", familySlug: "cinto-power-lift", variantName: "M", name: "Cinto Power Lift", goal: "Estabilidade e força", size: "Tamanho M · 10 mm", price: 119.9, oldPrice: 149.9, rating: 4.9, reviews: 143, badge: "Linha premium", accent: "#f4cc79", description: "Suporte lombar firme para agachamentos, levantamentos e treinos de força.", benefits: ["10 mm de espessura", "Fecho reforçado", "Suporte lombar"], sortOrder: 250, ...gear }),

  product({ id: 13, slug: "whey-prime-baunilha", variantName: "Baunilha cremosa", size: "900 g · Baunilha cremosa", ...whey }),
  product({ id: 14, slug: "whey-prime-morango", variantName: "Morango", size: "900 g · Morango", ...whey }),
  product({ id: 15, slug: "whey-prime-cookies", variantName: "Cookies & Cream", size: "900 g · Cookies & Cream", ...whey }),
  product({ id: 16, slug: "pre-treino-insane-blue-ice", variantName: "Blue Ice", size: "300 g · Blue Ice", ...preWorkout }),
  product({ id: 17, slug: "pre-treino-insane-maca-verde", variantName: "Maçã verde", size: "300 g · Maçã verde", ...preWorkout }),
  product({ id: 18, slug: "whey-isolado-zero-chocolate", variantName: "Chocolate", size: "900 g · Chocolate", ...isolate }),
  product({ id: 19, slug: "whey-isolado-zero-coco", variantName: "Coco", size: "900 g · Coco", ...isolate }),
  product({ id: 20, slug: "vegan-pro-chocolate", variantName: "Chocolate", size: "700 g · Chocolate", badge: "100% vegetal", ...vegan }),
  product({ id: 21, slug: "vegan-pro-banana-canela", variantName: "Banana com canela", size: "700 g · Banana com canela", ...vegan }),
  product({ id: 22, slug: "hyper-mass-chocolate", variantName: "Chocolate", size: "3 kg · Chocolate", badge: "3 kg", ...hyperMass }),
  product({ id: 23, slug: "hyper-mass-baunilha", variantName: "Baunilha", size: "3 kg · Baunilha", ...hyperMass }),
  product({ id: 24, slug: "bcaa-recovery-uva", familySlug: "bcaa-recovery", variantName: "Uva", name: "BCAA Recovery", brand: "MAXFIT LABS", category: "Performance", goal: "Recuperação muscular", size: "400 g · Uva", price: 72.9, oldPrice: 94.9, rating: 4.7, reviews: 138, image: "/assets/images/maxfit-recovery.webp", badge: "Recovery", accent: "#a970ff", description: "Aminoácidos essenciais para apoiar recuperação e resistência muscular.", benefits: ["BCAA 2:1:1", "400 g", "Recuperação"], sortOrder: 70 }),
  product({ id: 25, slug: "bcaa-recovery-limao", familySlug: "bcaa-recovery", variantName: "Limão", name: "BCAA Recovery", brand: "MAXFIT LABS", category: "Performance", goal: "Recuperação muscular", size: "400 g · Limão", price: 72.9, oldPrice: 94.9, rating: 4.7, reviews: 138, image: "/assets/images/maxfit-recovery.webp", accent: "#a970ff", sortOrder: 70 }),
  product({ id: 26, slug: "glutamina-pure", familySlug: "glutamina-pure", variantName: "Sem sabor", name: "Glutamina Pure", brand: "MAXFIT LABS", category: "Performance", goal: "Recuperação e imunidade", size: "300 g · Sem sabor", price: 64.9, oldPrice: 84.9, rating: 4.8, reviews: 176, image: "/assets/images/maxfit-recovery.webp", badge: "100% L-Glutamina", accent: "#e7ecf2", description: "L-glutamina pura e sem sabor para complementar sua rotina de recuperação.", benefits: ["100% L-glutamina", "Sem sabor", "300 g"], sortOrder: 80 }),
  product({ id: 27, slug: "hydration-blue-raspberry", familySlug: "hydration-electrolytes", variantName: "Blue Raspberry", name: "Hydration Electrolytes", brand: "MAXFIT LABS", category: "Performance", goal: "Hidratação e resistência", size: "360 g · Blue Raspberry", price: 69.9, oldPrice: 89.9, rating: 4.8, reviews: 119, image: "/assets/images/maxfit-recovery.webp", badge: "Eletrólitos", accent: "#35d5ff", description: "Reposição de eletrólitos com sabor leve para treinos longos e dias intensos.", benefits: ["Eletrólitos", "Hidratação rápida", "Baixo açúcar"], sortOrder: 90 }),
  product({ id: 28, slug: "hydration-limao", familySlug: "hydration-electrolytes", variantName: "Limão", name: "Hydration Electrolytes", brand: "MAXFIT LABS", category: "Performance", goal: "Hidratação e resistência", size: "360 g · Limão", price: 69.9, oldPrice: 89.9, rating: 4.8, reviews: 119, image: "/assets/images/maxfit-recovery.webp", accent: "#35d5ff", sortOrder: 90 }),
  product({ id: 29, slug: "magnesio-complex", familySlug: "magnesio-complex", variantName: "90 cápsulas", name: "Magnésio Complex", brand: "MAXFIT NUTRITION", category: "Saúde", goal: "Relaxamento e recuperação", size: "90 cápsulas · 3 fontes", price: 44.9, oldPrice: 59.9, rating: 4.7, reviews: 98, image: "/assets/images/maxfit-multi-daily.webp", badge: "3 fontes", accent: "#8ca4ff", description: "Três fontes de magnésio em uma fórmula para músculos, energia e rotina de sono.", benefits: ["3 fontes de magnésio", "90 cápsulas", "Uso diário"], sortOrder: 140 }),
  product({ id: 30, slug: "colageno-peptides-frutas-vermelhas", familySlug: "colageno-peptides", variantName: "Frutas vermelhas", name: "Colágeno Peptides", brand: "MAXFIT NUTRITION", category: "Saúde", goal: "Pele, unhas e articulações", size: "300 g · Frutas vermelhas", price: 74.9, oldPrice: 94.9, rating: 4.8, reviews: 147, image: "/assets/images/maxfit-multi-daily.webp", badge: "Peptídeos", accent: "#ff91b9", description: "Peptídeos de colágeno com vitamina C para complementar sua rotina de cuidado.", benefits: ["Peptídeos bioativos", "Vitamina C", "300 g"], sortOrder: 150 }),
  product({ id: 31, slug: "colageno-peptides-neutro", familySlug: "colageno-peptides", variantName: "Neutro", name: "Colágeno Peptides", brand: "MAXFIT NUTRITION", category: "Saúde", goal: "Pele, unhas e articulações", size: "300 g · Neutro", price: 74.9, oldPrice: 94.9, rating: 4.8, reviews: 147, image: "/assets/images/maxfit-multi-daily.webp", accent: "#ff91b9", sortOrder: 150 }),
  product({ id: 32, slug: "pasta-amendoim-cremosa", familySlug: "pasta-amendoim", variantName: "Cremosa", name: "Pasta de Amendoim Pro", goal: "Energia saudável", size: "600 g · Cremosa", price: 34.9, oldPrice: 44.9, rating: 4.9, reviews: 331, accent: "#e9ad62", description: "Pasta de amendoim integral, fonte de gorduras boas e sem adição de açúcar.", benefits: ["Sem açúcar", "100% amendoim", "Fonte de proteína"], sortOrder: 180, ...snacks }),
  product({ id: 33, slug: "pasta-amendoim-cacau", familySlug: "pasta-amendoim", variantName: "Cacau", name: "Pasta de Amendoim Pro", goal: "Energia saudável", size: "600 g · Cacau", price: 37.9, oldPrice: 47.9, rating: 4.9, reviews: 331, accent: "#e9ad62", sortOrder: 180, ...snacks }),
  product({ id: 34, slug: "protein-bar-peanut-brownie", familySlug: "protein-bar", variantName: "Peanut Brownie", name: "Protein Bar", goal: "Lanche proteico", size: "Caixa com 12 · Peanut Brownie", price: 74.9, oldPrice: 89.9, rating: 4.7, reviews: 124, accent: "#d89cff", sortOrder: 190, ...snacks }),
  product({ id: 35, slug: "protein-bar-cookies", familySlug: "protein-bar", variantName: "Cookies", name: "Protein Bar", goal: "Lanche proteico", size: "Caixa com 12 · Cookies", price: 74.9, oldPrice: 89.9, rating: 4.7, reviews: 124, accent: "#d89cff", sortOrder: 190, ...snacks }),
  product({ id: 36, slug: "protein-granola-chocolate", familySlug: "protein-granola", variantName: "Chocolate", name: "Protein Granola", goal: "Café da manhã proteico", size: "350 g · Chocolate", price: 39.9, oldPrice: 49.9, rating: 4.8, reviews: 87, badge: "12 g proteína", accent: "#cf9a61", description: "Granola crocante com proteína, castanhas e sabor de verdade.", benefits: ["12 g de proteína", "Crocante", "350 g"], sortOrder: 200, ...snacks }),
  product({ id: 37, slug: "protein-granola-mel", familySlug: "protein-granola", variantName: "Mel e castanhas", name: "Protein Granola", goal: "Café da manhã proteico", size: "350 g · Mel e castanhas", price: 39.9, oldPrice: 49.9, rating: 4.8, reviews: 87, accent: "#cf9a61", sortOrder: 200, ...snacks }),
  product({ id: 38, slug: "coqueteleira-pro-700-lima", familySlug: "coqueteleira-pro-700", variantName: "Lima", name: "Coqueteleira Pro 700", goal: "Praticidade", size: "700 ml · Lima", price: 39.9, oldPrice: 54.9, rating: 4.8, reviews: 275, accent: "#c8ff2e", sortOrder: 220, ...gear }),
  product({ id: 39, slug: "coqueteleira-pro-700-preta", familySlug: "coqueteleira-pro-700", variantName: "Preta", name: "Coqueteleira Pro 700", goal: "Praticidade", size: "700 ml · Preta", price: 39.9, oldPrice: 54.9, rating: 4.8, reviews: 275, accent: "#c8ff2e", sortOrder: 220, ...gear }),
  product({ id: 40, slug: "luva-training-grip-p", familySlug: "luva-training-grip", variantName: "P", name: "Luva Training Grip", goal: "Proteção e aderência", size: "Tamanho P · Par", price: 69.9, oldPrice: 89.9, rating: 4.6, reviews: 94, accent: "#a6b0be", sortOrder: 240, ...gear }),
  product({ id: 41, slug: "luva-training-grip-g", familySlug: "luva-training-grip", variantName: "G", name: "Luva Training Grip", goal: "Proteção e aderência", size: "Tamanho G · Par", price: 69.9, oldPrice: 89.9, rating: 4.6, reviews: 94, accent: "#a6b0be", sortOrder: 240, ...gear }),
  product({ id: 42, slug: "luva-training-grip-gg", familySlug: "luva-training-grip", variantName: "GG", name: "Luva Training Grip", goal: "Proteção e aderência", size: "Tamanho GG · Par", price: 69.9, oldPrice: 89.9, rating: 4.6, reviews: 94, accent: "#a6b0be", sortOrder: 240, ...gear }),
  product({ id: 43, slug: "cinto-power-lift-p", familySlug: "cinto-power-lift", variantName: "P", name: "Cinto Power Lift", goal: "Estabilidade e força", size: "Tamanho P · 10 mm", price: 119.9, oldPrice: 149.9, rating: 4.9, reviews: 143, accent: "#f4cc79", sortOrder: 250, ...gear }),
  product({ id: 44, slug: "cinto-power-lift-g", familySlug: "cinto-power-lift", variantName: "G", name: "Cinto Power Lift", goal: "Estabilidade e força", size: "Tamanho G · 10 mm", price: 119.9, oldPrice: 149.9, rating: 4.9, reviews: 143, accent: "#f4cc79", sortOrder: 250, ...gear }),
  product({ id: 45, slug: "cinto-power-lift-gg", familySlug: "cinto-power-lift", variantName: "GG", name: "Cinto Power Lift", goal: "Estabilidade e força", size: "Tamanho GG · 10 mm", price: 119.9, oldPrice: 149.9, rating: 4.9, reviews: 143, accent: "#f4cc79", sortOrder: 250, ...gear }),
  product({ id: 46, slug: "lifting-straps-pro", familySlug: "lifting-straps-pro", variantName: "Par", name: "Lifting Straps Pro", goal: "Pegada e cargas altas", size: "Par · Algodão reforçado", price: 39.9, oldPrice: 54.9, rating: 4.8, reviews: 76, badge: "Nova linha", accent: "#8cf7e7", description: "Straps reforçados para ampliar a segurança da pegada em puxadas e levantamentos.", benefits: ["Algodão reforçado", "Alça acolchoada", "Par"], sortOrder: 260, ...gear }),
];
