window.PROJECTS = [
            {
                id: 'monolith-residence',
                category: 'residential',
                categoryLabel: 'Жилой комплекс',
                title: 'Клубный дом «Монолит»',
                scale: 'М 1:100',
                size: '1600 × 1200 × 750 мм',
                materials: 'Акрил, анодированная латунь, шпон ореха',
                time: '5 недель',
                description: 'Выставочный макет премиального жилого комплекса с детальной проработкой фасадов из натурального камня, благоустройством приватного двора-парка и индивидуальной поквартирной подсветкой с управлением через iPad.',
                svgType: 'tower'
            },
            {
                id: 'river-quarter',
                category: 'urban',
                categoryLabel: 'Градостроительство',
                title: 'Мастер-план «Речной квартал»',
                scale: 'М 1:500',
                size: '3200 × 2400 × 650 мм',
                materials: 'Архитектурный полистирол, литой акрил, массив дуба',
                time: '8 недель',
                description: 'Градостроительный макет редевелопмента набережной площадью 42 гектара. Включает многоуровневый рельеф местности, имитацию водной глади с глубинной подсветкой и транспортные развязки.',
                svgType: 'urban'
            },
            {
                id: 'energy-hub',
                category: 'industrial',
                categoryLabel: 'Промышленный объект',
                title: 'Терминал СПГ и энергоблок',
                scale: 'М 1:250',
                size: '2100 × 1500 × 600 мм',
                materials: '3D-фотополимер, металл, прозрачный акрил',
                time: '6 недель',
                description: 'Технологический макет промышленного кластера для международного экономического форума. Воспроизведены трубопроводные эстакады, криогенные резервуары и динамическая индикация технологических потоков.',
                svgType: 'industrial'
            },
            {
                id: 'hamovniki-villa',
                category: 'residential',
                categoryLabel: 'Жилой комплекс',
                title: 'Резиденция «Саввинская»',
                scale: 'М 1:75',
                size: '1400 × 1100 × 820 мм',
                materials: 'Матовый акрил, латунный профиль, орех',
                time: '4 недели',
                description: 'Камерный макет для закрытого офиса продаж. Выполнен в монохромной тёплой палитре с акцентными латунными ламелями и защитным колпаком из осветлённого музейного стекла.',
                svgType: 'villa'
            },
            {
                id: 'innovation-park',
                category: 'urban',
                categoryLabel: 'Градостроительство',
                title: 'Технополис «Горизонт»',
                scale: 'М 1:1000',
                size: '2800 × 1900 × 550 мм',
                materials: 'Фрезерованный ПВХ, акрил, шпон ясеня',
                time: '7 недель',
                description: 'Концептуальный градостроительный макет научно-образовательного кластера. Чёткое зонирование очередей строительства с помощью программируемых световых контуров.',
                svgType: 'urban'
            },
            {
                id: 'logistics-center',
                category: 'industrial',
                categoryLabel: 'Промышленный объект',
                title: 'Автоматизированный хаб класса А+',
                scale: 'М 1:200',
                size: '1900 × 1300 × 500 мм',
                materials: 'Акрил, фотополимерная печать, композит',
                time: '4.5 недели',
                description: 'Макет со съёмной кровлей, демонстрирующий внутреннюю логистику, стеллажные системы высокой плотности, погрузочные доки и маршруты беспилотного транспорта.',
                svgType: 'industrial'
            }
];

        // Generate crisp architectural isometric SVG illustrations for portfolio cards & modal
        window.projectSVG = function(type) {
            const commonAttrs = 'viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet" fill="none" stroke-width="0.9"';
            if (type === 'tower') {
                return `<svg ${commonAttrs}>
                    <polygon points="200,225 60,155 200,85 340,155" fill="#1C1612" stroke="#B59473" stroke-opacity="0.4"/>
                    <polygon points="200,195 115,152 200,110 285,152" fill="#261E18" stroke="#EAE0D5" stroke-opacity="0.4"/>
                    <polygon points="200,175 145,147 200,120 255,147" fill="#32271F"/>
                    <polygon points="145,147 200,175 200,75 145,47" fill="#231B15" stroke="#EAE0D5" stroke-opacity="0.45"/>
                    <polygon points="255,147 200,175 200,75 255,47" fill="#1A140F" stroke="#B59473" stroke-opacity="0.6"/>
                    <polygon points="200,75 145,47 200,20 255,47" fill="#3D3026" stroke="#EAE0D5" stroke-opacity="0.7"/>
                    <line x1="163" y1="56" x2="163" y2="156" stroke="#B59473" stroke-opacity="0.5"/>
                    <line x1="181" y1="65" x2="181" y2="165" stroke="#B59473" stroke-opacity="0.5"/>
                    <line x1="219" y1="65" x2="219" y2="165" stroke="#EAE0D5" stroke-opacity="0.3"/>
                    <line x1="237" y1="56" x2="237" y2="156" stroke="#EAE0D5" stroke-opacity="0.3"/>
                    <line x1="40" y1="155" x2="360" y2="155" stroke="#B59473" stroke-opacity="0.2" stroke-dasharray="3 3"/>
                </svg>`;
            }
            if (type === 'urban') {
                return `<svg ${commonAttrs}>
                    <polygon points="200,230 45,150 200,70 355,150" fill="#1A1410" stroke="#B59473" stroke-opacity="0.45"/>
                    <path d="M95,175 Q175,140 295,120" stroke="#B59473" stroke-width="1.5" stroke-opacity="0.5"/>
                    <polygon points="150,130 120,115 150,100 180,115" fill="#382C23"/>
                    <polygon points="120,115 150,130 150,95 120,80" fill="#261D17"/>
                    <polygon points="180,115 150,130 150,95 180,80" fill="#1E1712"/>
                    <polygon points="225,115 195,100 225,85 255,100" fill="#46372C"/>
                    <polygon points="195,100 225,115 225,68 195,53" fill="#2E231C"/>
                    <polygon points="255,100 225,115 225,68 255,53" fill="#211914"/>
                    <polygon points="250,165 215,147 250,130 285,147" fill="#3B2E24"/>
                    <polygon points="215,147 250,165 250,138 215,120" fill="#271E18"/>
                    <polygon points="285,147 250,165 250,138 285,120" fill="#1C1611"/>
                </svg>`;
            }
            if (type === 'industrial') {
                return `<svg ${commonAttrs}>
                    <polygon points="200,225 55,152 200,80 345,152" fill="#191410" stroke="#B59473" stroke-opacity="0.4"/>
                    <polygon points="185,170 105,130 165,100 245,140" fill="#362A21" stroke="#EAE0D5" stroke-opacity="0.4"/>
                    <polygon points="105,130 185,170 185,135 105,95" fill="#251D17"/>
                    <polygon points="245,140 185,170 185,135 245,105" fill="#1B1510"/>
                    <ellipse cx="265" cy="110" rx="22" ry="11" fill="#47382C" stroke="#EAE0D5" stroke-opacity="0.5"/>
                    <path d="M243,110 L243,142 A22,11 0 0,0 287,142 L287,110" fill="#2A211A"/>
                    <ellipse cx="220" cy="88" rx="18" ry="9" fill="#47382C" stroke="#EAE0D5" stroke-opacity="0.5"/>
                    <path d="M202,88 L202,118 A18,9 0 0,0 238,118 L238,88" fill="#2A211A"/>
                    <line x1="165" y1="100" x2="220" y2="88" stroke="#EAE0D5" stroke-width="1.2"/>
                </svg>`;
            }
            return `<svg ${commonAttrs}>
                <polygon points="200,220 65,152 200,85 335,152" fill="#1C1612" stroke="#B59473" stroke-opacity="0.45"/>
                <polygon points="200,180 110,135 200,90 290,135" fill="#3B2E24" stroke="#EAE0D5" stroke-opacity="0.5"/>
                <polygon points="110,135 200,180 200,142 110,97" fill="#281F18"/>
                <polygon points="290,135 200,180 200,142 290,97" fill="#1E1712"/>
                <polygon points="200,145 135,112 200,80 265,112" fill="#4F3E31" stroke="#EAE0D5" stroke-opacity="0.75"/>
                <polygon points="135,112 200,145 200,118 135,85" fill="#342820"/>
                <polygon points="265,112 200,145 200,118 265,85" fill="#251C16"/>
            </svg>`;
        }
