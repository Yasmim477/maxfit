-- Expande o catálogo sem alterar usuários, carrinhos ou pedidos existentes.
alter table public.products
  add column family_slug text,
  add column variant_name text,
  add column description text not null default '',
  add column benefits text[] not null default '{}',
  add column stock integer not null default 50 check (stock >= 0),
  add column sort_order integer not null default 1000,
  add column featured boolean not null default false;

insert into public.products (
  slug, name, brand, category, goal, size, price, old_price, rating, reviews,
  image_path, badge, accent, active, family_slug, variant_name, stock, sort_order, featured
) values
  ('whey-prime', '100% Whey Prime', 'MAXFIT LABS', 'Proteínas', 'Ganho de massa', '900 g · Chocolate belga', 139.90, 179.90, 4.9, 438, 'assets/images/maxfit-whey-prime.webp', 'Mais vendido', '#c8ff2e', true, 'whey-prime', 'Chocolate belga', 72, 10, true),
  ('creatina-monohidratada', 'Creatina Monohidratada', 'MAXFIT LABS', 'Performance', 'Força e potência', '300 g · 100% pura', 79.90, 109.90, 4.9, 612, 'assets/images/maxfit-creatina.webp', 'Top 1 creatina', '#35a7ff', true, 'creatina-monohidratada', 'Sem sabor', 86, 60, true),
  ('pre-treino-insane', 'Pré-Treino Insane', 'MAXFIT LABS', 'Performance', 'Energia e foco', '300 g · Frutas vermelhas', 94.90, 129.90, 4.8, 284, 'assets/images/maxfit-pre-treino.webp', 'Novo', '#ff5b63', true, 'pre-treino-insane', 'Frutas vermelhas', 44, 30, true),
  ('whey-isolado-zero', 'Whey Isolado Zero', 'MAXFIT LABS', 'Proteínas', 'Definição muscular', '900 g · Baunilha', 189.90, 229.90, 4.8, 197, 'assets/images/maxfit-iso-zero.webp', 'Zero lactose', '#5ed2ff', true, 'whey-isolado-zero', 'Baunilha', 39, 20, true),
  ('multivitaminico-complete', 'Multivitamínico Complete', 'MAXFIT NUTRITION', 'Saúde', 'Saúde e imunidade', '120 cápsulas', 49.90, 64.90, 4.7, 156, 'assets/images/maxfit-multi-daily.webp', 'Uso diário', '#e6b84c', true, 'multivitaminico-complete', '120 cápsulas', 65, 120, false),
  ('omega-3-ultra', 'Ômega 3 Ultra', 'MAXFIT NUTRITION', 'Saúde', 'Bem-estar diário', '120 cápsulas · 1000 mg', 59.90, 79.90, 4.8, 209, 'assets/images/maxfit-multi-daily.webp', 'Alta concentração', '#5ed2ff', true, 'omega-3-ultra', '120 cápsulas', 58, 130, false),
  ('pasta-amendoim-crunchy', 'Pasta de Amendoim Pro', 'MAXFIT FOODS', 'Snacks', 'Energia saudável', '600 g · Crocante', 34.90, 44.90, 4.9, 331, 'assets/images/maxfit-snacks.webp', 'Sem açúcar', '#e9ad62', true, 'pasta-amendoim', 'Crocante', 77, 180, false),
  ('protein-bar-trio', 'Protein Bar', 'MAXFIT FOODS', 'Snacks', 'Lanche proteico', 'Caixa com 12 · Chocolate Crunch', 74.90, 89.90, 4.7, 124, 'assets/images/maxfit-snacks.webp', '15 g proteína', '#d89cff', true, 'protein-bar', 'Chocolate Crunch', 48, 190, false),
  ('coqueteleira-pro-700', 'Coqueteleira Pro 700', 'MAXFIT GEAR', 'Acessórios', 'Praticidade', '700 ml · Fumê', 39.90, 54.90, 4.8, 275, 'assets/images/maxfit-gear.webp', 'BPA free', '#c8ff2e', true, 'coqueteleira-pro-700', 'Fumê', 91, 220, false),
  ('kit-mini-bands-force', 'Kit Mini Bands Force', 'MAXFIT GEAR', 'Acessórios', 'Treino funcional', '5 intensidades · Bolsa inclusa', 64.90, 84.90, 4.8, 188, 'assets/images/maxfit-gear.webp', null, '#ff8f70', true, 'kit-mini-bands-force', '5 intensidades', 46, 230, false),
  ('luva-training-grip', 'Luva Training Grip', 'MAXFIT GEAR', 'Acessórios', 'Proteção e aderência', 'Tamanho M · Par', 69.90, 89.90, 4.6, 94, 'assets/images/maxfit-gear.webp', null, '#a6b0be', true, 'luva-training-grip', 'M', 31, 240, false),
  ('cinto-power-lift', 'Cinto Power Lift', 'MAXFIT GEAR', 'Acessórios', 'Estabilidade e força', 'Tamanho M · 10 mm', 119.90, 149.90, 4.9, 143, 'assets/images/maxfit-gear.webp', 'Linha premium', '#f4cc79', true, 'cinto-power-lift', 'M', 28, 250, false),
  ('whey-prime-baunilha', '100% Whey Prime', 'MAXFIT LABS', 'Proteínas', 'Ganho de massa', '900 g · Baunilha cremosa', 139.90, 179.90, 4.9, 438, 'assets/images/maxfit-whey-prime.webp', null, '#c8ff2e', true, 'whey-prime', 'Baunilha cremosa', 64, 10, true),
  ('whey-prime-morango', '100% Whey Prime', 'MAXFIT LABS', 'Proteínas', 'Ganho de massa', '900 g · Morango', 139.90, 179.90, 4.9, 438, 'assets/images/maxfit-whey-prime.webp', null, '#c8ff2e', true, 'whey-prime', 'Morango', 55, 10, true),
  ('whey-prime-cookies', '100% Whey Prime', 'MAXFIT LABS', 'Proteínas', 'Ganho de massa', '900 g · Cookies & Cream', 139.90, 179.90, 4.9, 438, 'assets/images/maxfit-whey-prime.webp', null, '#c8ff2e', true, 'whey-prime', 'Cookies & Cream', 61, 10, true),
  ('pre-treino-insane-blue-ice', 'Pré-Treino Insane', 'MAXFIT LABS', 'Performance', 'Energia e foco', '300 g · Blue Ice', 94.90, 129.90, 4.8, 284, 'assets/images/maxfit-pre-treino.webp', null, '#ff5b63', true, 'pre-treino-insane', 'Blue Ice', 41, 30, true),
  ('pre-treino-insane-maca-verde', 'Pré-Treino Insane', 'MAXFIT LABS', 'Performance', 'Energia e foco', '300 g · Maçã verde', 94.90, 129.90, 4.8, 284, 'assets/images/maxfit-pre-treino.webp', null, '#ff5b63', true, 'pre-treino-insane', 'Maçã verde', 38, 30, true),
  ('whey-isolado-zero-chocolate', 'Whey Isolado Zero', 'MAXFIT LABS', 'Proteínas', 'Definição muscular', '900 g · Chocolate', 189.90, 229.90, 4.8, 197, 'assets/images/maxfit-iso-zero.webp', null, '#5ed2ff', true, 'whey-isolado-zero', 'Chocolate', 36, 20, true),
  ('whey-isolado-zero-coco', 'Whey Isolado Zero', 'MAXFIT LABS', 'Proteínas', 'Definição muscular', '900 g · Coco', 189.90, 229.90, 4.8, 197, 'assets/images/maxfit-iso-zero.webp', null, '#5ed2ff', true, 'whey-isolado-zero', 'Coco', 32, 20, true),
  ('vegan-pro-chocolate', 'Vegan Protein Pro', 'MAXFIT LABS', 'Proteínas', 'Nutrição vegetal', '700 g · Chocolate', 149.90, 184.90, 4.8, 168, 'assets/images/maxfit-vegan.webp', '100% vegetal', '#54c96c', true, 'vegan-pro', 'Chocolate', 39, 40, false),
  ('vegan-pro-banana-canela', 'Vegan Protein Pro', 'MAXFIT LABS', 'Proteínas', 'Nutrição vegetal', '700 g · Banana com canela', 149.90, 184.90, 4.8, 168, 'assets/images/maxfit-vegan.webp', null, '#54c96c', true, 'vegan-pro', 'Banana com canela', 34, 40, false),
  ('hyper-mass-chocolate', 'Hyper Mass', 'MAXFIT LABS', 'Proteínas', 'Ganho de peso e massa', '3 kg · Chocolate', 124.90, 159.90, 4.7, 121, 'assets/images/maxfit-hyper-mass.webp', '3 kg', '#ff8c2e', true, 'hyper-mass', 'Chocolate', 47, 50, false),
  ('hyper-mass-baunilha', 'Hyper Mass', 'MAXFIT LABS', 'Proteínas', 'Ganho de peso e massa', '3 kg · Baunilha', 124.90, 159.90, 4.7, 121, 'assets/images/maxfit-hyper-mass.webp', null, '#ff8c2e', true, 'hyper-mass', 'Baunilha', 43, 50, false),
  ('bcaa-recovery-uva', 'BCAA Recovery', 'MAXFIT LABS', 'Performance', 'Recuperação muscular', '400 g · Uva', 72.90, 94.90, 4.7, 138, 'assets/images/maxfit-recovery.webp', 'Recovery', '#a970ff', true, 'bcaa-recovery', 'Uva', 52, 70, false),
  ('bcaa-recovery-limao', 'BCAA Recovery', 'MAXFIT LABS', 'Performance', 'Recuperação muscular', '400 g · Limão', 72.90, 94.90, 4.7, 138, 'assets/images/maxfit-recovery.webp', null, '#a970ff', true, 'bcaa-recovery', 'Limão', 49, 70, false),
  ('glutamina-pure', 'Glutamina Pure', 'MAXFIT LABS', 'Performance', 'Recuperação e imunidade', '300 g · Sem sabor', 64.90, 84.90, 4.8, 176, 'assets/images/maxfit-recovery.webp', '100% L-Glutamina', '#e7ecf2', true, 'glutamina-pure', 'Sem sabor', 56, 80, false),
  ('hydration-blue-raspberry', 'Hydration Electrolytes', 'MAXFIT LABS', 'Performance', 'Hidratação e resistência', '360 g · Blue Raspberry', 69.90, 89.90, 4.8, 119, 'assets/images/maxfit-recovery.webp', 'Eletrólitos', '#35d5ff', true, 'hydration-electrolytes', 'Blue Raspberry', 42, 90, false),
  ('hydration-limao', 'Hydration Electrolytes', 'MAXFIT LABS', 'Performance', 'Hidratação e resistência', '360 g · Limão', 69.90, 89.90, 4.8, 119, 'assets/images/maxfit-recovery.webp', null, '#35d5ff', true, 'hydration-electrolytes', 'Limão', 45, 90, false),
  ('magnesio-complex', 'Magnésio Complex', 'MAXFIT NUTRITION', 'Saúde', 'Relaxamento e recuperação', '90 cápsulas · 3 fontes', 44.90, 59.90, 4.7, 98, 'assets/images/maxfit-multi-daily.webp', '3 fontes', '#8ca4ff', true, 'magnesio-complex', '90 cápsulas', 54, 140, false),
  ('colageno-peptides-frutas-vermelhas', 'Colágeno Peptides', 'MAXFIT NUTRITION', 'Saúde', 'Pele, unhas e articulações', '300 g · Frutas vermelhas', 74.90, 94.90, 4.8, 147, 'assets/images/maxfit-multi-daily.webp', 'Peptídeos', '#ff91b9', true, 'colageno-peptides', 'Frutas vermelhas', 38, 150, false),
  ('colageno-peptides-neutro', 'Colágeno Peptides', 'MAXFIT NUTRITION', 'Saúde', 'Pele, unhas e articulações', '300 g · Neutro', 74.90, 94.90, 4.8, 147, 'assets/images/maxfit-multi-daily.webp', null, '#ff91b9', true, 'colageno-peptides', 'Neutro', 40, 150, false),
  ('pasta-amendoim-cremosa', 'Pasta de Amendoim Pro', 'MAXFIT FOODS', 'Snacks', 'Energia saudável', '600 g · Cremosa', 34.90, 44.90, 4.9, 331, 'assets/images/maxfit-snacks.webp', null, '#e9ad62', true, 'pasta-amendoim', 'Cremosa', 72, 180, false),
  ('pasta-amendoim-cacau', 'Pasta de Amendoim Pro', 'MAXFIT FOODS', 'Snacks', 'Energia saudável', '600 g · Cacau', 37.90, 47.90, 4.9, 331, 'assets/images/maxfit-snacks.webp', null, '#e9ad62', true, 'pasta-amendoim', 'Cacau', 63, 180, false),
  ('protein-bar-peanut-brownie', 'Protein Bar', 'MAXFIT FOODS', 'Snacks', 'Lanche proteico', 'Caixa com 12 · Peanut Brownie', 74.90, 89.90, 4.7, 124, 'assets/images/maxfit-snacks.webp', null, '#d89cff', true, 'protein-bar', 'Peanut Brownie', 51, 190, false),
  ('protein-bar-cookies', 'Protein Bar', 'MAXFIT FOODS', 'Snacks', 'Lanche proteico', 'Caixa com 12 · Cookies', 74.90, 89.90, 4.7, 124, 'assets/images/maxfit-snacks.webp', null, '#d89cff', true, 'protein-bar', 'Cookies', 54, 190, false),
  ('protein-granola-chocolate', 'Protein Granola', 'MAXFIT FOODS', 'Snacks', 'Café da manhã proteico', '350 g · Chocolate', 39.90, 49.90, 4.8, 87, 'assets/images/maxfit-snacks.webp', '12 g proteína', '#cf9a61', true, 'protein-granola', 'Chocolate', 52, 200, false),
  ('protein-granola-mel', 'Protein Granola', 'MAXFIT FOODS', 'Snacks', 'Café da manhã proteico', '350 g · Mel e castanhas', 39.90, 49.90, 4.8, 87, 'assets/images/maxfit-snacks.webp', null, '#cf9a61', true, 'protein-granola', 'Mel e castanhas', 49, 200, false),
  ('coqueteleira-pro-700-lima', 'Coqueteleira Pro 700', 'MAXFIT GEAR', 'Acessórios', 'Praticidade', '700 ml · Lima', 39.90, 54.90, 4.8, 275, 'assets/images/maxfit-gear.webp', null, '#c8ff2e', true, 'coqueteleira-pro-700', 'Lima', 74, 220, false),
  ('coqueteleira-pro-700-preta', 'Coqueteleira Pro 700', 'MAXFIT GEAR', 'Acessórios', 'Praticidade', '700 ml · Preta', 39.90, 54.90, 4.8, 275, 'assets/images/maxfit-gear.webp', null, '#c8ff2e', true, 'coqueteleira-pro-700', 'Preta', 79, 220, false),
  ('luva-training-grip-p', 'Luva Training Grip', 'MAXFIT GEAR', 'Acessórios', 'Proteção e aderência', 'Tamanho P · Par', 69.90, 89.90, 4.6, 94, 'assets/images/maxfit-gear.webp', null, '#a6b0be', true, 'luva-training-grip', 'P', 25, 240, false),
  ('luva-training-grip-g', 'Luva Training Grip', 'MAXFIT GEAR', 'Acessórios', 'Proteção e aderência', 'Tamanho G · Par', 69.90, 89.90, 4.6, 94, 'assets/images/maxfit-gear.webp', null, '#a6b0be', true, 'luva-training-grip', 'G', 29, 240, false),
  ('luva-training-grip-gg', 'Luva Training Grip', 'MAXFIT GEAR', 'Acessórios', 'Proteção e aderência', 'Tamanho GG · Par', 69.90, 89.90, 4.6, 94, 'assets/images/maxfit-gear.webp', null, '#a6b0be', true, 'luva-training-grip', 'GG', 22, 240, false),
  ('cinto-power-lift-p', 'Cinto Power Lift', 'MAXFIT GEAR', 'Acessórios', 'Estabilidade e força', 'Tamanho P · 10 mm', 119.90, 149.90, 4.9, 143, 'assets/images/maxfit-gear.webp', null, '#f4cc79', true, 'cinto-power-lift', 'P', 18, 250, false),
  ('cinto-power-lift-g', 'Cinto Power Lift', 'MAXFIT GEAR', 'Acessórios', 'Estabilidade e força', 'Tamanho G · 10 mm', 119.90, 149.90, 4.9, 143, 'assets/images/maxfit-gear.webp', null, '#f4cc79', true, 'cinto-power-lift', 'G', 21, 250, false),
  ('cinto-power-lift-gg', 'Cinto Power Lift', 'MAXFIT GEAR', 'Acessórios', 'Estabilidade e força', 'Tamanho GG · 10 mm', 119.90, 149.90, 4.9, 143, 'assets/images/maxfit-gear.webp', null, '#f4cc79', true, 'cinto-power-lift', 'GG', 16, 250, false),
  ('lifting-straps-pro', 'Lifting Straps Pro', 'MAXFIT GEAR', 'Acessórios', 'Pegada e cargas altas', 'Par · Algodão reforçado', 39.90, 54.90, 4.8, 76, 'assets/images/maxfit-gear.webp', 'Nova linha', '#8cf7e7', true, 'lifting-straps-pro', 'Par', 48, 260, false)
on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  category = excluded.category,
  goal = excluded.goal,
  size = excluded.size,
  price = excluded.price,
  old_price = excluded.old_price,
  rating = excluded.rating,
  reviews = excluded.reviews,
  image_path = excluded.image_path,
  badge = excluded.badge,
  accent = excluded.accent,
  active = excluded.active,
  family_slug = excluded.family_slug,
  variant_name = excluded.variant_name,
  stock = excluded.stock,
  sort_order = excluded.sort_order,
  featured = excluded.featured;

update public.products as product
set description = family.description,
    benefits = family.benefits
from (values
  ('whey-prime', 'Blend proteico cremoso com 24 g de proteína por porção, feito para recuperação e construção muscular.', array['24 g de proteína', 'Ótima dissolução', 'Aminoácidos essenciais']::text[]),
  ('whey-isolado-zero', 'Proteína isolada de rápida absorção, sem lactose e com baixo teor de carboidratos.', array['Zero lactose', '26 g de proteína', 'Baixo carboidrato']::text[]),
  ('vegan-pro', 'Proteína vegetal completa, cremosa e sem ingredientes de origem animal.', array['100% vegetal', '22 g de proteína', 'Sem lactose']::text[]),
  ('hyper-mass', 'Hipercalórico completo para elevar o aporte energético e apoiar o ganho de massa.', array['Alta densidade calórica', 'Proteínas e carboidratos', '3 kg']::text[]),
  ('creatina-monohidratada', 'Creatina monohidratada micronizada e sem aditivos, para força, potência e desempenho.', array['100% pura', '3 g por dose', 'Sem sabor']::text[]),
  ('pre-treino-insane', 'Fórmula de alta energia para treinos intensos, com foco e disposição do início ao fim.', array['Energia prolongada', 'Mais foco', '300 g · 30 doses']::text[]),
  ('bcaa-recovery', 'Aminoácidos essenciais para apoiar recuperação e resistência muscular.', array['BCAA 2:1:1', '400 g', 'Recuperação']::text[]),
  ('glutamina-pure', 'L-glutamina pura e sem sabor para complementar sua rotina de recuperação.', array['100% L-glutamina', 'Sem sabor', '300 g']::text[]),
  ('hydration-electrolytes', 'Reposição de eletrólitos com sabor leve para treinos longos e dias intensos.', array['Eletrólitos', 'Hidratação rápida', 'Baixo açúcar']::text[]),
  ('multivitaminico-complete', 'Vitaminas e minerais essenciais em uma fórmula prática para a rotina.', array['23 nutrientes', 'Antioxidantes', '120 cápsulas']::text[]),
  ('omega-3-ultra', 'Fonte concentrada de EPA e DHA para complementar a alimentação diária.', array['EPA + DHA', 'Alta concentração', '120 cápsulas']::text[]),
  ('magnesio-complex', 'Três fontes de magnésio em uma fórmula para músculos, energia e rotina de sono.', array['3 fontes de magnésio', '90 cápsulas', 'Uso diário']::text[]),
  ('colageno-peptides', 'Peptídeos de colágeno com vitamina C para complementar sua rotina de cuidado.', array['Peptídeos bioativos', 'Vitamina C', '300 g']::text[]),
  ('pasta-amendoim', 'Pasta de amendoim integral, fonte de gorduras boas e sem adição de açúcar.', array['Sem açúcar', '100% amendoim', 'Fonte de proteína']::text[]),
  ('protein-bar', 'Barra macia e crocante para levar proteína a qualquer lugar.', array['15 g de proteína', 'Caixa com 12', 'Prática e saborosa']::text[]),
  ('protein-granola', 'Granola crocante com proteína, castanhas e sabor de verdade.', array['12 g de proteína', 'Crocante', '350 g']::text[]),
  ('coqueteleira-pro-700', 'Coqueteleira resistente com mixer interno e fechamento seguro.', array['BPA free', 'Mixer interno', 'Tampa antivazamento']::text[]),
  ('kit-mini-bands-force', 'Cinco níveis de resistência para mobilidade, ativação e treino funcional.', array['5 intensidades', 'Tecido resistente', 'Bolsa inclusa']::text[]),
  ('luva-training-grip', 'Luva respirável com palma aderente para proteger as mãos durante o treino.', array['Palma antiderrapante', 'Tecido respirável', 'Ajuste firme']::text[]),
  ('cinto-power-lift', 'Suporte lombar firme para agachamentos, levantamentos e treinos de força.', array['10 mm de espessura', 'Fecho reforçado', 'Suporte lombar']::text[]),
  ('lifting-straps-pro', 'Straps reforçados para ampliar a segurança da pegada em puxadas e levantamentos.', array['Algodão reforçado', 'Alça acolchoada', 'Par']::text[])
) as family(family_slug, description, benefits)
where product.family_slug = family.family_slug;

update public.products
set family_slug = slug
where family_slug is null;

update public.products
set variant_name = size
where variant_name is null;

alter table public.products
  alter column family_slug set not null,
  alter column variant_name set not null;

create index products_active_sort_order_idx
  on public.products (sort_order, family_slug)
  where active = true;

analyze public.products;
