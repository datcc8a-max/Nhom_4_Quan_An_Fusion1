// Data module: MENU items and promo codes
window.MENU = [
  {id:1,name:'Phở Bò Tái Chín',cat:'pho',img:'images/foods/Phở Bò Việt Nam.webp',price:75000,oldPrice:null,desc:'Nước dùng hầm xương từ 8 tiếng, thịt bò tươi thái mỏng, rau thơm tươi ngon. Đậm đà hương vị Hà Nội.',rating:4.9,ratingCount:234,badge:'Bestseller',toppings:['Thêm hành','Thêm rau','Thêm tương','Không mì chính','Ít nước béo'],prep:15,kcal:480,serves:1},
  {id:2,name:'Phở Gà Hoa Cúc',cat:'pho',img:'images/foods/img_b4158787.jpg',price:65000,oldPrice:75000,desc:'Gà ta thả vườn luộc chín tới, nước dùng thanh ngọt, hoa cúc vàng thơm đặc trưng.',rating:4.7,ratingCount:189,badge:'Sale',toppings:['Thêm hành','Thêm rau','Ít nước','Nhiều nước','Thêm da giòn'],prep:12,kcal:390,serves:1},
  {id:3,name:'Bún Bò Huế Chánh Gốc',cat:'pho',img:'images/foods/img_a678ecfd.jpg',price:70000,oldPrice:null,desc:'Cay nồng đặc trưng xứ Huế, chả lụa giò heo mềm, mắm ruốc thơm, sả bầm.',rating:4.8,ratingCount:156,badge:null,toppings:['Ít cay','Vừa cay','Cay nhiều','Thêm chả','Không tiết'],prep:18,kcal:520,serves:1},
  {id:4,name:'Cơm Tấm Sườn Nướng',cat:'com',img:'images/foods/com_tam.png',price:80000,oldPrice:null,desc:'Sườn non ướp 12h nướng than hoa giòn cạnh, cơm tấm dẻo thơm, bì chả, đồ chua ngọt.',rating:4.9,ratingCount:312,badge:'Bestseller',toppings:['Thêm trứng','Thêm bì chả','Ít cơm','Nhiều cơm','Thêm sườn'],prep:20,kcal:650,serves:1},
  {id:5,name:'Cơm Chiên Dương Châu',cat:'com',img:'images/foods/img_def3c946.jpg',price:60000,oldPrice:null,desc:'Cơm chiên thập cẩm: tôm, thịt xá xíu, trứng, hành lá, dưa leo, cà rốt.',rating:4.6,ratingCount:98,badge:'New',toppings:['Ít dầu','Không tỏi','Thêm trứng','Cay','Thêm tôm'],prep:10,kcal:580,serves:1},
  {id:6,name:'Cơm Gà Hội An',cat:'com',img:'images/foods/Cơm Gà Hội An.webp',price:75000,oldPrice:85000,desc:'Gà ta đặc biệt, cơm trộn mỡ gà vàng ươm thơm, rau răm tươi, nước mắm gừng.',rating:4.8,ratingCount:201,badge:'Sale',toppings:['Thêm da giòn','Nước mắm riêng','Ít cơm','Thêm gừng'],prep:15,kcal:540,serves:1},
  {id:7,name:'Bánh Mì Thịt Đặc Biệt',cat:'banh',img:'images/foods/Bánh Mì Thịt Đặc biệt.webp',price:35000,oldPrice:null,desc:'Bánh mì vỏ giòn tan, đầy nhân: thịt nguội, chả lụa, pate gan, dưa chua, rau thơm, ớt.',rating:4.7,ratingCount:445,badge:'Bestseller',toppings:['Thêm trứng ốp','Ít rau','Thêm tương ớt','Không hành','Thêm pate'],prep:5,kcal:320,serves:1},
  {id:8,name:'Bánh Cuốn Hà Nội',cat:'banh',img:'images/foods/banh_cuon.png',price:50000,oldPrice:null,desc:'Bánh tráng mỏng như lụa, nhân thịt băm mộc nhĩ, hành phi giòn, chấm nước mắm chua ngọt.',rating:4.6,ratingCount:87,badge:'New',toppings:['Thêm chả lụa','Ít hành phi','Nước chấm riêng','Thêm chả quế'],prep:8,kcal:280,serves:1},
  {id:9,name:'Trà Sữa Trân Châu Đen',cat:'nuoc',img:'images/foods/tra_sua.png',price:45000,oldPrice:55000,desc:'Trà oolong thơm mượt, sữa tươi Vinamilk, trân châu đen dẻo tự làm mỗi ngày.',rating:4.8,ratingCount:567,badge:'Sale',toppings:['Ít đường (50%)','Ngọt vừa (70%)','Ngọt nhiều (100%)','Ít đá','Không đá','Thêm thạch','Thêm kem béo'],prep:5,kcal:280,serves:1},
  {id:10,name:'Nước Ép Cam Vắt',cat:'nuoc',img:'images/foods/nước ép cam vắt.png',price:35000,oldPrice:null,desc:'Cam sành Đồng Tháp vắt tươi 100%, không thêm đường, không chất bảo quản. Nguyên chất.',rating:4.5,ratingCount:123,badge:null,toppings:['Ít đá','Không đường','Thêm đường','Thêm muối ớt'],prep:3,kcal:110,serves:1},
  {id:11,name:'Cà Phê Sữa Đá',cat:'nuoc',img:'images/foods/img_ab3cff56.jpg',price:30000,oldPrice:null,desc:'Cà phê phin robusta đậm đặc, sữa đặc ông Thọ ngọt béo, đá viên lớn không tan nhanh.',rating:4.7,ratingCount:289,badge:null,toppings:['Ít đá','Nhiều đá','Ít ngọt','Nhiều sữa','Đen đá','Pha phin tại chỗ'],prep:8,kcal:120,serves:1},
  {id:12,name:'Chè Ba Màu Sài Gòn',cat:'trangmieng',img:'images/foods/img_c96061f3.jpg',price:40000,oldPrice:null,desc:'Đậu đỏ nấu nhuyễn, đậu xanh bông, thạch lá dứa, chan đẫm nước cốt dừa béo ngậy.',rating:4.6,ratingCount:78,badge:'New',toppings:['Ít đường','Nhiều nước cốt dừa','Thêm đá','Không đá','Thêm thạch'],prep:3,kcal:240,serves:1},
  {id:13,name:'Kem Dừa Sầu Riêng',cat:'trangmieng',img:'images/foods/img_f7168373.jpg',price:55000,oldPrice:65000,desc:'Kem dừa làm từ nước cốt dừa Bến Tre, múi sầu riêng Ri6 Cai Lậy béo thơm, trân châu.',rating:4.9,ratingCount:198,badge:'Sale',toppings:['Thêm trân châu','Thêm thạch','Thêm sầu riêng','Ít đường','Kem cốt dừa thêm'],prep:5,kcal:320,serves:1},
  {id:14,name:'Combo Phở Đặc Biệt',cat:'khuyen-mai',img:'images/foods/img_48ac30c5.jpg',price:85000,oldPrice:120000,desc:'COMBO TIẾT KIỆM: Phở bò tái chín cỡ L + Nước ép cam vắt + Chè ba màu. Tiết kiệm 35.000đ!',rating:4.9,ratingCount:341,badge:'Sale',toppings:['Tùy chọn phở','Thêm hành','Ít cay'],prep:15,kcal:810,serves:2},
  {id:15,name:'Combo Cơm Chiều',cat:'khuyen-mai',img:'images/foods/combo_com.png',price:99000,oldPrice:140000,desc:'COMBO GIA ĐÌNH: Cơm tấm sườn đặc biệt + Phở bò tái + Trà sữa size L. Đủ no cả buổi!',rating:4.8,ratingCount:212,badge:'Sale',toppings:['Tùy chọn','Ít cay','Thêm rau'],prep:20,kcal:1100,serves:2},
  {id:16,name:'Bún Chả Hà Nội',cat:'pho',img:'images/foods/bun_cha.png',price:65000,oldPrice:null,desc:'Chả thịt nướng than hoa thơm lừng, bún tươi, rau sống và nước chấm chua ngọt đặc trưng Hà thành.',rating:4.8,ratingCount:180,badge:'New',toppings:['Thêm chả','Thêm nem','Ít bún','Nhiều rau'],prep:18,kcal:580,serves:1},
  {id:17,name:'Gỏi Cuốn Tôm Thịt',cat:'banh',img:'images/foods/img_62022bcd.jpg',price:45000,oldPrice:null,desc:'Bánh tráng cuốn tôm, thịt luộc, bún và rau thơm. Chấm cùng tương đen hoặc nước mắm chua ngọt.',rating:4.7,ratingCount:155,badge:null,toppings:['Tương đen','Nước mắm','Thêm tôm','Chỉ rau'],prep:10,kcal:220,serves:2},
  {id:18,name:'Hủ Tiếu Nam Vang',cat:'pho',img:'images/foods/hu_tieu.png',price:70000,oldPrice:null,desc:'Sợi hủ tiếu dai, nước dùng đậm đà với tôm, thịt bằm, tim, cật và trứng cút.',rating:4.7,ratingCount:130,badge:null,toppings:['Khô','Nước','Thêm tôm','Không nội tạng'],prep:15,kcal:450,serves:1},
  {id:19,name:'Bánh Xèo Miền Tây',cat:'banh',img:'images/foods/banh_xeo.png',price:60000,oldPrice:null,desc:'Vỏ bánh giòn rụm, vàng ươm với nhân tôm, thịt ba chỉ và giá đỗ. Ăn kèm rau sống và nước mắm chua ngọt.',rating:4.6,ratingCount:115,badge:'New',toppings:['Thêm tôm','Ít dầu','Nhiều rau sống'],prep:12,kcal:380,serves:1},
  {id:20,name:'Nước Mía Lau',cat:'nuoc',img:'images/foods/nuoc_mia.png',price:20000,oldPrice:null,desc:'Nước mía ép nguyên chất, thêm chút tắc và lá dứa cho hương vị thơm mát, giải nhiệt.',rating:4.8,ratingCount:350,badge:null,toppings:['Ít đường','Nhiều tắc','Không đá'],prep:3,kcal:90,serves:1},
];

window.PROMO_CODES = {
  'PHOGIA20': {type:'fixed',val:20000,label:'Giảm 20.000đ',disabled:false},
  'WELCOME10': {type:'pct',val:10,label:'Giảm 10%',disabled:false},
  'SALE50K': {type:'fixed',val:50000,label:'Giảm 50.000đ',disabled:false},
  'FREESHIP': {type:'ship',val:15000,label:'Miễn phí ship',disabled:false},
  'NEWUSER': {type:'pct',val:15,label:'Giảm 15%',disabled:false},
};

// merge any saved promo customizations from localStorage (keeps behavior from app.js)
(function(){
  const savedPromoCodes = JSON.parse(localStorage.getItem('pgd_promo_codes') || 'null');
  if(savedPromoCodes){
    Object.keys(savedPromoCodes).forEach(code => {
      window.PROMO_CODES[code] = Object.assign({}, window.PROMO_CODES[code] || {}, savedPromoCodes[code]);
    });
  }
})();

