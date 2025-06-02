const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Tüm makaleleri getir (beğeni sayısına göre sıralı)
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ likes: -1, createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tek bir makaleyi getir
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Makale bulunamadı' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Makaleyi beğen
router.post('/:id/like', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Makale bulunamadı' });
    }
    
    article.likes += 1;
    await article.save();
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// İlk makaleleri oluştur
const initialArticles = [
  {
    title: "Tasarruf Etmenin 10 Etkili Yolu",
    content: `Tasarruf etmek, finansal özgürlüğe giden yolda en önemli adımlardan biridir. İşte size yardımcı olacak 10 etkili yöntem:

1. Bütçe Planlaması
Her ay başında gelir ve giderlerinizi planlayın. Gereksiz harcamaları tespit edip azaltın.

2. Otomatik Tasarruf
Maaşınızın belirli bir yüzdesini otomatik olarak tasarruf hesabına aktarın.

3. Alışveriş Listesi
Market alışverişlerinde liste yapın ve sadece ihtiyacınız olanları alın.

4. Fatura Takibi
Elektrik, su, doğalgaz gibi faturalarınızı düzenli kontrol edin ve tasarruf önlemleri alın.

5. Toplu Taşıma
Mümkün olduğunca toplu taşıma kullanın, araç masraflarını azaltın.

6. Ev Yemekleri
Dışarıda yemek yemeyi azaltın, ev yemeklerine ağırlık verin.

7. İkinci El Alışveriş
Bazı eşyaları ikinci el olarak almayı değerlendirin.

8. Kupon ve İndirimler
Alışverişlerde kupon ve indirimleri takip edin.

9. Acil Durum Fonu
En az 3 aylık giderinizi karşılayacak bir acil durum fonu oluşturun.

10. Yatırım Yapın
Tasarruflarınızı değerlendirin, uzun vadeli yatırımlar yapın.`,
    summary: "Finansal özgürlüğe ulaşmak için uygulayabileceğiniz 10 etkili tasarruf yöntemi.",
    category: "Tasarruf",
    readTime: 5
  },
  {
    title: "Yatırım Yapmaya Başlamak İçin Rehber",
    content: `Yatırım yapmak, geleceğinizi güvence altına almanın en etkili yollarından biridir. İşte başlangıç için temel bilgiler:

1. Risk Profili Belirleme
Öncelikle risk toleransınızı belirleyin. Ne kadar risk alabileceğinizi düşünün.

2. Finansal Hedefler
Kısa, orta ve uzun vadeli hedeflerinizi belirleyin.

3. Portföy Çeşitlendirme
Yatırımlarınızı farklı varlık sınıflarına dağıtın.

4. Düzenli Yatırım
Her ay düzenli olarak yatırım yapın.

5. Araştırma
Yatırım yapmadan önce detaylı araştırma yapın.

6. Profesyonel Danışmanlık
Gerekirse profesyonel yardım alın.

7. Sabırlı Olun
Yatırımlarınızda sabırlı olun, kısa vadeli dalgalanmalara takılmayın.

8. Sürekli Öğrenin
Finansal okuryazarlığınızı geliştirin.`,
    summary: "Yatırım dünyasına adım atmak isteyenler için temel rehber.",
    category: "Yatırım",
    readTime: 4
  },
  {
    title: "Etkili Bütçe Yönetimi",
    content: `Bütçe yönetimi, finansal sağlığınızın temelidir. İşte etkili bütçe yönetimi için ipuçları:

1. Gelir-Gider Analizi
Tüm gelir ve giderlerinizi detaylı olarak kaydedin.

2. Kategori Bazlı Planlama
Harcamalarınızı kategorilere ayırın ve her kategori için limit belirleyin.

3. Acil Durum Fonu
Beklenmedik durumlar için fon oluşturun.

4. Borç Yönetimi
Borçlarınızı önceliklendirin ve planlı şekilde ödeyin.

5. Tasarruf Hedefleri
Belirli tasarruf hedefleri koyun.

6. Düzenli Kontrol
Bütçenizi düzenli olarak gözden geçirin.

7. Teknoloji Kullanımı
Bütçe takip uygulamalarından faydalanın.

8. Aile Katılımı
Tüm aile bireylerini sürece dahil edin.`,
    summary: "Finansal hedeflerinize ulaşmak için etkili bütçe yönetimi stratejileri.",
    category: "Bütçe",
    readTime: 6
  },
  {
    title: "Borç Yönetimi Stratejileri",
    content: `Borç yönetimi, finansal sağlığınız için kritik öneme sahiptir. İşte etkili borç yönetimi stratejileri:

1. Borç Envanteri
Tüm borçlarınızı listeleyin ve önceliklendirin.

2. Ödeme Planı
Her borç için gerçekçi ödeme planları oluşturun.

3. Faiz Oranları
Yüksek faizli borçları önceliklendirin.

4. Konsolidasyon
Uygun koşullarda borç birleştirmeyi değerlendirin.

5. Bütçe Ayarlaması
Borç ödemeleri için bütçenizi düzenleyin.

6. Ek Gelir
Gerekirse ek gelir kaynakları oluşturun.

7. Profesyonel Yardım
İhtiyaç halinde uzman desteği alın.

8. Borç Önleme
Gelecekte borçlanmayı önleyecek stratejiler geliştirin.`,
    summary: "Borçlarınızı etkili şekilde yönetmek için pratik stratejiler.",
    category: "Borç Yönetimi",
    readTime: 5
  },
  {
    title: "Dijital Finansal Okuryazarlık",
    content: `Dijital çağda finansal okuryazarlık daha da önem kazanıyor. İşte dijital finansal okuryazarlık için öneriler:

1. Online Bankacılık
Online bankacılık hizmetlerini etkin kullanın.

2. Fintech Uygulamaları
Finansal teknoloji uygulamalarını takip edin.

3. Güvenlik Önlemleri
Dijital güvenlik önlemlerini öğrenin ve uygulayın.

4. Dijital Bütçe Takibi
Dijital bütçe takip araçlarını kullanın.

5. Online Yatırım
Online yatırım platformlarını değerlendirin.

6. Kripto Para
Kripto para ve blockchain teknolojisini anlayın.

7. Dijital Ödeme
Dijital ödeme yöntemlerini öğrenin.

8. Sürekli Öğrenme
Dijital finans dünyasındaki gelişmeleri takip edin.`,
    summary: "Dijital çağda finansal okuryazarlığınızı geliştirmek için rehber.",
    category: "Yatırım",
    readTime: 4
  },
  {
    title: "Emeklilik Planlaması",
    content: `Emeklilik planlaması, geleceğiniz için kritik öneme sahiptir. İşte emeklilik planlaması için öneriler:

1. Erken Başlama
Emeklilik planlamasına erken yaşlarda başlayın.

2. Hedef Belirleme
Emeklilik hedeflerinizi belirleyin.

3. Tasarruf Stratejisi
Düzenli tasarruf planı oluşturun.

4. Yatırım Çeşitlendirme
Farklı yatırım araçlarını değerlendirin.

5. Emeklilik Hesapları
Bireysel emeklilik sistemini değerlendirin.

6. Sağlık Sigortası
Sağlık sigortası planlaması yapın.

7. Vasiyet Planlaması
Vasiyet ve miras planlaması yapın.

8. Profesyonel Danışmanlık
Uzman desteği alın.`,
    summary: "Konforlu bir emeklilik için erken planlama stratejileri.",
    category: "Yatırım",
    readTime: 6
  },
  {
    title: "Finansal Bağımsızlık Yolculuğu",
    content: `Finansal bağımsızlık, birçok kişinin hedefidir. İşte finansal bağımsızlığa giden yol:

1. Hedef Belirleme
Net finansal hedefler belirleyin.

2. Gelir Artırma
Gelir kaynaklarınızı çeşitlendirin.

3. Tasarruf Oranı
Tasarruf oranınızı artırın.

4. Yatırım Stratejisi
Uzun vadeli yatırım stratejisi geliştirin.

5. Borç Yönetimi
Borçlarınızı etkin yönetin.

6. Risk Yönetimi
Risk yönetimi stratejileri geliştirin.

7. Sürekli Öğrenme
Finansal okuryazarlığınızı geliştirin.

8. Disiplin
Finansal disiplini koruyun.`,
    summary: "Finansal bağımsızlığa ulaşmak için adım adım rehber.",
    category: "Tasarruf",
    readTime: 5
  },
  {
    title: "Aile Finansı Yönetimi",
    content: `Aile finansı yönetimi, aile bütünlüğü için önemlidir. İşte aile finansı yönetimi için öneriler:

1. Aile Bütçesi
Ortak aile bütçesi oluşturun.

2. Finansal Hedefler
Aile hedeflerini belirleyin.

3. Tasarruf Planı
Aile tasarruf planı yapın.

4. Eğitim Planlaması
Çocukların eğitimi için planlama yapın.

5. Acil Durum Fonu
Aile acil durum fonu oluşturun.

6. Sigorta Planlaması
Aile sigorta planlaması yapın.

7. Emeklilik Planlaması
Ebeveynler için emeklilik planlaması yapın.

8. Aile Toplantıları
Düzenli aile finans toplantıları yapın.`,
    summary: "Aile finansını etkin yönetmek için pratik öneriler.",
    category: "Bütçe",
    readTime: 4
  }
];

// Makaleleri veritabanına ekle
router.post('/initialize', async (req, res) => {
  try {
    await Article.deleteMany({}); // Mevcut makaleleri temizle
    const articles = await Article.insertMany(initialArticles);
    res.status(201).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 